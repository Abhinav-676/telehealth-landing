"use client";

import { useScrollReveal } from "../hooks/useScrollReveal";

export default function AIFeatures() {
    const contentRef = useScrollReveal();
    const imageRef = useScrollReveal();

    return (
        <section id="ai-features" className="py-20 bg-slate-900 text-white overflow-hidden relative">
            {/* Background Grid Effect */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#6366f1 1px, transparent 1px)", backgroundSize: "30px 30px" }}></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div ref={contentRef} className="reveal">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-semibold mb-6 border border-indigo-500/30">
                            <i className="fa-solid fa-microchip"></i>
                            AI-Powered Technology
                        </div>
                        <h2 className="text-3xl lg:text-5xl font-bold mb-6 leading-tight">Smarter Care, <br /> <span className="text-indigo-400">Faster Diagnosis.</span></h2>
                        <p className="text-slate-300 text-lg mb-8">We leverage cutting-edge artificial intelligence to assist doctors and ensure patient safety, giving you a technological advantage in healthcare.</p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
                                    <i className="fa-solid fa-stethoscope text-white"></i>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-1">Symptom Checker</h4>
                                    <p className="text-slate-400 text-sm">Natural language input that provides instant triage and risk assessment before you even book.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
                                    <i className="fa-solid fa-user-doctor text-white"></i>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-1">Doctor AI Assistant</h4>
                                    <p className="text-slate-400 text-sm">Provides doctors with instant case summaries and differential diagnosis suggestions.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
                                    <i className="fa-solid fa-bell text-white"></i>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-1">Smart Alerts</h4>
                                    <p className="text-slate-400 text-sm">Real-time warnings for drug interactions and critical allergy alerts to keep you safe.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Visual */}
                    <div ref={imageRef} className="relative reveal delay-200">
                        <div className="absolute inset-0 bg-indigo-600 blur-[100px] opacity-20 rounded-full"></div>
                        <img src="https://images.pexels.com/photos/305565/pexels-photo-305565.jpeg" alt="AI Interface" className="relative rounded-2xl shadow-2xl border border-slate-700 w-full" />

                        {/* Floating Badge */}
                        <div className="absolute -bottom-6 -right-6 bg-slate-800 border border-slate-700 p-4 rounded-xl shadow-xl flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-sm font-medium text-slate-200">AI Analysis Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
