import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Users, Rocket, Brain, Globe, Cpu, Linkedin, Github, Instagram } from 'lucide-react';
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
            description: "We adhere to strict coding standards and architectural patterns."
        },
        {
            icon: <Rocket className="w-6 h-6" />,
            title: "Innovation",
            description: "Pushing boundaries with bleeding-edge technology stacks."
        },
        {
            icon: <Brain className="w-6 h-6" />,
            title: "Mentorship",
            description: "Seniors guiding juniors to create a cycle of excellence."
        },
        {
            icon: <Globe className="w-6 h-6" />,
            title: "Open Source",
            description: "Contributors to significant global repositories."
        },
        {
            icon: <Cpu className="w-6 h-6" />,
            title: "Performance",
            description: "Optimizing for speed, efficiency, and scalability."
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
                        ZBC is a collective of ambitious engineers dedicated to the craft of software development.
                        We bridge the gap between academic theory and industry-grade engineering.
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

const TeamMemberCard = ({ name, role, color = "bg-white/5" }) => (
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
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Linkedin size={18} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Github size={18} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram size={18} /></a>
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

            {/* Level 3: General Secretary */}
            <div className="w-full flex justify-center">
                <TeamMemberCard name="Gen Sec Name" role="General Secretary" />
            </div>

            {/* Level 4: Leads */}
            <div className="w-full">
                <h3 className="text-center text-gray-500 font-mono mb-8 uppercase tracking-widest text-sm">Cluster Leads</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 justify-center">
                    <TeamMemberCard name="Lead Name" role="Technical Lead" />
                    <TeamMemberCard name="Lead Name" role="Finance Lead" />
                    <TeamMemberCard name="Lead Name" role="Event Mgmt Lead" />
                    <TeamMemberCard name="Lead Name" role="Content & Design" />
                    <TeamMemberCard name="Lead Name" role="Social Media" />
                </div>
            </div>

            {/* Level 5: Faculty Coordinator */}
            <div className="w-full flex justify-center pt-8 border-t border-white/5">
                <div className="text-center">
                    <h3 className="text-gray-500 font-mono mb-8 uppercase tracking-widest text-sm">Faculty Coordinator</h3>
                    <TeamMemberCard name="Faculty Name" role="Faculty Coordinator" />
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
