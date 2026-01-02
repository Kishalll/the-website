import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Spotlight from '../components/ui/Spotlight';
import ColorBends from '../components/ui/ColorBends';

const Hero = () => {
    return (
        <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black text-white selection:bg-white selection:text-black">
            {/* Background with ColorBends */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <ColorBends
                    colors={['#726e6e', '#111111', '#000000']}
                    mouseInfluence={0.5}
                    alpha={0.2}
                />
                <div className="absolute inset-0 bg-black/60 pointer-events-none"></div> {/* Overlay to ensure text readability */}
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-none">
                <Spotlight className="p-8 md:p-16 rounded-3xl border border-white/5 bg-black/40 backdrop-blur-sm pointer-events-auto">
                    <div className="text-center">


                        <h1 className="text-6xl md:text-9xl font-bold tracking-tighter mb-8 text-white">
                            <span className="inline-block overflow-hidden">
                                <motion.span
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                    className="block"
                                >
                                    ZERO
                                </motion.span>
                            </span>
                            <span className="inline-block overflow-hidden mx-4 text-white">
                                <motion.span
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                                    className="block glitch-wrapper text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-400" data-text="BUGS"
                                >
                                    BUGS
                                </motion.span>
                            </span>
                            <span className="inline-block overflow-hidden">
                                <motion.span
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                    className="block"
                                >
                                    CLUB
                                </motion.span>
                            </span>
                        </h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-400 font-light leading-relaxed mb-12"
                        >
                            Real projects. Real impact. Zero bugs. We are a community turning ideas into fully deployable software, enforcing quality every step of the way.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="flex justify-center"
                        >
                            <a href="#about" className="group relative px-8 py-4 bg-white text-black font-bold uppercase tracking-widest overflow-hidden">
                                <span className="relative z-10 flex items-center gap-2 group-hover:gap-4 transition-all duration-300">
                                    Join Us <ArrowRight size={20} />
                                </span>
                                <div className="absolute inset-0 bg-gray-200 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                            </a>
                        </motion.div>
                    </div>
                </Spotlight>
            </div>

            {/* Decorative floating bits */}
            <div className="absolute bottom-20 right-20 hidden md:block opacity-30 font-mono text-xs text-right">
                <p>INITIALIZING_SYSTEM...</p>
                <p>LOADING_ASSETS...</p>
                <p className="text-green-500">READY.</p>
            </div>
        </div>
    );
};

export default Hero;
