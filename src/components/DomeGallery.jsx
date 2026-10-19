import { useEffect, useMemo, useRef, useCallback, useState } from 'react';
import { useGesture } from '@use-gesture/react';
import './DomeGallery.css';

const DEFAULT_IMAGES = [{ src: '', alt: '' }];

const DEFAULTS = {
    maxVerticalRotationDeg: 10,
    dragSensitivity: 20,
    enlargeTransitionMs: 300,
    minSlots: 12,
    slotsPerRing: 21,
    autoRotate: true,
    tileGap: 14,
    ringCount: 3,
    // Big responsive preview card; capped so it never overflows the viewport.
    openedImageWidth: 'min(1040px, calc(100vw - 4rem))',
    openedImageHeight: 'min(760px, calc(100vh - 5rem))',
};

// Much darker tints so dummy tiles recede well behind the photos.
const PLACEHOLDER_COLORS = ['#172554', '#450a0a', '#052e16'];

// The ring is sized so its projected silhouette spans the whole site width.
// With the stage perspective at 2R a ring of radius R projects to ~0.71R on
// each side, so R = 0.72 * viewport width lands tiles edge to edge — no
// margins or padding on the sides of the ring container.
const RING_WIDTH_FACTOR = 0.72;
const MIN_RING_RADIUS = 240;
const MAX_RING_SLOTS = 64;

// Width multiplier + aspect ratio per tier. Medium is the base size; small and
// big scale it, so rings of any radius can mix tile sizes while staying under
// the per-ring height cap.
const SIZE_TIERS = [
    { w: 1, aspect: 0.63 },
    { w: 0.66, aspect: 0.78 },
    { w: 1.5, aspect: 0.55 },
];
// Cycle weighted toward medium: medium, small, medium, big.
const TIER_CYCLE = [0, 1, 0, 2];

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const normalizeAngle = (d) => ((d % 360) + 360) % 360;
const wrapAngleSigned = (deg) => {
    const a = (((deg + 180) % 360) + 360) % 360;
    return a - 180;
};
const getDataNumber = (el, name, fallback) => {
    const attr = el.dataset[name] ?? el.getAttribute(`data-${name}`);
    const n = attr == null ? NaN : parseFloat(attr);
    return Number.isFinite(n) ? n : fallback;
};

function normalizePool(pool) {
    const seen = new Set();
    const out = [];
    for (const image of pool) {
        const norm =
            typeof image === 'string'
                ? { src: image, alt: '', title: '', tag: '', caption: '' }
                : {
                      src: image?.src || '',
                      alt: image?.alt || '',
                      title: image?.title || '',
                      tag: image?.tag || '',
                      caption: image?.caption || '',
                  };
        if (!norm.src || seen.has(norm.src)) continue;
        seen.add(norm.src);
        out.push(norm);
    }
    return out;
}

function mulberry32(seed) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function shuffled(arr, rand) {
    const out = [...arr];
    for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
}

// Deterministic pseudo-random tier assignment: looks scattered, but the same
// slot count always yields the same layout (no reshuffling on re-render).
function assignTiers(count, seed) {
    const tiers = Array.from({ length: count }, (_, i) => TIER_CYCLE[i % TIER_CYCLE.length]);
    const rand = mulberry32(seed);
    return shuffled(tiers, rand);
}

// Deterministic scatter of real images over the ring's slots, so photos never
// cluster in one arc and placeholders fill the rest evenly.
function pickIndices(count, take, seed) {
    const idx = Array.from({ length: count }, (_, i) => i);
    const rand = mulberry32(seed);
    return shuffled(idx, rand).slice(0, Math.min(take, count));
}

// Flat tiles are tangent to the ring, so tile i spans 2*atan(k*f_i/2R) radians
// and every gap spans gapEff/R. Scale k is the tile width factor; solve for the
// k where all spans sum to exactly 2π.
function solveScale(n, factors, radius, gapEff) {
    const span = (k) =>
        factors.reduce((sum, f) => sum + 2 * Math.atan((k * f) / (2 * radius)), 0) +
        (n * gapEff) / radius;

    let lo = 0.01;
    let hi = 16;
    let guard = 0;
    while (span(hi) < 2 * Math.PI && guard++ < 60) hi *= 2;
    if (span(hi) < 2 * Math.PI) return hi;
    if (span(lo) > 2 * Math.PI) return lo;

    for (let i = 0; i < 90; i++) {
        const mid = (lo + hi) / 2;
        if (span(mid) < 2 * Math.PI) lo = mid;
        else hi = mid;
    }
    return (lo + hi) / 2;
}

