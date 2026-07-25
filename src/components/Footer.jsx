import React from 'react';
import { Github, Linkedin, Mail, ArrowUp, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer id="contact" className="bg-surface text-white pt-20 pb-10 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start mb-16 w-full">
                    <div className="mb-10 md:mb-0">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="text-2xl font-bold tracking-tighter">ZBC</span>
                        </div>
                        <p className="text-gray-400 max-w-sm mb-6">
                            Zero Bugs Club. <br />
                            Shipping code that matters. <br />
                            Building the future, one commit at a time.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://github.com/Zero-Bugs-Club" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><Github size={20} /></a>
                            <a href="https://www.instagram.com/zbcvitc?igsh=MTlzam1jaDRxd3c1" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><Instagram size={20} /></a>
                            <a href="https://www.linkedin.com/in/zbc-vitc-905075301?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><Linkedin size={20} /></a>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-12 sm:gap-24">
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
                                <li className="flex items-center gap-2 text-gray-300">
                                    <Mail size={16} />
                                    zbcvitc@gmail.com
                                </li>
                                <li className="text-gray-300">VIT Chennai, Kelambakkam - Vandalur Rd, Rajan Nagar, Chennai, Tamil Nadu 600127, India</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} Zero Bugs Club. All rights reserved.
                    </p>
                    <button
                        onClick={scrollToTop}
                        className="group flex items-center gap-2 text-sm text-white border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-all"
                    >
                        Back to Top
                        <ArrowUp size={16} className="group-hover:-translate-y-1 transition-transform" />
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
