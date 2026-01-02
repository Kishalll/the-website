import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import LightRays from '../components/ui/LightRays';


const EventsPage = () => {
    const [selectedSession, setSelectedSession] = React.useState('2025 - 2026 Season');
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

    const sessions = [
        '2025 - 2026 Season',
        '2024 - 2025 Season',
        '2023 - 2024 Season'
    ];

    const allEvents = {
        '2025 - 2026 Season': [
            {
                month: "OCT",
                day: "15",
                year: "2024",
                title: "Introduction to Rust",
                time: "10:00 AM - 02:00 PM",
                location: "AB3 401",
                status: "Completed",
                regStatus: null
            },
            {
                month: "NOV",
                day: "02",
                year: "2025",
                title: "ZBC Annual Hackathon",
                time: "48 Hours",
                location: "MG Auditorium",
                status: "Upcoming",
                regStatus: "Open"
            },
            {
                month: "DEC",
                day: "10",
                year: "2025",
                title: "Deploying with Docker",
                time: "03:00 PM - 06:00 PM",
                location: "Virtual (GMeet)",
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
        ],
        '2024 - 2025 Season': [
            {
                month: "SEP",
                day: "10",
                year: "2024",
                title: "Web Dev Bootcamp",
                time: "09:00 AM - 04:00 PM",
                location: "AB3 501",
                status: "Completed",
                regStatus: null
            },
            {
                month: "FEB",
                day: "14",
                year: "2025",
                title: "Cybersecurity Workshop",
                time: "10:00 AM - 01:00 PM",
                location: "MG Auditorium",
                status: "Completed",
                regStatus: null
            }
        ],
        '2023 - 2024 Season': [
            {
                month: "AUG",
                day: "20",
                year: "2023",
                title: "Intro to Python",
                time: "02:00 PM - 05:00 PM",
                location: "Online",
                status: "Completed",
                regStatus: null
            },
            {
                month: "MAR",
                day: "15",
                year: "2024",
                title: "AI & ML Summit",
                time: "09:00 AM - 05:00 PM",
                location: "MG Auditorium",
                status: "Completed",
                regStatus: null
            }
        ]
    };

    const currentEvents = allEvents[selectedSession] || [];

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
            <div className="max-w-5xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-20 border-b border-white/10 pb-6 gap-4 md:gap-0">
                    <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tighter">Timeline</h1>

                    {/* Glassy Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-6 py-3 rounded-xl flex items-center gap-3 backdrop-blur-md transition-all min-w-[200px] justify-between group"
                        >
                            <span className="font-mono text-sm tracking-wide text-gray-300">{selectedSession}</span>
                            <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-full bg-black/90 border border-white/10 rounded-xl overflow-hidden backdrop-blur-xl z-50 shadow-2xl">
                                {sessions.map((session) => (
                                    <button
                                        key={session}
                                        onClick={() => {
                                            setSelectedSession(session);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-6 py-3 text-sm font-mono tracking-wide transition-colors ${selectedSession === session ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                                    >
                                        {session}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    {currentEvents.map((event, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-gradient-to-b from-white/10 to-black/20 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:from-white/15 hover:to-black/30 p-6 md:p-10 rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-8 group transition-all"
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
                                                Registrations Open
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
