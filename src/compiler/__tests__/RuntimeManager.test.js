import { describe, it, expect, vi, afterEach } from 'vitest';
import { RuntimeManager, JavaScriptRuntime, HtmlRuntime } from '../runtime';
import { RuntimeManager as RuntimeManagerClass } from '../runtime/RuntimeManager';
import { PythonRuntime } from '../runtime/PythonRuntime';
import { cancelRuntimeLoad } from '../services/api';
import { LANGUAGES, DEFAULT_LANGUAGE, PREVIEW_LANGUAGES } from '../types/languages';

describe('Compiler RuntimeManager & Language Config', () => {
  it('defines the expected languages', () => {
    const langIds = LANGUAGES.map((l) => l.id);
    expect(langIds).toContain('javascript');
    expect(langIds).toContain('python');
    expect(langIds).toContain('html');
    expect(langIds).toContain('css');
    expect(langIds).toContain('c');
    expect(langIds).toContain('cpp');
  });

  it('sets JavaScript as the default language', () => {
    expect(DEFAULT_LANGUAGE).toBe('javascript');
  });

  it('identifies preview languages correctly', () => {
    expect(PREVIEW_LANGUAGES.has('html')).toBe(true);
    expect(PREVIEW_LANGUAGES.has('css')).toBe(true);
    expect(PREVIEW_LANGUAGES.has('python')).toBe(false);
  });

  it('executes JavaScript runtime synchronously', async () => {
    const jsRuntime = new JavaScriptRuntime();
    await jsRuntime.load();
    const result = await jsRuntime.execute('console.log("Hello from test");', null);

    expect(result.status).toBe('success');
    expect(result.stdout).toContain('Hello from test');
  });

  it('validates HTML runtime live preview message', async () => {
    const htmlRuntime = new HtmlRuntime();
    await htmlRuntime.load();
    const result = await htmlRuntime.execute('<h1>Test</h1>', null);

    expect(result.status).toBe('success');
    expect(result.stdout).toContain('Live Preview panel');
  });
});

