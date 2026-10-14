import React, { useState, useEffect, useRef } from 'react';
import { Check, ChevronDown, ChevronUp, Copy } from 'lucide-react';

// Common curated palette swatches
const DEFAULT_SWATCHES = [
  '#000000',
  '#FFF7ED',
  '#FFFFFF',
  '#1E293B',
  '#4F46E5',
  '#0284C7',
  '#059669',
  '#EA580C',
  '#DC2626',
  '#7C3AED'
];

function hexToRgb(hex) {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  if (clean.length !== 6) return null;
  const num = parseInt(clean, 16);
  if (isNaN(num)) return null;
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function rgbToHsv(r, g, b) {
  const rf = r / 255;
  const gf = g / 255;
  const bf = b / 255;
  const max = Math.max(rf, gf, bf);
  const min = Math.min(rf, gf, bf);
  const diff = max - min;

  let h = 0;
  const s = max === 0 ? 0 : diff / max;
  const v = max;

  if (max !== min) {
    switch (max) {
      case rf:
        h = (gf - bf) / diff + (gf < bf ? 6 : 0);
        break;
      case gf:
        h = (bf - rf) / diff + 2;
        break;
      case bf:
        h = (rf - gf) / diff + 4;
        break;
      default:
        break;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)];
}

function hsvToRgb(h, s, v) {
  const sf = s / 100;
  const vf = v / 100;
  const c = vf * sf;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = vf - c;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }

  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255)
  ];
}

