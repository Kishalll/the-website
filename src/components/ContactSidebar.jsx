import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Github, Linkedin, Mail, Instagram } from 'lucide-react';

const ContactSidebar = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const subject = `Hello ZBC from ${formData.name}`;
        const body = `${formData.message}`;
        window.location.href = `mailto:zbcvitc@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    const socialLinks = [
        { icon: <Github size={24} />, href: "#", bg: "hover:bg-[#333]" },
        { icon: <Linkedin size={24} />, href: "#", bg: "hover:bg-[#0077b5]" },
        { icon: <Instagram size={24} />, href: "#", bg: "hover:bg-[#E1306C]" },
        { icon: <Mail size={24} />, href: "mailto:zbcvitc@gmail.com", bg: "hover:bg-[#EA4335]" }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-[#0a0a0a] border-l border-white/10 z-[70] p-8 shadow-2xl flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-3xl font-bold tracking-tighter">Get in Touch</h2>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            <p className="text-gray-400 mb-8">
                                Have a project in mind or want to join the club? Send us a message directly.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/50 transition-colors"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/50 transition-colors resize-none"
                                        placeholder="Tell us about..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-white text-black font-bold py-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 group"
                                >
                                    Send Message
                                    <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>

                            <div className="mt-12 text-center">
                                <div className="relative mb-8">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/10"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-[#0a0a0a] text-gray-500">Or connect via</span>
                                    </div>
                                </div>

                                <div className="flex justify-center gap-4">
                                    {socialLinks.map((link, i) => (
                                        <a
                                            key={i}
                                            href={link.href}
                                            className={`w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 ${link.bg}`}
                                        >
                                            {link.icon}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ContactSidebar;
