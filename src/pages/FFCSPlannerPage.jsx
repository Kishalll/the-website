import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import FogBackground from '../components/ui/FogBackground';
import FFCSPlanner from '../components/FFCSPlanner';

const FFCSPlannerPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-black pt-24 pb-12 px-0 relative overflow-hidden flex flex-col"
        >
            {/* Background Layer - Sit strictly behind content */}
            <FogBackground />

            <div className="relative z-10 flex flex-col flex-1 px-4 sm:px-6 lg:px-8">
                {/* Header */}
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

                {/* Planner Area - Same rounded-2xl border radius as CompilerPage with translucent 75% black background */}
                <div className="flex-1 rounded-2xl overflow-hidden border border-white/10 bg-black/75 backdrop-blur-md shadow-2xl p-4 sm:p-6 mb-8 text-white flex flex-col">
                    <FFCSPlanner />
                </div>
            </div>
        </motion.div>
    );
};

export default FFCSPlannerPage;

