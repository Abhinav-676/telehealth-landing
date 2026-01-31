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
                        <h2 className="text-3xl lg:text-5xl font-bold mb-6 leading-tight">Intelligent Care, <br /> <span className="text-indigo-400">Human-Like Interaction.</span></h2>
                        <p className="text-slate-300 text-lg mb-8">Dr. Sarah isn't just a chatbot. She listens, understands contexts, and adapts her questions based on your responses.</p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
                                    <i className="fa-solid fa-microphone-lines text-white"></i>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-1">Voice Recognition</h4>
                                    <p className="text-slate-400 text-sm">Speak naturally. Our advanced speech-to-text engine captures every detail of your symptoms accurately.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
                                    <i className="fa-solid fa-clipboard-question text-white"></i>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-1">Adaptive Questioning</h4>
                                    <p className="text-slate-400 text-sm">The AI dynamically generates follow-up questions based on your severity ratings and previous answers.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
                                    <i className="fa-solid fa-file-pdf text-white"></i>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-1">Instant Reports</h4>
                                    <p className="text-slate-400 text-sm">Get a professional PDF summary of your consultation, complete with recommendations and precautions.</p>
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
