"use client";

import Navbar from "@/components/landing-page/Navbar";
import HeroSection from "@/components/landing-page/HeroSection";
import WhyChooseSection from "@/components/landing-page/WhyChooseSection";
import TestimonialsSection from "@/components/landing-page/TestimonialsSection";
import OurProcessSection from "@/components/landing-page/OurProcessSection";
import ServicesSection from "@/components/landing-page/ServicesSection";
import TopExpertsSection from "@/components/landing-page/TopExpertsSection";
import MobileAppSection from "@/components/landing-page/MobileAppSection";
import PricingSection from "@/components/landing-page/PricingSection";
import FaqSection from "@/components/landing-page/FaqSection";
import CtaSection from "@/components/landing-page/CtaSection";
import Footer from "@/components/landing-page/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden relative">
      <Navbar />
      <HeroSection />
      <WhyChooseSection />
      <TestimonialsSection />
      {/* <OurProcessSection /> */}
      <ServicesSection />
      <TopExpertsSection />
      <MobileAppSection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
