import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Linkedin, Github, Instagram, Mail, CheckCircle2, Quote } from 'lucide-react';
import LightRays from '../components/ui/LightRays';
import { getBoardMemberBySlug, getPersonByDeptAndSlug, getDepartmentBySlug } from '../data/teamData';

const SocialIcon = ({ platform }) => {
    switch (platform) {
        case 'linkedin':
            return <Linkedin size={20} />;
        case 'github':
            return <Github size={20} />;
        case 'instagram':
            return <Instagram size={20} />;
        case 'mail':
            return <Mail size={20} />;
        default:
            return null;
    }
};

const PersonDetailPage = () => {
    const { dept: deptSlug, name: personSlug, slug: singleSlug } = useParams();
    const navigate = useNavigate();

    let person = null;
    let backPath = '/about';
    let backText = 'Back to Team';

    if (deptSlug && personSlug) {
        person = getPersonByDeptAndSlug(deptSlug, personSlug);
        backPath = `/about/${deptSlug}`;
        backText = 'Back to Department';
    } else if (singleSlug) {
        person = getBoardMemberBySlug(singleSlug);
        if (!person) {
            const deptObj = getDepartmentBySlug(singleSlug);
            if (deptObj) {
                // handled by department resolver
            }
        }
    }

    if (!person) {
        return (
            <div className="min-h-screen bg-black pt-36 text-center text-white">
                <h1 className="text-4xl font-bold mb-4">Member Profile Not Found</h1>
                <Link to="/about" className="text-blue-400 hover:underline">
                    Back to About Page
                </Link>
            </div>
        );
    }

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

            {/* Identical max-w-7xl outer container to align Back button perfectly with DepartmentPage */}
            <div className="max-w-7xl mx-auto relative z-20">
                {/* Clickable Back Navigation Button */}
                <div className="mb-8 relative z-30">
                    <button
                        onClick={() => navigate(backPath)}
                        className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-all cursor-pointer font-mono text-sm uppercase tracking-wider shadow-lg"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        {backText}
                    </button>
                </div>

                {/* Profile Card Content centered inside max-w-4xl */}
                <div className="max-w-4xl mx-auto">
                    {/* Profile Header Card */}
                    <div className="flex flex-col md:flex-row items-center gap-8 p-8 md:p-10 rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-black/30 backdrop-blur-md mb-12 shadow-2xl">
                        {/* Square Profile Avatar */}
                        <div className="w-36 h-36 md:w-44 md:h-44 rounded-2xl bg-neutral-800 border-2 border-white/20 overflow-hidden relative shrink-0 shadow-lg">
                            {person.image ? (
                                <img src={person.image} alt={person.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-tr from-gray-700 to-gray-600"></div>
                            )}
                        </div>

                        {/* Basic Info */}
                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-2 text-white">
                                {person.name}
                            </h1>
                            <p className="text-lg text-blue-400 font-mono tracking-wide mb-4 uppercase font-semibold">
                                {person.role}
                            </p>

                            {/* Social Links */}
                            <div className="flex justify-center md:justify-start gap-4">
                                {person.socials?.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.url}
                                        className="p-3 bg-white/5 hover:bg-white/15 rounded-full text-gray-300 hover:text-white transition-all duration-300 border border-white/10"
                                    >
                                        <SocialIcon platform={social.platform} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Note Section */}
                    {person.note && (
                        <div className="p-8 rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-black/20 backdrop-blur-sm mb-10 relative overflow-hidden">
                            <Quote className="absolute top-4 right-4 text-white/5 w-20 h-20 pointer-events-none" />
                            <h2 className="text-xs font-mono uppercase tracking-widest text-blue-400 mb-3">
                                Note from {person.noteFrom || 'Leadership'}
                            </h2>
                            <p className="text-gray-300 text-lg italic leading-relaxed">
                                "{person.note}"
                            </p>
                        </div>
                    )}

                    {/* Contributions List */}
                    {person.contributions && person.contributions.length > 0 && (
                        <div className="p-8 rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-black/20 backdrop-blur-sm">
                            <h2 className="text-xl font-bold tracking-tight mb-6 text-white uppercase font-mono text-sm tracking-widest">
                                Key Contributions
                            </h2>
                            <ul className="space-y-4">
                                {person.contributions.map((item, index) => (
                                    <li key={index} className="flex items-start gap-3 text-gray-300 text-base leading-relaxed">
                                        <CheckCircle2 size={20} className="text-blue-400 shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default PersonDetailPage;
