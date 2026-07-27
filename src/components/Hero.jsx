import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FloatingLines from '../components/ui/FloatingLines';
import { recruitmentConfig } from '../config/recruitment.config';

const Hero = () => {
    const navigate = useNavigate();

    const handleJoinClick = () => {
        if (recruitmentConfig.isRecruiting) {
            navigate('/recruitment');
        } else {
            alert("We aren't recruiting right now. Stay tuned for updates!");
            navigate('/about');
        }
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
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pointer-events-auto">
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
                    className="mt-6 max-w-3xl mx-auto text-xl md:text-3xl font-mono tracking-widest text-gray-300 uppercase leading-relaxed mb-12"
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
                        className="group relative px-10 py-4 font-bold uppercase tracking-widest outline-none border border-white/20 backdrop-blur-sm cursor-pointer"
                    >
                        <span className="relative z-10 flex items-center gap-2 group-hover:gap-4 transition-all duration-300">
                            Join Us <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                        </span>
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;