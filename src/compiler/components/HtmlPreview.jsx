/**
 * HTML/CSS live preview — renders content in a sandboxed iframe.
 */
import { useRef, useEffect, useCallback } from "react";
import { RefreshCw } from "lucide-react";

export function HtmlPreview({ code, language, result }) {
  const iframeRef = useRef(null);
  const prevUrlRef = useRef("");

  const renderPreview = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    if (prevUrlRef.current) {
      URL.revokeObjectURL(prevUrlRef.current);
      prevUrlRef.current = "";
    }

    if (language === "css") {
      const cssLiteral = JSON.stringify(code).replace(/</g, "\\x3C");
      const srcdoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style id="user-css"></style>
</head>
<body>
  <div class="card">
    <h1>CSS Preview</h1>
    <p>Your CSS styles are applied to this page.</p>
    <button style="background:#4f46e5;color:white;border:none;padding:10px 24px;border-radius:8px;font-size:16px;cursor:pointer">Sample Button</button>
  </div>
  <script>
    document.getElementById('user-css').textContent = ${cssLiteral};
  </script>
</body>
</html>`;
      iframe.srcdoc = srcdoc;
      return;
    }

    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    prevUrlRef.current = url;
    iframe.src = url;
  }, [code, language]);

  useEffect(() => {
    renderPreview();
  }, [renderPreview, result]);

  useEffect(() => {
    return () => {
      if (prevUrlRef.current) {
        URL.revokeObjectURL(prevUrlRef.current);
      }
    };
  }, []);

  const handleRefresh = useCallback(() => {
    renderPreview();
  }, [renderPreview]);

  return (
    <div className="compiler-panel">
      <div className="compiler-panel-header">
        <span>{language === "css" ? "🎨 CSS Preview" : "🌐 HTML Preview"}</span>
        <button className="compiler-panel-btn" onClick={handleRefresh} title="Refresh preview">
          <RefreshCw size={14} />
          <span>Refresh</span>
        </button>
      </div>
      <iframe
        ref={iframeRef}
        className="compiler-preview-iframe"
        sandbox="allow-scripts"
        title={`${language} preview`}
      />
    </div>
  );
}
