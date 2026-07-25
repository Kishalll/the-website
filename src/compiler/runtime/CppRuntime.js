/**
 * CppRuntime — In-browser C/C++ execution via JSCPP interpreter.
 */

const JSCPP_CDN =
  "https://cdn.jsdelivr.net/npm/JSCPP@2.0.9/dist/JSCPP.es5.min.js";

export class CppRuntime {
  constructor(isCpp = true) {
    this.language = isCpp ? "cpp" : "c";
    this.runtime = isCpp ? "JSCPP C++ Interpreter" : "JSCPP C Interpreter";
    this.isLoaded = false;
    this.loadPromise = null;
    this.loadError = null;
  }

  async load() {
    if (this.isLoaded) return;
    if (this.loadPromise) return this.loadPromise;
    if (this.loadError) throw new Error(this.loadError);

    this.loadPromise = this._initialize();
    return this.loadPromise;
  }

  async _initialize() {
    try {
      if (!window.JSCPP) {
        await this._loadScript(JSCPP_CDN);
      }

      if (!window.JSCPP?.run) {
        throw new Error("JSCPP library failed to initialize");
      }

      this.isLoaded = true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load JSCPP";
      this.loadError = message;
      throw new Error(message);
    }
  }

  async execute(code, stdin) {
    if (!window.JSCPP?.run) {
      throw new Error("C/C++ runtime not loaded. Call load() first.");
    }

    let capturedStdout = "";
    const capturedStderr = [];

    const startTime = performance.now();
    let exitCode = null;
    let execError = null;

    try {
      exitCode = window.JSCPP.run(code, stdin ?? "", {
        stdio: {
          write: (s) => {
            capturedStdout += s;
          },
        },
        unsigned_overflow: "warn",
      });
    } catch (err) {
      execError = err instanceof Error ? err : new Error(String(err));
      capturedStderr.push(execError.toString());
    }

    const endTime = performance.now();
    const hasError =
      capturedStderr.length > 0 || (exitCode !== null && exitCode !== 0);

    return {
      stdout: capturedStdout,
      stderr: capturedStderr.join("\n"),
      error: hasError
        ? exitCode !== null && exitCode !== 0
          ? `Program exited with code ${exitCode}`
          : execError?.message ?? "Execution completed with errors"
        : null,
      executionTimeMs: Math.round(endTime - startTime),
      runtime: this.runtime,
      status: hasError ? "error" : "success",
      timestamp: new Date().toISOString(),
    };
  }

  reset() {
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

export class CRuntime extends CppRuntime {
  constructor() {
    super(false);
  }
}

export class CppLangRuntime extends CppRuntime {
  constructor() {
    super(true);
  }
}
