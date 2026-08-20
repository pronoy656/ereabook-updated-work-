'use client';
import React, { useState } from 'react';
import { Tag, Send, Crown, Briefcase, CheckCircle2, ShieldCheck, Clock, Award, Headphones } from 'lucide-react';

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="relative w-full bg-[#FAFCFF] py-24 z-10 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold tracking-wider uppercase mb-6 border border-blue-100">
            <Tag className="w-3.5 h-3.5" />
            SIMPLE, TRANSPARENT PRICING
          </div>
          <h2 className="text-4xl lg:text-[2.75rem] font-bold text-[#0B1B3D] tracking-tight mb-4">
            Choose the Plan That's Right for You
          </h2>
          <p className="text-[15px] text-slate-500 font-medium">
            Flexible plans for individuals and businesses.<br className="hidden sm:block" />
            Start free and upgrade anytime.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center items-center mb-16 relative">
          <div className="bg-slate-100 p-1 rounded-full flex items-center shadow-inner relative z-10">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2.5 rounded-full text-[14px] font-bold transition-all duration-300 ${
                !isYearly ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2.5 rounded-full text-[14px] font-bold transition-all duration-300 ${
                isYearly ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Yearly (Save 20%)
            </button>

            {/* Decorative Arrow */}
            <div className="absolute left-[105%] top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-2 text-blue-600 pointer-events-none whitespace-nowrap">
              <svg width="32" height="20" viewBox="0 0 40 24" fill="none" className="rotate-[15deg] shrink-0 mt-2">
                <path d="M1 1C7.66667 18.3333 24.6 27.2 38 10M38 10L27 9M38 10L36 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[12.5px] font-bold mt-6 shrink-0">Save more with yearly plans!</span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="flex flex-col lg:flex-row items-stretch justify-center gap-6 lg:gap-8 mb-16">
          
          {/* Basic Plan */}
          <div className="flex-1 max-w-[380px] w-full mx-auto bg-white rounded-3xl p-8 lg:p-10 border border-slate-200 shadow-sm flex flex-col relative">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <Send className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-[18px] font-bold text-slate-900">Basic</h3>
                <p className="text-[12px] text-slate-500 font-medium">For individuals getting started</p>
              </div>
            </div>

            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-5xl font-black text-slate-900">$0</span>
              <span className="text-[14px] font-bold text-slate-500">/month</span>
            </div>
            <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[11px] font-bold rounded-full mb-8 self-start">
              Free forever
            </div>

            <div className="w-full h-px bg-slate-100 mb-8" />

            <div className="flex flex-col gap-4 mb-10 flex-1">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-[13.5px] text-slate-600 font-medium">Browse experts & categories</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-[13.5px] text-slate-600 font-medium">Book up to 1 session per month</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-[13.5px] text-slate-600 font-medium">Chat & message support</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-[13.5px] text-slate-600 font-medium">Session reminders</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-[13.5px] text-slate-600 font-medium">Basic account security</span>
              </div>
            </div>

            <button className="w-full bg-white hover:bg-blue-50 text-blue-600 border-2 border-blue-100 hover:border-blue-200 font-bold text-[14px] py-4 rounded-xl transition-colors mt-auto">
              Get Started Free
            </button>
          </div>

          {/* Premium Plan */}
          <div className="flex-1 max-w-[380px] w-full mx-auto bg-white rounded-3xl p-8 lg:p-10 border-2 border-blue-500 shadow-[0_20px_50px_-15px_rgba(37,99,235,0.15)] flex flex-col relative transform lg:-translate-y-4">
            
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[12px] font-bold shadow-md">
              Most Popular
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <Crown className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-[18px] font-bold text-slate-900">Premium</h3>
                <p className="text-[12px] text-slate-500 font-medium">For professionals & frequent users</p>
              </div>
            </div>

            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-5xl font-black text-blue-600">${isYearly ? '23' : '29'}</span>
              <span className="text-[14px] font-bold text-slate-500">/month</span>
            </div>
            <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[11px] font-bold rounded-full mb-8 self-start">
              Billed {isYearly ? 'yearly' : 'monthly'}
            </div>

            <div className="w-full h-px bg-slate-100 mb-8" />

            <div className="flex flex-col gap-4 mb-10 flex-1">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-[13.5px] text-slate-900 font-bold">Everything in Basic</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-[13.5px] text-slate-600 font-medium">Unlimited session bookings</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-[13.5px] text-slate-600 font-medium">Priority customer support</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-[13.5px] text-slate-600 font-medium">HD video consultations</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-[13.5px] text-slate-600 font-medium">Session notes & history</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-[13.5px] text-slate-600 font-medium">Exclusive offers & discounts</span>
              </div>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-[14px] py-4 rounded-xl transition-colors shadow-md shadow-blue-600/20 mt-auto">
              Get Premium
            </button>
          </div>

          {/* Business Plan */}
          <div className="flex-1 max-w-[380px] w-full mx-auto bg-white rounded-3xl p-8 lg:p-10 border border-slate-200 shadow-sm flex flex-col relative">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <Briefcase className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-[18px] font-bold text-slate-900">Business</h3>
                <p className="text-[12px] text-slate-500 font-medium">For teams & organizations</p>
              </div>
            </div>

            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-5xl font-black text-slate-900">${isYearly ? '63' : '79'}</span>
              <span className="text-[14px] font-bold text-slate-500">/month</span>
            </div>
            <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[11px] font-bold rounded-full mb-8 self-start">
              Billed {isYearly ? 'yearly' : 'monthly'}
            </div>

            <div className="w-full h-px bg-slate-100 mb-8" />

            <div className="flex flex-col gap-4 mb-10 flex-1">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-[13.5px] text-slate-900 font-bold">Everything in Premium</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-[13.5px] text-slate-600 font-medium">Team accounts & collaboration</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-[13.5px] text-slate-600 font-medium">Advanced analytics & reports</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-[13.5px] text-slate-600 font-medium">Dedicated account manager</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-[13.5px] text-slate-600 font-medium">Custom integrations</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-[13.5px] text-slate-600 font-medium">Priority scheduling</span>
              </div>
            </div>

            <button className="w-full bg-white hover:bg-blue-50 text-blue-600 border-2 border-blue-100 hover:border-blue-200 font-bold text-[14px] py-4 rounded-xl transition-colors mt-auto">
              Get Business
            </button>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="bg-[#FAFCFF] rounded-3xl p-8 shadow-[0_5px_20px_-10px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4 max-w-[1100px] mx-auto">
          
          <div className="flex items-center gap-4 flex-1 justify-center lg:justify-start px-2">
            <div className="w-12 h-12 rounded-full border border-blue-200 bg-transparent flex items-center justify-center text-blue-600 shrink-0">
              <ShieldCheck className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[14px] font-bold text-slate-900 leading-tight mb-1">Secure & Private</span>
              <span className="text-[12px] font-medium text-slate-500">Your data is 100% safe<br/>and encrypted.</span>
            </div>
          </div>

          <div className="w-full h-px lg:w-px lg:h-12 bg-slate-200 opacity-60" />

          <div className="flex items-center gap-4 flex-1 justify-center px-2">
            <div className="w-12 h-12 rounded-full border border-blue-200 bg-transparent flex items-center justify-center text-blue-600 shrink-0">
              <Clock className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[14px] font-bold text-slate-900 leading-tight mb-1">Cancel Anytime</span>
              <span className="text-[12px] font-medium text-slate-500">No hidden fees.<br/>Cancel anytime.</span>
            </div>
          </div>

          <div className="w-full h-px lg:w-px lg:h-12 bg-slate-200 opacity-60" />

          <div className="flex items-center gap-4 flex-1 justify-center px-2">
            <div className="w-12 h-12 rounded-full border border-blue-200 bg-transparent flex items-center justify-center text-blue-600 shrink-0">
              <Award className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[14px] font-bold text-slate-900 leading-tight mb-1">Money-Back Guarantee</span>
              <span className="text-[12px] font-medium text-slate-500">Not satisfied? Get a full<br/>refund within 7 days.</span>
            </div>
          </div>

          <div className="w-full h-px lg:w-px lg:h-12 bg-slate-200 opacity-60" />

          <div className="flex items-center gap-4 flex-1 justify-center lg:justify-end px-2">
            <div className="w-12 h-12 rounded-full border border-blue-200 bg-transparent flex items-center justify-center text-blue-600 shrink-0">
              <Headphones className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[14px] font-bold text-slate-900 leading-tight mb-1">24/7 Support</span>
              <span className="text-[12px] font-medium text-slate-500">We're here to help<br/>around the clock.</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
