/**
 * ZBC Compiler — Main Compiler Application
 *
 * Fully client-side multi-language compiler embedded within the ZBC website.
 * Uses the website's dark theme, navbar, and overall layout.
 */

import { useState, useCallback, useEffect } from "react";

import { Toolbar } from "./components/Toolbar";
import { EditorPanel } from "./components/EditorPanel";
import { OutputConsole } from "./components/OutputConsole";
import { StdinPanel } from "./components/StdinPanel";
import { StatsPanel } from "./components/StatsPanel";
import { StatusBar } from "./components/StatusBar";
import { HtmlPreview } from "./components/HtmlPreview";

import { useEditor } from "./hooks/useEditor";
import { executeCode, preloadRuntime, isRuntimePreloaded, cancelRuntimeLoad } from "./services/api";
import { PREVIEW_LANGUAGES } from "./types/languages";
import { RuntimeManager, JavaScriptRuntime, HtmlRuntime, CRuntime, CppLangRuntime } from "./runtime";

// ── Register browser runtimes ──
RuntimeManager.registerLazy("python", () => import("./runtime/PythonRuntime"));
RuntimeManager.register("javascript", JavaScriptRuntime);
RuntimeManager.register("html", HtmlRuntime);
RuntimeManager.register("css", HtmlRuntime);
RuntimeManager.register("c", CRuntime);
RuntimeManager.register("cpp", CppLangRuntime);

// ── CodeMirror language extensions ──
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { cpp } from "@codemirror/lang-cpp";

const LANG_EXTENSIONS = {
  python: [python()],
  javascript: [javascript()],
  html: [html(), css(), javascript()],
  css: [css()],
  c: [cpp()],
  cpp: [cpp()],
};

// Keep the loading shimmer visible for at least this long, even when Pyodide
// is served from cache and would otherwise finish loading almost instantly.
const MIN_RUNTIME_LOAD_DISPLAY_MS = 1000;

function getLanguageExtensions(language) {
  return LANG_EXTENSIONS[language] ?? [];
}

