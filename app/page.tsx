"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Services from "../components/Services";
import HowItWorks from "../components/HowItWorks";
import AIFeatures from "../components/AIFeatures";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import BookingModal from "../components/BookingModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <main className="min-h-screen bg-white">
      <Navbar onOpenModal={openModal} />
      <Hero onOpenModal={openModal} />
      <Stats />
      <Services />
      <HowItWorks />
      <AIFeatures />
      <Testimonials />
      <CTA onOpenModal={openModal} />
      <Footer />
      <BookingModal isOpen={isModalOpen} onClose={closeModal} />
    </main>
  );
}
