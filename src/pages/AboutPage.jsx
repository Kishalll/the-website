import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Users, Rocket, Brain, Globe, Cpu, Linkedin, Github, Instagram, Mail, ArrowRight } from 'lucide-react';
import FogBackground from '../components/ui/FogBackground';
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
            <FogBackground />

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 p-2">
                    {values.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{
                                y: -8,
                                scale: 1.03,
                                boxShadow: "0px 12px 35px 2px rgba(255, 255, 255, 0.15)",
                                zIndex: 20
                            }}
                            transition={{
                                delay: 0.4 + (index * 0.1),
                                y: { type: "spring", stiffness: 300, damping: 25 },
                                scale: { type: "spring", stiffness: 300, damping: 25 },
                                boxShadow: { duration: 0.25 }
                            }}
                            className="bg-[#111111] p-8 rounded-2xl border border-white/10 hover:border-white/20 cursor-pointer group flex flex-col justify-between relative shadow-xl z-10"
                        >
                            <div>
                                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white mb-6 group-hover:bg-white group-hover:text-black transition-colors duration-300 shadow-md">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Team Section */}
                <div className="mb-12">
                    <h2 className="text-4xl md:text-6xl font-bold text-center text-white mb-12 tracking-tighter">
                        THE TEAM
                    </h2>

                    <TeamHierarchy />
                </div>
            </div>
        </motion.div>
    );
};

const TeamMemberCard = ({ name, role, onClick, socials }) => (
    <motion.div
        onClick={onClick}
        whileHover={{
            y: -6,
            scale: 1.02,
            boxShadow: "0px 10px 25px 2px rgba(255, 255, 255, 0.15)",
            zIndex: 20
        }}
        transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
            boxShadow: { duration: 0.25 }
        }}
        className="flex flex-col items-center p-6 rounded-2xl border border-white/10 bg-[#111111] hover:border-white/30 transition-colors cursor-pointer group w-full max-w-sm mx-auto relative shadow-xl z-10"
    >
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-neutral-800 mb-4 border-2 border-white/10 group-hover:border-white/50 transition-colors overflow-hidden relative shadow-inner">
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
    </motion.div>
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
        <div className="flex flex-col gap-12 items-center">
            {president && (
                <div className="w-full flex justify-center p-2">
                    <TeamMemberCard
                        name={president.name}
                        role={president.role}
                        onClick={() => handleNavigate(`/about/${president.slug}`)}
                    />
                </div>
            )}

            {vicePresident && (
                <div className="w-full flex justify-center p-2">
                    <TeamMemberCard
                        name={vicePresident.name}
                        role={vicePresident.role}
                        onClick={() => handleNavigate(`/about/${vicePresident.slug}`)}
                    />
                </div>
            )}

            <div className="w-full flex justify-center gap-8 flex-wrap p-2">
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

            <div className="w-full">
                <h3 className="text-center text-white font-bold text-2xl md:text-3xl tracking-tight mb-8">
                    Departments
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center p-2">
                    {departments.map((dept) => (
                        <div key={dept.slug} className="flex flex-col items-center gap-4 w-full max-w-sm">
                            <TeamMemberCard
                                name={dept.lead.name}
                                role={`${dept.name} Lead`}
                                onClick={() => handleNavigate(`/about/${dept.slug}/${dept.lead.slug}`)}
                            />
                            <motion.button
                                onClick={() => handleNavigate(`/about/${dept.slug}`)}
                                whileHover={{
                                    y: -3,
                                    scale: 1.02,
                                    boxShadow: "0px 8px 20px 2px rgba(255, 255, 255, 0.2)",
                                    zIndex: 20
                                }}
                                whileTap={{ scale: 0.98 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 25,
                                    boxShadow: { duration: 0.25 }
                                }}
                                className="w-full py-2.5 px-4 rounded-xl border border-white/15 bg-[#1a1a1a] hover:bg-white hover:text-black font-semibold text-sm flex items-center justify-center gap-2 group cursor-pointer shadow-md text-white transition-colors duration-300 z-10"
                            >
                                View members
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full pt-8 border-t border-white/10">
                <h3 className="text-center text-white font-bold text-2xl md:text-3xl tracking-tight mb-8">
                    Faculty Coordinator
                </h3>
                <div className="flex justify-center p-2">
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