import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Users, Rocket, Brain, Globe, Cpu, Linkedin, Github, Instagram, Mail } from 'lucide-react';
import LightRays from '../components/ui/LightRays';

const AboutPage = () => {


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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32">
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
                <div className="mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-6xl font-bold text-center text-white mb-20 tracking-tighter"
                    >
                        THE TEAM
                    </motion.h2>

                    {/* Hierarchy Helper Component */}
                    <TeamHierarchy />
                </div>
            </div>
        </motion.div>
    );
};

const TeamMemberCard = ({ name, role, _color = "bg-white/5", socials }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`flex flex-col items-center p-6 rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-black/20 backdrop-blur-sm hover:border-white/30 transition-all group w-full max-w-sm mx-auto`}
    >
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-neutral-800 mb-4 border-2 border-white/10 group-hover:border-white/50 transition-colors overflow-hidden relative">
            {/* Placeholder Image */}
            <div className="absolute inset-0 bg-gradient-to-tr from-gray-700 to-gray-600"></div>
        </div>
        <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
        <p className="text-sm text-blue-400 font-mono tracking-wide mb-4 uppercase">{role}</p>

        <div className="flex gap-4">
            {socials ? (
                // Custom socials
                socials.map((social, index) => (
                    <a key={index} href={social.href || '#'} className="text-gray-400 hover:text-white transition-colors">
                        {social.icon}
                    </a>
                ))
            ) : (
                // Default socials
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
    return (
        <div className="flex flex-col gap-16 items-center">
            {/* Level 1: Chairperson */}
            <div className="w-full flex justify-center">
                <TeamMemberCard name="Chairperson Name" role="Chairperson" />
            </div>

            {/* Level 2: Vice Chairperson */}
            <div className="w-full flex justify-center">
                <TeamMemberCard name="Vice Chair Name" role="Vice Chairperson" />
            </div>

            {/* Level 3: General Secretary & Treasurer */}
            <div className="w-full flex justify-center gap-4 flex-wrap">
                <TeamMemberCard name="Gen Sec Name" role="General Secretary" />
                <TeamMemberCard name="Treasurer Name" role="Treasurer" />
            </div>

            {/* Level 4: Leads */}
            <div className="w-full">
                <h3 className="text-center text-gray-500 font-mono mb-8 uppercase tracking-widest text-sm">Cluster Leads</h3>
                <div className="flex flex-wrap justify-center gap-6">
                    <TeamMemberCard name="Lead Name" role="Development" />
                    <TeamMemberCard name="Lead Name" role="UI/UX" />
                    <TeamMemberCard name="Lead Name" role="Cybersec and Testing" />
                    <TeamMemberCard name="Mano Kathik" role="Design and Content" />
                    <TeamMemberCard name="Lead Name" role="Event Management" />
                    <TeamMemberCard name="Lead Name" role="Social Media and Marketing" />
                </div>
            </div>

            {/* Level 5: Faculty Coordinator */}
            <div className="w-full flex justify-center pt-8 border-t border-white/5">
                <div className="text-center">
                    <h3 className="text-gray-500 font-mono mb-8 uppercase tracking-widest text-sm">Faculty Coordinator</h3>
                    <TeamMemberCard
                        name="Dr.Punitha K"
                        role="Faculty Coordinator"
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
