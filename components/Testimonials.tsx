"use client";

import { useScrollReveal } from "../hooks/useScrollReveal";

const reviews = [
    {
        stars: 5,
        text: "The video quality was excellent and the doctor was incredibly attentive. I received my prescription digitally within minutes. Truly efficient!",
        name: "Priya S.",
        role: "Verified Patient",
        img: "https://picsum.photos/seed/priya/100/100"
    },
    {
        stars: 5,
        text: "As a doctor, this platform streamlined my workflow significantly. The AI assistant for case summaries saves me hours of paperwork every week.",
        name: "Dr. Rajesh Kumar",
        role: "Cardiologist",
        img: "https://picsum.photos/seed/doctor_male/100/100"
    },
    {
        stars: 4.5,
        text: "I was worried about my symptoms late at night. The Symptom Checker gave me peace of mind and helped me decide if I needed urgent care.",
        name: "Amit P.",
        role: "Verified Patient",
        img: "https://picsum.photos/seed/amit/100/100"
    }
];

export default function Testimonials() {
    const headerRef = useScrollReveal();
    const gridRef = useScrollReveal();

    return (
        <section id="testimonials" className="py-20 bg-brand-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16 reveal">
                    <h2 className="text-brand-600 font-semibold tracking-wide uppercase text-2xl mb-10">Testimonials</h2>
                    <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Trusted by Patients & Doctors</h3>
                    <p className="text-gray-600 text-lg">Don't just take our word for it. Here is what our community has to say.</p>
                </div>

                <div ref={gridRef} className="grid md:grid-cols-3 gap-8 reveal">
                    {reviews.map((review, i) => (
                        <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-1 text-yellow-400 mb-4 text-sm">
                                {[...Array(5)].map((_, starIndex) => (
                                    <i key={starIndex} className={`fa-solid ${starIndex < Math.floor(review.stars) ? 'fa-star' : (review.stars % 1 !== 0 && starIndex === Math.floor(review.stars) ? 'fa-star-half-stroke' : 'fa-star text-gray-300')}`}></i>
                                ))}
                            </div>
                            <p className="text-gray-600 italic mb-6">"{review.text}"</p>
                            <div className="flex items-center gap-4">
                                <img src={review.img} alt={review.name} className="w-12 h-12 rounded-full object-cover" />
                                <div>
                                    <h5 className="font-bold text-gray-900">{review.name}</h5>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">{review.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
