"use client";

import React from 'react';
import Link from 'next/link';
import { LayoutGrid, Scale, Briefcase, Users, TrendingUp, DollarSign, ChevronRight, CheckCircle2, ArrowRight, Heart, ClipboardList } from 'lucide-react';

export default function ServicesSection() {
  return (
    <section className="container mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-24 relative z-10">
      
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
          
          {/* Tab 1: Active */}
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 text-sm font-bold shadow-sm transition-all cursor-pointer">
            <LayoutGrid className="w-4 h-4" />
            <span>All Categories</span>
          </button>

          <div className="w-px h-5 bg-slate-200 hidden sm:block mx-1" />

          {/* Tab 2: Legal */}
          <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-50 text-sm font-semibold transition-all cursor-pointer">
            <Scale className="w-4 h-4" />
            <span>Legal</span>
          </button>

          <div className="w-px h-5 bg-slate-200 hidden sm:block mx-1" />

          {/* Tab 3: Business */}
          <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-50 text-sm font-semibold transition-all cursor-pointer">
            <Briefcase className="w-4 h-4" />
            <span>Business</span>
          </button>

          <div className="w-px h-5 bg-slate-200 hidden sm:block mx-1" />

          {/* Tab 4: Relationships */}
          <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-50 text-sm font-semibold transition-all cursor-pointer">
            <Users className="w-4 h-4" />
            <span>Relationships</span>
          </button>

          <div className="w-px h-5 bg-slate-200 hidden sm:block mx-1" />

          {/* Tab 5: Career */}
          <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-50 text-sm font-semibold transition-all cursor-pointer">
            <TrendingUp className="w-4 h-4" />
            <span>Career</span>
          </button>

          <div className="w-px h-5 bg-slate-200 hidden sm:block mx-1" />

          {/* Tab 6: Finance */}
          <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-50 text-sm font-semibold transition-all cursor-pointer">
            <DollarSign className="w-4 h-4" />
            <span>Finance</span>
          </button>

          {/* Right Arrow Button */}
          <button className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors ml-1 cursor-pointer">
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>
      </div>

      {/* 4 Service Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Legal Advice */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.04)] hover:shadow-[0_15px_35px_rgba(37,99,235,0.08)] hover:border-blue-200 transition-all duration-300 flex flex-col overflow-hidden group">
          {/* Card Image */}
          <div className="relative w-full h-44 overflow-hidden bg-slate-100">
            <img 
              src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80" 
              alt="Legal Advice" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          
          {/* Floating Icon Badge */}
          <div className="px-6 relative">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-purple-600 shadow-md flex items-center justify-center -mt-6 relative z-10">
              <Scale className="w-5 h-5" />
            </div>
          </div>

          {/* Content */}
          <div className="p-6 pt-3 flex flex-col flex-grow justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1.5">Legal Advice</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4 min-h-[38px]">
                Get clarity on your legal matters from experienced lawyers.
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-[12px] font-medium text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                  <span>Contracts &amp; Agreements</span>
                </div>
                <div className="flex items-center gap-2 text-[12px] font-medium text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                  <span>Family Law</span>
                </div>
                <div className="flex items-center gap-2 text-[12px] font-medium text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                  <span>Property Disputes</span>
                </div>
              </div>
            </div>

            <Link href="#" className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 group-hover:gap-2.5 transition-all">
              Find an Expert <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Card 2: Business Consulting */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.04)] hover:shadow-[0_15px_35px_rgba(16,185,129,0.08)] hover:border-emerald-200 transition-all duration-300 flex flex-col overflow-hidden group">
          {/* Card Image */}
          <div className="relative w-full h-44 overflow-hidden bg-slate-100">
            <img 
              src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80" 
              alt="Business Consulting" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          
          {/* Floating Icon Badge */}
          <div className="px-6 relative">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-emerald-600 shadow-md flex items-center justify-center -mt-6 relative z-10">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>

          {/* Content */}
          <div className="p-6 pt-3 flex flex-col flex-grow justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1.5">Business Consulting</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4 min-h-[38px]">
                Grow your business with strategic advice from industry experts.
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-[12px] font-medium text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Business Strategy</span>
                </div>
                <div className="flex items-center gap-2 text-[12px] font-medium text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Operations Management</span>
                </div>
                <div className="flex items-center gap-2 text-[12px] font-medium text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Startup Guidance</span>
                </div>
              </div>
            </div>

            <Link href="#" className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 group-hover:gap-2.5 transition-all">
              Find an Expert <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Card 3: Relationship Advice */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.04)] hover:shadow-[0_15px_35px_rgba(245,158,11,0.08)] hover:border-amber-200 transition-all duration-300 flex flex-col overflow-hidden group">
          {/* Card Image */}
          <div className="relative w-full h-44 overflow-hidden bg-slate-100">
            <img 
              src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&auto=format&fit=crop&q=80" 
              alt="Relationship Advice" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          
          {/* Floating Icon Badge */}
          <div className="px-6 relative">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-amber-500 shadow-md flex items-center justify-center -mt-6 relative z-10">
              <Heart className="w-5 h-5" />
            </div>
          </div>

          {/* Content */}
          <div className="p-6 pt-3 flex flex-col flex-grow justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1.5">Relationship Advice</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4 min-h-[38px]">
                Improve relationships and build stronger connections.
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-[12px] font-medium text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Marriage Counseling</span>
                </div>
                <div className="flex items-center gap-2 text-[12px] font-medium text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Communication Issues</span>
                </div>
                <div className="flex items-center gap-2 text-[12px] font-medium text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Relationship Coaching</span>
                </div>
              </div>
            </div>

            <Link href="#" className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-600 group-hover:gap-2.5 transition-all">
              Find an Expert <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Card 4: Career Coaching */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.04)] hover:shadow-[0_15px_35px_rgba(37,99,235,0.08)] hover:border-blue-200 transition-all duration-300 flex flex-col overflow-hidden group">
          {/* Card Image */}
          <div className="relative w-full h-44 overflow-hidden bg-slate-100">
            <img 
              src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80" 
              alt="Career Coaching" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          
          {/* Floating Icon Badge */}
          <div className="px-6 relative">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-blue-600 shadow-md flex items-center justify-center -mt-6 relative z-10">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          {/* Content */}
          <div className="p-6 pt-3 flex flex-col flex-grow justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1.5">Career Coaching</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4 min-h-[38px]">
                Advance your career with personalized coaching and guidance.
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-[12px] font-medium text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Career Planning</span>
                </div>
                <div className="flex items-center gap-2 text-[12px] font-medium text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Resume &amp; LinkedIn Review</span>
                </div>
                <div className="flex items-center gap-2 text-[12px] font-medium text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Interview Preparation</span>
                </div>
              </div>
            </div>

            <Link href="#" className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 group-hover:gap-2.5 transition-all">
              Find an Expert <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

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
