"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Star, Calendar, Users, Bot, Zap } from 'lucide-react';

const EXPERTS_EN = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Senior Legal Consultant",
    category: "Legal Advice",
    categoryBg: "bg-purple-50 text-purple-700",
    rating: 4.9,
    reviews: "128 reviews",
    exp: "8+ years exp.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    tags: ["Contracts", "Disputes", "Corporate Law"]
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Business Strategist",
    category: "Business Consulting",
    categoryBg: "bg-emerald-50 text-emerald-700",
    rating: 4.8,
    reviews: "96 reviews",
    exp: "10+ years exp.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    tags: ["Strategy", "Operations", "Growth"]
  },
  {
    id: 3,
    name: "Emily Davis",
    role: "Relationship Coach",
    category: "Relationship Advice",
    categoryBg: "bg-amber-50 text-amber-700",
    rating: 4.9,
    reviews: "112 reviews",
    exp: "6+ years exp.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
    tags: ["Communication", "Marriage", "Counseling"]
  },
  {
    id: 4,
    name: "David Wilson",
    role: "Career Coach",
    category: "Career Coaching",
    categoryBg: "bg-blue-50 text-blue-700",
    rating: 4.8,
    reviews: "76 reviews",
    exp: "7+ years exp.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    tags: ["Career Growth", "Resume", "Interview Prep"]
  },
  {
    id: 5,
    name: "Dr. Marcus Vance",
    role: "Financial Advisor",
    category: "Finance & Wealth",
    categoryBg: "bg-emerald-50 text-emerald-700",
    rating: 5.0,
    reviews: "142 reviews",
    exp: "12+ years exp.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
    tags: ["Tax Planning", "Investments", "Wealth"]
  },
  {
    id: 6,
    name: "Sophia Martinez",
    role: "Leadership Coach",
    category: "Business Consulting",
    categoryBg: "bg-purple-50 text-purple-700",
    rating: 4.9,
    reviews: "89 reviews",
    exp: "9+ years exp.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    tags: ["Leadership", "Management", "Negotiation"]
  }
];

const EXPERTS_DE = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Senior Rechtsberaterin",
    category: "Rechtsberatung",
    categoryBg: "bg-purple-50 text-purple-700",
    rating: 4.9,
    reviews: "128 Bewertungen",
    exp: "8+ Jahre Erf.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    tags: ["Verträge", "Streitigkeiten", "Unternehmensrecht"]
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Unternehmensstratege",
    category: "Unternehmensberatung",
    categoryBg: "bg-emerald-50 text-emerald-700",
    rating: 4.8,
    reviews: "96 Bewertungen",
    exp: "10+ Jahre Erf.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    tags: ["Strategie", "Prozesse", "Wachstum"]
  },
  {
    id: 3,
    name: "Emily Davis",
    role: "Partnerschafts-Coach",
    category: "Partnerschaftsberatung",
    categoryBg: "bg-amber-50 text-amber-700",
    rating: 4.9,
    reviews: "112 Bewertungen",
    exp: "6+ Jahre Erf.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
    tags: ["Kommunikation", "Eheberatung", "Mediation"]
  },
  {
    id: 4,
    name: "David Wilson",
    role: "Karriere-Coach",
    category: "Karriere-Coaching",
    categoryBg: "bg-blue-50 text-blue-700",
    rating: 4.8,
    reviews: "76 Bewertungen",
    exp: "7+ Jahre Erf.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    tags: ["Bewerbung", "Gehaltsverhandlung", "Führung"]
  },
  {
    id: 5,
    name: "Dr. Marcus Vance",
    role: "Finanzberater",
    category: "Finanzen & Vermögen",
    categoryBg: "bg-emerald-50 text-emerald-700",
    rating: 5.0,
    reviews: "142 Bewertungen",
    exp: "12+ Jahre Erf.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
    tags: ["Steuerplanung", "Investitionen", "Vermögen"]
  },
  {
    id: 6,
    name: "Sophia Martinez",
    role: "Führungskräfte-Coach",
    category: "Unternehmensberatung",
    categoryBg: "bg-purple-50 text-purple-700",
    rating: 4.9,
    reviews: "89 Bewertungen",
    exp: "9+ Jahre Erf.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    tags: ["Führung", "Management", "Verhandlung"]
  }
];

import { useLandingLanguage } from '@/context/LandingLanguageContext';

