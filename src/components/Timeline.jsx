import React from 'react';
import { motion } from 'framer-motion';

const Timeline = () => {
    const events = [
        {
            date: "Oct 15, 2025",
            title: "Open Source October",
            category: "Workshop",
            description: "Learn how to make your first PR to a major open source repo."
        },
        {
            date: "Nov 02, 2025",
            title: "ZBC Hackathon '25",
            category: "Hackathon",
            description: "48 hours of coding, caffeine, and building the next big thing."
        },
        {
            date: "Dec 10, 2025",
            title: "Rust for Beginners",
            category: "Bootcamp",
            description: "Deep dive into memory safety and systems programming with Rust."
        }
    ];

    return (
        <section id="events" className="py-24 bg-surface text-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Upcoming Events</h2>
                    <div className="h-1 w-20 bg-white mx-auto"></div>
                </motion.div>

                <div className="relative border-l border-white/20 ml-4 md:ml-0 md:pl-0 space-y-12">
                    {events.map((event, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="relative pl-8 md:pl-0"
                        >
                            {/* Timeline Dot */}
                            <div className="absolute left-[-5px] top-2 w-2.5 h-2.5 bg-white rounded-full ring-4 ring-black"></div>

                            <div className="md:grid md:grid-cols-5 md:gap-10 items-start">
                                <div className="md:col-span-1 text-sm text-gray-400 font-mono pt-1 mb-2 md:mb-0 md:text-right">
                                    {event.date}
                                </div>
                                <div className="md:col-span-4 bg-black/40 p-6 border border-white/5 hover:border-white/20 transition-all cursor-pointer">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-xl font-bold">{event.title}</h3>
                                        <span className="text-xs font-bold px-2 py-1 bg-white text-black uppercase tracking-wider">{event.category}</span>
                                    </div>
                                    <p className="text-gray-400">{event.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Timeline;
