import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Linkedin, Github, Instagram, Mail } from 'lucide-react';
import FogBackground from '../components/ui/FogBackground';
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
    const { dept, slug } = useParams();
    const deptSlug = dept || slug;
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
            className="min-h-screen bg-black pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white"
        >
            {/* Background Layer - Sits strictly behind content */}
            <FogBackground />

            <div className="max-w-7xl mx-auto relative z-20">
                {/* Back Button */}
                <div className="mb-6 relative z-30">
                    <button
                        onClick={() => navigate('/about')}
                        className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-neutral-900 hover:bg-neutral-800 text-gray-300 hover:text-white transition-all cursor-pointer font-mono text-sm uppercase tracking-wider shadow-lg"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Team
                    </button>
                </div>

                {/* Department Header */}
                <div className="text-center mb-10">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-2 text-white">
                        {name} Department
                    </h1>
                    <p className="text-gray-400 text-lg font-mono tracking-wide">
                        ZERO BUGS CLUB
                    </p>
                </div>

                {/* Clickable Lead Card Section with Spring Hover Animation */}
                <div className="mb-12">
                    <h2 className="text-center text-white font-bold mb-4 text-xl md:text-2xl tracking-wide">
                        Department Lead
                    </h2>
                    <motion.div
                        onClick={() => navigate(`/about/${deptSlug}/${lead.slug}`)}
                        whileHover={{
                            y: -8,
                            scale: 1.02,
                            boxShadow: "0px 12px 35px 2px rgba(255, 255, 255, 0.2)",
                            zIndex: 10
                        }}
                        transition={{
                            y: { type: "spring", stiffness: 300, damping: 25 },
                            scale: { type: "spring", stiffness: 300, damping: 25 },
                            boxShadow: { duration: 0.25 }
                        }}
                        className="flex flex-col items-center p-8 rounded-2xl border border-white/15 bg-gradient-to-b from-zinc-900 to-neutral-950 hover:border-white/40 transition-colors cursor-pointer group w-full max-w-md mx-auto shadow-2xl relative"
                    >
                        {/* Square Avatar */}
                        <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-neutral-800 mb-5 border-2 border-white/20 group-hover:border-white/60 transition-colors overflow-hidden relative shadow-lg">
                            {lead.image ? (
                                <img src={lead.image} alt={lead.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-tr from-gray-700 to-gray-600"></div>
                            )}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300">
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

                {/* Members Section with Spring Hover Animation */}
                <div>
                    <h2 className="text-center text-white font-bold mb-6 text-xl md:text-2xl tracking-wide">
                        Members
                    </h2>
                    {members && members.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                            {members.map((member, index) => (
                                <motion.div
                                    key={member.slug}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={{
                                        y: -8,
                                        scale: 1.02,
                                        boxShadow: "0px 12px 35px 2px rgba(255, 255, 255, 0.2)",
                                        zIndex: 10
                                    }}
                                    transition={{
                                        delay: index * 0.05,
                                        y: { type: "spring", stiffness: 300, damping: 25 },
                                        scale: { type: "spring", stiffness: 300, damping: 25 },
                                        boxShadow: { duration: 0.25 }
                                    }}
                                    onClick={() => navigate(`/about/${deptSlug}/${member.slug}`)}
                                    className="flex flex-col items-center p-6 rounded-2xl border border-white/15 bg-gradient-to-b from-zinc-900 to-neutral-950 hover:border-white/30 transition-colors cursor-pointer group w-full max-w-sm shadow-md relative"
                                >
                                    {/* Square Avatar */}
                                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl bg-neutral-800 mb-4 border-2 border-white/10 group-hover:border-white/50 transition-colors overflow-hidden relative shadow-md">
                                        {member.image ? (
                                            <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-tr from-gray-700 to-gray-600"></div>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300">
                                        {member.name}
                                    </h3>
                                    <p className="text-xs text-blue-400 font-mono tracking-wide mb-4 uppercase">
                                        {member.role}
                                    </p>

                                    <div className="flex gap-4" onClick={(e) => e.stopPropagation()}>
                                        {member.socials?.map((social, idx) => (
                                            <a
                                                key={idx}
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