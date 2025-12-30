"use client";

import { useScrollReveal } from "../hooks/useScrollReveal";

const services = [
    {
        icon: "fa-solid fa-video",
        color: "blue",
        title: "Video Consultations",
        desc: "Face-to-face doctor meetings via secure, high-definition video calls from any device."
    },
    {
        icon: "fa-solid fa-file-prescription",
        color: "green",
        title: "Digital Prescriptions",
        desc: "Electronically signed prescriptions delivered instantly to your pharmacy of choice."
    },
    {
        icon: "fa-solid fa-folder-medical",
        color: "yellow",
        title: "Medical Records",
        desc: "Centralized, secure storage for all your health documents and test results."
    },
    {
        icon: "fa-regular fa-calendar-check",
        color: "purple",
        title: "Easy Booking",
        desc: "Search doctors by specialty and book appointments in real-time without waiting."
    },
    {
        icon: "fa-solid fa-pills",
        color: "red",
        title: "Drug Interaction Checker",
        desc: "Automated safety alerts instantly warn you about potential medication conflicts."
    },
    {
        icon: "fa-solid fa-lock",
        color: "indigo",
        title: "HIPAA-Grade Security",
        desc: "Military-grade encryption ensures your personal data remains completely private."
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
                    <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Everything You Need for Better Health</h3>
                    <p className="text-gray-600 text-lg">A comprehensive suite of medical tools designed to bring the hospital experience to your living room.</p>
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
