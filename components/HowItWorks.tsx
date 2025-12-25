"use client";

import { useScrollReveal } from "../hooks/useScrollReveal";

const steps = [
    {
        id: 1,
        title: "Register",
        desc: "Quick sign-up with phone verification in under 2 minutes."
    },
    {
        id: 2,
        title: "Find a Doctor",
        desc: "Browse by specialty, location, language, and ratings."
    },
    {
        id: 3,
        title: "Book & Pay",
        desc: "Select your time slot and complete secure payment instantly."
    },
    {
        id: 4,
        title: "Consult",
        desc: "Join video call, chat, share files, and receive prescriptions."
    }
];

export default function HowItWorks() {
    const headerRef = useScrollReveal();
    const stepsRef = useScrollReveal();

    return (
        <section id="how-it-works" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16 reveal">
                    <h2 className="text-brand-600 font-semibold tracking-wide uppercase text-sm mb-2">How It Works</h2>
                    <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Your Journey to Better Health in 4 Steps</h3>
                    <p className="text-gray-600 text-lg">We've removed the complexity from healthcare. Here is how simple it is to get started.</p>
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
