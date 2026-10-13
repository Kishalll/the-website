import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GalleryVerticalEnd, Loader2 } from 'lucide-react';
import GalleryCarousel from '../components/GalleryCarousel';
import { loadGalleryImages } from '../lib/gallery';

const GalleryPage = () => {
    const [images, setImages] = useState([]);
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        const controller = new AbortController();

        loadGalleryImages(controller.signal)
            .then((list) => {
                setImages(list);
                setStatus(list.length ? 'ready' : 'empty');
            })
            .catch((error) => {
                if (error.name === 'AbortError') return;
                setStatus('error');
            });

        return () => controller.abort();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-screen w-full overflow-hidden bg-black"
        >
            {status === 'ready' && <GalleryCarousel images={images} />}

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