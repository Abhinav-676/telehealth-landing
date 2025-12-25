"use client";

import { useScrollReveal } from "../hooks/useScrollReveal";

interface CTAProps {
    onOpenModal: () => void;
}

export default function CTA({ onOpenModal }: CTAProps) {
    const ref = useScrollReveal();

    return (
        <section className="py-20 bg-gray-900 relative overflow-hidden">
            {/* Decorative Glow */}
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-r from-brand-900/50 to-blue-900/50"></div>

            <div ref={ref} className="max-w-4xl mx-auto px-4 text-center relative z-10 reveal">
                <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">Ready to Transform Your Healthcare?</h2>
                <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">Join thousands of users who are using our secure, reliable, and AI-powered platform daily to manage their health.</p>
                <button onClick={onOpenModal} className="bg-brand-600 hover:bg-brand-500 text-white text-xl px-10 py-5 rounded-full font-bold transition shadow-2xl shadow-brand-600/40 transform hover:scale-105 cursor-pointer">
                    Get Started Today
                </button>
                <p className="mt-6 text-sm text-gray-500">No credit card required for sign-up.</p>
            </div>
        </section>
    );
}
