import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Terminal } from 'lucide-react';

const Hero = () => {
    return (
        <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

            <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-white mb-6 uppercase">
                        Zero <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 glitch-wrapper" data-text="Bugs">Bugs</span> Club
                    </h1>

                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400 mb-10">
                        A community of elite builders, engineers, and open-source contributors obsessed with shipping quality code.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <a href="#about" className="group px-8 py-4 bg-white text-black font-bold rounded-none hover:bg-gray-200 transition-all flex items-center gap-2">
                            Join the Community
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                        </a>
                    </div>
                </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
        </div>
    );
};

export default Hero;
