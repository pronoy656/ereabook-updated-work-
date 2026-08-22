'use client';
import React, { useState } from 'react';
import { Tag, Send, Crown, Briefcase, CheckCircle2, ShieldCheck, Clock, Award, Headphones, Sparkles, ArrowRight } from 'lucide-react';

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="relative w-full bg-white py-20 lg:py-28 z-10 overflow-hidden scroll-mt-20">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold tracking-wider uppercase mb-5 shadow-sm">
            <Tag className="w-3.5 h-3.5" />
            SIMPLE, TRANSPARENT PRICING
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 leading-tight">
            Choose the Plan That's <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600">Right for You</span>
          </h2>
          
          <p className="text-base text-slate-600 font-medium max-w-lg leading-relaxed">
            Flexible plans for individuals and businesses. Start free and upgrade anytime as you grow.
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="flex justify-center items-center mb-16 relative">
          <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-full flex items-center border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.04)] relative z-10">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-7 py-2.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
                !isYearly 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-7 py-2.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                isYearly 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Yearly</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                isYearly ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-600 border border-emerald-200/80'
              }`}>
                Save 20%
              </span>
            </button>
          </div>

          {/* Decorative Save Callout */}
          <div className="absolute left-[calc(50%+160px)] hidden sm:flex items-center gap-2 text-blue-600 pointer-events-none whitespace-nowrap">
            <svg width="32" height="20" viewBox="0 0 40 24" fill="none" className="rotate-[15deg] shrink-0 mt-1">
              <path d="M1 1C7.66667 18.3333 24.6 27.2 38 10M38 10L27 9M38 10L36 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 shadow-sm mt-5">
              🔥 Save more with yearly!
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto mb-16">
          
          {/* Basic Plan */}
          <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 border border-slate-200/80 shadow-[0_10px_30px_rgba(15,23,42,0.03)] hover:shadow-[0_20px_40px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 shadow-sm">
                <Send className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-xl font-extrabold text-slate-900">Basic</h3>
                <p className="text-xs text-slate-500 font-medium">For individuals getting started</p>
              </div>
            </div>

            <div className="flex items-baseline gap-1.5 mb-2">
              <span className="text-5xl font-black text-slate-900 tracking-tight">$0</span>
              <span className="text-sm font-bold text-slate-400">/month</span>
            </div>
            <div className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold rounded-full mb-8 self-start border border-slate-200/60">
              Free forever
            </div>

            <div className="w-full h-px bg-slate-100 mb-8" />

            <div className="flex flex-col gap-4 mb-10 flex-1">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-sm text-slate-600 font-medium">Browse experts & categories</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-sm text-slate-600 font-medium">Book up to 1 session per month</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-sm text-slate-600 font-medium">Chat & message support</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-sm text-slate-600 font-medium">Session reminders</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-sm text-slate-600 font-medium">Basic account security</span>
              </div>
            </div>

            <button className="w-full bg-slate-50 hover:bg-blue-50 text-slate-800 hover:text-blue-600 border border-slate-200 hover:border-blue-200 font-bold text-sm py-4 rounded-2xl transition-all duration-200 cursor-pointer mt-auto flex items-center justify-center gap-2">
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Premium Plan (Hero Most Popular Card) */}
          <div className="bg-gradient-to-b from-white via-blue-50/20 to-white rounded-[2.5rem] p-8 lg:p-10 border-2 border-blue-500 shadow-[0_25px_60px_-15px_rgba(37,99,235,0.22)] flex flex-col relative transform lg:-translate-y-3 hover:-translate-y-4 transition-all duration-300 z-20">
            
            {/* Most Popular Floating Pill */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white px-5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-blue-500/30 flex items-center gap-1.5 border border-white/20 whitespace-nowrap">
              <Sparkles className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>Most Popular</span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/30">
                <Crown className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-xl font-extrabold text-slate-900">Premium</h3>
                <p className="text-xs text-slate-500 font-medium">For professionals & frequent users</p>
              </div>
            </div>

            <div className="flex items-baseline gap-1.5 mb-2">
              <span className="text-5xl font-black text-blue-600 tracking-tight">${isYearly ? '23' : '29'}</span>
              <span className="text-sm font-bold text-slate-400">/month</span>
            </div>
            <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[11px] font-bold rounded-full mb-8 self-start border border-blue-100">
              Billed {isYearly ? 'yearly ($276/yr)' : 'monthly'}
            </div>

            <div className="w-full h-px bg-slate-100 mb-8" />

            <div className="flex flex-col gap-4 mb-10 flex-1">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-sm text-slate-900 font-bold">Everything in Basic</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-sm text-slate-700 font-medium">Unlimited session bookings</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-sm text-slate-700 font-medium">Priority customer support</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-sm text-slate-700 font-medium">HD video consultations</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-sm text-slate-700 font-medium">Session notes & history</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-sm text-slate-700 font-medium">Exclusive offers & discounts</span>
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm py-4 rounded-2xl transition-all duration-200 shadow-xl shadow-blue-600/30 hover:scale-[1.02] cursor-pointer mt-auto flex items-center justify-center gap-2">
              <span>Get Premium</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Business Plan */}
          <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 border border-slate-200/80 shadow-[0_10px_30px_rgba(15,23,42,0.03)] hover:shadow-[0_20px_40px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-md">
                <Briefcase className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-xl font-extrabold text-slate-900">Business</h3>
                <p className="text-xs text-slate-500 font-medium">For teams & organizations</p>
              </div>
            </div>

            <div className="flex items-baseline gap-1.5 mb-2">
              <span className="text-5xl font-black text-slate-900 tracking-tight">${isYearly ? '63' : '79'}</span>
              <span className="text-sm font-bold text-slate-400">/month</span>
            </div>
            <div className="inline-block px-3 py-1 bg-purple-50 text-purple-700 text-[11px] font-bold rounded-full mb-8 self-start border border-purple-100">
              Billed {isYearly ? 'yearly ($756/yr)' : 'monthly'}
            </div>

            <div className="w-full h-px bg-slate-100 mb-8" />

            <div className="flex flex-col gap-4 mb-10 flex-1">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-sm text-slate-900 font-bold">Everything in Premium</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-sm text-slate-600 font-medium">Team accounts & collaboration</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-sm text-slate-600 font-medium">Advanced analytics & reports</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-sm text-slate-600 font-medium">Dedicated account manager</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-sm text-slate-600 font-medium">Custom integrations</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-sm text-slate-600 font-medium">Priority scheduling</span>
              </div>
            </div>

            <button className="w-full bg-slate-900 hover:bg-black text-white font-bold text-sm py-4 rounded-2xl transition-all duration-200 shadow-lg cursor-pointer mt-auto flex items-center justify-center gap-2">
              <span>Get Business</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
