/**
 * HtmlRuntime — Browser HTML/CSS/JS preview runtime.
 */
export class HtmlRuntime {
  constructor() {
    this.language = "html";
    this.runtime = "Browser Preview";
    this.isLoaded = true;
  }

  async load() {
    this.isLoaded = true;
  }

  async execute(code, _stdin) {
    const startTime = performance.now();

    try {
      this._validateHtml(code);
      const scriptErrors = this._checkScripts(code);
      const endTime = performance.now();

      return {
        stdout: "🌐 HTML/CSS rendered in the Live Preview panel below.",
        stderr: scriptErrors.join("\n"),
        error: scriptErrors.length > 0 ? "Script warnings found" : null,
        executionTimeMs: Math.round(endTime - startTime),
        runtime: this.runtime,
        status: scriptErrors.length > 0 ? "error" : "success",
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      const endTime = performance.now();
      return {
        stdout: "",
        stderr: "",
        error: err instanceof Error ? err.message : "HTML validation failed",
        executionTimeMs: Math.round(endTime - startTime),
        runtime: this.runtime,
        status: "error",
        timestamp: new Date().toISOString(),
      };
    }
  }

  reset() {
    // Nothing to reset
  }

  _validateHtml(code) {
    if (!code || code.trim().length === 0) {
      throw new Error("HTML content is empty");
    }
  }

  _checkScripts(code) {
    const warnings = [];
    const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
    let match;

    while ((match = scriptRegex.exec(code)) !== null) {
      const scriptContent = match[1]?.trim();
      if (!scriptContent) continue;
      try {
        new Function(scriptContent);
      } catch {
        warnings.push("JavaScript syntax warning in inline script");
      }
    }

    return warnings;
  }
}
