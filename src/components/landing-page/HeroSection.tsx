"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Star, Users, ShieldCheck, CalendarDays } from 'lucide-react';
import { useTranslations } from 'next-intl';

function AnimatedNumber({ 
  value, 
  prefix = "", 
  suffix = "", 
  decimals = 0,
  duration = 2000 
}: { 
  value: number; 
  prefix?: string; 
  suffix?: string; 
  decimals?: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTime: number | null = null;

          const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            setCount(easeOutProgress * value);

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setCount(value);
            }
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);

  const formattedNumber = decimals > 0 
    ? count.toFixed(decimals) 
    : Math.floor(count).toLocaleString();

  return (
    <span ref={ref}>
      {prefix}{formattedNumber}{suffix}
    </span>
  );
}

import { useLandingLanguage } from '@/context/LandingLanguageContext';
import ScrollReveal from '@/components/landing-page/ScrollReveal';

export default function HeroSection() {
  const { t } = useLandingLanguage();

  return (
    <>
      {/* Hero Section */}
      <main className="container mx-auto px-6 sm:px-8 lg:px-12 pt-24 sm:pt-28 lg:pt-32 pb-16 relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-14">
        
        {/* Left Column (Content) */}
        <ScrollReveal variant="fade-right" duration={800} className="space-y-6 lg:w-[48%] flex flex-col items-start relative z-20">
          
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[12px] font-bold shadow-sm">
            <div className="bg-blue-600 rounded-full w-4 h-4 flex items-center justify-center shrink-0">
               <CheckCircle2 className="w-2.5 h-2.5 text-white" />
            </div>
            <span>{t('hero.trust_badge')}</span>
          </div>

          {/* Large Bold Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] font-extrabold leading-[1.12] tracking-tight text-slate-900">
            {t('hero.title_1')} <br />
            <span className="relative inline-block text-blue-600 whitespace-nowrap">
              {t('hero.title_2')}
              {/* Subtle curved blue underline */}
              <svg className="absolute -bottom-2.5 left-0 w-full h-3.5 text-blue-600" viewBox="0 0 320 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 10C80 2 220 2 317 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-[1.05rem] text-slate-600 leading-relaxed max-w-lg font-normal pt-1">
            {t('hero.subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-1 w-full sm:w-auto">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95 text-white px-7 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-xl shadow-blue-600/30 cursor-pointer">
              {t('hero.find_expert')}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button className="w-full sm:w-auto flex items-center justify-center bg-white border border-blue-600/35 hover:border-blue-600 hover:bg-blue-50/50 hover:scale-105 active:scale-95 text-blue-600 px-7 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm cursor-pointer">
              {t('hero.become_consultant')}
            </button>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-3">
            <div className="flex -space-x-2.5 shrink-0">
              <div className="w-9 h-9 rounded-full border-2 border-white bg-slate-200 overflow-hidden relative shadow-sm hover:scale-110 transition-transform duration-200">
                 <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Client 1" />
              </div>
              <div className="w-9 h-9 rounded-full border-2 border-white bg-slate-300 overflow-hidden relative shadow-sm hover:scale-110 transition-transform duration-200">
                 <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Client 2" />
              </div>
              <div className="w-9 h-9 rounded-full border-2 border-white bg-slate-400 overflow-hidden relative shadow-sm hover:scale-110 transition-transform duration-200">
                 <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Client 3" />
              </div>
              <div className="w-9 h-9 rounded-full border-2 border-white bg-slate-500 overflow-hidden relative shadow-sm hover:scale-110 transition-transform duration-200">
                 <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Client 4" />
              </div>
            </div>

            <div className="flex flex-col gap-0.5 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              </div>
              <div className="text-slate-600 font-medium">
                <span className="font-bold text-slate-900">4.9/5</span> {t('hero.reviews_text')}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Right Hero Visual */}
        <ScrollReveal variant="fade-left" duration={800} delay={150} className="relative lg:w-[52%] w-full flex justify-center lg:justify-end z-10 pt-6 lg:pt-0">
          
          <div className="relative w-full max-w-2xl">

            {/* Butterfly Wings Inspired Organic Backdrop SVG */}
            <div className="absolute -inset-6 sm:-inset-8 -z-10 pointer-events-none flex items-center justify-center animate-pulse-slow">
              <svg className="w-[115%] h-[115%] overflow-visible" viewBox="0 0 550 460" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="wing-top-gradient" x1="20%" y1="0%" x2="100%" y2="80%">
                    <stop offset="0%" stopColor="#EBF3FF" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#DCE8FE" stopOpacity="0.85" />
                  </linearGradient>
                  
                  <linearGradient id="wing-bottom-gradient" x1="0%" y1="20%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#F3E8FF" stopOpacity="0.9" />
                    <stop offset="60%" stopColor="#ECE0FD" stopOpacity="0.65" />
                    <stop offset="100%" stopColor="#F8FAFC" stopOpacity="0.1" />
                  </linearGradient>
                </defs>

                <path 
                  d="M 220,70 Q 380,-10 490,60 Q 560,120 520,220 Q 460,290 350,270 Q 240,250 220,70 Z" 
                  fill="url(#wing-top-gradient)" 
                />
                
                <path 
                  d="M 110,160 Q 230,100 320,180 Q 410,260 370,370 Q 310,460 170,440 Q 30,420 10,300 Q -10,180 110,160 Z" 
                  fill="url(#wing-bottom-gradient)" 
                />

                <path 
                  d="M 170,110 Q 310,40 430,130 Q 490,210 430,310 Q 350,390 230,360 Q 110,330 90,230 Q 70,140 170,110 Z" 
                  fill="#F0F6FE" 
                  opacity="0.55" 
                />
              </svg>
            </div>

            {/* Small Blue Dotted Matrix Grid on Left */}
            <div className="absolute -left-10 top-1/2 -translate-y-1/2 z-0 hidden sm:grid grid-cols-4 gap-2.5 opacity-40 animate-pulse-slow">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              ))}
            </div>

            {/* Top-Left Floating Card: 10,000+ Verified Professionals */}
            <div className="absolute -top-6 -left-4 sm:-left-8 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-[0_15px_35px_rgba(15,23,42,0.08)] border border-slate-100 z-30 flex flex-col gap-2.5 min-w-[210px] animate-float">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-sm border border-blue-100/60">
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-extrabold text-slate-900 leading-tight">
                    <AnimatedNumber value={10000} suffix="+" />
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{t('hero.stat_verified')}</span>
                </div>
              </div>
              <div className="w-full h-6 pt-1">
                <svg className="w-full h-full text-blue-600" viewBox="0 0 160 28" fill="none">
                  <path d="M2 22 C 30 24, 45 14, 70 16 C 95 18, 110 4, 135 12 C 145 15, 152 4, 158 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                </svg>
              </div>
            </div>

            {/* Main Hero Image */}
            <div className="relative w-full aspect-[4/3] rounded-[2.25rem] overflow-hidden shadow-[0_20px_50px_rgba(15,23,42,0.1)] border-4 border-white z-10 bg-slate-100 hover:scale-[1.01] transition-transform duration-500">
              <img 
                src="/hero_woman.jpg" 
                className="w-full h-full object-cover" 
                alt="Professional Consultant working in modern office" 
              />
            </div>

            {/* Top-Right Floating Shield Badge */}
            <div className="absolute -top-5 -right-3 sm:-right-6 z-30 animate-pulse-slow">
              <div className="w-16 h-16 rounded-full bg-white p-1.5 shadow-[0_15px_30px_rgba(15,23,42,0.12)] border border-slate-100 flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <div className="w-full h-full rounded-full bg-blue-600 flex items-center justify-center text-white shadow-inner">
                  <ShieldCheck className="w-7 h-7" />
                </div>
              </div>
            </div>

            {/* Bottom-Right Floating Card: Secure & Private */}
            <div className="absolute -bottom-6 -right-3 sm:-right-6 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-[0_15px_35px_rgba(15,23,42,0.08)] border border-slate-100 z-30 flex items-start gap-3.5 max-w-[270px] animate-float-delayed">
              <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5 shadow-sm border border-indigo-100/60">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900 leading-tight mb-1">{t('hero.stat_secure')}</span>
                <span className="text-xs text-slate-500 font-medium leading-relaxed">
                  {t('hero.stat_secure_desc')}
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 ml-1.5 align-middle animate-pulse" />
                </span>
              </div>
            </div>

          </div>

        </ScrollReveal>
      </main>

      {/* Bottom Statistics Bar */}
      <ScrollReveal variant="fade-up" delay={250} className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 mt-2 z-20 pb-16">
        <div className="bg-white rounded-3xl py-6 px-8 sm:px-12 shadow-lg hover:shadow-xl border border-slate-200 flex flex-wrap lg:flex-nowrap items-center justify-between gap-6 lg:gap-8 transition-all duration-300">
          
          {/* Col 1 */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="text-2xl font-bold text-slate-900 leading-tight mb-0.5">
                <AnimatedNumber value={10000} suffix="+" />
              </div>
              <div className="text-sm font-medium text-slate-600">{t('hero.stat_verified')}</div>
            </div>
          </div>

          <div className="w-px h-10 bg-slate-200 hidden lg:block" />

          {/* Col 2 */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="text-2xl font-bold text-slate-900 leading-tight mb-0.5">
                <AnimatedNumber value={25000} suffix="+" />
              </div>
              <div className="text-sm font-medium text-slate-600">{t('hero.stat_consultations')}</div>
            </div>
          </div>

          <div className="w-px h-10 bg-slate-200 hidden lg:block" />

          {/* Col 3 */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="text-2xl font-bold text-slate-900 leading-tight mb-0.5">
                <AnimatedNumber value={4.9} decimals={1} suffix="/5" />
              </div>
              <div className="text-sm font-medium text-slate-600">{t('hero.stat_rating')}</div>
            </div>
          </div>

          <div className="w-px h-10 bg-slate-200 hidden lg:block" />

          {/* Col 4 */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="text-2xl font-bold text-slate-900 leading-tight mb-0.5">
                <AnimatedNumber value={100} suffix="%" />
              </div>
              <div className="text-sm font-medium text-slate-600">{t('hero.stat_secure')}</div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </>
  );
}
