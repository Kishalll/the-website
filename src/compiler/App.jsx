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
import { executeCode, preloadRuntime, isRuntimeLoaded } from "./services/api";
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

function getLanguageExtensions(language) {
  return LANG_EXTENSIONS[language] ?? [];
}

export default function CompilerApp() {
  const { language, setLanguage, code, setCode, stdin, setStdin } = useEditor();

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [lineCount, setLineCount] = useState(1);
  const [loadingRuntime, setLoadingRuntime] = useState(null);
  const [loadProgress, setLoadProgress] = useState("");

  const isPreviewLanguage = PREVIEW_LANGUAGES.has(language);

  // ── Preload Pyodide when Python is selected ──
  useEffect(() => {
    if (language === "python" && !isRuntimeLoaded("python")) {
      setLoadingRuntime("python");
      setLoadProgress("Loading Python runtime (Pyodide ~12MB)...");

      preloadRuntime("python")
        .then(() => {
          setLoadingRuntime(null);
          setLoadProgress("");
        })
        .catch((err) => {
          setLoadingRuntime(null);
          setLoadProgress("");
          console.error("Failed to preload Pyodide:", err);
        });
    }
  }, [language]);

  // ── Fullscreen ──
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape" && isFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isFullscreen]);

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
    <div className={`compiler-app ${isFullscreen ? "compiler-fullscreen" : ""}`}>
      <Toolbar
        language={language}
        isRunning={isRunning}
        isFullscreen={isFullscreen}
        fontSize={fontSize}
        loadingRuntime={loadingRuntime}
        onLanguageChange={setLanguage}
        onRun={handleRun}
        onFullscreenToggle={toggleFullscreen}
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