export default function CompilerApp() {
  const { language, setLanguage, code, setCode, stdin, setStdin } = useEditor();

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [lineCount, setLineCount] = useState(1);
  const [loadingRuntime, setLoadingRuntime] = useState(null);
  const [loadProgress, setLoadProgress] = useState("");
  const [loadProgressPercent, setLoadProgressPercent] = useState("");
  const [pythonDownloadCancelled, setPythonDownloadCancelled] = useState(false);

  const isPreviewLanguage = PREVIEW_LANGUAGES.has(language);

  // ── Preload Pyodide when Python is selected; cancel it if the user
  //    switches away before the download finishes ──
  useEffect(() => {
    // Reset cancelled flag when switching languages or starting a new download
    setPythonDownloadCancelled(false);

    if (language === "python" && !isRuntimePreloaded("python")) {
      setLoadingRuntime("python");
      setLoadProgress("Loading Python runtime (Pyodide)...");

      let active = true;
      const startedAt = performance.now();
      preloadRuntime("python", (percent) => {
        if (active) {
          setLoadProgressPercent(`${percent}%`);
        }
      })
        .then(() => {
          if (!active) return;
          setPythonDownloadCancelled(false);
          // Hold the shimmer at least long enough to be noticed, even when
          // Pyodide is cached and finishes loading almost immediately.
          const elapsed = performance.now() - startedAt;
          const remaining = Math.max(0, MIN_RUNTIME_LOAD_DISPLAY_MS - elapsed);
          setTimeout(() => {
            if (!active) return;
            setLoadingRuntime(null);
            setLoadProgress("");
            setLoadProgressPercent("");
          }, remaining);
        })
        .catch((err) => {
          if (!active) return;
          // Cancelling (switching away / Cancel button) is expected, not an error.
          if (err?.message === "Pyodide load cancelled") return;
          setLoadingRuntime(null);
          setLoadProgress("");
          setLoadProgressPercent("");
          console.error("Failed to preload Pyodide:", err);
        });

      return () => {
        // User switched away (or unmounted) mid-download — abort Pyodide
        // so it stops eating bandwidth in the background.
        active = false;
        cancelRuntimeLoad("python");
        setLoadingRuntime(null);
        setLoadProgress("");
        setLoadProgressPercent("");
      };
    }
  }, [language]);

  // ── Track line count ──
  useEffect(() => {
    setLineCount(code.split("\n").length);
  }, [code]);

  // ── Execution ──
  const handleRun = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setError(null);
    setResult(null);

    try {
      const execResult = await executeCode(code, language, stdin || null);
      setResult(execResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Execution failed");
    } finally {
      setIsRunning(false);
    }
  }, [code, language, stdin, isRunning]);

  const handleClearOutput = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  // Abort the in-progress Pyodide download (used by the shimmer Cancel button).
  const handleCancelRuntimeLoad = useCallback(() => {
    cancelRuntimeLoad("python");
    setLoadingRuntime(null);
    setLoadProgress("");
    setLoadProgressPercent("");
    setPythonDownloadCancelled(true);
  }, []);

  // Restart the Pyodide download after it was previously cancelled.
  const handleRestartDownload = useCallback(() => {
    setPythonDownloadCancelled(false);
    setLoadingRuntime("python");
    setLoadProgress("Loading Python runtime (Pyodide)...");
    setLoadProgressPercent("0%");

    let active = true;
    const startedAt = performance.now();
    preloadRuntime("python", (percent) => {
      if (active) {
        setLoadProgressPercent(`${percent}%`);
      }
    })
      .then(() => {
        if (!active) return;
        const elapsed = performance.now() - startedAt;
        const remaining = Math.max(0, MIN_RUNTIME_LOAD_DISPLAY_MS - elapsed);
        setTimeout(() => {
          if (!active) return;
          setLoadingRuntime(null);
          setLoadProgress("");
          setLoadProgressPercent("");
        }, remaining);
      })
      .catch((err) => {
        if (!active) return;
        if (err?.message === "Pyodide load cancelled") return;
        setLoadingRuntime(null);
        setLoadProgress("");
        setLoadProgressPercent("");
        setPythonDownloadCancelled(true);
        console.error("Failed to preload Pyodide:", err);
      });
  }, []);

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (!isRunning && !loadingRuntime) {
          handleRun();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleRun, isRunning, loadingRuntime]);

  // ── Render ──
  return (
    <div className="compiler-app">
      <Toolbar
        language={language}
        isRunning={isRunning}
        fontSize={fontSize}
        loadingRuntime={loadingRuntime}
        onLanguageChange={setLanguage}
        onRun={handleRun}
        onFontSizeChange={setFontSize}
      />

      <main className="compiler-main">
        <div className="compiler-editor-section">
          <EditorPanel
            value={code}
            onChange={setCode}
            theme="dark"
            fontSize={fontSize}
            languageExtensions={getLanguageExtensions(language)}
            readOnly={isRunning}
          />

          {/* Shimmer overlay while the Python runtime (Pyodide) is loading */}
          {loadingRuntime === "python" && language === "python" && (
            <div className="compiler-shimmer-overlay" role="status" aria-live="polite">
              <div className="compiler-shimmer-content">
                <div className="compiler-shimmer-spinner" aria-hidden="true" />
                <div className="compiler-shimmer-title">Preparing Python Runtime</div>
                <div className="compiler-shimmer-sub">
                  Pyodide is downloading (~12MB)... first run may take a moment
                </div>
                <div className="compiler-shimmer-progress-container">
                  <div className="compiler-shimmer-progress-bar" style={{ width: loadProgressPercent || "0%" }} />
                </div>
                <div className="compiler-shimmer-skeleton" aria-hidden="true">
                  <div className="compiler-shimmer-bar" style={{ width: "72%" }} />
                  <div className="compiler-shimmer-bar" style={{ width: "90%" }} />
                  <div className="compiler-shimmer-bar" style={{ width: "58%" }} />
                </div>
                <button
                  type="button"
                  className="compiler-shimmer-cancel"
                  onClick={handleCancelRuntimeLoad}
                  disabled={isRunning}
                  title={isRunning ? "Can't cancel while code is running" : undefined}
                >
                  Cancel download
                </button>
              </div>
            </div>
          )}

          {/* Download needed overlay — shown after user cancels the download */}
          {pythonDownloadCancelled && language === "python" && !loadingRuntime && (
            <div className="compiler-shimmer-overlay compiler-download-prompt" role="status" aria-live="polite">
              <div className="compiler-shimmer-content">
                <div className="compiler-download-icon" aria-hidden="true">
                  🐍
                </div>
                <div className="compiler-shimmer-title">Python Libraries Not Downloaded</div>
                <div className="compiler-shimmer-sub">
                  Download the Python libraries to run Python code in your browser
                </div>
                <div className="compiler-shimmer-skeleton" aria-hidden="true">
                  <div className="compiler-shimmer-bar" style={{ width: "72%" }} />
                  <div className="compiler-shimmer-bar" style={{ width: "90%" }} />
                  <div className="compiler-shimmer-bar" style={{ width: "58%" }} />
                </div>
                <button
                  type="button"
                  className="compiler-download-btn"
                  onClick={handleRestartDownload}
                  disabled={isRunning}
                >
                  ⬇ Download Python Libs
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="compiler-output-section">
          <OutputConsole
            result={result}
            error={error}
            isRunning={isRunning}
            loadingRuntime={loadingRuntime}
            loadProgress={loadProgress}
            onClear={handleClearOutput}
          />

          {language === "python" && (
            <StdinPanel value={stdin} onChange={setStdin} />
          )}

          {isPreviewLanguage && (
            <HtmlPreview code={code} language={language} result={result} isRunning={isRunning} />
          )}

          <StatsPanel result={result} isRunning={isRunning} />
        </div>
      </main>

      <StatusBar language={language} lineCount={lineCount} />
    </div>
  );
}
