'use client'
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Services from "../components/Services";
import HowItWorks from "../components/HowItWorks";
import AIFeatures from "../components/AIFeatures";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import ConsultModal from "@/components/ConsultModal";

export default function Home() {
  const isVisible = useSelector((state) => (state as any).visibility.value as boolean)

  return (
    <main className="min-h-screen bg-white">
      <ConsultModal isVisible={isVisible} />
      <Navbar />
      <Hero />
      <Stats />
      <Services />
      <HowItWorks />
      <AIFeatures />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
