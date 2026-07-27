import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Shield, Code2, Sparkles, Cpu, Layers } from 'lucide-react';
import LightRays from '../components/ui/LightRays';

const FULL_TEXT = "About Us";

const values = [
    {
        icon: Code2,
        title: "Building Real Software",
        description: "We don't just learn concepts — we build production-grade web apps, tools, and developer platforms used by real people."
    },
    {
        icon: Shield,
        title: "Cybersecurity & CTFs",
        description: "Hands-on experience with reverse engineering, web exploitation, binary analysis, and real-world security challenges."
    },
    {
        icon: Terminal,
        title: "Developer Utilities",
        description: "Creating open-source, browser-native tools to streamline workflows and help fellow developers innovate faster."
    },
    {
        icon: Cpu,
        title: "Emerging Tech",
        description: "Exploring artificial intelligence, system architecture, and modern full-stack frameworks to stay ahead of the tech curve."
    },
    {
        icon: Layers,
        title: "Peer Collaboration",
        description: "A tight-knit community of passionate developers, builders, and security enthusiasts working together on ambitious ideas."
    },
    {
        icon: Sparkles,
        title: "Continuous Evolution",
        description: "Driven by curiosity and continuous learning — always refining skills, shipping code, and scaling our impact."
    }
];

const AboutPage = () => {
    const [displayedText, setDisplayedText] = useState("");
    const [isTypingComplete, setIsTypingComplete] = useState(false);

    useEffect(() => {
        let index = 0;
        const timer = setInterval(() => {
            if (index < FULL_TEXT.length) {
                setDisplayedText(FULL_TEXT.slice(0, index + 1));
                index++;
            } else {
                setIsTypingComplete(true);
                clearInterval(timer);
            }
        }, 150);

        return () => clearInterval(timer);
    }, []);

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

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header Section */}
                <div className="mb-16 text-center md:text-left">
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-4 flex items-center justify-center md:justify-start min-h-[1.2em]">
                        <span>{displayedText}</span>
                        <motion.span
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                            className="inline-block w-[3px] md:w-[5px] h-[0.8em] bg-white ml-2 rounded-sm"
                        />
                    </h1>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: isTypingComplete ? 1 : 0, y: isTypingComplete ? 0 : 10 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="text-gray-400 text-lg max-w-2xl"
                    >
                        Explore. Engineer. Evolve. Zero Bugs Club is a collective of student developers, security researchers, and tech enthusiasts.
                    </motion.p>
                </div>

                {/* Core Pillars / Values Grid with ample padding for floating elements */}
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 p-8">
                    {values.map((item, index) => {
                        const IconComponent = item.icon;
                        return (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: isTypingComplete ? 1 : 0, y: isTypingComplete ? 0 : 20 }}
                                whileHover={{ 
                                    y: -28, 
                                    scale: 1.18,
                                    boxShadow: "0px 20px 80px 15px rgba(255, 255, 255, 0.65)",
                                    zIndex: 50
                                }}
                                transition={{
                                    layout: { duration: 0.2 },
                                    opacity: { duration: 0.4, delay: index * 0.08 },
                                    y: { type: "spring", stiffness: 400, damping: 20 },
                                    scale: { type: "spring", stiffness: 400, damping: 20 },
                                    boxShadow: { duration: 0.25 }
                                }}
                                className="h-full group relative block bg-gradient-to-b from-neutral-900 to-black border border-white/20 hover:border-white p-8 rounded-2xl cursor-pointer transition-colors duration-300"
                            >
                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-white group-hover:text-black group-hover:scale-125 transition-all duration-300">
                                        <IconComponent size={28} />
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:translate-x-1 transition-transform duration-300">
                                        {item.title}
                                    </h3>

                                    <p className="text-gray-400 text-sm leading-relaxed flex-1 group-hover:text-gray-100 transition-colors duration-300">
                                        {item.description}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
};

export default AboutPage;