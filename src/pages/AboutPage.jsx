import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Users, Rocket, Brain, Globe, Cpu, Linkedin, Github, Instagram, Mail, ArrowRight } from 'lucide-react';
import LightRays from '../components/ui/LightRays';
import { boardMembers, facultyCoordinator, departments } from '../data/teamData';

const AboutPage = () => {
    React.useLayoutEffect(() => {
        const lockedY = sessionStorage.getItem('about_locked_y');
        if (lockedY !== null) {
            const targetY = parseFloat(lockedY);
            window.scrollTo(0, targetY);
            const rafId = requestAnimationFrame(() => {
                window.scrollTo(0, targetY);
                sessionStorage.removeItem('about_locked_y');
            });
            return () => cancelAnimationFrame(rafId);
        }
    }, []);

    const values = [
        {
            icon: <Users className="w-6 h-6" />,
            title: "Community First",
            description: "We foster a collaborative environment where knowledge flows freely."
        },
        {
            icon: <Code2 className="w-6 h-6" />,
            title: "Clean Code",
            description: "Ensuring code readability and maintainability, making it easy to update and debug."
        },
        {
            icon: <Rocket className="w-6 h-6" />,
            title: "Production-Ready",
            description: "Transforming concepts into resilient, deployable solutions."
        },
        {
            icon: <Brain className="w-6 h-6" />,
            title: "Mentorship",
            description: "Hands-on guidance from experienced seniors and industry professionals."
        },
        {
            icon: <Globe className="w-6 h-6" />,
            title: "Open Source",
            description: "Contributors to significant global repositories that power the developer community."
        },
        {
            icon: <Cpu className="w-6 h-6" />,
            title: "Performance",
            description: "Architecting scalable software designed to handle real-world loads"
        }
    ];

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
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-20">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 glitch-wrapper text-white" data-text="Who We Are"
                    >
                        Who We Are
                    </motion.h1>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-400 max-w-3xl mx-auto"
                    >
                        ZBC is a student community dedicated to the practical application of software engineering.
                        We transform academic concepts into tangible reality by designing, building, and maintaining fully deployable projects.
                    </motion.p>
                </div>

                {/* Values Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {values.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + (index * 0.1) }}
                            className="bg-gradient-to-b from-white/10 to-black/20 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:border-white/20 hover:from-white/15 hover:to-black/30 transition-all group"
                        >
                            <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-white mb-6 group-hover:bg-white group-hover:text-black transition-colors">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                            <p className="text-gray-400 leading-relaxed">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Team Section */}
                <div className="mb-12">
                    <h2 className="text-4xl md:text-6xl font-bold text-center text-white mb-10 tracking-tighter">
                        THE TEAM
                    </h2>

                    {/* Hierarchy Helper Component */}
                    <TeamHierarchy />
                </div>
            </div>
        </motion.div>
    );
};

const TeamMemberCard = ({ name, role, onClick, socials }) => (
    <div
        onClick={onClick}
        className="flex flex-col items-center p-6 rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-black/20 backdrop-blur-sm hover:border-white/30 hover:scale-[1.02] transition-all cursor-pointer group w-full max-w-sm mx-auto shadow-lg"
    >
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-neutral-800 mb-4 border-2 border-white/10 group-hover:border-white/50 transition-colors overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-gray-700 to-gray-600"></div>
        </div>
        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{name}</h3>
        <p className="text-sm text-blue-400 font-mono tracking-wide mb-4 uppercase">{role}</p>

        <div className="flex gap-4" onClick={(e) => e.stopPropagation()}>
            {socials ? (
                socials.map((social, index) => (
                    <a key={index} href={social.href || '#'} className="text-gray-400 hover:text-white transition-colors">
                        {social.icon}
                    </a>
                ))
            ) : (
                <>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors"><Linkedin size={18} /></a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors"><Github size={18} /></a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram size={18} /></a>
                </>
            )}
        </div>
    </div>
);

const TeamHierarchy = () => {
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        const currentY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        sessionStorage.setItem('about_locked_y', currentY.toString());
        navigate(path);
    };

    const president = boardMembers.find(m => m.slug === 'manvi-chadha');
    const vicePresident = boardMembers.find(m => m.slug === 'kishal-p');
    const secretary = boardMembers.find(m => m.slug === 'm-mano-karthik');
    const coSecretary = boardMembers.find(m => m.slug === 'divyashri-rajaraman');

    return (
        <div className="flex flex-col gap-10 items-center">
            {/* Level 1: Chairperson */}
            {president && (
                <div className="w-full flex justify-center">
                    <TeamMemberCard
                        name={president.name}
                        role={president.role}
                        onClick={() => handleNavigate(`/about/${president.slug}`)}
                    />
                </div>
            )}

            {/* Level 2: Vice Chairperson */}
            {vicePresident && (
                <div className="w-full flex justify-center">
                    <TeamMemberCard
                        name={vicePresident.name}
                        role={vicePresident.role}
                        onClick={() => handleNavigate(`/about/${vicePresident.slug}`)}
                    />
                </div>
            )}

            {/* Level 3: Secretary & Co-secretary */}
            <div className="w-full flex justify-center gap-6 flex-wrap">
                {secretary && (
                    <TeamMemberCard
                        name={secretary.name}
                        role={secretary.role}
                        onClick={() => handleNavigate(`/about/${secretary.slug}`)}
                    />
                )}
                {coSecretary && (
                    <TeamMemberCard
                        name={coSecretary.name}
                        role={coSecretary.role}
                        onClick={() => handleNavigate(`/about/${coSecretary.slug}`)}
                    />
                )}
            </div>

            {/* Level 4: Departments */}
            <div className="w-full">
                <h3 className="text-center text-white font-bold text-2xl md:text-3xl tracking-tight mb-6">
                    Departments
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                    {departments.map((dept) => (
                        <div key={dept.slug} className="flex flex-col items-center gap-4 w-full max-w-sm">
                            <TeamMemberCard
                                name={dept.lead.name}
                                role={`${dept.name} Lead`}
                                onClick={() => handleNavigate(`/about/${dept.slug}/${dept.lead.slug}`)}
                            />
                            <button
                                onClick={() => handleNavigate(`/about/${dept.slug}`)}
                                className="w-full py-2.5 px-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white hover:text-black font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer shadow-md"
                            >
                                View members
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Level 5: Faculty Coordinator */}
            <div className="w-full pt-6 border-t border-white/5">
                <h3 className="text-center text-white font-bold text-2xl md:text-3xl tracking-tight mb-6">
                    Faculty Coordinator
                </h3>
                <div className="flex justify-center">
                    <TeamMemberCard
                        name={facultyCoordinator.name}
                        role={facultyCoordinator.role}
                        onClick={() => handleNavigate(`/about/${facultyCoordinator.slug}`)}
                        socials={[
                            { icon: <Linkedin size={18} />, href: "#" },
                            { icon: <Mail size={18} />, href: "mailto:zbcvitc@gmail.com" }
                        ]}
                    />
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
