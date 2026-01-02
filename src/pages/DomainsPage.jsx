import React from 'react';
import { motion } from 'framer-motion';
import LightRays from '../components/ui/LightRays';

const DomainsPage = () => {
    const activities = [
        {
            title: "Technical Workshops",
            desc: "Expert-led sessions covering full-stack development, cloud computing, AI/ML, Cybersecurity, and DevOps. ",
            tags: ["React", "Python", "Node.js", "Docker"]
        },
        {
            title: "Hackathons",
            desc: "Intense coding competitions designed to test problem-solving skills under pressure. Great for rapid prototyping and teamwork.",
            tags: ["MVP", "Innovation", "Snacks", "All-nighters"]
        },
        {
            title: "Open Source Sprints",
            desc: "Dedicated sessions for contributing to popular open-source projects or maintaining ZBC's own tools and libraries.",
            tags: ["Git", "OSS", "Collaboration"]
        },
        {
            title: "Guest Tech Talks",
            desc: "Industry leaders and alumni sharing insights about the current tech landscape, career growth, and future trends.",
            tags: ["Networking", "Insights", "Future"]
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
            <div className="max-w-6xl mx-auto relative z-10">
                <h1 className="text-5xl md:text-7xl font-bold mb-16 text-white tracking-tighter">
                    Our <span className="text-gray-500">Craft</span>
                </h1>

                <div className="grid gap-12">
                    {activities.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group border border-white/10 bg-gradient-to-b from-white/10 to-black/20 backdrop-blur-sm hover:from-white/15 hover:to-black/30 hover:border-white/20 p-8 rounded-2xl transition-all"
                        >
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                <div className="md:w-1/4">
                                    <h3 className="text-3xl font-bold text-white group-hover:pl-4 transition-all duration-300">{item.title}</h3>
                                </div>
                                <div className="md:w-1/2">
                                    <p className="text-gray-400 text-lg leading-relaxed mb-6">{item.desc}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {item.tags.map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-white/10 rounded-full text-xs font-mono text-gray-300">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default DomainsPage;
