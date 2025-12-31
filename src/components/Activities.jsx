import React from 'react';
import { motion } from 'framer-motion';

const Activities = () => {
    const activities = [
        {
            id: "01",
            title: "Workshops",
            desc: "Hands-on sessions on the latest tech stacks, from React to Rust."
        },
        {
            id: "02",
            title: "Hackathons",
            desc: "24-48 hour coding marathons to build solution for real-world problems."
        },
        {
            id: "03",
            title: "Open Source",
            desc: "Contributing to major projects and maintaining our own OSS ecosystem."
        }
    ];

    return (
        <section id="activities" className="py-24 bg-black text-white relative">
            {/* Big textured text background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-[0.03]">
                <h1 className="text-[20vw] font-bold text-center leading-none text-white whitespace-nowrap">BUILD</h1>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 border-l-4 border-white pl-6"
                >
                    <span className="text-gray-500 uppercase tracking-widest text-sm font-semibold">What Do We Do</span>
                    <h2 className="text-4xl md:text-6xl font-bold mt-2">Engineering <br /> The Future.</h2>
                </motion.div>

                <div className="space-y-4">
                    {activities.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group flex flex-col md:flex-row items-baseline md:items-center border-b border-white/10 py-8 hover:bg-white/5 transition-colors px-4 cursor-default"
                        >
                            <span className="text-2xl md:text-4xl font-mono text-gray-700 mr-8 group-hover:text-white transition-colors">/{item.id}</span>
                            <h3 className="text-3xl md:text-5xl font-bold flex-1 group-hover:translate-x-2 transition-transform duration-300">{item.title}</h3>
                            <p className="text-gray-400 mt-2 md:mt-0 md:max-w-md text-right">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Activities;
