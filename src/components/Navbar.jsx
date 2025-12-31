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
        { name: 'Activities', href: '/activities' },
        { name: 'Events', href: '/events' },
        { name: 'Gallery', href: '/gallery' },
    ];

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-md border-b border-white/10' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center gap-2 group">
                            <img className="h-10 w-auto filter grayscale group-hover:grayscale-0 transition-all duration-300" src="/logo.png" alt="ZBC Logo" />
                            <span className="font-bold text-xl tracking-tighter text-white">ZBC</span>
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.name}
                                    to={link.href}
                                    className={({ isActive }) => `
                    relative px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 group
                    ${isActive ? 'text-white' : 'text-gray-300 hover:text-white'}
                  `}
                                >
                                    {link.name}
                                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                                </NavLink>
                            ))}
                            <button
                                onClick={onContactClick}
                                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
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
                                onClick={() => setIsOpen(false)}
                                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                            >
                                {link.name}
                            </NavLink>
                        ))}
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                onContactClick();
                            }}
                            className="w-full text-left text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
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
