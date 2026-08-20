"use client";

import React from 'react';
import { ShieldCheck, Lock, Users, Zap, MessageSquare } from 'lucide-react';

export default function WhyChooseSection() {
  return (
    <section className="container mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-20 relative z-10">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12 lg:gap-16">
        
        {/* Left Content */}
        <div className="space-y-6 lg:w-[45%] flex flex-col items-start">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold tracking-wider uppercase">
            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-blue-600" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 13L2 9Z"/></svg>
            Why Choose Fixpair
          </div>

          <h2 className="text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Why thousands <br />
            trust <span className="text-blue-600">Fixpair</span>
          </h2>

          <p className="text-base text-slate-600 leading-relaxed max-w-md font-normal">
            We make professional advice simple, secure, and effective—so you can focus on what matters most.
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900 leading-tight">Verified Professionals</span>
                <span className="text-xs text-slate-600 leading-snug">Every expert is carefully<br className="hidden sm:block" /> screened and verified.</span>
              </div>
            </div>

            <div className="w-px h-10 bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900 leading-tight">100% Confidential</span>
                <span className="text-xs text-slate-600 leading-snug">Your conversations and<br className="hidden sm:block" /> data are always protected.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 2x2 Feature Grid */}
        <div className="lg:w-[55%] w-full relative">
          
          {/* Center Dot Grid Matrix */}
          <div className="absolute -top-6 -left-10 z-0 hidden sm:grid grid-cols-5 gap-2.5 opacity-40">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 relative z-10">
            
            {/* Card 1: Top-Rated Experts */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-md hover:shadow-xl hover:border-blue-200 transition-all duration-300 relative overflow-hidden flex flex-col items-start">
              <svg viewBox="0 0 100 25" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-16 pointer-events-none"><path d="M0,15 C30,-5 70,25 100,5 L100,25 L0,25 Z" fill="#EEF5FF"/></svg>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 shrink-0 relative z-10">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5 relative z-10">Top-Rated Experts</h3>
              <p className="text-sm text-slate-600 leading-relaxed relative z-10">
                Access professionals with proven experience and excellent ratings.
              </p>
            </div>

            {/* Card 2: Quick & Easy Process */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-md hover:shadow-xl hover:border-purple-200 transition-all duration-300 relative overflow-hidden flex flex-col items-start">
              <svg viewBox="0 0 100 25" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-16 pointer-events-none"><path d="M0,5 C40,25 60,-5 100,15 L100,25 L0,25 Z" fill="#F5F3FF"/></svg>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 shrink-0 relative z-10">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5 relative z-10">Quick &amp; Easy Process</h3>
              <p className="text-sm text-slate-600 leading-relaxed relative z-10">
                Find the right expert and book a session in just a few clicks.
              </p>
            </div>

            {/* Card 3: Personalized Guidance */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-md hover:shadow-xl hover:border-amber-200 transition-all duration-300 relative overflow-hidden flex flex-col items-start">
              <svg viewBox="0 0 100 25" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-16 pointer-events-none"><path d="M0,20 C30,-5 70,-5 100,20 L100,25 L0,25 Z" fill="#FFFBEB"/></svg>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mb-4 shrink-0 relative z-10">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5 relative z-10">Personalized Guidance</h3>
              <p className="text-sm text-slate-600 leading-relaxed relative z-10">
                Get tailored advice and reports that fit your unique needs.
              </p>
            </div>

            {/* Card 4: Safe & Secure */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-md hover:shadow-xl hover:border-emerald-200 transition-all duration-300 relative overflow-hidden flex flex-col items-start">
              <svg viewBox="0 0 100 25" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-16 pointer-events-none"><path d="M0,10 C40,30 60,-5 100,10 L100,25 L0,25 Z" fill="#ECFDF5"/></svg>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4 shrink-0 relative z-10">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5 relative z-10">Safe &amp; Secure</h3>
              <p className="text-sm text-slate-600 leading-relaxed relative z-10">
                End-to-end encrypted sessions for your complete peace of mind.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
