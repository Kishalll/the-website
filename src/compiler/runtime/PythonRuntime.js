/**
 * PythonRuntime — In-browser Python execution via Pyodide (WASM).
 *
 * Cancellation strategy
 * ---------------------
 * window.loadPyodide() internally downloads ~23MB (pyodide.asm.js,
 * pyodide.asm.wasm, python_stdlib.zip, pyodide-lock.json) using its own
 * internal fetches/script tags that CANNOT be aborted. So instead of letting
 * that happen during preload, we fetch those same files ourselves with an
 * abortable fetch() + AbortController (warming the browser HTTP cache).
 * cancelLoad() aborts those fetches, which genuinely stops the download.
 * loadPyodide() is only invoked when the code is actually run — by then the
 * assets resolve from cache, and the language dropdown is disabled while
 * running, so no switching away can interrupt it.
 */

const PYODIDE_CDN = "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/";

// Heavy files that loadPyodide() downloads internally. Pre-fetching these
// with abortable fetch() lets cancelLoad() stop the network transfer.
const PYODIDE_PRELOAD_ASSETS = [
  "pyodide-lock.json",
  "pyodide.asm.js",
  "pyodide.asm.wasm",
  "python_stdlib.zip",
];

export class PythonRuntime {
  constructor() {
    this.language = "python";
    this.runtime = "Pyodide 0.26.2";
    this.isLoaded = false;
    this.pyodide = null;
    this.loadPromise = null;
    this.loadError = null;
    this.generation = 0;
    this.pendingScript = null;
    this.pendingScriptReject = null;
    this.preloadPromise = null;
    this.abortController = null;
    this.cacheWarmed = false;
  }

  /**
   * Warm the browser HTTP cache for the heavy Pyodide assets using abortable
   * fetches. Does NOT initialize the runtime — load() still needs to run
   * (from cache) before execution.
   * @param {function} onProgress - Optional callback for progress updates (percent: number)
   */
  preload(onProgress) {
    if (this.isLoaded || this.cacheWarmed) return Promise.resolve();
    if (this.preloadPromise) return this.preloadPromise;

    this._onProgress = onProgress;
    const generation = ++this.generation;
    this.preloadPromise = this._preload()
      .then(() => {
        // If the warm-up didn't actually fetch anything (e.g. offline), allow a
        // later call to retry instead of permanently caching a no-op preload.
        if (generation === this.generation && !this.cacheWarmed) {
          this.preloadPromise = null;
        }
      })
      .catch((err) => {
        // Only clear the cached promise if this preload is still the current
        // one, so a stale cancelled preload can't clobber a newer one.
        if (generation === this.generation) {
          this.preloadPromise = null;
        }
        throw err;
      });
    return this.preloadPromise;
  }

