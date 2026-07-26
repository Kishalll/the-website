import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, ArrowUp, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Footer = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY || document.documentElement.scrollTop;

            // Trigger when within 400px of the absolute bottom of the page
            const distanceFromBottom = documentHeight - (scrollTop + windowHeight);
            
            if (distanceFromBottom < 400) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer id="contact" className="bg-surface text-white pt-20 pb-10 border-t border-white/5 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-4 mb-16 items-center">
                    
                    {/* Navigation & Contact */}
                    <div className="lg:col-span-5 grid grid-cols-2 gap-4 sm:gap-6 text-left">
                        <div>
                            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-gray-500">Navigation</h4>
                            <ul className="space-y-3">
                                {[
                                    { name: 'Home', path: '/' },
                                    { name: 'About', path: '/about' },
                                    { name: 'Domains', path: '/domains' },
                                    { name: 'Tools', path: '/tools' },
                                    { name: 'Gallery', path: '/gallery' }
                                ].map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.path}
                                            onClick={() => window.scrollTo(0, 0)}
                                            className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors py-1"
                                        >
                                            <span className="h-px w-0 bg-white group-hover:w-4 transition-all duration-300"></span>
                                            <span className="transform group-hover:translate-x-1 transition-transform duration-300 uppercase tracking-wider text-sm">{link.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-gray-500">Contact</h4>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-2 text-gray-300 text-sm">
                                    <Mail size={16} className="shrink-0" />
                                    zbcvitc@gmail.com
                                </li>
                                <li className="text-gray-300 text-sm leading-relaxed">
                                    VIT Chennai, Kelambakkam - Vandalur Rd, Rajan Nagar, Chennai, Tamil Nadu 600127, India
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Logo */}
                    <div className="lg:col-span-4 flex items-center justify-center lg:justify-end">
                        <img 
                            src="/logo_new.png" 
                            alt="Zero Bugs Club Logo" 
                            className="w-52 h-52 lg:w-60 lg:h-60 object-contain hover:scale-105 transition-transform duration-300 filter drop-shadow-[0_0_25px_rgba(255,255,255,0.07)]"
                        />
                    </div>

                    {/* Brand Bio & Socials */}
                    <div className="lg:col-span-3 text-center lg:text-right flex flex-col items-center lg:items-end">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-3xl font-bold tracking-tighter">ZBC</span>
                        </div>
                        <p className="text-gray-400 text-sm max-w-[220px] mb-5 leading-relaxed">
                            Zero Bugs Club. <br />
                            Shipping code that matters. <br />
                            Building the future, one commit at a time.
                        </p>
                        
                        {/* Upsized Social Media Icons */}
                        <div className="flex gap-3">
                            <a 
                                href="https://github.com/Zero-Bugs-Club" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-gray-400 hover:text-white transition-colors p-3 bg-white/5 rounded-full hover:bg-white/10 hover:scale-110 duration-300"
                            >
                                <Github size={22} />
                            </a>
                            <a 
                                href="https://www.instagram.com/zbcvitc?igsh=MTlzam1jaDRxd3c1" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-gray-400 hover:text-white transition-colors p-3 bg-white/5 rounded-full hover:bg-white/10 hover:scale-110 duration-300"
                            >
                                <Instagram size={22} />
                            </a>
                            <a 
                                href="https://www.linkedin.com/in/zbc-vitc-905075301?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-gray-400 hover:text-white transition-colors p-3 bg-white/5 rounded-full hover:bg-white/10 hover:scale-110 duration-300"
                            >
                                <Linkedin size={22} />
                            </a>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar: Clean 3-Column Center Alignment */}
                <div className="border-t border-white/10 pt-8 grid grid-cols-1 md:grid-cols-3 items-center gap-4 text-center md:text-left">
                    
                    {/* Left Column: Copyright */}
                    <p className="text-gray-500 text-sm order-2 md:order-1">
                        &copy; {new Date().getFullYear()} Zero Bugs Club. All rights reserved.
                    </p>

                    {/* Center Column: Back to Top Button */}
                    <div className="flex justify-center order-1 md:order-2 h-12 items-center">
                        <AnimatePresence>
                            {isVisible && (
                                <motion.button
                                    initial={{ y: 40, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 40, opacity: 0 }}
                                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                    onClick={scrollToTop}
                                    aria-label="Back to Top"
                                    className="group flex items-center justify-center w-12 h-12 rounded-full border border-white/20 bg-black/80 backdrop-blur-md text-white shadow-2xl hover:bg-white hover:text-black transition-colors duration-300"
                                >
                                    <ArrowUp size={20} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right Column: Empty Spacer */}
                    <div className="hidden md:block order-3"></div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;