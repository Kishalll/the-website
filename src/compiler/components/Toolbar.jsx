/**
 * Toolbar — language selector, run button, fullscreen, font size controls.
 * ZBC-styled: dark glassmorphism with white/10 borders.
 */
import { LANGUAGES } from "../types/languages";
import { Play, Maximize2, Minimize2, Minus, Plus } from "lucide-react";

export function Toolbar({
  language,
  isRunning,
  isFullscreen,
  fontSize,
  loadingRuntime,
  onLanguageChange,
  onRun,
  onFullscreenToggle,
  onFontSizeChange,
}) {
  return (
    <div className="compiler-toolbar">
      <div className="compiler-toolbar-left">
        {/* Language selector */}
        <select
          className="compiler-toolbar-select"
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          disabled={isRunning}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.icon} {lang.label}
            </option>
          ))}
        </select>

        {/* Font size controls */}
        <div className="compiler-toolbar-group">
          <button
            className="compiler-toolbar-btn"
            onClick={() => onFontSizeChange(Math.max(10, fontSize - 2))}
            title="Decrease font size"
            disabled={fontSize <= 10}
          >
            <Minus size={14} />
          </button>
          <span className="compiler-toolbar-fontsize">{fontSize}px</span>
          <button
            className="compiler-toolbar-btn"
            onClick={() => onFontSizeChange(Math.min(28, fontSize + 2))}
            title="Increase font size"
            disabled={fontSize >= 28}
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
      <div className="compiler-toolbar-right">
        {/* Fullscreen toggle */}
        <button
          className="compiler-toolbar-btn"
          onClick={onFullscreenToggle}
          title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          <span className="hidden sm:inline ml-1">{isFullscreen ? "Exit" : "Full"}</span>
        </button>

        {/* Run button */}
        <button
          className="compiler-toolbar-run"
          onClick={onRun}
          disabled={isRunning}
        >
          {loadingRuntime ? (
            <>
              <span className="compiler-spinner" />
              <span>Loading...</span>
            </>
          ) : isRunning ? (
            <>
              <span className="compiler-spinner" />
              <span>Running...</span>
            </>
          ) : (
            <>
              <Play size={16} />
              <span>Run</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