  async _preload() {
    const controller = new AbortController();
    this.abortController = controller;

    try {
      // 1. Load the small bootstrap script (abortable by removing the element).
      if (!window.loadPyodide) {
        this._reportProgress(5);
        await this._loadScript(`${PYODIDE_CDN}pyodide.js`);
        this._reportProgress(15);
      }

      // 2. Warm the cache for the heavy assets. These fetches are abortable,
      //    so cancelLoad() can genuinely stop the download. Failures here are
      //    non-fatal: loadPyodide() will fetch these itself when actually run.
      //    Progress is aggregated across ALL parallel fetches so it only ever
      //    moves forward (no jumping up/down).
      let anyWarmed = false;
      const totalExpected = new Array(PYODIDE_PRELOAD_ASSETS.length).fill(0);
      const totalReceived = new Array(PYODIDE_PRELOAD_ASSETS.length).fill(0);
      const indexByName = {};
      PYODIDE_PRELOAD_ASSETS.forEach((name, i) => { indexByName[name] = i; });

      const reportAggregate = () => {
        const sumExpected = totalExpected.reduce((a, b) => a + b, 0);
        const sumReceived = totalReceived.reduce((a, b) => a + b, 0);
        if (sumExpected > 0) {
          // 15-95% range (0-15% is bootstrap, 95-100% is wrap-up)
          const pct = Math.round(15 + (sumReceived / sumExpected) * 80);
          this._reportProgress(Math.min(95, pct));
        }
      };

      await Promise.all(
        PYODIDE_PRELOAD_ASSETS.map((file) =>
          fetch(`${PYODIDE_CDN}${file}`, {
            signal: controller.signal,
          })
            .then(async (res) => {
              if (res.ok) anyWarmed = true;
              const idx = indexByName[file];
              const reader = res.body.getReader();
              const contentLength = +res.headers.get("Content-Length") || 0;
              totalExpected[idx] = contentLength || 1; // avoid /0

              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                totalReceived[idx] += value.length;
                reportAggregate();
              }

              // Clamp to exact total once the stream finishes
              if (contentLength > 0) totalReceived[idx] = contentLength;
              reportAggregate();
            })
            .catch((err) => {
              if (err?.name === "AbortError") {
                throw new Error("Pyodide load cancelled");
              }
              // Other failures are non-fatal.
            })
        )
      );

      // Only mark the cache as warmed if at least one asset was actually
      // fetched, so a later selection skips re-warming (and the shimmer
      // flash) but a fully-failed warm (e.g. offline) can retry.
      this.cacheWarmed = anyWarmed;
      this._reportProgress(100);
    } finally {
      this.abortController = null;
    }
  }

  _reportProgress(percent) {
    if (typeof this._onProgress === "function") {
      this._onProgress(percent);
    }
  }

  async load() {
    if (this.isLoaded) return;
    if (this.loadError) throw new Error(this.loadError);
    if (this.loadPromise) return this.loadPromise;

    // If a preload is in flight, wait for it — it warms the cache so
    // loadPyodide() resolves from cache instead of re-downloading.
    if (this.preloadPromise) {
      try {
        await this.preloadPromise;
      } catch {
        /* cancelled preload — fall through to a normal load */
      }
    }

    const generation = ++this.generation;
    this.loadPromise = this._initialize(generation).catch((err) => {
      // Only clear the cached promise if this load is still the current one,
      // so a stale cancelled load can't clobber a newer load's promise.
      if (generation === this.generation) {
        this.loadPromise = null;
      }
      throw err;
    });
    return this.loadPromise;
  }

  /**
   * Abort an in-progress Pyodide download. Aborts the cache-warming fetches
   * (which stops the network transfer) and removes the pending bootstrap
   * script element. Safe to call at any time; a later load() starts fresh.
   */
  cancelLoad() {
    if (this.isLoaded) return;

    this.generation += 1; // invalidate any in-flight _initialize()

    // Only discard preload state when a download is actually in flight. If the
    // preload already completed, its warmed cache should survive a switch-away
    // so re-selecting Python skips the shimmer and the re-fetch.
    const inFlight = Boolean(this.abortController || this.pendingScript);

    // Abort the cache-warming fetches — this genuinely stops the download.
    this.abortController?.abort();
    this.abortController = null;
    if (inFlight) {
      this.preloadPromise = null;
      this.cacheWarmed = false;
    }

    // Abort the pyodide.js bootstrap script download, if still in flight.
    if (this.pendingScript) {
      // Drop the handlers first so a removed element's async onerror can't
      // clobber state belonging to a newer load.
      this.pendingScript.onload = null;
      this.pendingScript.onerror = null;
      if (this.pendingScript.parentNode) {
        this.pendingScript.parentNode.removeChild(this.pendingScript);
      }
      this.pendingScript = null;
    }
    if (this.pendingScriptReject) {
      this.pendingScriptReject(new Error("Pyodide load cancelled"));
      this.pendingScriptReject = null;
    }

    // Drop the cached promise so a later load() starts completely fresh.
    this.loadPromise = null;
  }

  async _initialize(generation) {
    try {
      if (!window.loadPyodide) {
        await this._loadScript(`${PYODIDE_CDN}pyodide.js`);
      }
      this._throwIfCancelled(generation);

      // Keep the instance local until we've confirmed this load is still the
      // active one, so a stale (cancelled) load can never clobber a newer
      // load's this.pyodide once it has been assigned.
      const pyodide = await window.loadPyodide({
        indexURL: PYODIDE_CDN,
      });

      if (generation !== this.generation) {
        // Cancelled while loading — discard this load's own instance only.
        try {
          pyodide.destroy();
        } catch {
          /* ignore destroy failures */
        }
        throw new Error("Pyodide load cancelled");
      }

      this.pyodide = pyodide;
      this.isLoaded = true;
    } catch (err) {
      // A cancellation is expected — never touch this.pyodide here (a newer
      // load may already own it). Just rethrow without caching a permanent
      // load error so the next load() starts fresh.
      if (err instanceof Error && err.message === "Pyodide load cancelled") {
        throw err;
      }

      const message =
        err instanceof Error ? err.message : "Failed to load Pyodide";
      this.loadError = message;
      throw new Error(message);
    }
  }

  _throwIfCancelled(generation) {
    if (generation !== this.generation) {
      throw new Error("Pyodide load cancelled");
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
    this.abortController?.abort();
    this.pyodide = null;
    this.isLoaded = false;
    this.loadPromise = null;
    this.loadError = null;
    this.generation = 0;
    this.pendingScript = null;
    this.pendingScriptReject = null;
    this.preloadPromise = null;
    this.abortController = null;
    this.cacheWarmed = false;
  }

  _loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        // Only clear state if this element is still the current pending one — a
        // stale removed script firing onerror late must not clobber a newer
        // load's pendingScript/pendingScriptReject.
        if (this.pendingScript === script) {
          this.pendingScript = null;
          this.pendingScriptReject = null;
        }
        resolve();
      };
      script.onerror = () => {
        if (this.pendingScript === script) {
          this.pendingScript = null;
          this.pendingScriptReject = null;
        }
        reject(new Error(`Failed to load script: ${src}`));
      };
      this.pendingScript = script;
      this.pendingScriptReject = reject;
      document.head.appendChild(script);
    });
  }
}
