/**
 * JavaScriptRuntime — In-browser JavaScript execution with console capture.
 */
export class JavaScriptRuntime {
  constructor() {
    this.language = "javascript";
    this.runtime = "Browser JS";
    this.isLoaded = true;
  }

  async load() {
    this.isLoaded = true;
  }

  async execute(code, _stdin) {
    const logs = [];
    const errors = [];

    const origLog = console.log;
    const origError = console.error;
    const origWarn = console.warn;

    console.log = (...args) => {
      const msg = args.map(String).join(" ");
      logs.push(msg);
      origLog.apply(console, args);
    };
    console.error = (...args) => {
      const msg = args.map(String).join(" ");
      errors.push(msg);
      origError.apply(console, args);
    };
    console.warn = (...args) => {
      const msg = args.map(String).join(" ");
      logs.push("[warn] " + msg);
      origWarn.apply(console, args);
    };

    const startTime = performance.now();
    let execError = null;

    try {
      const fn = new Function(code);
      fn();
    } catch (err) {
      execError = err instanceof Error ? err : new Error(String(err));
      errors.push(execError.toString());
    } finally {
      console.log = origLog;
      console.error = origError;
      console.warn = origWarn;
    }

    const endTime = performance.now();

    return {
      stdout: logs.join("\n"),
      stderr: errors.join("\n"),
      error: execError ? execError.message : null,
      executionTimeMs: Math.round(endTime - startTime),
      runtime: this.runtime,
      status: execError ? "error" : "success",
      timestamp: new Date().toISOString(),
    };
  }

  reset() {
    // Nothing to reset
  }
}
