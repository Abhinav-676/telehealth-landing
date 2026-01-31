"use client";

import { useScrollReveal } from "../hooks/useScrollReveal";

const steps = [
    {
        id: 1,
        title: "Start Session",
        desc: "Launch the AI consultation instantly with a single click—no waiting rooms."
    },
    {
        id: 2,
        title: "Speak Naturally",
        desc: "Describe your symptoms to Dr. Sarah using your voice, just like a real doctor."
    },
    {
        id: 3,
        title: "AI Analysis",
        desc: "Our advanced AI processes your input in real-time to ask relevant follow-up questions."
    },
    {
        id: 4,
        title: "Get Report",
        desc: "Receive a comprehensive medical report and recommendations aimed at your recovery."
    }
];

export default function HowItWorks() {
    const headerRef = useScrollReveal();
    const stepsRef = useScrollReveal();

    return (
        <section id="how-it-works" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16 reveal">
                    <h2 className="text-brand-600 font-semibold tracking-wide uppercase text-2xl mb-10">How it works</h2>
                    <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Your Checkup in 4 Simple Steps</h3>
                    <p className="text-gray-600 text-lg">We've simplified healthcare. Get professional-grade insights without the hassle.</p>
                </div>

                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10 transform -translate-y-1/2"></div>

                    <div ref={stepsRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 reveal">
                        {steps.map((step) => (
                            <div key={step.id} className="bg-white p-6 rounded-2xl border border-gray-100 text-center relative group">
                                <div className="w-16 h-16 mx-auto bg-brand-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg shadow-brand-500/40 group-hover:scale-110 transition-transform z-10 relative">
                                    {step.id}
                                </div>
                                <h4 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h4>
                                <p className="text-gray-600 text-sm">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
