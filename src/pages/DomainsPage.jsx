import React from 'react';
import { motion } from 'framer-motion';
import FogBackground from '../components/ui/FogBackground'; // Adjust path based on your folder structure

const DomainsPage = () => {
    const activities = [
        {
            title: "Technical Workshops",
            desc: "Expert-led sessions covering full-stack development, cloud computing, AI/ML, Cybersecurity, and DevOps.",
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
            <FogBackground />

            <div className="max-w-6xl mx-auto relative z-10">
                <h1 className="text-5xl md:text-7xl font-bold mb-16 text-white tracking-tighter">
                    Our <span className="text-gray-500">Craft</span>
                </h1>

                <div className="grid gap-8 p-2">
                    {activities.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileHover={{
                                y: -8,
                                scale: 1.02,
                                boxShadow: "0px 12px 35px 2px rgba(255, 255, 255, 0.2)",
                                zIndex: 10
                            }}
                            transition={{
                                delay: index * 0.1,
                                y: { type: "spring", stiffness: 300, damping: 25 },
                                scale: { type: "spring", stiffness: 300, damping: 25 },
                                boxShadow: { duration: 0.25 }
                            }}
                            className="group border border-white/10 bg-[#111111] hover:border-white/20 p-8 rounded-2xl cursor-pointer relative shadow-xl"
                        >
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                <div className="md:w-1/4">
                                    <h3 className="text-3xl font-bold text-white group-hover:translate-x-1 transition-transform duration-300">
                                        {item.title}
                                    </h3>
                                </div>
                                <div className="md:w-1/2">
                                    <p className="text-gray-400 text-lg leading-relaxed mb-6 group-hover:text-gray-200 transition-colors duration-300">
                                        {item.desc}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {item.tags.map(tag => (
                                            <span 
                                                key={tag} 
                                                className="px-3 py-1 bg-neutral-800 group-hover:bg-neutral-700 group-hover:text-white rounded-full text-xs font-mono text-gray-300 transition-all duration-300"
                                            >
                                                {tag}
                                            </span>
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