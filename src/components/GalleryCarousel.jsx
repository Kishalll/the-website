import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Pause, Play } from 'lucide-react';
import { preloadImage, useLazyImage } from '../hooks/useLazyImage';

const easeOutShrink = [0.22, 1, 0.36, 1];

const buildSlideVariants = (reducedMotion) =>
    reducedMotion
        ? {
              enter: { opacity: 0 },
              center: { opacity: 1 },
              exit: { opacity: 0 },
          }
        : {
              // ease-out, shrink away toward the side opposite the navigation
              enter: (direction) => ({
                  x: direction > 0 ? '30%' : '-30%',
                  scale: 0.72,
                  opacity: 0,
                  filter: 'blur(6px)',
              }),
              center: { x: '0%', scale: 1, opacity: 1, filter: 'blur(0px)' },
              exit: (direction) => ({
                  x: direction > 0 ? '-26%' : '26%',
                  scale: 0.42,
                  opacity: 0,
                  filter: 'blur(10px)',
              }),
          };

const Slide = ({ image, isActive, reducedMotion }) => {
    const { containerRef, status } = useLazyImage(image.src, { immediate: isActive });
    const loaded = status === 'loaded';

    return (
        <div ref={containerRef} className="absolute inset-0 overflow-hidden bg-black">
            <img
                src={image.blur ?? image.src}
                alt=""
                aria-hidden="true"
                className={`absolute inset-0 h-full w-full scale-110 object-cover blur-2xl transition-opacity duration-500 ${loaded ? 'opacity-0' : 'opacity-100'}`}
            />

            <motion.div
                className="absolute inset-0"
                initial={false}
                animate={loaded && !reducedMotion ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                transition={
                    loaded && !reducedMotion
                        ? { duration: 20, repeat: Infinity, ease: 'easeInOut' }
                        : { duration: 0.4 }
                }
            >
                <img
                    src={image.src}
                    alt={image.title}
                    width={image.width}
                    height={image.height}
                    decoding="async"
                    loading={isActive ? 'eager' : 'lazy'}
                    fetchPriority={isActive ? 'high' : 'low'}
                    draggable={false}
                    className={`h-full w-full select-none object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                />
            </motion.div>
        </div>
    );
};

const Caption = ({ image, reducedMotion }) => (
    <motion.div
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 24, filter: 'blur(10px)' }}
        animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -18, filter: 'blur(10px)' }}
        transition={{ duration: 0.8, ease: easeOutShrink }}
        className="pointer-events-none absolute inset-x-0 bottom-0 max-w-xl"
    >
        <span
            className="mb-3 inline-block rounded-full border bg-black/60 px-3 py-1 text-xs font-mono uppercase tracking-widest backdrop-blur-sm"
            style={{ borderColor: `${image.accent}99`, color: image.accent }}
        >
            {image.tag}
        </span>
        <h3 className="mb-2 text-3xl font-bold tracking-tighter text-white sm:text-5xl">
            {image.title}
        </h3>
        <p className="text-sm text-gray-300 sm:text-base">{image.caption}</p>
    </motion.div>
);

const EdgeZone = ({ side, onActivate }) => {
    const isLeft = side === 'left';
    const [hovered, setHovered] = useState(false);
    const straight = 'M 2 0 Q 2 90 2 180';
    const pointy = isLeft ? 'M 26 2 L -24 90 L 26 178' : 'M -26 2 L 24 90 L -26 178';

    return (
        <button
            type="button"
            onClick={onActivate}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setHovered(true)}
            onBlur={() => setHovered(false)}
            aria-label={isLeft ? 'Previous image' : 'Next image'}
            className={`group absolute top-0 bottom-0 z-30 flex w-[34%] items-center sm:w-[22%] ${
                isLeft
                    ? 'left-0 justify-start bg-gradient-to-r from-black/50 via-black/10 to-transparent pl-6 sm:pl-10'
                    : 'right-0 justify-end bg-gradient-to-l from-black/50 via-black/10 to-transparent pr-6 sm:pr-10'
            }`}
        >
            <svg width="46" height="200" viewBox="-34 0 68 180" className="overflow-visible">
                <motion.path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="miter"
                    initial={false}
                    animate={{ d: hovered ? pointy : straight, strokeWidth: hovered ? 3.5 : 2 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className="text-white/40 transition-colors duration-300 group-hover:text-white"
                />
            </svg>
        </button>
    );
};

const Thumbnail = ({ image, isActive, onSelect }) => {
    const { containerRef, status } = useLazyImage(image.src);
    const loaded = status === 'loaded';

    return (
        <button
            ref={containerRef}
            type="button"
            onClick={onSelect}
            aria-label={`Show ${image.title}`}
            aria-current={isActive}
            className={`group/thumb relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg border transition-all duration-500 ease-out ${
                isActive
                    ? 'scale-105 border-white shadow-[0_0_0_1px_rgba(255,255,255,0.35),0_8px_24px_rgba(0,0,0,0.55)] opacity-100'
                    : 'border-white/20 opacity-45 hover:scale-[1.03] hover:border-white/70 hover:opacity-90'
            }`}
        >
            <img
                src={image.blur ?? image.src}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover blur-md"
            />
            {loaded && (
                <img
                    src={image.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                />
            )}
            <span className="pointer-events-none absolute inset-0 rounded-lg ring-white/60 transition-all duration-500 group-hover/thumb:ring-1 group-focus-visible/thumb:ring-1" />
        </button>
    );
};

const GalleryCarousel = ({ images, autoPlayInterval = 2500 }) => {
    const count = images.length;
    const [[index, direction], setState] = useState([0, 0]);
    const [isPlaying, setIsPlaying] = useState(true);
    const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined');
    const containerRef = useRef(null);
    const thumbStripRef = useRef(null);
    const wheelAccum = useRef(0);
    const wheelLock = useRef(false);
    const wheelLockTimer = useRef(null);
    const reducedMotion = useReducedMotion();
    const slideVariants = buildSlideVariants(reducedMotion);

    const paginate = useCallback(
        (step) => {
            setState(([current]) => [(current + step + count) % count, step]);
        },
        [count]
    );

    const goTo = useCallback((target) => {
        setState(([current]) => {
            if (target === current) return [current, 0];
            return [target, target > current ? 1 : -1];
        });
    }, []);

    useEffect(() => {
        const node = containerRef.current;
        if (!node || typeof IntersectionObserver === 'undefined') return undefined;
        const observer = new IntersectionObserver(
            (entries) => setInView(entries.some((entry) => entry.isIntersecting)),
            { threshold: 0.25 }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!inView) return;
        preloadImage(images[(index + 1) % count].src).catch(() => {});
        preloadImage(images[(index + 2) % count].src).catch(() => {});
        preloadImage(images[(index - 1 + count) % count].src).catch(() => {});
    }, [index, inView, images, count]);

    // Warm the remaining images in the background once the carousel is visible so
    // neighboring slides and the thumbnail strip never pop in while browsing.
    useEffect(() => {
        if (!inView) return undefined;
        let cancelled = false;
        const timers = images.map((image, i) =>
            setTimeout(() => {
                if (!cancelled) preloadImage(image.src).catch(() => {});
            }, 150 * (i + 1))
        );
        return () => {
            cancelled = true;
            timers.forEach(clearTimeout);
        };
    }, [inView, images]);

    useEffect(() => {
        if (!inView || !isPlaying || reducedMotion) return undefined;
        const timer = setTimeout(() => paginate(1), autoPlayInterval);
        return () => clearTimeout(timer);
    }, [index, inView, isPlaying, reducedMotion, autoPlayInterval, paginate]);

    const handleDragEnd = (_event, info) => {
        const power = info.offset.x + info.velocity.x * 0.2;
        if (power < -80) paginate(1);
        else if (power > 80) paginate(-1);
    };

    const handleWheel = useCallback(
        (event) => {
            const { deltaX, deltaY } = event;
            // Only hijack predominantly-horizontal gestures (trackpads/shift+wheel);
            // vertical page scrolling is left completely untouched.
            if (Math.abs(deltaX) <= Math.abs(deltaY) || Math.abs(deltaX) < 2) return;

            event.preventDefault();

            if (wheelLock.current) return;
            wheelAccum.current += deltaX;
            if (Math.abs(wheelAccum.current) < 50) return;

            paginate(wheelAccum.current > 0 ? 1 : -1);
            wheelAccum.current = 0;
            wheelLock.current = true;
            if (wheelLockTimer.current) clearTimeout(wheelLockTimer.current);
            wheelLockTimer.current = setTimeout(() => {
                wheelLock.current = false;
            }, 280);
        },
        [paginate]
    );

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            paginate(1);
        } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            paginate(-1);
        } else if (event.key === ' ' || event.key === 'Spacebar') {
            event.preventDefault();
            setIsPlaying((prev) => !prev);
        }
    };

    const handleThumbWheel = useCallback((event) => {
        const strip = thumbStripRef.current;
        if (!strip) return;
        // Map any wheel gesture (mouse wheel or trackpad) to horizontal strip scroll.
        const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
        if (delta === 0) return;
        const atStart = strip.scrollLeft <= 0;
        const atEnd = strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 1;
        if ((delta < 0 && atStart) || (delta > 0 && atEnd)) return;
        event.preventDefault();
        strip.scrollLeft += delta;
    }, []);

    if (count === 0) return null;

    const active = images[index];

    return (
        <div
            ref={containerRef}
            role="region"
            aria-roledescription="carousel"
            aria-label="Club gallery"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onWheel={handleWheel}
            className="relative h-[100svh] w-full select-none overflow-hidden bg-black outline-none"
        >
            <motion.div
                className="absolute inset-0"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.14}
                onDragEnd={handleDragEnd}
            >
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={index}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.9, ease: easeOutShrink }}
                        className="absolute inset-0"
                    >
                        <Slide image={active} isActive={inView} reducedMotion={reducedMotion} />
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            {/* Corner/edge fade so the photo dissolves instead of ending in a hard border */}
            <div
                className="pointer-events-none absolute inset-0 z-10"
                style={{
                    background:
                        'radial-gradient(135% 125% at 50% 50%, transparent 34%, rgba(0,0,0,0.35) 66%, rgba(0,0,0,0.9) 100%)',
                }}
            />
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-44 bg-gradient-to-b from-black via-black/60 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-56 bg-gradient-to-t from-black via-black/60 to-transparent" />

            <div className="pointer-events-none absolute left-0 right-0 top-24 z-20 text-center">
                <span className="font-mono text-xs uppercase tracking-[0.5em] text-white/50">
                    Our Moments
                </span>
            </div>

            <div className="absolute left-6 right-6 bottom-28 z-20 sm:left-12 sm:right-12 sm:bottom-32">
                <AnimatePresence>
                    <Caption key={active.id} image={active} reducedMotion={reducedMotion} />
                </AnimatePresence>
            </div>

            <div className="pointer-events-none absolute right-6 top-24 z-20 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs font-mono text-gray-200 backdrop-blur">
                {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
            </div>

            <div className="absolute inset-0 z-20">
                <EdgeZone side="left" onActivate={() => paginate(-1)} />
                <EdgeZone side="right" onActivate={() => paginate(1)} />
            </div>

            <button
                type="button"
                onClick={() => setIsPlaying((prev) => !prev)}
                aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                className="absolute bottom-6 right-6 z-30 rounded-full border border-white/15 bg-black/40 p-2 text-white backdrop-blur transition-colors duration-300 hover:bg-white hover:text-black"
            >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>

            <div
                ref={thumbStripRef}
                onWheel={handleThumbWheel}
                className="absolute bottom-6 left-1/2 z-30 flex max-w-[60%] -translate-x-1/2 gap-3 overflow-x-auto overscroll-contain pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:max-w-[55%]"
            >
                {images.map((image, i) => (
                    <Thumbnail
                        key={image.id}
                        image={image}
                        isActive={i === index}
                        onSelect={() => goTo(i)}
                    />
                ))}
            </div>

            {isPlaying && inView && !reducedMotion && (
                <motion.div
                    key={index}
                    className="absolute bottom-0 left-0 z-30 h-0.5 bg-white"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: autoPlayInterval / 1000, ease: 'linear' }}
                />
            )}
        </div>
    );
};

export default GalleryCarousel;