// One ring: fixed radius (shared by all rings so they form a donut), slot
// count n chosen by the caller, tile scale solved so spans close exactly 360°.
function layoutAt(ringIndex, n, ringImages, radius, gap) {
    const tiers = assignTiers(n, n * 31 + ringIndex * 97);
    const factors = tiers.map((t) => SIZE_TIERS[t].w);
    // Guarantees closure is solvable for any n >= 3: gaps never eat more than
    // 60% of the circle even when n is tiny.
    const gapEff = Math.min(gap, (0.3 * 2 * Math.PI * radius) / n);
    const k = solveScale(n, factors, radius, gapEff);
    const widths = factors.map((f) => k * f);
    const heights = tiers.map((t, i) => widths[i] * SIZE_TIERS[t].aspect);

    const imageBySlot = new Map();
    pickIndices(n, ringImages.length, n * 7 + ringIndex * 13 + 1).forEach((slot, j) => {
        imageBySlot.set(slot, ringImages[j]);
    });

    let cursor = 0;
    const items = widths.map((w, i) => {
        const delta = 2 * Math.atan(w / (2 * radius));
        const angle = ((cursor + delta / 2) * 180) / Math.PI;
        cursor += delta + gapEff / radius;

        const real = imageBySlot.get(i);
        if (real) {
            return {
                src: real.src,
                alt: real.alt,
                title: real.title,
                tag: real.tag,
                caption: real.caption,
                angle,
                w,
                h: heights[i],
                placeholder: null,
            };
        }
        return {
            src: '',
            alt: '',
            title: '',
            tag: '',
            caption: '',
            angle,
            w,
            h: heights[i],
            placeholder: PLACEHOLDER_COLORS[(i + ringIndex) % PLACEHOLDER_COLORS.length],
        };
    });

    return { items, tallest: Math.max(...heights), gapEff, y: 0 };
}

// The donut: on vertical screens (phones/portrait), size radius and spacing so each
// ring spans 1/3rd of the screen height, fitting the rings from top to bottom.
// On horizontal screens (desktop/landscape), size radius to fit viewport width.
function buildRings(uniqueImages, minSlots, viewport, gap, ringCount, slotsPerRing = null) {
    const count = Math.max(1, Math.round(ringCount));
    const isVertical = viewport.h > viewport.w;
    const radius = isVertical
        ? Math.max(MIN_RING_RADIUS, viewport.h * 1.15)
        : Math.max(MIN_RING_RADIUS, viewport.w * RING_WIDTH_FACTOR);
    const minPerRing = Math.max(3, Math.ceil(minSlots / count));
    const targetSlots = slotsPerRing ?? DEFAULTS.slotsPerRing;

    const rings = [];
    let tallestAll = 0;
    for (let r = 0; r < count; r++) {
        const ringImages = uniqueImages.filter((_, i) => i % count === r);
        let n = Math.max(targetSlots, minPerRing, ringImages.length, 3);
        let layout = layoutAt(r, n, ringImages, radius, gap);
        tallestAll = Math.max(tallestAll, layout.tallest);
        rings.push(layout);
    }

    // On vertical screens, space rings evenly so each occupies 1/3rd of the viewport height.
    // On horizontal screens, use tight stacking derived from tile height + clear gap.
    const clearGap = tallestAll * 0.16 + 8;
    const spacing = isVertical ? viewport.h / count : tallestAll + clearGap * 0.75;
    rings.forEach((ring, r) => {
        ring.y = (r - (count - 1) / 2) * spacing;
    });
    return { rings, radius };
}

// Per-load randomness: every ring gets its own direction, speed band and
// starting angle, shuffled so no two rings repeat a combination.
function makeMotion(count) {
    const n = Math.max(1, Math.round(count));
    const rand = Math.random;
    const dirs = shuffled(
        Array.from({ length: n }, (_, i) => (i % 2 === 0 ? 1 : -1)),
        rand
    );
    const mags = shuffled(
        Array.from({ length: n }, (_, i) => [2, 4, 6][i % 3]),
        rand
    ).map((base) => base * (0.85 + rand() * 0.3));
    const startAngles = Array.from({ length: n }, () => rand() * 360);
    return { dirs, mags, startAngles };
}

