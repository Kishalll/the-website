import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Maximize2, Download } from 'lucide-react';

const easeOutShrink = [0.22, 1, 0.36, 1];

const Lightbox = ({ isOpen, onClose, images, currentIndex }) => {
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [direction, setDirection] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [contentSize, setContentSize] = useState({ width: 0, height: 0 });
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const containerRef = useRef(null);
    const imageRef = useRef(null);
    const reducedMotion = useReducedMotion();

    const activeImage = images[currentIndex];

    const handleResize = useCallback(() => {
        if (containerRef.current && imageRef.current) {
            const container = containerRef.current;
            const image = imageRef.current;
            setContentSize({ width: image.offsetWidth, height: image.offsetHeight });
            setContainerSize({ width: container.offsetWidth, height: container.offsetHeight });
        }
    }, []);

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [activeImage, handleResize]);

    const handlePrev = useCallback(() => {
        setDirection(-1);
        setZoom(1);
        setPan({ x: 0, y: 0 });
    }, []);

    const handleNext = useCallback(() => {
        setDirection(1);
        setZoom(1);
        setPan({ x: 0, y: 0 });
    }, []);

    const handleZoomIn = useCallback(() => setZoom((prev) => Math.min(prev + 0.5, 5)), []);
    const handleZoomOut = useCallback(() => setZoom((prev) => Math.max(prev - 0.5, 1)), []);

    const handleDragStart = useCallback((e) => {
        if (e.type === 'touchstart') {
            setStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
        } else {
            setStartPos({ x: e.clientX, y: e.clientY });
        }
        setIsDragging(true);
    }, []);

    const handleDragMove = useCallback((e) => {
        if (!isDragging) return;
        
        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
        
        const deltaX = clientX - startPos.x;
        const deltaY = clientY - startPos.y;
        
        setPan({ x: deltaX, y: deltaY });
    }, [isDragging, startPos]);

    const handleDragEnd = useCallback((e) => {
        if (!isDragging) return;
        setIsDragging(false);
        
        const clientX = e.type === 'touchend' ? e.changedTouches[0].clientX : e.clientX;
        const threshold = window.innerWidth * 0.15;
        
        if (clientX - startPos.x < -threshold) {
            handleNext();
        } else if (clientX - startPos.x > threshold) {
            handlePrev();
        } else {
            setPan({ x: 0, y: 0 });
        }
    }, [isDragging, handleNext, handlePrev, startPos]);

    const handleWheel = useCallback((e) => {
        e.preventDefault();
        if (e.deltaY > 0) {
            handleZoomOut();
        } else {
            handleZoomIn();
        }
    }, [handleZoomIn, handleZoomOut]);

    const handleClose = useCallback(() => {
        onClose();
        setTimeout(() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
        }, 300);
    }, [onClose]);

    const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
    if (prevIsOpen !== isOpen) {
        setPrevIsOpen(isOpen);
        if (!isOpen) {
            setZoom(1);
            setPan({ x: 0, y: 0 });
        }
    }

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const slideVariants = reducedMotion
        ? {
              enter: { opacity: 0 },
              center: { opacity: 1 },
              exit: { opacity: 0 },
          }
        : {
              enter: (dir) => ({
                  x: dir > 0 ? '-50%' : '50%',
                  opacity: 0,
              }),
              center: { x: '0%', opacity: 1 },
              exit: (dir) => ({
                  x: dir > 0 ? '50%' : '-50%',
                  opacity: 0,
              }),
          };

    if (!isOpen || !activeImage) return null;

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
                    />
                    
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full h-full max-w-7xl max-h-[95vh] bg-black"
                        >
                            <div
                                ref={containerRef}
                                className="relative w-full h-full overflow-hidden"
                                onMouseDown={handleDragStart}
                                onMouseMove={handleDragMove}
                                onMouseUp={handleDragEnd}
                                onMouseLeave={handleDragEnd}
                                onWheel={handleWheel}
                                onTouchStart={handleDragStart}
                                onTouchMove={handleDragMove}
                                onTouchEnd={handleDragEnd}
                                role="dialog"
                                aria-modal="true"
                                aria-label="Full-screen image viewer"
                            >
                                <motion.div
                                    className="absolute inset-0 flex items-center justify-center"
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    custom={direction}
                                    transition={{ duration: 0.5, ease: easeOutShrink }}
                                >
                                    <motion.div
                                        ref={imageRef}
                                        style={{
                                            width: `${contentSize.width * zoom}px`,
                                            height: `${contentSize.height * zoom}px`,
                                            x: pan.x,
                                            y: pan.y,
                                        }}
                                        className="flex-shrink-0 cursor-grab active:cursor-grabbing"
                                        drag={zoom > 1 && !reducedMotion}
                                        dragMomentum={false}
                                        dragConstraints={zoom > 1 ? { left: -((contentSize.width * zoom - containerSize.width) / 2), right: ((contentSize.width * zoom - containerSize.width) / 2), top: -((contentSize.height * zoom - containerSize.height) / 2), bottom: ((contentSize.height * zoom - containerSize.height) / 2) } : undefined}
                                        dragElastic={0.2}
                                        onDragStart={(e) => e.stopPropagation()}
                                        onDragEnd={(e, info) => {
                                            const threshold = 50;
                                            if (info.offset.x < -threshold && zoom <= 1) handlePrev();
                                            else if (info.offset.x > threshold && zoom <= 1) handleNext();
                                        }}
                                    >
                                        <img
                                            src={activeImage.src}
                                            alt={activeImage.title}
                                            className="h-full w-full object-contain select-none pointer-events-none"
                                            draggable={false}
                                        />
                                    </motion.div>
                                </motion.div>

                                {zoom > 1 && !reducedMotion && (
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
                                            className="rounded-full border border-white/20 bg-black/40 p-2 text-white hover:bg-white hover:text-black transition-colors"
                                            aria-label="Zoom out"
                                        >
                                            <ZoomOut size={18} />
                                        </button>
                                        <span className="text-xs font-mono text-white/70 bg-black/40 px-2 py-1 rounded">
                                            {Math.round(zoom * 100)}%
                                        </span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
                                            className="rounded-full border border-white/20 bg-black/40 p-2 text-white hover:bg-white hover:text-black transition-colors"
                                            aria-label="Zoom in"
                                        >
                                            <ZoomIn size={18} />
                                        </button>
                                    </div>
                                )}

                                <div className="pointer-events-none absolute top-4 left-0 right-0 flex justify-between z-20 px-4 sm:px-6 md:px-8">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                                        className="rounded-full border border-white/20 bg-black/40 p-2 text-white opacity-0 hover:opacity-100 transition-opacity disabled:opacity-0"
                                        disabled={currentIndex === 0}
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleClose(); }}
                                        className="rounded-full border border-white/20 bg-black/40 p-2 text-white hover:bg-white hover:text-black transition-colors"
                                        aria-label="Close"
                                    >
                                        <X size={24} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleNext(); }}
                                        className="rounded-full border border-white/20 bg-black/40 p-2 text-white opacity-0 hover:opacity-100 transition-opacity disabled:opacity-0"
                                        disabled={currentIndex === images.length - 1}
                                        aria-label="Next image"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </div>

                                <div className="pointer-events-none absolute bottom-6 left-6 right-6 sm:left-12 sm:right-12 sm:bottom-8 z-20">
                                    <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 border border-white/10 max-w-md">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-mono uppercase tracking-widest text-white/70">
                                                {activeImage.tag}
                                            </span>
                                            <span className="w-px h-4 bg-white/20" />
                                            <span className="text-xs font-mono text-white/70">
                                                {String(currentIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
                                            </span>
                                        </div>
                                        {activeImage.caption && (
                                            <p className="text-sm text-gray-300 line-clamp-2">{activeImage.caption}</p>
                                        )}
                                        {zoom > 1 && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); }}
                                                className="mt-3 flex items-center gap-2 text-xs font-mono text-white/70 hover:text-white transition-colors"
                                            >
                                                <Maximize2 size={14} />
                                                <span>Double tap to zoom</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Lightbox;
