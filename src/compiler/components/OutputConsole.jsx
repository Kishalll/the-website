/**
 * Output console — displays stdout, stderr, runtime loading, and errors.
 */
import { useEffect, useRef } from "react";
import { Copy, Trash2 } from "lucide-react";

export function OutputConsole({
  result,
  error,
  isRunning,
  loadingRuntime,
  loadProgress,
  onClear,
}) {
  const outputRef = useRef(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [result, error, loadingRuntime]);

  const handleCopy = () => {
    const text = outputRef.current?.textContent ?? "";
    navigator.clipboard.writeText(text).catch(() => {});
  };

  return (
    <div className="compiler-panel">
      <div className="compiler-panel-header">
        <span className="compiler-panel-title">Output</span>
        <div className="compiler-panel-actions">
          <button
            className="compiler-panel-btn"
            onClick={handleCopy}
            title="Copy output"
            disabled={!result && !error}
          >
            <Copy size={14} />
            <span>Copy</span>
          </button>
          <button
            className="compiler-panel-btn"
            onClick={onClear}
            title="Clear output"
          >
            <Trash2 size={14} />
            <span>Clear</span>
          </button>
        </div>
      </div>
      <pre className="compiler-panel-content" ref={outputRef}>
        {loadingRuntime && (
          <span className="compiler-running">
            ⏳ {loadProgress || `Loading ${loadingRuntime} runtime...`}
          </span>
        )}

        {isRunning && !loadingRuntime && (
          <span className="compiler-running">⏳ Running...</span>
        )}

        {!isRunning && !loadingRuntime && !result && !error && (
          <span className="compiler-placeholder">
            Click <strong>"▶ Run"</strong> to execute your code
          </span>
        )}

        {error && (
          <code>
            <span className="compiler-error-text">❌ {error}</span>
          </code>
        )}

        {result && (
          <code>
            {result.error && (
              <>
                <span className="compiler-section-label">❌ Error:</span>
                <span className="compiler-error-text">{result.error}</span>
              </>
            )}
            {result.stderr && (
              <>
                <span className="compiler-section-label">⚠️ Stderr:</span>
                <span className="compiler-error-text">{result.stderr}</span>
              </>
            )}
            {result.stdout && (
              <>
                {result.stderr || result.error ? (
                  <>
                    <span className="compiler-section-label">📤 Stdout:</span>
                    <span>{result.stdout}</span>
                  </>
                ) : (
                  <span>{result.stdout}</span>
                )}
              </>
            )}
            {!result.stdout && !result.stderr && !result.error && (
              <span className="compiler-empty">(no output)</span>
            )}
          </code>
        )}
      </pre>
    </div>
  );
}