function rgbToHex(r, g, b) {
  return (
    '#' +
    [r, g, b]
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

export const InAppColorPicker = ({
  color = '#000000',
  onChange,
  label = 'Color',
  swatches = DEFAULT_SWATCHES
}) => {
  const [hsv, setHsv] = useState(() => {
    const rgb = hexToRgb(color) || [0, 0, 0];
    return rgbToHsv(rgb[0], rgb[1], rgb[2]);
  });
  const [hexInput, setHexInput] = useState(color);
  const [showHexInput, setShowHexInput] = useState(false);
  const [copied, setCopied] = useState(false);

  const satValRef = useRef(null);
  const hueRef = useRef(null);

  // Sync external color changes
  useEffect(() => {
    setHexInput(color);
    const rgb = hexToRgb(color);
    if (rgb) {
      setHsv(rgbToHsv(rgb[0], rgb[1], rgb[2]));
    }
  }, [color]);

  const updateColorFromHsv = (newHsv) => {
    setHsv(newHsv);
    const [r, g, b] = hsvToRgb(newHsv[0], newHsv[1], newHsv[2]);
    const hex = rgbToHex(r, g, b);
    setHexInput(hex);
    if (onChange) {
      onChange(hex);
    }
  };

  // 2D Saturation / Value Pad handler
  const handleSatValPointer = (e) => {
    if (!satValRef.current) return;
    const rect = satValRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

    const s = Math.round((x / rect.width) * 100);
    const v = Math.round((1 - y / rect.height) * 100);

    updateColorFromHsv([hsv[0], s, v]);
  };

  // 1D Hue Slider handler
  const handleHuePointer = (e) => {
    if (!hueRef.current) return;
    const rect = hueRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const h = Math.min(359, Math.max(0, Math.round((x / rect.width) * 360)));

    updateColorFromHsv([h, hsv[1], hsv[2]]);
  };

  const handleHexChange = (e) => {
    let val = e.target.value.trim().toUpperCase();
    if (!val.startsWith('#')) {
      val = '#' + val;
    }
    setHexInput(val);
    const rgb = hexToRgb(val);
    if (rgb) {
      const newHsv = rgbToHsv(rgb[0], rgb[1], rgb[2]);
      setHsv(newHsv);
      if (onChange) {
        onChange(val);
      }
    }
  };

  const handleCopyHex = async () => {
    try {
      await navigator.clipboard.writeText(color);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Ignore if clipboard restricted
    }
  };

  const pureHueHex = rgbToHex(...hsvToRgb(hsv[0], 100, 100));

  return (
    <div className="p-4 rounded-2xl border border-white/10 bg-neutral-900/90 shadow-xl flex flex-col gap-4 text-white">
      {/* Header with active color preview bubble */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wide text-gray-200">
          {label}
        </span>
        <div className="flex items-center gap-2">
          <span
            className="w-6 h-6 rounded-lg border border-white/20 shadow-inner"
            style={{ backgroundColor: color }}
          />
          <span className="text-xs font-mono font-medium text-gray-300">
            {color}
          </span>
        </div>
      </div>

      {/* Primary visual section 1: Curated Quick Swatches */}
      <div>
        <div className="text-[11px] font-medium text-gray-400 mb-2">
          Quick Swatches
        </div>
        <div className="flex flex-wrap gap-2">
          {swatches.map((swatch) => {
            const isSelected = color.toUpperCase() === swatch.toUpperCase();
            return (
              <button
                key={swatch}
                type="button"
                onClick={() => {
                  const rgb = hexToRgb(swatch);
                  if (rgb) {
                    updateColorFromHsv(rgbToHsv(rgb[0], rgb[1], rgb[2]));
                  }
                }}
                className={`w-8 h-8 rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
                  isSelected
                    ? 'border-white scale-110 shadow-lg ring-2 ring-white/30'
                    : 'border-white/10 hover:border-white/40 hover:scale-105'
                }`}
                style={{ backgroundColor: swatch }}
                title={swatch}
              >
                {isSelected && (
                  <Check
                    size={14}
                    className={
                      swatch === '#FFFFFF' || swatch === '#FFF7ED'
                        ? 'text-black stroke-[3]'
                        : 'text-white stroke-[3]'
                    }
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary visual section 2: Interactive 2D Color Spectrum Box */}
      <div>
        <div className="text-[11px] font-medium text-gray-400 mb-2">
          Visual Spectrum
        </div>
        <div
          ref={satValRef}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            handleSatValPointer(e);
          }}
          onPointerMove={(e) => {
            if (e.buttons > 0) handleSatValPointer(e);
          }}
          className="relative w-full h-36 rounded-xl overflow-hidden cursor-crosshair select-none touch-none border border-white/10 shadow-inner"
          style={{
            backgroundColor: pureHueHex,
            backgroundImage:
              'linear-gradient(to right, #fff, transparent), linear-gradient(to top, #000, transparent)'
          }}
        >
          {/* Thumb marker */}
          <div
            className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md pointer-events-none -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${hsv[1]}%`,
              top: `${100 - hsv[2]}%`,
              backgroundColor: color
            }}
          />
        </div>
      </div>

      {/* Primary visual section 3: Rainbow Hue Slider */}
      <div>
        <div className="flex justify-between text-[11px] font-medium text-gray-400 mb-1.5">
          <span>Hue</span>
          <span className="font-mono text-gray-500">{hsv[0]}°</span>
        </div>
        <div
          ref={hueRef}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            handleHuePointer(e);
          }}
          onPointerMove={(e) => {
            if (e.buttons > 0) handleHuePointer(e);
          }}
          className="relative w-full h-5 rounded-lg cursor-pointer select-none touch-none border border-white/10 shadow-inner"
          style={{
            background:
              'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)'
          }}
        >
          {/* Hue thumb marker */}
          <div
            className="absolute top-1/2 w-4 h-6 rounded-md bg-white border border-black/30 shadow-md pointer-events-none -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${(hsv[0] / 360) * 100}%` }}
          />
        </div>
      </div>

      {/* Secondary Section: Manual Hex input (accessible via toggle or subtle row) */}
      <div className="pt-2 border-t border-white/10">
        <button
          type="button"
          onClick={() => setShowHexInput(!showHexInput)}
          className="w-full flex items-center justify-between text-xs text-gray-400 hover:text-white transition-colors py-1"
        >
          <span>Manual Hex Code</span>
          {showHexInput ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showHexInput && (
          <div className="mt-2.5 flex items-center gap-2 bg-black/60 border border-white/10 rounded-xl p-2">
            <span className="text-xs font-mono text-gray-500 pl-1">#</span>
            <input
              type="text"
              maxLength={7}
              value={hexInput.replace('#', '')}
              onChange={handleHexChange}
              placeholder="000000"
              className="w-full bg-transparent text-xs text-white uppercase font-mono focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCopyHex}
              className="px-2 py-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white text-[11px] transition-colors"
              title="Copy hex code"
            >
              {copied ? 'Copied' : <Copy size={13} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InAppColorPicker;
