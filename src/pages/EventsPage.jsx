import React from 'react';
import { motion } from 'framer-motion';

const EventsPage = () => {
    const events = [
        {
            month: "OCT",
            day: "15",
            year: "2024",
            title: "Introduction to Rust",
            time: "10:00 AM - 02:00 PM",
            location: "Lab 404, Tech Tower",
            status: "Completed",
            regStatus: null
        },
        {
            month: "NOV",
            day: "02",
            year: "2025",
            title: "ZBC Annual Hackathon",
            time: "48 Hours",
            location: "Main Auditorium",
            status: "Upcoming",
            regStatus: "Open"
        },
        {
            month: "DEC",
            day: "10",
            year: "2025",
            title: "Deploying with Docker",
            time: "03:00 PM - 06:00 PM",
            location: "Virtual (Discord)",
            status: "Upcoming",
            regStatus: "Closed"
        },
        {
            month: "JAN",
            day: "20",
            year: "2026",
            title: "Blockchain Basics",
            time: "TBA",
            location: "TBA",
            status: "TBA",
            regStatus: null
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-zinc-950 pt-24 pb-20 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-5xl mx-auto">
                <div className="flex items-end justify-between mb-20 border-b border-white/10 pb-6">
                    <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tighter">Timeline</h1>
                    <span className="text-gray-500 font-mono mb-4 hidden md:block">2025 - 2026 Season</span>
                </div>

                <div className="space-y-6">
                    {events.map((event, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-[#050505] border border-white/5 hover:border-white/20 p-6 md:p-10 rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-8 group transition-all"
                        >
                            {/* Date Block */}
                            <div className="flex flex-col items-center bg-white/5 p-4 rounded-xl min-w-[100px]">
                                <span className="text-sm font-bold text-gray-500 uppercase">{event.month}</span>
                                <span className="text-4xl font-bold text-white">{event.day}</span>
                                <span className="text-xs text-gray-600">{event.year}</span>
                            </div>

                            <div className="flex-1 w-full">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2 gap-4">
                                    <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-gray-200 transition-colors">{event.title}</h3>

                                    <div className="flex flex-wrap gap-2">
                                        {/* Main Status Badge */}
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border self-start ${event.status === 'Upcoming' ? 'border-yellow-500/50 text-yellow-500' :
                                            event.status === 'Completed' ? 'border-green-500/50 text-green-500' :
                                                'border-gray-700 text-gray-500'
                                            }`}>
                                            {event.status}
                                        </span>

                                        {/* Sub Tags for Upcoming */}
                                        {event.status === 'Upcoming' && event.regStatus === 'Open' && (
                                            <a
                                                href="https://eventhubcc.vit.ac.in/EventHub/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-blue-500 text-blue-400 hover:bg-blue-500/10 transition-colors cursor-pointer flex items-center gap-1"
                                            >
                                                Registrations Open <span className="text-[10px]">↗</span>
                                            </a>
                                        )}

                                        {event.status === 'Upcoming' && event.regStatus === 'Closed' && (
                                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-red-500/50 text-red-500">
                                                Registrations Closed
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-gray-400 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                                        {event.time}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                                        {event.location}
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

export default EventsPage;
