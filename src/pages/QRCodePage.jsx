import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  QrCode,
  Download,
  Upload,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Palette,
  Shapes,
  Image as ImageIcon,
  FileText
} from 'lucide-react';
import QRCodeStyling from 'qr-code-styling';
import PageBackground from '../components/ui/PageBackground';
import InAppColorPicker from '../components/ui/InAppColorPicker';

const DOT_TYPES = [
  { value: 'rounded', label: 'Rounded' },
  { value: 'dots', label: 'Dots' },
  { value: 'classy', label: 'Classy' },
  { value: 'classy-rounded', label: 'Classy Rounded' },
  { value: 'square', label: 'Square' },
  { value: 'extra-rounded', label: 'Pill' }
];

const CORNER_SQUARE_TYPES = [
  { value: 'extra-rounded', label: 'Rounded' },
  { value: 'square', label: 'Square' },
  { value: 'dot', label: 'Circle' }
];

const CORNER_DOT_TYPES = [
  { value: 'dot', label: 'Dot' },
  { value: 'square', label: 'Square' }
];

const QRCodePage = () => {
  const [activeTab, setActiveTab] = useState('content');
  const [data, setData] = useState('https://before-build-26.vercel.app/');
  const [dotsType, setDotsType] = useState('square');
  const [dotsColor, setDotsColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFF7ED');
  const [cornerSquareType, setCornerSquareType] = useState('square');
  const [cornerDotType, setCornerDotType] = useState('square');
  const [useGradient, setUseGradient] = useState(false);
  const [gradientColor, setGradientColor] = useState('#4f46e5');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoSize, setLogoSize] = useState(0.35);
  const [logoMargin, setLogoMargin] = useState(4);
  const [errorCorrection, setErrorCorrection] = useState('M');
  const [copied, setCopied] = useState(false);

  const qrContainerRef = useRef(null);
  const qrCodeInstanceRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initialize qr-code-styling on client mount
  useEffect(() => {
    const qr = new QRCodeStyling({
      width: 280,
      height: 280,
      type: 'canvas'
    });

    qrCodeInstanceRef.current = qr;

    if (qrContainerRef.current) {
      qrContainerRef.current.innerHTML = '';
      qr.append(qrContainerRef.current);
    }
  }, []);

  // Update QR configuration whenever controls change
  useEffect(() => {
    if (!qrCodeInstanceRef.current) return;

    const dotsOptions = {
      type: dotsType,
      color: useGradient ? undefined : dotsColor,
      gradient: useGradient
        ? {
            type: 'linear',
            rotation: 45,
            colorStops: [
              { offset: 0, color: dotsColor },
              { offset: 1, color: gradientColor }
            ]
          }
        : undefined
    };

    qrCodeInstanceRef.current.update({
      data: data.trim() || 'https://google.com',
      dotsOptions,
      backgroundOptions: {
        color: bgColor
      },
      cornersSquareOptions: {
        type: cornerSquareType,
        color: dotsColor
      },
      cornersDotOptions: {
        type: cornerDotType,
        color: dotsColor
      },
      image: logoUrl || undefined,
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: logoSize,
        margin: logoMargin,
        crossOrigin: 'anonymous'
      },
      qrOptions: {
        errorCorrectionLevel: logoUrl ? 'H' : errorCorrection
      }
    });
  }, [
    data,
    dotsType,
    dotsColor,
    bgColor,
    useGradient,
    gradientColor,
    cornerSquareType,
    cornerDotType,
    logoUrl,
    logoSize,
    logoMargin,
    errorCorrection
  ]);

  const handleDownload = (extension) => {
    if (!qrCodeInstanceRef.current) return;
    qrCodeInstanceRef.current.download({
      name: 'custom-qr-code',
      extension
    });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, SVG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setLogoUrl(reader.result);
      if (errorCorrection === 'L' || errorCorrection === 'M') {
        setErrorCorrection('Q');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReset = () => {
    setData('https://before-build-26.vercel.app/');
    setDotsType('square');
    setDotsColor('#000000');
    setBgColor('#FFF7ED');
    setCornerSquareType('square');
    setCornerDotType('square');
    setUseGradient(false);
    setGradientColor('#4f46e5');
    setLogoUrl('');
    setLogoSize(0.35);
    setLogoMargin(4);
    setErrorCorrection('M');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCopyLink = async () => {
    if (!data) return;
    try {
      await navigator.clipboard.writeText(data);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API is restricted
    }
  };

  const tabs = [
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'shapes', label: 'Shapes', icon: Shapes },
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'logo', label: 'Logo', icon: ImageIcon }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-black pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col"
    >
      <PageBackground />

      <div className="relative z-10 flex flex-col flex-1 max-w-7xl mx-auto w-full">
        {/* Header navigation and title */}
        <div className="mb-6 pt-2">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <Link
              to="/tools"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span>All Tools</span>
            </Link>
            <span className="text-gray-600">/</span>
            <div className="flex items-center gap-2 text-white">
              <QrCode size={18} />
              <span className="font-semibold text-sm sm:text-base">QR Code Generator</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
                Canva-Style QR Generator
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">
                Design custom branded QR codes with colors, patterns, and logos.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="self-start sm:self-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs sm:text-sm transition-colors"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Responsive layout: on mobile, preview sits at the top; on desktop, preview is sticky on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Preview Panel: rendered first on mobile for immediate visual feedback */}
          <div className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-28">
            <div className="rounded-2xl border border-white/10 bg-neutral-950/80 backdrop-blur-md p-5 sm:p-6 shadow-2xl flex flex-col items-center">
              <span className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-4 self-start">
                Live Preview
              </span>

              {/* QR Canvas Display Wrapper with fluid centering */}
              <div
                className="w-full max-w-[280px] sm:max-w-[300px] aspect-square rounded-2xl p-4 flex items-center justify-center shadow-inner transition-colors duration-200"
                style={{ backgroundColor: bgColor }}
              >
                <div
                  ref={qrContainerRef}
                  className="w-full h-full flex items-center justify-center [&>canvas]:max-w-full [&>canvas]:h-auto [&>canvas]:rounded-lg [&>svg]:max-w-full [&>svg]:h-auto"
                />
              </div>

              {/* URL snippet info */}
              <div className="w-full mt-4 p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs text-gray-400">
                <span className="truncate max-w-[220px] font-mono" title={data}>
                  {data || 'Empty text'}
                </span>
                <button
                  onClick={handleCopyLink}
                  className="p-1 hover:text-white transition-colors"
                  title="Copy link"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>

              {/* Export Buttons */}
              <div className="w-full grid grid-cols-2 gap-3 mt-4">
                <button
                  onClick={() => handleDownload('png')}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black font-semibold text-xs sm:text-sm hover:bg-gray-200 active:scale-95 transition-all shadow-md"
                >
                  <Download size={15} />
                  <span>PNG</span>
                </button>
                <button
                  onClick={() => handleDownload('svg')}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 bg-white/5 text-white font-semibold text-xs sm:text-sm hover:bg-white/10 active:scale-95 transition-all"
                >
                  <Download size={15} />
                  <span>SVG Vector</span>
                </button>
              </div>

              <p className="text-[11px] text-gray-500 text-center mt-3">
                Scannable on all modern iOS & Android cameras.
              </p>
            </div>
          </div>

          {/* Controls Panel: left column on desktop, below preview on mobile */}
          <div className="lg:col-span-7 order-2 lg:order-1 rounded-2xl border border-white/10 bg-neutral-950/80 backdrop-blur-md shadow-2xl p-4 sm:p-6 flex flex-col">
            
            {/* Touch-friendly navigation tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-white/10 no-scrollbar">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap min-h-[40px] ${
                      isActive
                        ? 'bg-white text-black shadow'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab content area */}
            <div className="py-5 flex flex-col gap-6">

              {/* 1. Content Tab */}
              {activeTab === 'content' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-2">
                      Destination URL or Text
                    </label>
                    <textarea
                      rows={3}
                      value={data}
                      onChange={(e) => setData(e.target.value)}
                      placeholder="https://example.com or any plain text..."
                      className="w-full bg-black/60 border border-white/15 focus:border-white/40 focus:outline-none rounded-xl p-3 text-sm text-white placeholder-gray-500 transition-colors resize-none font-mono"
                    />
                    <p className="text-[11px] text-gray-500 mt-1">
                      Enter a website address, contact card, or message to encode.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-2">
                      Error Correction Level
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { level: 'L', desc: 'Low (7%)' },
                        { level: 'M', desc: 'Med (15%)' },
                        { level: 'Q', desc: 'High (25%)' },
                        { level: 'H', desc: 'Max (30%)' }
                      ].map((item) => (
                        <button
                          key={item.level}
                          type="button"
                          onClick={() => setErrorCorrection(item.level)}
                          className={`p-2.5 rounded-xl border text-center transition-all ${
                            errorCorrection === item.level
                              ? 'border-white bg-white/10 text-white font-semibold'
                              : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                          }`}
                        >
                          <div className="text-xs font-bold">{item.level}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5">{item.desc}</div>
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1.5">
                      Higher levels keep the QR code readable even if partly obscured or covered with a logo.
                    </p>
                  </div>
                </div>
              )}

              {/* 2. Shapes & Patterns Tab */}
              {activeTab === 'shapes' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-2.5">
                      Dot Pattern Style
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {DOT_TYPES.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setDotsType(type.value)}
                          className={`px-3 py-2.5 rounded-xl border text-xs text-left transition-all min-h-[44px] flex items-center justify-between ${
                            dotsType === type.value
                              ? 'border-white bg-white/10 text-white font-semibold'
                              : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                          }`}
                        >
                          <span>{type.label}</span>
                          {dotsType === type.value && <Check size={14} className="text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-2.5">
                      Corner Frame Shape
                    </label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {CORNER_SQUARE_TYPES.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setCornerSquareType(type.value)}
                          className={`px-3 py-2.5 rounded-xl border text-xs text-center transition-all min-h-[44px] ${
                            cornerSquareType === type.value
                              ? 'border-white bg-white/10 text-white font-semibold'
                              : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-2.5">
                      Corner Center Dot Shape
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {CORNER_DOT_TYPES.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setCornerDotType(type.value)}
                          className={`px-3 py-2.5 rounded-xl border text-xs text-center transition-all min-h-[44px] ${
                            cornerDotType === type.value
                              ? 'border-white bg-white/10 text-white font-semibold'
                              : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Colors Tab */}
              {activeTab === 'colors' && (
                <div className="space-y-6">
                  {/* Gradient fill toggle */}
                  <div className="p-4 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-gray-200">Gradient Fill</div>
                      <div className="text-[11px] text-gray-400">Blend two colors across the QR pattern</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUseGradient(!useGradient)}
                      className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                        useGradient ? 'bg-white' : 'bg-neutral-800'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full transition-transform ${
                          useGradient ? 'bg-black translate-x-5' : 'bg-gray-400 translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Pattern Color Picker */}
                  <InAppColorPicker
                    label={useGradient ? 'Pattern Start Color' : 'Pattern (Dots) Color'}
                    color={dotsColor}
                    onChange={setDotsColor}
                  />

                  {/* Secondary Gradient End Color Picker */}
                  {useGradient && (
                    <InAppColorPicker
                      label="Pattern End Color"
                      color={gradientColor}
                      onChange={setGradientColor}
                    />
                  )}

                  {/* Background Color Picker */}
                  <InAppColorPicker
                    label="Background Color"
                    color={bgColor}
                    onChange={setBgColor}
                  />

                  <p className="text-[11px] text-gray-500 text-center">
                    Ensure strong contrast between the pattern and background color for dependable scanning.
                  </p>
                </div>
              )}

              {/* 4. Logo Tab */}
              {activeTab === 'logo' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-2">
                      Center Logo Image
                    </label>

                    {logoUrl ? (
                      <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={logoUrl}
                            alt="Uploaded Logo"
                            className="w-12 h-12 object-contain rounded-lg bg-white/10 p-1 border border-white/10"
                          />
                          <div>
                            <div className="text-xs font-semibold text-white">Custom Logo Active</div>
                            <div className="text-[11px] text-gray-400">Centered in QR code</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                          title="Remove logo"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-white/15 hover:border-white/30 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-white/5">
                        <Upload size={24} className="text-gray-400" />
                        <span className="text-xs font-medium text-gray-200">
                          Click to upload logo
                        </span>
                        <span className="text-[11px] text-gray-500">
                          Supports PNG, JPG, or SVG
                        </span>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {logoUrl && (
                    <div className="space-y-4 pt-2">
                      <div>
                        <div className="flex justify-between text-xs text-gray-300 mb-1">
                          <span>Logo Size</span>
                          <span className="font-mono text-gray-400">{Math.round(logoSize * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0.2"
                          max="0.45"
                          step="0.05"
                          value={logoSize}
                          onChange={(e) => setLogoSize(parseFloat(e.target.value))}
                          className="w-full accent-white cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs text-gray-300 mb-1">
                          <span>Logo Padding Margin</span>
                          <span className="font-mono text-gray-400">{logoMargin}px</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="15"
                          step="1"
                          value={logoMargin}
                          onChange={(e) => setLogoMargin(parseInt(e.target.value, 10))}
                          className="w-full accent-white cursor-pointer"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default QRCodePage;
