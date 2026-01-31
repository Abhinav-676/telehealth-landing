"use client";

import { useOpenModal } from "@/hooks/openModal";
import { useScrollReveal } from "../hooks/useScrollReveal";
import Link from "next/link";


export default function Hero() {
    const contentRef = useScrollReveal();
    const imageRef = useScrollReveal();
    const openModal = useOpenModal();

    return (
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-gradient-to-br from-brand-50 via-white to-blue-50">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-brand-200 blur-3xl opacity-50 animate-pulse-slow"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-200 blur-3xl opacity-50 animate-pulse-slow"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Hero Content */}
                    <div ref={contentRef} className="reveal active">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-sm font-semibold mb-6 border border-brand-200">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                            </span>
                            AI-Powered Healthcare v2.0 Live
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                            Quality Healthcare <br />
                            <span className="text-gradient">At Your Fingertips</span>
                        </h1>
                        <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
                            Connect with verified doctors instantly via secure video calls. Get AI-assisted diagnoses, digital prescriptions, and 24/7 support—all from the comfort of your home.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/consultation" className="bg-brand-600 hover:bg-brand-700 text-white text-lg px-8 py-4 rounded-full font-semibold transition shadow-xl shadow-brand-500/30 transform hover:-translate-y-1 flex items-center justify-center gap-2 cursor-pointer">
                                <span>Book Consultation Now</span>
                                <i className="fa-solid fa-arrow-right"></i>
                            </Link>
                            <button onClick={openModal} className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-lg px-8 py-4 rounded-full font-semibold transition flex items-center justify-center gap-2 cursor-pointer">
                                <i className="fa-solid fa-play text-brand-600"></i>
                                <span>Quick Summerize</span>
                            </button>
                        </div>
                        <div className="mt-8 flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex -space-x-2">
                                <img src="https://picsum.photos/seed/doc1/100/100" className="w-8 h-8 rounded-full border-2 border-white" alt="User" />
                                <img src="https://picsum.photos/seed/doc2/100/100" className="w-8 h-8 rounded-full border-2 border-white" alt="User" />
                                <img src="https://picsum.photos/seed/doc3/100/100" className="w-8 h-8 rounded-full border-2 border-white" alt="User" />
                            </div>
                            <p>Trusted by <span className="font-bold text-gray-900">50,000+</span> patients</p>
                        </div>
                    </div>

                    {/* Hero Visual */}
                    <div ref={imageRef} className="reveal delay-200 relative lg:h-auto">
                        <div className="relative z-10 animate-float">
                            <img src="https://images.pexels.com/photos/4225920/pexels-photo-4225920.jpeg" alt="Doctor using tablet" className="rounded-3xl shadow-2xl object-cover w-full h-auto border-4 border-white/50" />

                            {/* Floating Card 1 */}
                            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
                                <div className="bg-green-100 p-2 rounded-full text-green-600">
                                    <i className="fa-solid fa-shield-halved"></i>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Security Status</p>
                                    <p className="font-bold text-sm text-gray-800">HIPAA Compliant</p>
                                </div>
                            </div>

                            {/* Floating Card 2 */}
                            <div className="absolute -top-4 -right-4 bg-white p-4 rounded-xl shadow-xl border border-gray-100">
                                <div className="flex items-center gap-2 mb-1">
                                    <i className="fa-solid fa-star text-yellow-400 text-sm"></i>
                                    <span className="font-bold text-gray-900">4.9/5</span>
                                </div>
                                <p className="text-xs text-gray-500">Patient Reviews</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
