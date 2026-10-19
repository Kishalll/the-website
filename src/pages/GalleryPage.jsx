import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { GalleryVerticalEnd, Loader2 } from 'lucide-react';
import DomeGallery from '../components/DomeGallery';
import { loadGalleryImages } from '../lib/gallery';

const GalleryPage = () => {
    const [images, setImages] = useState([]);
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        let cancelled = false;

        loadGalleryImages()
            .then((list) => {
                if (cancelled) return;
                setImages(list);
                setStatus(list.length ? 'ready' : 'empty');
            })
            .catch(() => {
                if (!cancelled) setStatus('error');
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const domeImages = useMemo(
        () =>
            images.map((image) => ({
                src: image.src,
                alt: image.title,
                title: image.title,
                tag: image.tag,
                caption: image.caption,
            })),
        [images]
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-screen w-full overflow-hidden bg-black"
        >
            {status === 'ready' && (
                <div className="h-[100svh] w-full">
                    <DomeGallery
                        images={domeImages}
                        minSlots={12}
                        autoRotate
                        padFactor={0.16}
                        overlayBlurColor="#000000"
                        imageBorderRadius="8px"
                        openedImageBorderRadius="12px"
                        grayscale
                    />
                </div>
            )}

            {status === 'loading' && (
                <div className="flex h-[100svh] w-full items-center justify-center text-gray-400">
                    <Loader2 size={28} className="animate-spin" />
                </div>
            )}

            {status === 'empty' && (
                <div className="flex h-[100svh] w-full flex-col items-center justify-center gap-3 text-gray-500">
                    <GalleryVerticalEnd size={40} />
                    <p>No gallery moments yet.</p>
                </div>
            )}

            {status === 'error' && (
                <div className="flex h-[100svh] w-full flex-col items-center justify-center gap-3 text-gray-500">
                    <GalleryVerticalEnd size={40} />
                    <p>Unable to load the gallery right now.</p>
                </div>
            )}
        </motion.div>
    );
};

export default GalleryPage;