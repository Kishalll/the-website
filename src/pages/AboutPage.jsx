import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Users, Rocket, Brain, Globe, Cpu } from 'lucide-react';
import LightRays from '../components/ui/LightRays';

const AboutPage = () => {
    const stats = [
        { label: "Members", value: "500+" },
        { label: "Projects", value: "45+" },
        { label: "Events", value: "20+" },
    ];

    const values = [
        {
            icon: <Users className="w-6 h-6" />,
            title: "Community First",
            description: "We foster a collaborative environment where knowledge flows freely."
        },
        {
            icon: <Code2 className="w-6 h-6" />,
            title: "Clean Code",
            description: "We adhere to strict coding standards and architectural patterns."
        },
        {
            icon: <Rocket className="w-6 h-6" />,
            title: "Innovation",
            description: "Pushing boundaries with bleeding-edge technology stacks."
        },
        {
            icon: <Brain className="w-6 h-6" />,
            title: "Mentorship",
            description: "Seniors guiding juniors to create a cycle of excellence."
        },
        {
            icon: <Globe className="w-6 h-6" />,
            title: "Open Source",
            description: "Contributors to significant global repositories."
        },
        {
            icon: <Cpu className="w-6 h-6" />,
            title: "Performance",
            description: "Optimizing for speed, efficiency, and scalability."
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-black pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
        >
            <div className="absolute inset-0 z-0">
                <LightRays
                    raysOrigin="top-center"
                    raysColor="#cfcece"
                    raysSpeed={1.5}
                    lightSpread={0.8}
                    rayLength={1.2}
                    followMouse={true}
                    mouseInfluence={0.1}
                    noiseAmount={0.1}
                    distortion={0.05}
                />
            </div>
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-20">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 glitch-wrapper text-white" data-text="Who We Are"
                    >
                        Who We Are
                    </motion.h1>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-400 max-w-3xl mx-auto"
                    >
                        ZBC is a collective of ambitious engineers dedicated to the craft of software development.
                        We bridge the gap between academic theory and industry-grade engineering.
                    </motion.p>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-gradient-to-b from-white/10 to-black/20 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:from-white/15 hover:to-black/30 p-10 text-center rounded-2xl transition-all"
                        >
                            <h3 className="text-6xl font-bold text-white mb-2">{stat.value}</h3>
                            <p className="text-gray-500 uppercase tracking-widest font-semibold">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Values Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {values.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + (index * 0.1) }}
                            className="bg-gradient-to-b from-white/10 to-black/20 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:border-white/20 hover:from-white/15 hover:to-black/30 transition-all group"
                        >
                            <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-white mb-6 group-hover:bg-white group-hover:text-black transition-colors">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                            <p className="text-gray-400 leading-relaxed">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default AboutPage;
