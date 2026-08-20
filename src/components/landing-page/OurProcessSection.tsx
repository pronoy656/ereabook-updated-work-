"use client";

import React from 'react';
import { Sparkles, Search, Calendar, MessageSquare, Mic, Video, PhoneOff, FileText, CheckCircle2, Download, Lock } from 'lucide-react';

export default function OurProcessSection() {
  return (
    <section id="how-it-works" className="container mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-24 relative z-10 scroll-mt-20">

      <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-6">

        {/* ── LEFT COLUMN: badges, headline, subtitle, timeline ── */}
        <div className="lg:w-[38%] w-full flex flex-col items-start space-y-5">

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
          <p className="text-sm text-slate-500 leading-relaxed max-w-[310px]">
            We&apos;ve made it easy to connect with the right expert and get the guidance you need—fast and secure.
          </p>

          {/* Vertical timeline */}
          <div className="relative w-full pt-1">

            {/* Dashed connector line */}
            <div className="absolute left-[23px] top-8 bottom-8 border-l-2 border-dashed border-slate-200" />

            <div className="flex flex-col gap-6">

              {/* Step 01 */}
              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 z-10">
                  <Search className="w-5 h-5" />
                </div>
                <div className="pt-0.5">
                  <span className="block text-[11px] font-bold text-blue-500 mb-0.5">01</span>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Find the Right Expert</h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-[270px]">
                    Browse profiles, read reviews, and choose the expert that best fits your needs.
                  </p>
                </div>
              </div>

              {/* Step 02 */}
              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100 z-10">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="pt-0.5">
                  <span className="block text-[11px] font-bold text-purple-500 mb-0.5">02</span>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Book Your Session</h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-[270px]">
                    Pick a convenient time and book your consultation in just a few clicks.
                  </p>
                </div>
              </div>

              {/* Step 03 */}
              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 z-10">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="pt-0.5">
                  <span className="block text-[11px] font-bold text-emerald-500 mb-0.5">03</span>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Get Expert Advice</h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-[270px]">
                    Connect, discuss your concerns, and get actionable advice that makes a difference.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* ── DOT-GRID MOTIF — between columns ── */}
        <div className="hidden lg:grid grid-cols-5 gap-[11px] self-center opacity-35 shrink-0 mt-20">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="w-[6px] h-[6px] rounded-full bg-blue-400" />
          ))}
        </div>

        {/* ── RIGHT COLUMN: video mockup ── */}
        <div className="lg:flex-1 w-full flex flex-col items-stretch">

          {/* Outer wrapper gives space for the overlapping Session Summary card */}
          <div className="relative pr-0 sm:pr-[190px]">

            {/* Doodle curl arrow */}
            <div className="absolute -top-5 right-[186px] text-blue-400 z-20 hidden sm:block">
              <svg width="36" height="36" viewBox="0 0 50 50" fill="none">
                <path d="M38 8 C28 18, 18 13, 8 34 M8 34 L10 24 M8 34 L18 36"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* ── Main video card ── */}
            <div className="bg-white rounded-2xl p-3.5 shadow-[0_8px_40px_rgba(15,23,42,0.09)] border border-slate-200 relative z-10">

              {/* Header */}
              <div className="flex items-start justify-between px-1 pb-2.5 mb-2 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-bold text-slate-900">Consultation</span>
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-[11px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live
                    </span>
                  </div>
                  <span className="font-mono text-xs text-slate-400">00:28:34</span>
                </div>
              </div>

              {/* Video frame */}
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-800">

                {/* Main consultant */}
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80"
                  alt="Expert Consultant"
                  className="w-full h-full object-cover object-top"
                />

                {/* PIP — client top-right */}
                <div className="absolute top-3 right-3 w-28 sm:w-32 aspect-[4/3] rounded-xl overflow-hidden border-2 border-white shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80"
                    alt="Client"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 right-1 flex items-end gap-0.5 bg-black/60 px-1 py-0.5 rounded">
                    <span className="w-1 h-1.5 bg-emerald-400 rounded-full" />
                    <span className="w-1 h-3 bg-emerald-400 rounded-full" />
                    <span className="w-1 h-2 bg-emerald-400 rounded-full" />
                  </div>
                </div>

                {/* Call controls */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-full flex items-center gap-3 shadow-lg border border-slate-200/80">
                  <button className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors">
                    <Mic className="w-4 h-4" />
                  </button>
                  <button className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors">
                    <Video className="w-4 h-4" />
                  </button>
                  <button className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button className="w-9 h-9 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-colors shadow">
                    <PhoneOff className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>

            {/* ── Session Summary — overlapping right edge ── */}
            <div className="absolute right-0 top-14 bg-white rounded-2xl p-4 shadow-[0_10px_30px_rgba(15,23,42,0.11)] border border-slate-200 z-20 w-[180px] sm:w-[188px] flex flex-col gap-2.5 hidden sm:flex">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-bold text-slate-800">Session Summary</span>
              </div>
              <div className="space-y-1.5">
                {["Issue Discussed", "Key Points", "Expert Recommendations", "Next Steps"].map((item) => (
                  <div key={item} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-blue-500 shrink-0" />
                    <span className="text-[11px] text-slate-600">{item}</span>
                  </div>
                ))}
              </div>
              <button className="mt-0.5 w-full flex items-center justify-center gap-1.5 text-blue-600 text-[11px] font-bold py-1.5 px-3 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
                <Download className="w-3 h-3" />
                Download Report
              </button>
            </div>

          </div>

          {/* Security badge — centered below video */}
          <div className="mt-8 self-center inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white border border-slate-200 text-slate-500 text-[11px] font-medium shadow-sm">
            <Lock className="w-3.5 h-3.5 text-blue-500" />
            <span>End-to-end encrypted</span>
            <span className="text-slate-300">•</span>
            <span>100% private</span>
            <span className="text-slate-300">•</span>
            <span>Your data is always secure</span>
          </div>

        </div>

      </div>

    </section>
  );
}
