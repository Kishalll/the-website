import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Linkedin, Github, Instagram, Mail } from 'lucide-react';
import LightRays from '../components/ui/LightRays';
import { getDepartmentBySlug } from '../data/teamData';

const SocialIcon = ({ platform }) => {
    switch (platform) {
        case 'linkedin':
            return <Linkedin size={18} />;
        case 'github':
            return <Github size={18} />;
        case 'instagram':
            return <Instagram size={18} />;
        case 'mail':
            return <Mail size={18} />;
        default:
            return null;
    }
};

const DepartmentPage = () => {
    const { dept: deptSlug } = useParams();
    const navigate = useNavigate();
    const department = getDepartmentBySlug(deptSlug);

    if (!department) {
        return (
            <div className="min-h-screen bg-black pt-36 text-center text-white">
                <h1 className="text-4xl font-bold mb-4">Department Not Found</h1>
                <Link to="/about" className="text-blue-400 hover:underline">
                    Back to About Page
                </Link>
            </div>
        );
    }

    const { name, lead, members } = department;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-black pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white"
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

            <div className="max-w-7xl mx-auto relative z-20">
                {/* Clickable Back Button */}
                <div className="mb-8 relative z-30">
                    <button
                        onClick={() => navigate('/about')}
                        className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-all cursor-pointer font-mono text-sm uppercase tracking-wider shadow-lg"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Team
                    </button>
                </div>

                {/* Department Header */}
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-white"
                    >
                        {name} Department
                    </motion.h1>
                    <p className="text-gray-400 text-lg font-mono tracking-wide">
                        ZERO BUGS CLUB
                    </p>
                </div>

                {/* Lead Card Section */}
                <div className="mb-20">
                    <h2 className="text-center text-white font-bold mb-8 text-xl md:text-2xl tracking-wide">
                        Department Lead
                    </h2>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => navigate(`/about/${deptSlug}/${lead.slug}`)}
                        className="flex flex-col items-center p-8 rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-black/20 backdrop-blur-sm hover:border-white/40 hover:scale-[1.02] transition-all cursor-pointer group w-full max-w-md mx-auto shadow-2xl"
                    >
                        <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-neutral-800 mb-5 border-2 border-white/20 group-hover:border-white/60 transition-colors overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-gray-700 to-gray-600"></div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                            {lead.name}
                        </h3>
                        <p className="text-sm text-blue-400 font-mono tracking-wide mb-4 uppercase font-semibold">
                            {lead.role}
                        </p>

                        <div className="flex gap-4" onClick={(e) => e.stopPropagation()}>
                            {lead.socials?.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.url}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <SocialIcon platform={social.platform} />
                                </a>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Members Section */}
                <div>
                    <h2 className="text-center text-white font-bold mb-10 text-xl md:text-2xl tracking-wide">
                        Members
                    </h2>
                    {members && members.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                            {members.map((member) => (
                                <motion.div
                                    key={member.slug}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    onClick={() => navigate(`/about/${deptSlug}/${member.slug}`)}
                                    className="flex flex-col items-center p-6 rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-black/20 backdrop-blur-sm hover:border-white/30 hover:scale-[1.02] transition-all cursor-pointer group w-full max-w-sm"
                                >
                                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-neutral-800 mb-4 border-2 border-white/10 group-hover:border-white/50 transition-colors overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-gray-700 to-gray-600"></div>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                                        {member.name}
                                    </h3>
                                    <p className="text-xs text-blue-400 font-mono tracking-wide mb-4 uppercase">
                                        {member.role}
                                    </p>

                                    <div className="flex gap-4" onClick={(e) => e.stopPropagation()}>
                                        {member.socials?.map((social, index) => (
                                            <a
                                                key={index}
                                                href={social.url}
                                                className="text-gray-400 hover:text-white transition-colors"
                                            >
                                                <SocialIcon platform={social.platform} />
                                            </a>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-400">No members listed in this department yet.</p>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default DepartmentPage;
