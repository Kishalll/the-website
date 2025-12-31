import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Users, Rocket } from 'lucide-react';

const About = () => {
    const features = [
        {
            icon: <Users className="w-8 h-8" />,
            title: "Community First",
            description: "We are a collective of developers helping each other grow through peer learning and mentorship."
        },
        {
            icon: <Code2 className="w-8 h-8" />,
            title: "Engineering Excellence",
            description: "We don't just write code; we engineer solutions. Best practices and clean architecture are our religion."
        },
        {
            icon: <Rocket className="w-8 h-8" />,
            title: "Shipping Quality",
            description: "From idea to production, we focus on delivering bug-free, high-performance software."
        }
    ];

    return (
        <section id="about" className="py-24 bg-surface text-white relative border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Who Are We?</h2>
                    <p className="max-w-3xl mx-auto text-gray-400 text-lg leading-relaxed">
                        Zero Bugs Club is not just a student chapter; it's a movement. We are the builders, the innovators,
                        and the problem solvers. We believe in the power of open source and the art of engineering.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className="p-8 border border-white/5 bg-black/50 hover:bg-white/5 transition-colors duration-300 group"
                        >
                            <div className="p-3 bg-white/5 w-fit rounded-lg mb-6 text-white group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default About;
