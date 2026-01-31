"use client";

import { useScrollReveal } from "../hooks/useScrollReveal";

const services = [
    {
        icon: "fa-solid fa-robot",
        color: "blue",
        title: "AI Health Assessment",
        desc: "Complete, voice-guided medical interview to understand your condition deeply."
    },
    {
        icon: "fa-solid fa-file-medical-alt",
        color: "green",
        title: "Instant Reports",
        desc: "Receive a detailed PDF report with summary, precautions, and specialist recommendations."
    },
    {
        icon: "fa-solid fa-user-doctor",
        color: "yellow",
        title: "Human Doctor Handoff",
        desc: "Seamlessly share your AI report with a verified specialist for final diagnosis."
    },
    {
        icon: "fa-solid fa-notes-medical",
        color: "purple",
        title: "Symptom Tracking",
        desc: "Monitor the progression of your symptoms over time with smart logging."
    },
    {
        icon: "fa-solid fa-shield-halved",
        color: "red",
        title: "Data Privacy",
        desc: "Your consultations are private and encrypted. We prioritize your confidentiality."
    },
    {
        icon: "fa-solid fa-clock",
        color: "indigo",
        title: "24/7 Availability",
        desc: "Dr. Sarah never sleeps. Get medical guidance whenever you need it, day or night."
    }
];

export default function Services() {
    const headerRef = useScrollReveal();
    const gridRef = useScrollReveal();

    const getColorClasses = (color: string) => {
        const map: Record<string, string> = {
            blue: "bg-blue-100 text-blue-600",
            green: "bg-green-100 text-green-600",
            yellow: "bg-yellow-100 text-yellow-600",
            purple: "bg-purple-100 text-purple-600",
            red: "bg-red-100 text-red-600",
            indigo: "bg-indigo-100 text-indigo-600",
        };
        return map[color] || "bg-gray-100 text-gray-600";
    };

    return (
        <section id="services" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16 reveal">
                    <h2 className="text-brand-600 font-semibold tracking-wide uppercase text-2xl mb-10">Our Services</h2>
                    <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Complete Care Cycle</h3>
                    <p className="text-gray-600 text-lg">From initial AI assessment to professional medical care, we cover every step of your health journey.</p>
                </div>

                <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 reveal">
                    {services.map((service, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform ${getColorClasses(service.color)}`}>
                                <i className={service.icon}></i>
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h4>
                            <p className="text-gray-600">{service.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
