import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import FogBackground from '../components/ui/FogBackground'; // Import from your saved component path
import CompilerApp from '../compiler/App';
import '../compiler/compiler.css';

const CompilerPage = () => {
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
                            <Code2 size={18} />
                            <span className="font-semibold">Online Compiler</span>
                        </div>
                    </div>

                    <p className="text-gray-500 text-sm mt-2">
                        Write and run Python, JavaScript, HTML/CSS, and C/C++ code in your browser.
                    </p>
                </div>

                {/* Compiler Area - Solid opaque background bg-[#0a0c10] prevents fog penetration */}
                <div className="flex-1 rounded-2xl overflow-hidden border border-white/10 bg-[#0a0c10] shadow-2xl">
                    <CompilerApp />
                </div>
            </div>
        </motion.div>
    );
};

export default CompilerPage;