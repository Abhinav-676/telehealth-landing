'use client'

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HowItWorks from "@/components/HowItWorks";
import { motion } from "framer-motion";

export default function About() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-16 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="container mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
                    >
                        About Our Platform
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-600 max-w-3xl mx-auto"
                    >
                        Revolutionizing healthcare delivery through secure, AI-powered telemedicine solutions accessible to everyone, everywhere.
                    </motion.p>
                </div>
            </section>

            {/* Platform Introduction */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">We Bring Healthcare to You</h2>
                        <div className="prose prose-lg mx-auto text-gray-600">
                            <p className="mb-6">
                                Our platform bridges the gap between patients and healthcare providers by leveraging cutting-edge technology. We understand that access to quality healthcare is a fundamental right, not a privilege. That's why we've built a robust ecosystem that connects you with verified specialists instantly.
                            </p>
                            <p className="mb-6">
                                Whether you need a quick consultation, a second opinion, or ongoing management for chronic conditions, our secure video conferencing and AI-assisted diagnostic tools ensure you get the best care possible from the comfort of your home.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                                <i className="fas fa-bullseye text-blue-600 text-xl"></i>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
                            <p className="text-gray-600 leading-relaxed">
                                To democratize healthcare access by providing affordable, high-quality medical consultations through innovative digital solutions, ensuring no one is left behind due to geographical or financial barriers.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                                <i className="fas fa-eye text-indigo-600 text-xl"></i>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
                            <p className="text-gray-600 leading-relaxed">
                                A world where quality healthcare is universally accessible, efficient, and patient-centric, powered by the seamless integration of human expertise and artificial intelligence.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works - Reusing existing component */}
            <HowItWorks />

            {/* Privacy & Safety */}
            <section className="py-20 bg-gray-900 text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center">Privacy & Safety First</h2>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <i className="fas fa-shield-alt text-blue-400"></i>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">HIPAA Compliant</h3>
                                    <p className="text-gray-400">Your health data is protected by industry-standard encryption and compliance protocols.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <i className="fas fa-lock text-green-400"></i>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">End-to-End Encryption</h3>
                                    <p className="text-gray-400">All video calls and chats are encrypted, ensuring your conversations remain private.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <i className="fas fa-user-check text-purple-400"></i>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Verified Specialists</h3>
                                    <p className="text-gray-400">Every doctor on our platform undergoes a rigorous verification process.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <i className="fas fa-server text-red-400"></i>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Secure Data Storage</h3>
                                    <p className="text-gray-400">We use secure cloud infrastructure with 24/7 monitoring to protect your information.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* IMPORTANT DISCLAIMER */}
            <section className="py-24 bg-red-50 border-t border-red-100">
                <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fas fa-exclamation-circle text-red-600 text-4xl"></i>
                    </div>
                    <h2 className="text-3xl font-bold text-red-900 mb-6">Disclaimer</h2>
                    <div className="prose prose-lg mx-auto text-red-800">
                    <p className="font-semibold text-xl mb-4">
                        This website is for demonstration purposes only.
                    </p>
                    <p className="mt-6">
                        If you are experiencing a medical emergency, please call your local emergency services (e.g., 911) or visit the nearest emergency room immediately.
                    </p>
                    </div>
                </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
