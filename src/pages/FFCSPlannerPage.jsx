import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import FogBackground from '../components/ui/FogBackground';

const FFCSPlannerPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-black pt-24 pb-0 px-0 relative overflow-hidden flex flex-col"
        >
            {/* Background Layer - Sit strictly behind content */}
            <FogBackground />

            <div className="relative z-10 flex flex-col flex-1 px-4 sm:px-6 lg:px-8">
                {/* Header matching CompilerPage exactly */}
                <div className="max-w-7xl mx-auto w-full mb-4 pt-4">
                    <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                        <Link
                            to="/tools"
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium group"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            <span>All Tools</span>
                        </Link>
                        <span className="text-gray-600">/</span>
                        <div className="flex items-center gap-2 text-white">
                            <Calendar size={18} />
                            <span className="font-semibold">FFCS Planner</span>
                        </div>
                    </div>

                    <p className="text-gray-500 text-sm mt-2">
                        Plan, simulate, and optimize your course timetable without slot clashes.
                    </p>
                </div>

                {/* Planner Area - Same container layout, background, border, and shadows as CompilerPage */}
                <div className="flex-1 rounded-2xl overflow-hidden border border-white/10 bg-[#0a0c10] shadow-2xl p-6 sm:p-8 mb-8 text-white flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-4">
                        <Calendar size={32} />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Timetable Workspace</h2>
                    <p className="text-gray-400 text-sm max-w-md">
                        Interactive slot selector, course clash detector, and export tools will be built here.
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default FFCSPlannerPage;

