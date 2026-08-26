"use client";

import { LandingLanguageProvider } from "@/context/LandingLanguageContext";
import Navbar from "@/components/landing-page/Navbar";
import HeroSection from "@/components/landing-page/HeroSection";
import WhyChooseSection from "@/components/landing-page/WhyChooseSection";
import TestimonialsSection from "@/components/landing-page/TestimonialsSection";
import ServicesSection from "@/components/landing-page/ServicesSection";
import TopExpertsSection from "@/components/landing-page/TopExpertsSection";
import MobileAppSection from "@/components/landing-page/MobileAppSection";
import PricingSection from "@/components/landing-page/PricingSection";
import FaqSection from "@/components/landing-page/FaqSection";
import Footer from "@/components/landing-page/Footer";

export default function Home() {
  return (
    <LandingLanguageProvider>
      <div className="min-h-screen bg-white font-sans text-slate-900 relative">
        <Navbar />
        <HeroSection />
        <WhyChooseSection />
        <TestimonialsSection />
        <ServicesSection />
        <TopExpertsSection />
        <MobileAppSection />
        <PricingSection />
        <FaqSection />
        <Footer />
      </div>
    </LandingLanguageProvider>
  );
}
