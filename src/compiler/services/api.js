/**
 * Code Execution Service — Fully client-side.
 */
import { RuntimeManager } from "../runtime";

export async function executeCode(sourceCode, language, stdin) {
  try {
    const result = await RuntimeManager.execute(
      language,
      sourceCode,
      stdin ?? undefined
    );
    return result;
  } catch (err) {
    return {
      stdout: "",
      stderr: "",
      error: err instanceof Error ? err.message : "Execution failed",
      executionTimeMs: 0,
      runtime: "unknown",
      status: "error",
      timestamp: new Date().toISOString(),
    };
  }
}

export async function preloadRuntime(language) {
  await RuntimeManager.ensureLoaded(language);
}

export function isRuntimeLoaded(language) {
  return RuntimeManager.isLoaded(language);
}
