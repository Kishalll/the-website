import React from 'react';
import { motion } from 'framer-motion';

const Gallery = () => {
    // Using gradients as placeholders to keep the aesthetic clean and dark
    const images = [
        "bg-gradient-to-br from-gray-800 to-black",
        "bg-gradient-to-bl from-gray-900 to-black",
        "bg-gradient-to-tr from-gray-800 to-gray-900",
        "bg-gradient-to-tl from-black to-gray-800",
        "bg-gradient-to-r from-gray-900 to-black",
        "bg-gradient-to-b from-gray-800 to-gray-900",
    ];

    return (
        <section id="gallery" className="py-24 bg-black text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-5xl font-bold mb-12 text-right tracking-tight">Gallery</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {images.map((bgClass, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`aspect-square overflow-hidden relative group cursor-pointer ${index === 0 || index === 3 ? 'md:col-span-2' : ''}`}
                        >
                            <div className={`w-full h-full ${bgClass} opacity-80 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center`}>
                                <span className="text-gray-600 font-mono text-xs group-hover:text-white transition-colors">IMG_{index + 1}.RAW</span>
                            </div>
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                                <p className="border border-white px-4 py-2 uppercase text-sm tracking-widest">View</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Gallery;
