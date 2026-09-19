import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import FloatingLines from '../components/ui/FloatingLines';

const Hero = () => {
    const handleJoinClick = () => {
    window.open(
        'https://zbc-recruitments26.vercel.app/',
        '_blank',
        'noopener,noreferrer'
        );
    };

    return (
        <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black text-white selection:bg-white selection:text-black">
            {/* Background Lines */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-auto">
                <FloatingLines
                    linesGradient={['#333333', '#9b8f8f', '#ffffff']}
                    enabledWaves={['top', 'middle', 'bottom']}
                    lineCount={10}
                    lineDistance={5}
                    animationSpeed={1}
                    bendRadius={10}
                    bendStrength={-2.5}
                    interactive={true}
                    parallax={true}
                    parallaxStrength={0.2}
                    mixBlendMode="screen"
                />
            </div>

            {/* Main Content Area */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pointer-events-auto -mt-8 md:mt-0">
                {/* Responsive Headline: 1-word per line on mobile with increased line spacing and width */}
                <h1 className="text-6xl xs:text-7xl sm:text-8xl md:text-9xl font-bold tracking-tight mb-6 md:mb-8 text-white flex flex-col space-y-3 md:space-y-0 md:block items-center justify-center leading-none">
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
                    <span className="inline-block overflow-hidden md:mx-4 text-white">
                        <motion.span
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="block glitch-wrapper text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-400" 
                            data-text="BUGS"
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
                    className="mt-6 md:mt-6 max-w-4xl mx-auto text-[3.8vw] xs:text-sm sm:text-2xl md:text-4xl font-mono font-extrabold tracking-wider sm:tracking-widest uppercase leading-relaxed mb-8 md:mb-12 px-2 whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-white drop-shadow-[0_0_15px_rgba(255,255,255,0.75)]"
                >
                    EXPLORE. ENGINEER. EVOLVE.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex justify-center"
                >
                    <motion.button
                        onClick={handleJoinClick}
                        initial={{ 
                            borderRadius: "0px", 
                            backgroundColor: "#9ca3af",
                            color: "#111827" 
                        }}
                        whileHover={{ 
                            borderRadius: "12px", 
                            backgroundColor: "#ffffff",
                            color: "#000000",
                            scale: 1.03,
                            boxShadow: "0px 0px 25px rgba(255, 255, 255, 0.6)"
                        }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ 
                            type: "spring", 
                            stiffness: 260, 
                            damping: 22 
                        }}
                        className="group relative px-8 py-3.5 md:px-10 md:py-4 text-sm md:text-base font-bold uppercase tracking-widest outline-none border border-white/20 backdrop-blur-sm cursor-pointer"
                    >
                        <span className="relative z-10 flex items-center gap-2 group-hover:gap-4 transition-all duration-300">
                            Join Us <ArrowRight size={18} className="md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </span>
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;