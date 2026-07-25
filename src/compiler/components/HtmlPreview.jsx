/**
 * HTML/CSS live preview — renders content in a sandboxed iframe.
 */
import { useRef, useEffect, useCallback, useState } from "react";
import { RefreshCw, ExternalLink, Maximize2, Minimize2 } from "lucide-react";

import { HtmlIcon, CssIcon } from "./LanguageIcons";

export function HtmlPreview({ code, language, result }) {
  const iframeRef = useRef(null);
  const prevUrlRef = useRef("");
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const handleOpenNewTab = useCallback(() => {
    let content = code;
    if (language === "css") {
      content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${code}</style>
</head>
<body>
  <div class="card">
    <h1>CSS Preview</h1>
    <p>Your CSS styles are applied to this page.</p>
    <button style="background:#4f46e5;color:white;border:none;padding:10px 24px;border-radius:8px;font-size:16px;cursor:pointer">Sample Button</button>
  </div>
</body>
</html>`;
    }
    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  }, [code, language]);

  return (
    <div className={`compiler-panel ${isFullscreen ? "compiler-preview-fullscreen" : ""}`}>
      <div className="compiler-panel-header">
        <div className="flex items-center gap-2.5 shrink-0">
          {language === "css" ? <CssIcon size={22} className="shrink-0" /> : <HtmlIcon size={22} className="shrink-0" />}
          <span className="font-semibold text-white/90 whitespace-nowrap text-sm">{language === "css" ? "CSS Preview" : "HTML Preview"}</span>
        </div>
        <div className="compiler-panel-actions">
          <button className="compiler-panel-btn" onClick={handleRefresh} title="Refresh preview">
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
          <button className="compiler-panel-btn" onClick={handleOpenNewTab} title="Open preview in new tab">
            <ExternalLink size={14} />
            <span>Open Tab</span>
          </button>
          <button className="compiler-panel-btn" onClick={() => setIsFullscreen(!isFullscreen)} title={isFullscreen ? "Exit Fullscreen" : "Fullscreen preview"}>
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            <span>{isFullscreen ? "Exit" : "Fullscreen"}</span>
          </button>
        </div>
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