export default function DomeGallery({
    images = DEFAULT_IMAGES,
    padFactor = 0.16,
    overlayBlurColor = '#120F17',
    maxVerticalRotationDeg = DEFAULTS.maxVerticalRotationDeg,
    dragSensitivity = DEFAULTS.dragSensitivity,
    enlargeTransitionMs = DEFAULTS.enlargeTransitionMs,
    minSlots = DEFAULTS.minSlots,
    slotsPerRing = DEFAULTS.slotsPerRing,
    autoRotate = DEFAULTS.autoRotate,
    tileGap = DEFAULTS.tileGap,
    ringCount = DEFAULTS.ringCount,
    dragDampening = 2,
    openedImageWidth = DEFAULTS.openedImageWidth,
    openedImageHeight = DEFAULTS.openedImageHeight,
    imageBorderRadius = '30px',
    openedImageBorderRadius = '30px',
    grayscale = true,
}) {
    const rootRef = useRef(null);
    const mainRef = useRef(null);
    const sphereRef = useRef(null);
    const frameRef = useRef(null);
    const viewerRef = useRef(null);
    const scrimRef = useRef(null);
    const focusedElRef = useRef(null);
    const originalTilePositionRef = useRef(null);
    const ringElsRef = useRef([]);

    const rotationRef = useRef({ x: 0, y: 0 });
    const renderRotRef = useRef({ x: 0, y: 0 });
    const startRotRef = useRef({ x: 0, y: 0 });
    const startPosRef = useRef(null);
    const draggingRef = useRef(false);
    const movedRef = useRef(false);
    const inertiaRAF = useRef(null);
    const openingRef = useRef(false);
    const openStartedAtRef = useRef(0);
    const lastDragEndAt = useRef(0);

    const scrollLockedRef = useRef(false);
    const lockScroll = useCallback(() => {
        if (scrollLockedRef.current) return;
        scrollLockedRef.current = true;
        document.body.classList.add('dg-scroll-lock');
    }, []);
    const unlockScroll = useCallback(() => {
        if (!scrollLockedRef.current) return;
        if (rootRef.current?.getAttribute('data-enlarging') === 'true') return;
        scrollLockedRef.current = false;
        document.body.classList.remove('dg-scroll-lock');
    }, []);

    const uniqueImages = useMemo(() => normalizePool(images), [images]);

    const [viewport, setViewport] = useState(() => ({
        w: typeof window !== 'undefined' && window.innerWidth ? window.innerWidth : 1024,
        h: typeof window !== 'undefined' && window.innerHeight ? window.innerHeight : 768,
    }));
    const { rings, radius } = useMemo(
        () => buildRings(uniqueImages, minSlots, viewport, tileGap, ringCount, slotsPerRing),
        [uniqueImages, minSlots, viewport, tileGap, ringCount, slotsPerRing]
    );

    const [motion] = useState(() => makeMotion(ringCount));
    const ringSpinRef = useRef(motion.startAngles.slice());

    const setRingEl = useCallback((index, el) => {
        ringElsRef.current[index] = el;
    }, []);

    const applyTransform = useCallback((xDeg, yDeg) => {
        const el = sphereRef.current;
        if (el) {
            el.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`;
        }
    }, []);

    // The radius is whatever the full-width solve produced — no clamping or
    // rounding, otherwise the ring would leave margins on the sides.
    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        root.style.setProperty('--radius', `${radius}px`);
        applyTransform(rotationRef.current.x, rotationRef.current.y);
    }, [radius, applyTransform]);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        const ro = new ResizeObserver((entries) => {
            const cr = entries[0].contentRect;
            const w = Math.max(1, cr.width);
            const h = Math.max(1, cr.height);
            setViewport((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));

            const minDim = Math.min(w, h);
            const viewerPad = Math.max(8, Math.round(minDim * padFactor));
            root.style.setProperty('--viewer-pad', `${viewerPad}px`);
            root.style.setProperty('--overlay-blur-color', overlayBlurColor);
            root.style.setProperty('--tile-radius', imageBorderRadius);
            root.style.setProperty('--enlarge-radius', openedImageBorderRadius);
            root.style.setProperty('--image-filter', grayscale ? 'grayscale(1)' : 'none');
            applyTransform(rotationRef.current.x, rotationRef.current.y);

            const enlargedOverlay = viewerRef.current?.querySelector('.enlarge');
            if (enlargedOverlay && frameRef.current && mainRef.current) {
                const frameR = frameRef.current.getBoundingClientRect();
                const mainR = mainRef.current.getBoundingClientRect();

                const hasCustomSize = openedImageWidth && openedImageHeight;
                const enImg = enlargedOverlay.querySelector('img');
                const natW = enImg?.naturalWidth || 0;
                const natH = enImg?.naturalHeight || 0;

                if (hasCustomSize) {
                    const tempDiv = document.createElement('div');
                    tempDiv.style.cssText = `position: absolute; width: ${openedImageWidth}; height: ${openedImageHeight}; visibility: hidden;`;
                    document.body.appendChild(tempDiv);
                    const tempRect = tempDiv.getBoundingClientRect();
                    document.body.removeChild(tempDiv);

                    let targetW = `${tempRect.width}px`;
                    let targetH = `${tempRect.height}px`;
                    let centeredW = tempRect.width;
                    let centeredH = tempRect.height;
                    if (natW > 0 && natH > 0) {
                        const imgAspect = natW / natH;
                        const boxAspect = tempRect.width / tempRect.height;
                        if (imgAspect >= boxAspect) {
                            centeredW = tempRect.width;
                            centeredH = Math.round(tempRect.width / imgAspect);
                        } else {
                            centeredH = tempRect.height;
                            centeredW = Math.round(tempRect.height * imgAspect);
                        }
                        targetW = `${centeredW}px`;
                        targetH = `${centeredH}px`;
                    }

                    const centeredLeft =
                        frameR.left - mainR.left + (frameR.width - centeredW) / 2;
                    const centeredTop =
                        frameR.top - mainR.top + (frameR.height - centeredH) / 2;

                    enlargedOverlay.style.left = `${centeredLeft}px`;
                    enlargedOverlay.style.top = `${centeredTop}px`;
                    enlargedOverlay.style.width = targetW;
                    enlargedOverlay.style.height = targetH;
                } else {
                    let centeredW = frameR.width;
                    let centeredH = frameR.height;
                    if (natW > 0 && natH > 0) {
                        const imgAspect = natW / natH;
                        const boxAspect = frameR.width / frameR.height;
                        if (imgAspect >= boxAspect) {
                            centeredW = frameR.width;
                            centeredH = Math.round(frameR.width / imgAspect);
                        } else {
                            centeredH = frameR.height;
                            centeredW = Math.round(frameR.height * imgAspect);
                        }
                    }
                    const centeredLeft =
                        frameR.left - mainR.left + (frameR.width - centeredW) / 2;
                    const centeredTop =
                        frameR.top - mainR.top + (frameR.height - centeredH) / 2;

                    enlargedOverlay.style.left = `${centeredLeft}px`;
                    enlargedOverlay.style.top = `${centeredTop}px`;
                    enlargedOverlay.style.width = `${centeredW}px`;
                    enlargedOverlay.style.height = `${centeredH}px`;
                }
            }
        });
        ro.observe(root);
        return () => ro.disconnect();
    }, [
        padFactor,
        overlayBlurColor,
        grayscale,
        imageBorderRadius,
        openedImageBorderRadius,
        openedImageWidth,
        openedImageHeight,
        applyTransform,
    ]);

    useEffect(() => {
        applyTransform(rotationRef.current.x, rotationRef.current.y);
    }, [applyTransform]);

    // Ring spin loop: every ring advances at its own speed/direction while the
    // interaction gates allow it, driven through the --ring-spin CSS variable.
    useEffect(() => {
        let raf;
        let last = performance.now();
        const tick = (now) => {
            const dt = Math.min(64, now - last);
            last = now;

            const canAutoRotate =
                autoRotate &&
                !draggingRef.current &&
                !focusedElRef.current &&
                !openingRef.current &&
                !inertiaRAF.current;
            if (canAutoRotate) {
                for (let i = 0; i < motion.dirs.length; i++) {
                    const next = wrapAngleSigned(
                        ringSpinRef.current[i] + motion.dirs[i] * motion.mags[i] * (dt / 1000)
                    );
                    ringSpinRef.current[i] = next;
                    const el = ringElsRef.current[i];
                    if (el) el.style.setProperty('--ring-spin', `${next}deg`);
                }
            }

            const target = rotationRef.current;
            const render = renderRotRef.current;
            if (draggingRef.current) {
                renderRotRef.current = { x: target.x, y: target.y };
                applyTransform(target.x, target.y);
            } else {
                const dx = target.x - render.x;
                const dy = wrapAngleSigned(target.y - render.y);
                if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) {
                    if (render.x !== target.x || render.y !== target.y) {
                        renderRotRef.current = { x: target.x, y: target.y };
                        applyTransform(target.x, target.y);
                    }
                } else {
                    const nx = render.x + dx * 0.22;
                    const ny = render.y + dy * 0.22;
                    renderRotRef.current = { x: nx, y: ny };
                    applyTransform(nx, ny);
                }
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [applyTransform, autoRotate, motion]);

    const stopInertia = useCallback(() => {
        if (inertiaRAF.current) {
            cancelAnimationFrame(inertiaRAF.current);
            inertiaRAF.current = null;
        }
    }, []);

    const startInertia = useCallback(
        (vx, vy) => {
            const MAX_V = 1.4;
            let vX = clamp(vx, -MAX_V, MAX_V) * 80;
            let vY = clamp(vy, -MAX_V, MAX_V) * 80;
            let frames = 0;
            const d = clamp(dragDampening ?? 0.6, 0, 1);
            const frictionMul = 0.94 + 0.055 * d;
            const stopThreshold = 0.015 - 0.01 * d;
            const maxFrames = Math.round(90 + 270 * d);
            const step = () => {
                vX *= frictionMul;
                vY *= frictionMul;
                if (Math.abs(vX) < stopThreshold && Math.abs(vY) < stopThreshold) {
                    inertiaRAF.current = null;
                    return;
                }
                if (++frames > maxFrames) {
                    inertiaRAF.current = null;
                    return;
                }
                const nextX = clamp(
                    rotationRef.current.x - vY / 200,
                    -maxVerticalRotationDeg,
                    maxVerticalRotationDeg
                );
                const nextY = wrapAngleSigned(rotationRef.current.y + vX / 200);
                rotationRef.current = { x: nextX, y: nextY };
                inertiaRAF.current = requestAnimationFrame(step);
            };
            stopInertia();
            inertiaRAF.current = requestAnimationFrame(step);
        },
        [dragDampening, maxVerticalRotationDeg, stopInertia]
    );

    useGesture(
        {
            onDragStart: ({ event }) => {
                if (focusedElRef.current) return;
                stopInertia();
                const evt = event;
                draggingRef.current = true;
                movedRef.current = false;
                startRotRef.current = { ...rotationRef.current };
                startPosRef.current = { x: evt.clientX, y: evt.clientY };
            },
            onDrag: ({ event, last, velocity = [0, 0], direction = [0, 0], movement }) => {
                if (focusedElRef.current || !draggingRef.current || !startPosRef.current) return;
                const evt = event;
                const dxTotal = evt.clientX - startPosRef.current.x;
                const dyTotal = evt.clientY - startPosRef.current.y;
                if (!movedRef.current) {
                    const dist2 = dxTotal * dxTotal + dyTotal * dyTotal;
                    if (dist2 > 16) movedRef.current = true;
                }
                const nextX = clamp(
                    startRotRef.current.x - dyTotal / dragSensitivity,
                    -maxVerticalRotationDeg,
                    maxVerticalRotationDeg
                );
                const nextY = wrapAngleSigned(startRotRef.current.y + dxTotal / dragSensitivity);
                if (rotationRef.current.x !== nextX || rotationRef.current.y !== nextY) {
                    rotationRef.current = { x: nextX, y: nextY };
                }
                if (last) {
                    draggingRef.current = false;
                    let [vMagX, vMagY] = velocity;
                    const [dirX, dirY] = direction;
                    let vx = vMagX * dirX;
                    let vy = vMagY * dirY;
                    if (Math.abs(vx) < 0.001 && Math.abs(vy) < 0.001 && Array.isArray(movement)) {
                        const [mx, my] = movement;
                        vx = clamp((mx / dragSensitivity) * 0.02, -1.2, 1.2);
                        vy = clamp((my / dragSensitivity) * 0.02, -1.2, 1.2);
                    }
                    if (Math.abs(vx) > 0.005 || Math.abs(vy) > 0.005) startInertia(vx, vy);
                    if (movedRef.current) lastDragEndAt.current = performance.now();
                    movedRef.current = false;
                }
            },
        },
        { target: mainRef, eventOptions: { passive: true } }
    );

    useEffect(() => {
        const el = mainRef.current;
        if (!el) return undefined;
        const onWheel = (event) => {
            if (focusedElRef.current) return;
            event.preventDefault();
            stopInertia();
            const delta =
                Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
            if (!delta) return;
            const nextY = wrapAngleSigned(rotationRef.current.y + delta * 0.15);
            rotationRef.current = { x: rotationRef.current.x, y: nextY };
        };
        el.addEventListener('wheel', onWheel, { passive: false });
        return () => el.removeEventListener('wheel', onWheel);
    }, [stopInertia]);

    useEffect(() => {
        const scrim = scrimRef.current;
        if (!scrim) return;
        const close = () => {
            if (performance.now() - openStartedAtRef.current < 250) return;
            const el = focusedElRef.current;
            if (!el) return;
            const parent = el.parentElement;
            const overlay = viewerRef.current?.querySelector('.enlarge');
            if (!overlay) return;
            const refDiv = parent.querySelector('.item__image--reference');
            const originalPos = originalTilePositionRef.current;
            if (!originalPos) {
                overlay.remove();
                if (refDiv) refDiv.remove();
                parent.style.setProperty('--rot-y-delta', '0deg');
                parent.style.setProperty('--rot-x-delta', '0deg');
                el.style.visibility = '';
                el.style.zIndex = 0;
                focusedElRef.current = null;
                rootRef.current?.removeAttribute('data-enlarging');
                openingRef.current = false;
                unlockScroll();
                return;
            }
            const currentRect = overlay.getBoundingClientRect();
            const rootRect = rootRef.current.getBoundingClientRect();
            const originalPosRelativeToRoot = {
                left: originalPos.left - rootRect.left,
                top: originalPos.top - rootRect.top,
                width: originalPos.width,
                height: originalPos.height,
            };
            const overlayRelativeToRoot = {
                left: currentRect.left - rootRect.left,
                top: currentRect.top - rootRect.top,
                width: currentRect.width,
                height: currentRect.height,
            };
            const animatingOverlay = document.createElement('div');
            animatingOverlay.className = 'enlarge-closing';
            animatingOverlay.style.cssText = `position:absolute;left:${overlayRelativeToRoot.left}px;top:${overlayRelativeToRoot.top}px;width:${overlayRelativeToRoot.width}px;height:${overlayRelativeToRoot.height}px;z-index:9999;border-radius: var(--enlarge-radius, 32px);overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.35);transition:all ${enlargeTransitionMs}ms ease-out;pointer-events:none;margin:0;transform:none;`;
            const originalImg = overlay.querySelector('img');
            if (originalImg) {
                const img = originalImg.cloneNode();
                img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
                animatingOverlay.appendChild(img);
            } else if (overlay.dataset.placeholder) {
                animatingOverlay.style.background = overlay.dataset.placeholder;
            }
            overlay.remove();
            rootRef.current.appendChild(animatingOverlay);
            void animatingOverlay.getBoundingClientRect();
            requestAnimationFrame(() => {
                animatingOverlay.style.left = originalPosRelativeToRoot.left + 'px';
                animatingOverlay.style.top = originalPosRelativeToRoot.top + 'px';
                animatingOverlay.style.width = originalPosRelativeToRoot.width + 'px';
                animatingOverlay.style.height = originalPosRelativeToRoot.height + 'px';
                animatingOverlay.style.opacity = '0';
            });
            const cleanup = () => {
                animatingOverlay.remove();
                originalTilePositionRef.current = null;
                if (refDiv) refDiv.remove();
                parent.style.transition = 'none';
                el.style.transition = 'none';
                parent.style.setProperty('--rot-y-delta', '0deg');
                parent.style.setProperty('--rot-x-delta', '0deg');
                requestAnimationFrame(() => {
                    el.style.visibility = '';
                    el.style.opacity = '0';
                    el.style.zIndex = 0;
                    focusedElRef.current = null;
                    rootRef.current?.removeAttribute('data-enlarging');
                    requestAnimationFrame(() => {
                        parent.style.transition = '';
                        el.style.transition = 'opacity 300ms ease-out';
                        requestAnimationFrame(() => {
                            el.style.opacity = '1';
                            setTimeout(() => {
                                el.style.transition = '';
                                el.style.opacity = '';
                                openingRef.current = false;
                                if (
                                    !draggingRef.current &&
                                    rootRef.current?.getAttribute('data-enlarging') !== 'true'
                                )
                                    document.body.classList.remove('dg-scroll-lock');
                            }, 300);
                        });
                    });
                });
            };
            animatingOverlay.addEventListener('transitionend', cleanup, { once: true });
        };
        scrim.addEventListener('click', close);
        const onKey = (e) => {
            if (e.key === 'Escape') close();
        };
        window.addEventListener('keydown', onKey);
        return () => {
            scrim.removeEventListener('click', close);
            window.removeEventListener('keydown', onKey);
        };
    }, [enlargeTransitionMs, unlockScroll]);

    const openItemFromElement = useCallback(
        (el) => {
            if (openingRef.current) return;
            openingRef.current = true;
            openStartedAtRef.current = performance.now();
            lockScroll();
            const parent = el.parentElement;
            focusedElRef.current = el;
            el.setAttribute('data-focused', 'true');
            const angle = getDataNumber(parent, 'angle', 0);
            const parentY = normalizeAngle(angle);
            // The tile also carries its ring's current spin plus the sphere's
            // yaw — all three must cancel for the tile to face the camera.
            const ringIdx = getDataNumber(parent, 'ring', 0);
            const spin = normalizeAngle(ringSpinRef.current[ringIdx] ?? 0);
            const globalY = normalizeAngle(rotationRef.current.y);
            let rotY = -(parentY + spin + globalY) % 360;
            if (rotY < -180) rotY += 360;
            const rotX = -rotationRef.current.x;
            parent.style.setProperty('--rot-y-delta', `${rotY}deg`);
            parent.style.setProperty('--rot-x-delta', `${rotX}deg`);
            const refDiv = document.createElement('div');
            refDiv.className = 'item__image item__image--reference';
            refDiv.style.opacity = '0';
            refDiv.style.transform = `rotateY(${-angle}deg)`;
            parent.appendChild(refDiv);

            void refDiv.offsetHeight;

            const tileR = refDiv.getBoundingClientRect();
            const mainR = mainRef.current?.getBoundingClientRect();
            const frameR = frameRef.current?.getBoundingClientRect();

            if (!mainR || !frameR || tileR.width <= 0 || tileR.height <= 0) {
                openingRef.current = false;
                focusedElRef.current = null;
                parent.removeChild(refDiv);
                unlockScroll();
                return;
            }

            originalTilePositionRef.current = {
                left: tileR.left,
                top: tileR.top,
                width: tileR.width,
                height: tileR.height,
            };
            el.style.visibility = 'hidden';
            el.style.zIndex = 0;
            const overlay = document.createElement('div');
            overlay.className = 'enlarge';
            overlay.style.position = 'absolute';
            overlay.style.left = frameR.left - mainR.left + 'px';
            overlay.style.top = frameR.top - mainR.top + 'px';
            overlay.style.width = frameR.width + 'px';
            overlay.style.height = frameR.height + 'px';
            overlay.style.opacity = '0';
            overlay.style.zIndex = '30';
            overlay.style.willChange = 'transform, opacity';
            overlay.style.transformOrigin = 'top left';
            overlay.style.transition = `transform ${enlargeTransitionMs}ms ease, opacity ${enlargeTransitionMs}ms ease`;
            const placeholderColor = parent.dataset.placeholder || '';
            const rawSrc = parent.dataset.src || el.querySelector('img')?.src || '';
            const title = parent.dataset.title || '';
            const tag = parent.dataset.tag || '';
            const caption = parent.dataset.caption || '';
            if (placeholderColor) {
                overlay.dataset.placeholder = placeholderColor;
                overlay.style.background = placeholderColor;
            } else {
                const img = document.createElement('img');
                img.src = rawSrc;
                img.alt = title || el.querySelector('img')?.alt || '';
                overlay.appendChild(img);
            }
            if (tag || caption) {
                const meta = document.createElement('div');
                meta.className = 'enlarge__meta';
                if (tag) {
                    const tagEl = document.createElement('span');
                    tagEl.className = 'enlarge__tag';
                    tagEl.textContent = tag;
                    meta.appendChild(tagEl);
                }
                if (caption) {
                    const captionEl = document.createElement('p');
                    captionEl.className = 'enlarge__caption';
                    captionEl.textContent = caption;
                    meta.appendChild(captionEl);
                }
                overlay.appendChild(meta);
            }
            viewerRef.current.appendChild(overlay);
            const tx0 = tileR.left - frameR.left;
            const ty0 = tileR.top - frameR.top;
            const sx0 = tileR.width / frameR.width;
            const sy0 = tileR.height / frameR.height;

            const validSx0 = isFinite(sx0) && sx0 > 0 ? sx0 : 1;
            const validSy0 = isFinite(sy0) && sy0 > 0 ? sy0 : 1;

            overlay.style.transform = `translate(${tx0}px, ${ty0}px) scale(${validSx0}, ${validSy0})`;

            setTimeout(() => {
                if (!overlay.parentElement) return;
                overlay.style.opacity = '1';
                overlay.style.transform = 'translate(0px, 0px) scale(1, 1)';
                rootRef.current?.setAttribute('data-enlarging', 'true');
            }, 16);

            const wantsResize = openedImageWidth || openedImageHeight;
            if (wantsResize) {
                const onFirstEnd = (ev) => {
                    if (ev.propertyName !== 'transform') return;
                    overlay.removeEventListener('transitionend', onFirstEnd);
                    const prevTransition = overlay.style.transition;
                    overlay.style.transition = 'none';
                    const tempWidth = openedImageWidth || `${frameR.width}px`;
                    const tempHeight = openedImageHeight || `${frameR.height}px`;
                    overlay.style.width = tempWidth;
                    overlay.style.height = tempHeight;
                    const newRect = overlay.getBoundingClientRect();
                    const enImg = overlay.querySelector('img');
                    const natW = enImg?.naturalWidth || el.querySelector('img')?.naturalWidth || 0;
                    const natH = enImg?.naturalHeight || el.querySelector('img')?.naturalHeight || 0;
                    let targetW = tempWidth;
                    let targetH = tempHeight;
                    let centeredW = newRect.width;
                    let centeredH = newRect.height;
                    if (natW > 0 && natH > 0) {
                        const imgAspect = natW / natH;
                        const boxAspect = newRect.width / newRect.height;
                        if (imgAspect >= boxAspect) {
                            centeredW = newRect.width;
                            centeredH = Math.round(newRect.width / imgAspect);
                        } else {
                            centeredH = newRect.height;
                            centeredW = Math.round(newRect.height * imgAspect);
                        }
                        targetW = `${centeredW}px`;
                        targetH = `${centeredH}px`;
                    }
                    overlay.style.width = frameR.width + 'px';
                    overlay.style.height = frameR.height + 'px';
                    void overlay.offsetWidth;
                    overlay.style.transition = `left ${enlargeTransitionMs}ms ease, top ${enlargeTransitionMs}ms ease, width ${enlargeTransitionMs}ms ease, height ${enlargeTransitionMs}ms ease`;
                    const centeredLeft =
                        frameR.left - mainR.left + (frameR.width - centeredW) / 2;
                    const centeredTop =
                        frameR.top - mainR.top + (frameR.height - centeredH) / 2;
                    requestAnimationFrame(() => {
                        overlay.style.left = `${centeredLeft}px`;
                        overlay.style.top = `${centeredTop}px`;
                        overlay.style.width = targetW;
                        overlay.style.height = targetH;
                    });
                    const cleanupSecond = () => {
                        overlay.removeEventListener('transitionend', cleanupSecond);
                        overlay.style.transition = prevTransition;
                    };
                    overlay.addEventListener('transitionend', cleanupSecond, { once: true });
                };
                overlay.addEventListener('transitionend', onFirstEnd);
            }
        },
        [enlargeTransitionMs, lockScroll, openedImageHeight, openedImageWidth, unlockScroll]
    );

    const onTileClick = useCallback(
        (e) => {
            if (draggingRef.current) return;
            if (movedRef.current) return;
            if (performance.now() - lastDragEndAt.current < 80) return;
            if (openingRef.current) return;
            openItemFromElement(e.currentTarget);
        },
        [openItemFromElement]
    );

    const onTilePointerUp = useCallback(
        (e) => {
            if (e.pointerType !== 'touch') return;
            if (draggingRef.current) return;
            if (movedRef.current) return;
            if (performance.now() - lastDragEndAt.current < 80) return;
            if (openingRef.current) return;
            openItemFromElement(e.currentTarget);
        },
        [openItemFromElement]
    );

    useEffect(() => {
        return () => {
            document.body.classList.remove('dg-scroll-lock');
        };
    }, []);

    return (
        <div
            ref={rootRef}
            className="sphere-root"
            style={{
                ['--overlay-blur-color']: overlayBlurColor,
                ['--tile-radius']: imageBorderRadius,
                ['--enlarge-radius']: openedImageBorderRadius,
                ['--image-filter']: grayscale ? 'grayscale(1)' : 'none',
            }}
        >
            <main ref={mainRef} className="sphere-main">
                <div className="stage">
                    <div ref={sphereRef} className="sphere">
                        {rings.map((ring, ri) => (
                            <div
                                key={`ring-${ri}`}
                                className="ring"
                                data-ring={ri}
                                data-dir={motion.dirs[ri]}
                                data-speed={motion.mags[ri]}
                                ref={(el) => setRingEl(ri, el)}
                                style={{
                                    ['--ring-y']: `${ring.y}px`,
                                    ['--ring-spin']: `${motion.startAngles[ri]}deg`,
                                }}
                            >
                                {ring.items.map((it, i) => (
                                    <div
                                        key={`${ri}-${i}`}
                                        className={`item${it.placeholder ? ' item--placeholder' : ''}`}
                                        data-ring={ri}
                                        data-src={it.src}
                                        data-angle={it.angle}
                                        data-placeholder={it.placeholder || ''}
                                        data-title={it.title || ''}
                                        data-tag={it.tag || ''}
                                        data-caption={it.caption || ''}
                                        style={{
                                            ['--angle']: it.angle,
                                            ['--item-w']: `${it.w}px`,
                                            ['--item-h']: `${it.h}px`,
                                        }}
                                    >
                                        {it.placeholder ? (
                                            <div
                                                className="item__image item__image--placeholder"
                                                style={{ background: it.placeholder }}
                                                aria-hidden="true"
                                            />
                                        ) : (
                                            <div
                                                className="item__image"
                                                role="button"
                                                tabIndex={0}
                                                aria-label={it.alt || 'Open image'}
                                                onClick={onTileClick}
                                                onPointerUp={onTilePointerUp}
                                            >
                                                <img
                                                    src={it.src}
                                                    draggable={false}
                                                    alt={it.alt}
                                                    loading="lazy"
                                                    decoding="async"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="overlay" />
                <div className="overlay overlay--blur" />
                <div className="edge-fade edge-fade--top" />
                <div className="edge-fade edge-fade--bottom" />

                <div className="viewer" ref={viewerRef}>
                    <div ref={scrimRef} className="scrim" />
                    <div ref={frameRef} className="frame" />
                </div>
            </main>
        </div>
    );
}
