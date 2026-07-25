/**
 * PythonRuntime — In-browser Python execution via Pyodide (WASM).
 */

const PYODIDE_CDN = "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/";

export class PythonRuntime {
  constructor() {
    this.language = "python";
    this.runtime = "Pyodide 0.26.2";
    this.isLoaded = false;
    this.pyodide = null;
    this.loadPromise = null;
    this.loadError = null;
  }

  async load() {
    if (this.isLoaded) return;
    if (this.loadError) throw new Error(this.loadError);
    if (this.loadPromise) return this.loadPromise;

    this.loadPromise = this._initialize().catch((err) => {
      this.loadPromise = null;
      throw err;
    });
    return this.loadPromise;
  }

  async _initialize() {
    try {
      if (!window.loadPyodide) {
        await this._loadScript(`${PYODIDE_CDN}pyodide.js`);
      }

      this.pyodide = await window.loadPyodide({
        indexURL: PYODIDE_CDN,
      });

      this.isLoaded = true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load Pyodide";
      this.loadError = message;
      throw new Error(message);
    }
  }

  async execute(code, stdin) {
    if (!this.pyodide) {
      throw new Error("Python runtime not loaded. Call load() first.");
    }

    const startTime = performance.now();
    const py = this.pyodide;

    py.globals.set("__user_code__", code);
    py.globals.set("__stdin_data__", stdin ?? "");

    const wrapper = `
import sys
from io import StringIO

_old_stdin = sys.stdin
_old_stdout = sys.stdout
_old_stderr = sys.stderr

sys.stdin = StringIO(__stdin_data__)
_stdout_buf = StringIO()
_stderr_buf = StringIO()
sys.stdout = _stdout_buf
sys.stderr = _stderr_buf

try:
    exec(__user_code__)
except BaseException:
    import traceback
    traceback.print_exc()

__exec_stdout__ = _stdout_buf.getvalue()
__exec_stderr__ = _stderr_buf.getvalue()

sys.stdout = _old_stdout
sys.stderr = _old_stderr
sys.stdin = _old_stdin
`;

    try {
      await py.runPythonAsync(wrapper);

      const capturedStdout = py.globals.get("__exec_stdout__") ?? "";
      const capturedStderr = py.globals.get("__exec_stderr__") ?? "";

      py.globals.delete("__user_code__");
      py.globals.delete("__stdin_data__");
      py.globals.delete("__exec_stdout__");
      py.globals.delete("__exec_stderr__");

      const endTime = performance.now();
      const hasError = capturedStderr.length > 0;

      return {
        stdout: capturedStdout,
        stderr: capturedStderr,
        error: hasError ? "Execution completed with errors" : null,
        executionTimeMs: Math.round(endTime - startTime),
        runtime: this.runtime,
        status: hasError ? "error" : "success",
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      const endTime = performance.now();

      py.globals.delete("__user_code__");
      py.globals.delete("__stdin_data__");
      py.globals.delete("__exec_stdout__");
      py.globals.delete("__exec_stderr__");

      return {
        stdout: "",
        stderr: "",
        error: err instanceof Error ? err.message : "Python execution failed",
        executionTimeMs: Math.round(endTime - startTime),
        runtime: this.runtime,
        status: "error",
        timestamp: new Date().toISOString(),
      };
    }
  }

  reset() {
    this.pyodide = null;
    this.isLoaded = false;
    this.loadPromise = null;
    this.loadError = null;
  }

  _loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  }
}
