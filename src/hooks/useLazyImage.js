import { useEffect, useRef, useState } from 'react';

// Module-level cache of already-decoded image URLs. Because images are served
// from stable paths with long-lived cache headers the browser HTTP cache
// handles cross-navigation reuse; this Set avoids even the decode cost within
// a session and dedupes concurrent loads.
const decodedCache = new Set();
const inflight = new Map();

export const isImageReady = (src) => decodedCache.has(src);

export const preloadImage = (src) => {
    if (!src || decodedCache.has(src)) return Promise.resolve(src);
    if (inflight.has(src)) return inflight.get(src);

    const promise = new Promise((resolve, reject) => {
        const img = new Image();
        img.decoding = 'async';
        img.fetchPriority = 'low';

        const finalize = () => {
            decodedCache.add(src);
            inflight.delete(src);
            resolve(src);
        };
        const fail = () => {
            inflight.delete(src);
            reject(new Error(`Failed to load image: ${src}`));
        };

        img.onload = () => {
            if (typeof img.decode === 'function') {
                img.decode().then(finalize).catch(finalize);
            } else {
                finalize();
            }
        };
        img.onerror = fail;
        img.src = src;
    });

    inflight.set(src, promise);
    return promise;
};

/**
 * Lazily loads an image once its container enters the viewport.
 * Returns a ref for the container and a status string
 * ('idle' | 'loaded' | 'error').
 */
export const useLazyImage = (src, { rootMargin = '200px', immediate = false } = {}) => {
    const [result, setResult] = useState(() => ({
        src,
        status: isImageReady(src) ? 'loaded' : 'idle',
    }));
    const containerRef = useRef(null);

    const status = isImageReady(src)
        ? 'loaded'
        : result.src === src
            ? result.status
            : 'idle';

    useEffect(() => {
        if (!src || isImageReady(src)) return undefined;

        let cancelled = false;
        const load = () => {
            preloadImage(src)
                .then(() => {
                    if (!cancelled) setResult({ src, status: 'loaded' });
                })
                .catch(() => {
                    if (!cancelled) setResult({ src, status: 'error' });
                });
        };

        if (immediate || typeof IntersectionObserver === 'undefined') {
            load();
            return () => {
                cancelled = true;
            };
        }

        const node = containerRef.current;
        if (!node) {
            load();
            return () => {
                cancelled = true;
            };
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    observer.disconnect();
                    load();
                }
            },
            { rootMargin }
        );

        observer.observe(node);

        return () => {
            cancelled = true;
            observer.disconnect();
        };
    }, [src, immediate, rootMargin]);

    return { containerRef, status };
};

export default useLazyImage;