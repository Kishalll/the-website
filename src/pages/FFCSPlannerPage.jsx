import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageBackground from '../components/ui/PageBackground';
import FFCSPlanner from '../components/FFCSPlanner';

const FFCSPlannerPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-black pt-20 pb-6 px-0 relative overflow-hidden flex flex-col"
        >
            {/* Background Layer - Sit strictly behind content */}
            <PageBackground />

            <div className="relative z-10 flex flex-col flex-1 px-3 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="max-w-7xl mx-auto w-full mb-2 pt-1">
                    <div className="flex items-center gap-3 border-b border-white/10 pb-2">
                        <Link
                            to="/tools"
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs sm:text-sm font-medium group"
                        >
                            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
                            <span>All Tools</span>
                        </Link>
                        <span className="text-gray-600">/</span>
                        <div className="flex items-center gap-2 text-white">
                            <Calendar size={16} />
                            <span className="font-semibold text-xs sm:text-sm">FFCS Planner</span>
                        </div>
                    </div>
                </div>

                {/* Planner Area */}
                <div className="flex-1 rounded-2xl overflow-hidden border border-white/10 bg-black/75 backdrop-blur-md shadow-2xl p-2.5 sm:p-4 mb-4 text-white flex flex-col">
                    <FFCSPlanner />
                </div>
            </div>
        </motion.div>
    );
};

export default FFCSPlannerPage;

