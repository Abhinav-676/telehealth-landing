"use client";

import { useScrollReveal } from "../hooks/useScrollReveal";

export default function Stats() {
    const ref = useScrollReveal();

    return (
        <section className="py-12 bg-white border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center reveal text-gray-900">
                    <div>
                        <div className="text-4xl font-extrabold text-brand-600 mb-1">10K+</div>
                        <p className="text-gray-600 font-medium">Verified Doctors</p>
                    </div>
                    <div>
                        <div className="text-4xl font-extrabold text-brand-600 mb-1">99.9%</div>
                        <p className="text-gray-600 font-medium">Uptime Guarantee</p>
                    </div>
                    <div>
                        <div className="text-4xl font-extrabold text-brand-600 mb-1">50K+</div>
                        <p className="text-gray-600 font-medium">Consultations</p>
                    </div>
                    <div>
                        <div className="text-4xl font-extrabold text-brand-600 mb-1">24/7</div>
                        <p className="text-gray-600 font-medium">Support Available</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
