/**
 * RuntimeManager — Orchestrates language runtimes.
 */
export class RuntimeManager {
  constructor() {
    this.runtimes = new Map();
    this.lazyLoaders = new Map();
    this.instances = new Map();
    this.loadPromises = new Map();
  }

  register(language, ctor) {
    this.runtimes.set(language.toLowerCase(), ctor);
  }

  registerLazy(language, loader) {
    this.lazyLoaders.set(language.toLowerCase(), loader);
  }

  hasRuntime(language) {
    return this.runtimes.has(language.toLowerCase());
  }

  getSupportedLanguages() {
    return Array.from(this.runtimes.keys());
  }

  async getInstance(language) {
    const key = language.toLowerCase();
    let instance = this.instances.get(key);

    if (!instance) {
      let ctor = this.runtimes.get(key);

      if (!ctor) {
        const loader = this.lazyLoaders.get(key);
        if (!loader) {
          throw new Error(`No runtime registered for language: ${language}`);
        }
        const loaded = await loader();
        const mod = loaded;
        const candidate = Object.values(mod).find(
          (v) =>
            typeof v === "function" &&
            typeof v.prototype?.execute === "function"
        );
        if (!candidate) {
          throw new Error(
            `Lazy-loaded module for "${language}" does not contain a valid RuntimeConstructor`
          );
        }
        ctor = candidate;
        this.runtimes.set(key, ctor);
        this.lazyLoaders.delete(key);
      }

      instance = new ctor();
      this.instances.set(key, instance);
    }

    return instance;
  }

  async ensureLoaded(language) {
    const runtime = await this.getInstance(language);

    if (runtime.isLoaded) return runtime;

    const key = language.toLowerCase();
    let pending = this.loadPromises.get(key);
    if (!pending) {
      pending = runtime.load();
      this.loadPromises.set(key, pending);
    }

    await pending;
    return runtime;
  }

  /**
   * Kick off a cancellable warm-up for a runtime (e.g. downloading Pyodide's
   * assets in the background so the actual load() resolves from cache). Falls
   * back to a plain full load for runtimes without a dedicated preload.
   */
  async preload(language) {
    const runtime = await this.getInstance(language);
    if (runtime.isLoaded) return;
    if (typeof runtime.preload === "function") {
      await runtime.preload();
    } else {
      await this.ensureLoaded(language);
    }
  }

  /**
   * True once the runtime is fully loaded OR its assets have already been
   * preloaded/cache-warmed (so callers can skip re-running preload).
   */
  isPreloaded(language) {
    const key = language.toLowerCase();
    const instance = this.instances.get(key);
    return Boolean(instance && (instance.isLoaded || instance.cacheWarmed));
  }

  async execute(language, code, stdin) {
    const runtime = await this.ensureLoaded(language);
    return runtime.execute(code, stdin);
  }

  /**
   * Abort an in-progress runtime load (e.g. when the user switches away
   * from Python while Pyodide is still downloading). Safe to call any time.
   */
  cancelLoad(language) {
    const key = language.toLowerCase();
    const instance = this.instances.get(key);
    if (instance?.cancelLoad) {
      instance.cancelLoad();
    }
    this.loadPromises.delete(key);
  }

  reset(language) {
    const key = language.toLowerCase();
    const instance = this.instances.get(key);
    if (instance) {
      instance.reset();
      this.instances.delete(key);
      this.loadPromises.delete(key);
    }
  }

  resetAll() {
    for (const [, instance] of this.instances) {
      instance.reset();
    }
    this.instances.clear();
    this.loadPromises.clear();
  }
}

export const runtimeManager = new RuntimeManager();
