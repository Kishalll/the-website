import React, { useEffect, useRef } from 'react';

// Convert Hex colors to normalized RGB [0-1]
const hexToRgb = (hex) => {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map((x) => x + x).join('');
  const num = parseInt(c, 16);
  return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
};

const FloatingLines = ({
  linesGradient = ['#333333', '#9b8f8f', '#ffffff'],
  lineCount = 10,
  lineDistance = 5,
  animationSpeed = 1,
  bendRadius = 10,
  bendStrength = -2.5,
  interactive = true,
  parallax = true,
  parallaxStrength = 0.2,
  mixBlendMode = 'screen',
  className = '',
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Fast-path 2D context optimization
    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    let animId;
    let time = 0;

    // Cache pre-computed RGB colors
    const rgbColors = linesGradient.map(hexToRgb);

    // Pre-calculated target mouse coordinates (prevents layout thrashing)
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    let currentDpr = 1;

    const resize = () => {
      const parent = canvas.parentElement;
      currentDpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x DPR for smooth high-Hz rendering
      canvas.width = (parent ? parent.offsetWidth : window.innerWidth) * currentDpr;
      canvas.height = (parent ? parent.offsetHeight : window.innerHeight) * currentDpr;
      ctx.scale(currentDpr, currentDpr);
    };

    resize();
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 100);
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    if (interactive) window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Color Interpolation Engine
    const getColor = (t) => {
      const index = t * (rgbColors.length - 1);
      const idx1 = Math.floor(index);
      const idx2 = Math.min(idx1 + 1, rgbColors.length - 1);
      const factor = index - idx1;

      const c1 = rgbColors[idx1];
      const c2 = rgbColors[idx2];

      const r = (c1[0] + (c2[0] - c1[0]) * factor) * 255;
      const g = (c1[1] + (c2[1] - c1[1]) * factor) * 255;
      const b = (c1[2] + (c2[2] - c1[2]) * factor) * 255;

      return `rgb(${r | 0}, ${g | 0}, ${b | 0})`;
    };

    const waveLayers = [
      { yRatio: 0.3, rotate: -0.15, speedMult: 0.8, amp: 40 },
      { yRatio: 0.5, rotate: 0.08, speedMult: 1.0, amp: 55 },
      { yRatio: 0.7, rotate: -0.1, speedMult: 0.9, amp: 45 },
    ];

    const render = () => {
      time += 0.015 * animationSpeed;

      const displayWidth = canvas.width / currentDpr;
      const displayHeight = canvas.height / currentDpr;

      ctx.clearRect(0, 0, displayWidth, displayHeight);

      // Smooth Lerping (Linear Interpolation) for Mouse Buffer
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      const mouseX = mouse.x;
      const mouseY = mouse.y;

      const parallaxX = parallax ? (mouseX - displayWidth / 2) * (parallaxStrength * 0.04) : 0;
      const parallaxY = parallax ? (mouseY - displayHeight / 2) * (parallaxStrength * 0.04) : 0;

      const radiusSq = Math.pow(bendRadius * 20, 2); // Squared distance check (faster than Math.sqrt)

      waveLayers.forEach((layer) => {
        const centerY = displayHeight * layer.yRatio + parallaxY;

        for (let i = 0; i < lineCount; i++) {
          ctx.save();
          ctx.translate(displayWidth / 2 + parallaxX, centerY);
          ctx.rotate(layer.rotate);
          ctx.translate(-displayWidth / 2 - parallaxX, -centerY);

          ctx.beginPath();
          const lineOffset = (i - lineCount / 2) * lineDistance * 3.5;
          const colorProgress = i / Math.max(lineCount - 1, 1);

          ctx.strokeStyle = getColor(colorProgress);
          ctx.lineWidth = 2.5;

          // Optimized step size (16px instead of 8px reduces CPU path calculations by 50%)
          const step = 16;
          for (let x = -50; x <= displayWidth + 50; x += step) {
            let y =
              centerY +
              Math.sin(x * 0.0035 + time * layer.speedMult + i * 0.2) * layer.amp +
              lineOffset;

            if (interactive) {
              const dx = x - mouseX;
              const dy = y - mouseY;
              const distSq = dx * dx + dy * dy;

              if (distSq < radiusSq) {
                const force = 1 - distSq / radiusSq;
                y += Math.sin(distSq * 0.0001 - time * 2) * bendStrength * 12 * force;
              }
            }

            if (x === -50) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }

          ctx.stroke();
          ctx.restore();
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (interactive) window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [
    linesGradient,
    lineCount,
    lineDistance,
    animationSpeed,
    bendRadius,
    bendStrength,
    interactive,
    parallax,
    parallaxStrength,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ mixBlendMode }}
    />
  );
};

export default FloatingLines;