describe('Runtime cancellation', () => {
  afterEach(() => {
    delete window.loadPyodide;
    delete globalThis.fetch;
    // NOTE: do not delete AbortController — it's provided/polyfilled by
    // src/test/setup.js and the preload tests below rely on it.
  });

  it('cancels an in-flight Pyodide load and allows a fresh reload', async () => {
    const runtime = new PythonRuntime();

    let resolveLoad;
    window.loadPyodide = vi.fn(
      () => new Promise((resolve) => { resolveLoad = resolve; })
    );

    const firstLoad = runtime.load();

    // Cancel while the load is still in-flight.
    runtime.cancelLoad();
    expect(runtime.loadPromise).toBeNull();

    // Even if the underlying download eventually resolves, the cancelled
    // load must reject and the runtime must stay unloaded.
    resolveLoad({ destroy: vi.fn() });
    await expect(firstLoad).rejects.toThrow('cancelled');
    expect(runtime.isLoaded).toBe(false);
    expect(window.loadPyodide).toHaveBeenCalledTimes(1);

    // A subsequent load() starts a completely fresh download.
    let resolveReload;
    window.loadPyodide = vi.fn(
      () => new Promise((resolve) => { resolveReload = resolve; })
    );
    const secondLoad = runtime.load();
    resolveReload({ destroy: vi.fn() });
    await expect(secondLoad).resolves.toBeUndefined();
    expect(runtime.isLoaded).toBe(true);
  });

  it('does not cache a cancellation as a permanent load error', async () => {
    const runtime = new PythonRuntime();
    let resolveLoad;
    window.loadPyodide = vi.fn(
      () => new Promise((resolve) => { resolveLoad = resolve; })
    );

    const firstLoad = runtime.load();
    runtime.cancelLoad();
    resolveLoad({ destroy: vi.fn() });
    await expect(firstLoad).rejects.toThrow('cancelled');

    // loadError must stay null so the next load() isn't poisoned.
    expect(runtime.loadError).toBeNull();
  });

  it('cancels a pending script download by removing the script element', async () => {
    const runtime = new PythonRuntime();
    delete window.loadPyodide;

    const appendSpy = vi.spyOn(document.head, 'appendChild');
    const removeSpy = vi.spyOn(document.head, 'removeChild');

    const loadPromise = runtime.load();
    const scriptEl = appendSpy.mock.calls[0][0];

    runtime.cancelLoad();

    expect(removeSpy).toHaveBeenCalledWith(scriptEl);
    await expect(loadPromise).rejects.toThrow('cancelled');

    appendSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it('cancelRuntimeLoad delegates to the runtime instance and clears cached loads', async () => {
    const manager = new RuntimeManagerClass();
    let resolveLoad;
    window.loadPyodide = vi.fn(
      () => new Promise((resolve) => { resolveLoad = resolve; })
    );

    manager.register('python', PythonRuntime);

    const pending = manager.ensureLoaded('python');
    // ensureLoaded() is async and awaits getInstance() before caching the
    // load promise — flush the microtask queue so the assertion is reliable.
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(manager.loadPromises.has('python')).toBe(true);

    // Note: cancelRuntimeLoad() (api.js) delegates to the module-level
    // singleton, so test the manager method directly on this instance.
    manager.cancelLoad('python');
    expect(manager.loadPromises.has('python')).toBe(false);

    resolveLoad({ destroy: vi.fn() });
    await expect(pending).rejects.toThrow('cancelled');
  });

  it('preload warms the cache with abortable fetches that cancelLoad aborts', async () => {
    const runtime = new PythonRuntime();
    window.loadPyodide = vi.fn(async () => ({ destroy: vi.fn() }));

    const abortedSignals = [];
    globalThis.fetch = vi.fn((url, init) => {
      abortedSignals.push(init?.signal);
      // Like a real browser: an aborted fetch rejects with an AbortError.
      return new Promise((_, reject) => {
        init?.signal?.addEventListener('abort', () => {
          const err = new Error('The user aborted a request.');
          err.name = 'AbortError';
          reject(err);
        });
      });
    });

    const preloadPromise = runtime.preload();

    // Let the fetches start, then cancel.
    await new Promise((resolve) => setTimeout(resolve, 0));
    runtime.cancelLoad();

    // Every fetch started by preload must have been aborted.
    expect(abortedSignals.length).toBeGreaterThan(0);
    for (const signal of abortedSignals) {
      expect(signal.aborted).toBe(true);
    }

    await expect(preloadPromise).rejects.toThrow('cancelled');
    expect(runtime.isLoaded).toBe(false);
    expect(runtime.cacheWarmed).toBe(false);
  });

  it('preload warms once and skips a second warming pass', async () => {
    const runtime = new PythonRuntime();
    window.loadPyodide = vi.fn(async () => ({ destroy: vi.fn() }));
    globalThis.fetch = vi.fn(async () => ({ ok: true, arrayBuffer: async () => new ArrayBuffer(0) }));

    await runtime.preload();
    expect(runtime.cacheWarmed).toBe(true);
    expect(globalThis.fetch).toHaveBeenCalledTimes(4);

    await runtime.preload();
    expect(globalThis.fetch).toHaveBeenCalledTimes(4);
  });

  it('keeps a completed preload\'s warmed cache when cancelLoad is called (no in-flight download)', async () => {
    const runtime = new PythonRuntime();
    window.loadPyodide = vi.fn(async () => ({ destroy: vi.fn() }));
    globalThis.fetch = vi.fn(async () => ({ ok: true, arrayBuffer: async () => new ArrayBuffer(0) }));

    await runtime.preload();
    expect(runtime.cacheWarmed).toBe(true);

    // A switch-away after the download finished must NOT discard the warmed
    // cache, otherwise re-selecting Python re-flashes the shimmer and re-fetches.
    runtime.cancelLoad();
    expect(runtime.cacheWarmed).toBe(true);
  });

  it('load() waits for an in-flight preload then initializes from cache', async () => {
    const runtime = new PythonRuntime();
    window.loadPyodide = vi.fn(async () => ({ destroy: vi.fn() }));
    // preload() issues 4 fetches — capture a resolver for each so they can
    // all be settled (a single shared resolver would leave 3 pending forever).
    const resolvers = [];
    globalThis.fetch = vi.fn(
      () => new Promise((resolve) => { resolvers.push(resolve); })
    );

    const preloadPromise = runtime.preload();
    const loadPromise = runtime.load();

    for (const resolve of resolvers) {
      resolve({ ok: true, arrayBuffer: async () => new ArrayBuffer(0) });
    }

    await preloadPromise;
    await expect(loadPromise).resolves.toBeUndefined();
    expect(runtime.isLoaded).toBe(true);
  });

  it('cancelRuntimeLoad delegates to the singleton without throwing', () => {
    expect(() => cancelRuntimeLoad('python')).not.toThrow();
  });
});
