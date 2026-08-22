"use client";

import React from 'react';
import { Sparkles, Search, Calendar, MessageSquare, Mic, Video, PhoneOff, FileText, Download, Lock } from 'lucide-react';

export default function OurProcessSection() {
  return (
    <section id="how-it-works" className="container mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-24 relative z-10 scroll-mt-20">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">

        {/* Left Column (5 cols): Section Header & 3-Step Timeline */}
        <div className="lg:col-span-5 flex flex-col items-start space-y-6">

          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold tracking-wider uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            OUR PROCESS
          </div>

          {/* Headline */}
          <h2 className="text-4xl lg:text-[2.6rem] font-extrabold text-slate-900 tracking-tight leading-[1.12]">
            Simple process.<br />
            <span className="text-blue-600">Powerful</span> results.
          </h2>

          {/* Subtitle */}
          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            We&apos;ve made it easy to connect with the right expert and get the guidance you need—fast, simple, and secure.
          </p>

          {/* Vertical 3-Step Timeline */}
          <div className="relative w-full pt-2">
            {/* Dashed connector line */}
            <div className="absolute left-[23px] top-8 bottom-8 border-l-2 border-dashed border-slate-200" />

            <div className="flex flex-col gap-6">

              {/* Step 01 */}
              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 z-10 shadow-sm">
                  <Search className="w-5 h-5" />
                </div>
                <div className="pt-0.5">
                  <span className="block text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-0.5">Step 01</span>
                  <h3 className="text-base font-bold text-slate-900 mb-1">Find the Right Expert</h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-sm font-medium">
                    Browse verified consultant profiles, read real ratings, and select the expert that best fits your goals.
                  </p>
                </div>
              </div>

              {/* Step 02 */}
              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100 z-10 shadow-sm">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="pt-0.5">
                  <span className="block text-[11px] font-bold text-purple-600 uppercase tracking-wider mb-0.5">Step 02</span>
                  <h3 className="text-base font-bold text-slate-900 mb-1">Book Your Session</h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-sm font-medium">
                    Pick a convenient time slot and confirm your 1-on-1 video consultation in just a few taps on the app.
                  </p>
                </div>
              </div>

              {/* Step 03 */}
              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 z-10 shadow-sm">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="pt-0.5">
                  <span className="block text-[11px] font-bold text-emerald-600 uppercase tracking-wider mb-0.5">Step 03</span>
                  <h3 className="text-base font-bold text-slate-900 mb-1">Get Expert Advice</h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-sm font-medium">
                    Connect on HD video, discuss your concerns, and receive an instant actionable summary report.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right Column (7 cols): Clean, Relatable Video Call Preview & Session Summary */}
        <div className="lg:col-span-7 flex flex-col items-center">

          {/* Main Video Consultation Card Container */}
          <div className="w-full bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-[0_12px_40px_rgba(15,23,42,0.08)] relative">

            {/* Video Call Top Bar */}
            <div className="flex items-center justify-between px-2 pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-extrabold text-slate-900 tracking-tight">1-on-1 Expert Consultation</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Live HD Session
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                <span>00:28:34</span>
              </div>
            </div>

            {/* Video Viewport Frame */}
            <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-inner group">

              {/* Main Background Image: Expert Consultant looking DIRECTLY into camera */}
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1000&auto=format&fit=crop&q=80"
                alt="Verified Legal Consultant looking into camera"
                className="w-full h-full object-cover object-center"
              />

              {/* Consultant Name & Verification Overlay (Bottom-Left of Video) */}
              <div className="absolute bottom-4 left-4 z-20 bg-slate-900/80 backdrop-blur-md border border-white/20 text-white px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-lg">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold leading-tight">Sarah Johnson</span>
                  <span className="text-[10px] text-slate-300 font-medium">Senior Legal Consultant • Verified</span>
                </div>
              </div>

              {/* PIP Overlay: Client/User looking DIRECTLY into camera (Top-Right of Video) */}
              <div className="absolute top-4 right-4 z-20 w-32 sm:w-40 aspect-[4/3] rounded-xl overflow-hidden border-2 border-white/90 shadow-2xl bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80"
                  alt="Client/User looking into camera"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute bottom-1.5 left-1.5 z-10 bg-slate-900/80 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] font-bold text-white border border-white/20">
                  You (Client)
                </div>
              </div>

              {/* Floating Bottom Video Controls Bar */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-slate-900/85 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-3 border border-white/20 shadow-xl">
                <button className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer" title="Mute Mic">
                  <Mic className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer" title="Toggle Video">
                  <Video className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer" title="In-call Chat">
                  <MessageSquare className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 rounded-xl bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-colors shadow-md cursor-pointer" title="End Call">
                  <PhoneOff className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Session Summary Card — Placed cleanly below video inside the card */}
            <div className="mt-4 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center border border-blue-200 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900">Post-Call Session Summary</span>
                  <span className="text-[11px] text-slate-500 font-medium">Includes key recommendations, discussed action points &amp; next steps</span>
                </div>
              </div>

              <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0">
                <Download className="w-3.5 h-3.5" />
                Download Report
              </button>
            </div>

          </div>

          {/* Security & Privacy Tag below Card */}
          <div className="mt-4 inline-flex items-center gap-2 text-[11px] font-medium text-slate-500 bg-white border border-slate-200/80 px-4 py-1.5 rounded-full shadow-sm">
            <Lock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>End-to-end Encrypted</span>
            <span className="text-slate-300">•</span>
            <span>100% Private &amp; Confidential</span>
          </div>

        </div>

      </div>

    </section>
  );
}
