"use client";

import React from 'react';
import { ShieldCheck, Lock, Users, Zap, MessageSquare } from 'lucide-react';
import { useLandingLanguage } from '@/context/LandingLanguageContext';

export default function WhyChooseSection() {
  const { t } = useLandingLanguage();

  return (
    <section id="why-choose-us" className="container mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-20 relative z-10 scroll-mt-20">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12 lg:gap-16">
        
        {/* Left Content */}
        <div className="space-y-6 lg:w-[45%] flex flex-col items-start">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold tracking-wider uppercase">
            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-blue-600" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 13L2 9Z"/></svg>
            {t('why.badge')}
          </div>

          <h2 className="text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            {t('why.title_1')} <br />
            <span className="text-blue-600">Fixpair</span>
          </h2>

          <p className="text-base text-slate-600 leading-relaxed max-w-md font-normal">
            {t('why.subtitle')}
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900 leading-tight">{t('why.verified_title')}</span>
                <span className="text-xs text-slate-600 leading-snug">{t('why.verified_desc')}</span>
              </div>
            </div>

            <div className="w-px h-10 bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900 leading-tight">{t('why.confidential_title')}</span>
                <span className="text-xs text-slate-600 leading-snug">{t('why.confidential_desc')}</span>
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
              <h3 className="text-base font-bold text-slate-900 mb-1.5 relative z-10">{t('why.card_1_title')}</h3>
              <p className="text-sm text-slate-600 leading-relaxed relative z-10">
                {t('why.card_1_desc')}
              </p>
            </div>

            {/* Card 2: Quick & Easy Process */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-md hover:shadow-xl hover:border-purple-200 transition-all duration-300 relative overflow-hidden flex flex-col items-start">
              <svg viewBox="0 0 100 25" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-16 pointer-events-none"><path d="M0,5 C40,25 60,-5 100,15 L100,25 L0,25 Z" fill="#F5F3FF"/></svg>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 shrink-0 relative z-10">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5 relative z-10">{t('why.card_2_title')}</h3>
              <p className="text-sm text-slate-600 leading-relaxed relative z-10">
                {t('why.card_2_desc')}
              </p>
            </div>

            {/* Card 3: Personalized Guidance */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-md hover:shadow-xl hover:border-amber-200 transition-all duration-300 relative overflow-hidden flex flex-col items-start">
              <svg viewBox="0 0 100 25" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-16 pointer-events-none"><path d="M0,20 C30,-5 70,-5 100,20 L100,25 L0,25 Z" fill="#FFFBEB"/></svg>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mb-4 shrink-0 relative z-10">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5 relative z-10">{t('why.card_3_title')}</h3>
              <p className="text-sm text-slate-600 leading-relaxed relative z-10">
                {t('why.card_3_desc')}
              </p>
            </div>

            {/* Card 4: Safe & Secure */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-md hover:shadow-xl hover:border-emerald-200 transition-all duration-300 relative overflow-hidden flex flex-col items-start">
              <svg viewBox="0 0 100 25" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-16 pointer-events-none"><path d="M0,10 C40,30 60,-5 100,10 L100,25 L0,25 Z" fill="#ECFDF5"/></svg>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4 shrink-0 relative z-10">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5 relative z-10">{t('why.card_4_title')}</h3>
              <p className="text-sm text-slate-600 leading-relaxed relative z-10">
                {t('why.card_4_desc')}
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
