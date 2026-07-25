/**
 * Toolbar — language selector, run button, fullscreen, font size controls.
 * ZBC-styled: dark glassmorphism with white/10 borders.
 */
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { LANGUAGES } from "../types/languages";
import { LANGUAGE_ICON_MAP } from "./languageIconMap";
import { Play, Maximize2, Minimize2, Minus, Plus, ChevronDown, Check } from "lucide-react";

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
  const [isOpen, setIsOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  const activeLangObj = LANGUAGES.find((l) => l.id === language) || LANGUAGES[0];
  const ActiveIcon = LANGUAGE_ICON_MAP[language];

  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + 8,
        left: rect.left,
      });
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      updatePosition();
    }
    setIsOpen(!isOpen);
  };

  // Close dropdown on click outside or window scroll/resize
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleScrollOrResize = () => {
      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen]);

  return (
    <div className="compiler-toolbar">
      <div className="compiler-toolbar-left">
        {/* Website themed custom language dropdown */}
        <div>
          <button
            ref={buttonRef}
            type="button"
            className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/15 rounded-xl px-3 py-1.5 text-sm font-medium text-white transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleToggle}
            disabled={isRunning}
          >
            {ActiveIcon && <ActiveIcon size={20} className="shrink-0" />}
            <span className="font-semibold text-white/90">{activeLangObj.label}</span>
            <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
          </button>

          {isOpen &&
            createPortal(
              <div
                ref={dropdownRef}
                style={{ top: `${menuPos.top}px`, left: `${menuPos.left}px` }}
                className="fixed w-56 bg-neutral-900/98 backdrop-blur-2xl border border-white/20 rounded-xl shadow-2xl z-[99999] py-1.5 overflow-hidden ring-1 ring-white/10 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="px-3 py-1.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider border-b border-white/10 mb-1">
                  Select Language
                </div>
                {LANGUAGES.map((lang) => {
                  const IconComp = LANGUAGE_ICON_MAP[lang.id];
                  const isSelected = lang.id === language;

                  return (
                    <button
                      key={lang.id}
                      type="button"
                      className={`w-full px-3 py-2 text-sm font-medium flex items-center justify-between transition-colors ${
                        isSelected
                          ? "bg-white/15 text-white font-semibold"
                          : "text-gray-300 hover:bg-white/10 hover:text-white"
                      }`}
                      onClick={() => {
                        onLanguageChange(lang.id);
                        setIsOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        {IconComp && <IconComp size={20} className="shrink-0" />}
                        <span>{lang.label}</span>
                      </div>
                      {isSelected && <Check size={16} className="text-white shrink-0" />}
                    </button>
                  );
                })}
              </div>,
              document.body
            )}
        </div>

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
