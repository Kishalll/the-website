import React from 'react';
import { motion } from 'framer-motion';

const GalleryPage = () => {
    // Generate placeholder items
    const items = Array.from({ length: 9 }).map((_, i) => ({
        id: i,
        size: i % 3 === 0 ? "large" : "small", // Simple logic for grid variation
        color: `bg-neutral-${(i % 5 + 4) * 100}` // Varying shades
    }));

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-black pt-24 pb-20 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-7xl mx-auto">
                <h1 className="text-5xl md:text-6xl font-bold mb-12 text-center text-white">Captured Moments</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[300px]">
                    {items.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: i * 0.05 }}
                            className={`relative group overflow-hidden rounded-xl cursor-pointer ${item.size === 'large' ? 'lg:col-span-2 lg:row-span-2' : ''
                                }`}
                        >
                            {/* Placeholder Gradient */}
                            <div className={`w-full h-full bg-gradient-to-br ${i % 2 === 0 ? 'from-[#1a1a1a] to-[#050505]' : 'from-[#222] to-[#111]'
                                } hover:scale-105 transition-transform duration-700 ease-out`}
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center">
                                <h3 className="text-xl font-bold text-white mb-2">Event Snapshot {i + 1}</h3>
                                <p className="text-sm text-gray-400">#ZBC #Engineering</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default GalleryPage;
