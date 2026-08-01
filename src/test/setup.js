import '@testing-library/jest-dom';

// jsdom test environments (and some older Node versions) don't always expose
// AbortController/AbortSignal as globals. PythonRuntime's abortable preload
// relies on them, so provide a minimal spec-compliant polyfill when missing.
if (typeof globalThis.AbortController === 'undefined') {
  class AbortSignalPolyfill {
    constructor() {
      this.aborted = false;
      this.listeners = [];
    }
    addEventListener(type, handler) {
      if (type === 'abort') this.listeners.push(handler);
    }
    removeEventListener(type, handler) {
      if (type === 'abort') {
        this.listeners = this.listeners.filter((h) => h !== handler);
      }
    }
    dispatchEvent() {
      const listeners = [...this.listeners];
      this.listeners = [];
      for (const handler of listeners) handler();
      return true;
    }
    onabort() {}
  }

  class AbortControllerPolyfill {
    constructor() {
      this.signal = new AbortSignalPolyfill();
    }
    abort() {
      if (this.signal.aborted) return;
      this.signal.aborted = true;
      this.signal.dispatchEvent();
    }
  }

  globalThis.AbortController = AbortControllerPolyfill;
}