export default function TopExpertsSection() {
  const [expertIdx, setExpertIdx] = useState(0);
  const { locale, t } = useLandingLanguage();
  const expertsList = locale === 'de' ? EXPERTS_DE : EXPERTS_EN;

  const maxExpertIdx = Math.max(0, expertsList.length - 4);
  const nextExpert = () => setExpertIdx(p => (p >= maxExpertIdx ? 0 : p + 1));
  const prevExpert = () => setExpertIdx(p => (p <= 0 ? maxExpertIdx : p - 1));

  return (
    <section id="experts" className="container mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-24 relative z-10 scroll-mt-20">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex flex-col items-start">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xss font-bold tracking-wider uppercase mb-4 border border-slate-200 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            {t('experts.badge')}
          </div>
          <h2 className="text-3xl lg:text-[2.6rem] font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            {t('experts.title_1')} <span className="text-blue-600">{t('experts.title_2')}</span>
          </h2>
          <p className="text-sm text-slate-600 font-normal max-w-md mt-2 leading-relaxed">
            {t('experts.subtitle')}
          </p>
        </div>

        <Link href="#" className="inline-flex items-center gap-2 bg-white border border-blue-600/40 hover:border-blue-600 hover:bg-blue-50/50 text-blue-600 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm shrink-0">
          {t('experts.view_all')}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Carousel Container with Left/Right Arrow Buttons */}
      <div className="relative">
        
        {/* Navigation Arrows */}
        <button 
          onClick={prevExpert}
          aria-label="Previous expert"
          className="hidden sm:flex absolute -left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-[0_4px_15px_rgba(0,0,0,0.08)] border border-slate-200 items-center justify-center text-slate-700 hover:text-blue-600 hover:scale-110 active:scale-95 transition-all z-20 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={nextExpert}
          aria-label="Next expert"
          className="hidden sm:flex absolute -right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-[0_4px_15px_rgba(0,0,0,0.08)] border border-slate-200 items-center justify-center text-slate-700 hover:text-blue-600 hover:scale-110 active:scale-95 transition-all z-20 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Expert Cards Animated Slider */}
        <div className="overflow-hidden py-2 px-1">
          <div 
            className="flex transition-transform duration-500 ease-out gap-6"
            style={{ transform: `translateX(-${expertIdx * (100 / 4 + 1.5)}%)` }}
          >
            {expertsList.map((expert) => (
              <div 
                key={expert.id} 
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] shrink-0 bg-white rounded-3xl border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.04)] hover:shadow-[0_15px_35px_rgba(37,99,235,0.08)] hover:border-blue-200 transition-all duration-300 p-6 flex flex-col justify-between group"
              >
                <div>
                  {/* Header row: Pill & Verified Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`${expert.categoryBg} text-xss font-bold px-2.5 py-1 rounded-md`}>
                      {expert.category}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Avatar & Name */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                      <img 
                        src={expert.image} 
                        alt={expert.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-[17px] font-bold text-slate-900 leading-tight mb-1">{expert.name}</h3>
                      <span className="text-[12px] text-slate-600 font-medium">{expert.role}</span>
                    </div>
                  </div>

                  {/* Rating & Exp Row */}
                  <div className="flex items-center gap-2 text-[12px] text-slate-600 mb-5">
                    <div className="flex items-center gap-1 font-bold text-slate-900">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{expert.rating}</span>
                    </div>
                    <span className="text-slate-400">({expert.reviews})</span>
                    <span className="text-slate-300">|</span>
                    <span className="font-medium text-slate-900">{expert.exp}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {expert.tags.map((tag, idx) => (
                      <span key={idx} className="bg-slate-50 text-slate-600 text-xss font-medium px-2.5 py-1 rounded-lg border border-slate-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Link */}
                <Link 
                  href={`/experts/${expert.id}`} 
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 group-hover:gap-2.5 transition-all pt-2 border-t border-slate-100 cursor-pointer"
                >
                  View Profile <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Indicator Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: maxExpertIdx + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setExpertIdx(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                expertIdx === idx 
                  ? "w-6 h-2 bg-blue-600" 
                  : "w-2 h-2 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>

      </div>

      {/* Can't find the right expert? Crisp White Compact 3D Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#F4F8FE] via-white to-[#F4F8FE] border border-slate-200/90 p-5 sm:p-6 lg:py-6 lg:px-10 mt-10 shadow-[0_10px_30px_rgba(15,23,42,0.04)] group hover:shadow-[0_15px_40px_rgba(37,99,235,0.08)] hover:border-blue-200 transition-all duration-300">
        
        {/* Soft Background Ambient Glow */}
        <div className="absolute -top-16 -left-16 w-60 h-60 bg-blue-400/10 rounded-full blur-[70px] pointer-events-none group-hover:bg-blue-400/15 transition-all duration-500" />
        <div className="absolute -bottom-16 -right-16 w-60 h-60 bg-indigo-400/10 rounded-full blur-[70px] pointer-events-none group-hover:bg-indigo-400/15 transition-all duration-500" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left: 3D Robot Orb + Text */}
          <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-5 sm:gap-6">
            
            {/* 3D Glossy Robot Sphere with Floating 3D Badges */}
            <div className="relative shrink-0 my-1">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4)] flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center relative overflow-hidden shadow-inner">
                  {/* 3D Glass Specular Highlight */}
                  <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-full pointer-events-none" />
                  {/* 3D Radial Glow */}
                  <div className="absolute bottom-0 right-0 w-8 h-8 bg-cyan-400/30 rounded-full blur-md pointer-events-none" />
                  
                  {/* 3D Robot Face Icon */}
                  <Bot className="w-9 h-9 sm:w-10 sm:h-10 text-white relative z-10 drop-shadow-[0_4px_6px_rgba(0,0,0,0.25)]" />
                </div>
              </div>

              {/* Floating 3D Micro Badge 1 (Calendar) */}
              <div className="absolute -top-1 -left-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white border border-slate-100 shadow-[0_4px_10px_rgba(0,0,0,0.12)] text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>

              {/* Floating 3D Micro Badge 2 (ShieldCheck) */}
              <div className="absolute -top-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white border border-slate-100 shadow-[0_4px_10px_rgba(0,0,0,0.12)] text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>

              {/* Floating 3D Micro Badge 3 (Users) */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white border border-slate-100 shadow-[0_4px_10px_rgba(0,0,0,0.12)] text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>
            </div>

            {/* Headline & Description */}
            <div className="flex flex-col">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {t('experts.cant_find_title')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 leading-normal max-w-md">
                {t('experts.cant_find_desc')}
              </p>
            </div>

          </div>

          {/* Right: CTA Button & Trust Subtext */}
          <div className="flex flex-col items-center sm:items-end shrink-0 w-full md:w-auto">
            <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl text-sm font-bold transition-all shadow-[0_4px_16px_rgba(37,99,235,0.25)] hover:shadow-[0_8px_24px_rgba(37,99,235,0.35)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer">
              <span>{t('experts.request_consultation')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>{t('experts.no_commitment')}</span>
              <span className="text-slate-300">•</span>
              <span>{t('experts.free_100')}</span>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
