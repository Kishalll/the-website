import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = ({ onContactClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'About', href: '/about' },
        { name: 'Domains', href: '/domains' },
        { name: 'Tools', href: '/tools' },
        { name: 'Gallery', href: '/gallery' },
    ];

    return (
        <nav className={`fixed w-full z-50 transition-all duration-500 border-b ${scrolled ? 'bg-black/60 backdrop-blur-xl border-white/5 py-2' : 'bg-transparent border-transparent py-4'}`}>
            <div className="w-full px-2 sm:px-4 lg:px-6">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center gap-3 group" onClick={() => window.scrollTo(0, 0)}>
                            <img className="h-16 w-auto filter grayscale group-hover:grayscale-0 transition-all duration-300" src="/logo_new.png" alt="ZBC Logo" />
                            <span className="font-bold text-3xl tracking-tighter text-white">ZBC</span>
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        {/* Slightly shifted left by reducing ml-10 to ml-4 lg:ml-8 and tightening item gap */}
                        <div className="ml-4 lg:ml-8 flex items-center space-x-5 lg:space-x-8">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.name}
                                    to={link.href}
                                    onClick={() => window.scrollTo(0, 0)}
                                    className={({ isActive }) => `
                    relative px-4 py-2 rounded-full text-base lg:text-lg font-medium transition-all duration-300 group overflow-hidden
                    ${isActive ? 'text-black bg-white font-semibold' : 'text-gray-400 hover:text-white'}
                  `}
                                >
                                    {link.name}
                                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                                </NavLink>
                            ))}
                            <button
                                onClick={onContactClick}
                                className="relative text-white px-6 py-2.5 rounded-full text-base lg:text-lg font-bold transition-all duration-300 border border-white/20 hover:bg-white hover:text-black overflow-hidden group"
                            >
                                Contact
                            </button>
                        </div>
                    </div>
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-300 hover:text-white focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden bg-black/95 backdrop-blur-lg border-b border-white/10"
                >
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.href}
                                onClick={() => {
                                    setIsOpen(false);
                                    window.scrollTo(0, 0);
                                }}
                                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-lg font-medium"
                            >
                                {link.name}
                            </NavLink>
                        ))}
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                onContactClick();
                            }}
                            className="w-full text-left text-gray-300 hover:text-white block px-3 py-2 rounded-md text-lg font-medium"
                        >
                            Contact
                        </button>
                    </div>
                </motion.div>
            )}
        </nav>
    );
};

export default Navbar;