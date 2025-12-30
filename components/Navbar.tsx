"use client";

import { useState, useEffect } from "react";

interface NavbarProps {
    onOpenModal: () => void;
}

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 border-b border-gray-100 ${isScrolled ? 'bg-white/95 shadow-sm' : 'bg-white/90 backdrop-blur-md'}`} id="navbar">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                        <div className="w-10 h-10 bg-gradient-to-br from-brand-600 to-blue-500 rounded-lg flex items-center justify-center text-white text-xl shadow-lg shadow-brand-500/30">
                            <i className="fa-solid fa-heart-pulse"></i>
                        </div>
                        <span className="font-bold text-xl tracking-tight text-gray-900">TeleHealth<span className="text-brand-600">Pro</span></span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8 items-center">
                        <a href="#services" className="text-gray-600 hover:text-brand-600 font-medium transition">Services</a>
                        <a href="#how-it-works" className="text-gray-600 hover:text-brand-600 font-medium transition">How It Works</a>
                        <a href="#ai-features" className="text-gray-600 hover:text-brand-600 font-medium transition">AI Features</a>
                        <a href="#testimonials" className="text-gray-600 hover:text-brand-600 font-medium transition">Reviews</a>
                        <button className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-full font-medium transition shadow-lg shadow-brand-500/30 transform hover:-translate-y-0.5 cursor-pointer">
                            Book Consultation
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            id="mobile-menu-btn"
                            className="text-gray-600 hover:text-brand-600 focus:outline-none"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <i className="fa-solid fa-bars text-2xl"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div id="mobile-menu" className={`md:hidden bg-white border-t border-gray-100 absolute w-full shadow-xl ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
                <div className="px-4 pt-2 pb-6 space-y-2">
                    <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-brand-600 hover:bg-gray-50">Services</a>
                    <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-brand-600 hover:bg-gray-50">How It Works</a>
                    <a href="#ai-features" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-brand-600 hover:bg-gray-50">AI Features</a>
                    <a href="#testimonials" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-brand-600 hover:bg-gray-50">Reviews</a>
                    <button  className="w-full mt-4 bg-brand-600 text-white px-6 py-3 rounded-lg font-medium shadow-md">
                        Book Consultation Now
                    </button>
                </div>
            </div>
        </nav>
    );
}
