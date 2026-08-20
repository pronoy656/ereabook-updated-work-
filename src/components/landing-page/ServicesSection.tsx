"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { LayoutGrid, Scale, Briefcase, Users, TrendingUp, DollarSign, ChevronRight, CheckCircle2, ArrowRight, Heart, ClipboardList } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Categories', icon: LayoutGrid },
  { id: 'legal', label: 'Legal', icon: Scale },
  { id: 'business', label: 'Business', icon: Briefcase },
  { id: 'relationships', label: 'Relationships', icon: Users },
  { id: 'career', label: 'Career', icon: TrendingUp },
  { id: 'finance', label: 'Finance', icon: DollarSign },
];

const SERVICES = [
  {
    id: "legal",
    category: "legal",
    title: "Legal Advice",
    description: "Get clarity on your legal matters from experienced lawyers.",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80",
    icon: Scale,
    iconColor: "text-purple-600",
    checkColor: "text-purple-500",
    shadowHover: "hover:shadow-[0_15px_35px_rgba(147,51,234,0.08)] hover:border-purple-200",
    btnColor: "text-purple-600",
    bulletPoints: ["Contracts & Agreements", "Family Law", "Property Disputes"]
  },
  {
    id: "business",
    category: "business",
    title: "Business Consulting",
    description: "Grow your business with strategic advice from industry experts.",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80",
    icon: Briefcase,
    iconColor: "text-emerald-600",
    checkColor: "text-emerald-500",
    shadowHover: "hover:shadow-[0_15px_35px_rgba(16,185,129,0.08)] hover:border-emerald-200",
    btnColor: "text-emerald-600",
    bulletPoints: ["Business Strategy", "Operations Management", "Startup Guidance"]
  },
  {
    id: "relationships",
    category: "relationships",
    title: "Relationship Advice",
    description: "Improve relationships and build stronger connections.",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&auto=format&fit=crop&q=80",
    icon: Heart,
    iconColor: "text-amber-500",
    checkColor: "text-amber-500",
    shadowHover: "hover:shadow-[0_15px_35px_rgba(245,158,11,0.08)] hover:border-amber-200",
    btnColor: "text-amber-600",
    bulletPoints: ["Marriage Counseling", "Communication Issues", "Relationship Coaching"]
  },
  {
    id: "career",
    category: "career",
    title: "Career Coaching",
    description: "Advance your career with personalized coaching and guidance.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80",
    icon: TrendingUp,
    iconColor: "text-blue-600",
    checkColor: "text-blue-600",
    shadowHover: "hover:shadow-[0_15px_35px_rgba(37,99,235,0.08)] hover:border-blue-200",
    btnColor: "text-blue-600",
    bulletPoints: ["Career Planning", "Resume & LinkedIn Review", "Interview Preparation"]
  },
  {
    id: "finance",
    category: "finance",
    title: "Finance & Wealth",
    description: "Optimize your finances and build long-term wealth stability.",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80",
    icon: DollarSign,
    iconColor: "text-indigo-600",
    checkColor: "text-indigo-500",
    shadowHover: "hover:shadow-[0_15px_35px_rgba(99,102,241,0.08)] hover:border-indigo-200",
    btnColor: "text-indigo-600",
    bulletPoints: ["Tax & Investment Planning", "Wealth Management", "Retirement Strategy"]
  }
];

export default function ServicesSection() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredServices = activeCategory === 'all'
    ? SERVICES
    : SERVICES.filter(service => service.category === activeCategory);

  const cycleCategory = () => {
    const currentIndex = CATEGORIES.findIndex(cat => cat.id === activeCategory);
    const nextIndex = (currentIndex + 1) % CATEGORIES.length;
    setActiveCategory(CATEGORIES[nextIndex].id);
  };

  return (
    <section id="services" className="container mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-24 relative z-10 scroll-mt-20">
      
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-10">
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xss font-bold tracking-wider uppercase mb-4 shadow-sm border border-slate-200">
          Our Services
        </div>
        <h2 className="text-4xl lg:text-[2.75rem] font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
          Expertise for <span className="text-blue-600">every area of life</span>
        </h2>
        <p className="text-base text-slate-600 font-medium max-w-lg mx-auto leading-relaxed">
          Get professional guidance across a wide range of categories from trusted experts.
        </p>
      </div>

      {/* Category Navigation Filter Pills */}
      <div className="flex items-center justify-center mb-12">
        <div className="bg-white rounded-2xl p-1.5 border border-slate-200 shadow-[0_2px_12px_rgba(15,23,42,0.04)] flex items-center gap-1 sm:gap-2 flex-wrap sm:flex-nowrap">
          
          {CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;

            return (
              <React.Fragment key={cat.id}>
                <button
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/25 scale-[1.02]'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
                  <span>{cat.label}</span>
                </button>

                {idx < CATEGORIES.length - 1 && (
                  <div className="w-px h-5 bg-slate-200 hidden sm:block mx-0.5" />
                )}
              </React.Fragment>
            );
          })}

          {/* Right Arrow Button to Cycle Categories */}
          <button 
            onClick={cycleCategory}
            title="Next Category"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-600 hover:text-white flex items-center justify-center text-slate-600 transition-all ml-1 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>
      </div>

      {/* Service Cards Grid */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${filteredServices.length >= 4 ? 'lg:grid-cols-4' : filteredServices.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-6 transition-all duration-300`}>
        
        {filteredServices.map((service) => {
          const Icon = service.icon;

          return (
            <div 
              key={service.id} 
              className={`bg-white rounded-3xl border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.04)] ${service.shadowHover} transition-all duration-300 flex flex-col overflow-hidden group hover:-translate-y-1`}
            >
              {/* Card Image */}
              <div className="relative w-full h-44 overflow-hidden bg-slate-100">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              {/* Floating Icon Badge */}
              <div className="px-6 relative">
                <div className={`w-12 h-12 rounded-2xl bg-white border border-slate-200 ${service.iconColor} shadow-md flex items-center justify-center -mt-6 relative z-10`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6 pt-3 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1.5">{service.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4 min-h-[38px]">
                    {service.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    {service.bulletPoints.map((point, i) => (
                      <div key={i} className="flex items-center gap-2 text-[12px] font-medium text-slate-600">
                        <CheckCircle2 className={`w-4 h-4 ${service.checkColor} shrink-0`} />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link href="#" className={`inline-flex items-center gap-1.5 text-sm font-bold ${service.btnColor} group-hover:gap-2.5 transition-all`}>
                  Find an Expert <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}

      </div>

      {/* Can't find what you need? Banner */}
      <div className="bg-gradient-to-r from-[#F5F8FE] via-white to-[#F5F8FE] rounded-3xl border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 mt-14 shadow-[0_4px_25px_rgba(15,23,42,0.03)]">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-sm">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h4 className="text-[17px] font-bold text-slate-900 mb-0.5">Can&apos;t find what you need?</h4>
            <p className="text-sm text-slate-600">
              Our experts cover 100+ areas of expertise. Tell us what you&apos;re looking for.
            </p>
          </div>
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-xl text-sm font-bold transition-all shadow-[0_4px_14px_rgba(37,99,235,0.25)] shrink-0 flex items-center gap-2 cursor-pointer">
          Request Custom Consultation
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </section>
  );
}

