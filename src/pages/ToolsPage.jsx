import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Wrench, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import LightRays from '../components/ui/LightRays';

const tools = [
    {
        id: 'compiler',
        label: 'Online Compiler',
        icon: Terminal,
        description: 'Write and run Python, JavaScript, HTML/CSS, and C/C++ code directly in your browser. Multi-language support with syntax highlighting.',
        slug: '/tools/compiler',
        tags: ['Python', 'JavaScript', 'C++', 'HTML/CSS']
    }
];

const ToolsPage = () => {
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
                <div className="mb-16">
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-4">
                        Tools
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl">
                        Developer tools and utilities running directly in your browser.
                    </p>
                </div>

                {/* Tools Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {tools.map((tool, index) => (
                        <motion.div
                            key={tool.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link
                                to={tool.slug}
                                className="group block h-full bg-gradient-to-b from-white/10 to-black/20 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:from-white/15 hover:to-black/30 p-8 rounded-2xl transition-all"
                            >
                                <div className="flex flex-col h-full">
                                    <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:bg-white group-hover:text-black transition-all duration-300">
                                        {typeof tool.icon === 'string' ? (
                                            <span>{tool.icon}</span>
                                        ) : (
                                            <tool.icon size={26} />
                                        )}
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:translate-x-1 transition-transform">
                                        {tool.label}
                                    </h3>

                                    <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">
                                        {tool.description}
                                    </p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {tool.tags.map(tag => (
                                            <span
                                                key={tag}
                                                className="px-3 py-1 bg-white/10 rounded-full text-xs font-mono text-gray-300"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* CTA */}
                                    <div className="flex items-center gap-2 text-sm font-medium text-white group-hover:gap-3 transition-all">
                                        <span>Open Tool</span>
                                        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Empty state for future tools */}
                {tools.length === 0 && (
                    <div className="text-center py-20">
                        <Wrench size={48} className="mx-auto text-gray-600 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-400 mb-2">More tools coming soon</h3>
                        <p className="text-gray-600">New developer tools will be added here over time.</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ToolsPage;
