"use client";

import React from 'react';
import { Download, CalendarDays, Video, MessageSquare, FileText, Star, Search, Scale, Briefcase, Users, LineChart, ShieldCheck, QrCode } from 'lucide-react';

export default function MobileAppSection() {
  return (
    <section id="mobile-app" className="container mx-auto px-6 sm:px-8 lg:px-12 py-12 lg:py-16 relative z-10 scroll-mt-20">
      <div className="bg-gradient-to-b from-[#F4F8FE] via-[#FAFCFF] to-[#EFF6FF] border border-blue-100/80 shadow-[0_20px_50px_-15px_rgba(37,99,235,0.07)] rounded-[3rem] p-8 sm:p-12 lg:p-16 relative overflow-hidden">
        
        {/* Soft Background Ambient Lights */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-400/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-400/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center mb-16 relative z-10">
          
          {/* Left Column: Content */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold tracking-wider uppercase mb-6 shadow-sm">
              <Download className="w-3.5 h-3.5" />
              OUR MOBILE APP
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-5 leading-[1.15]">
              Expert Help,<br />
              Right in Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600">Pocket</span>
            </h2>
            
            <p className="text-base text-slate-600 font-medium mb-8 max-w-lg leading-relaxed">
              Connect with top verified experts, book instant consultations, and get personalized guidance anytime, anywhere.
            </p>

            {/* 4 Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 w-full">
              
              {/* Feature 1 */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] hover:border-blue-300 hover:shadow-[0_10px_30px_rgba(37,99,235,0.08)] transition-all duration-300 flex items-start gap-3.5 group">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 group-hover:scale-110 transition-transform">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-0.5">Book on the Go</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Book sessions in just a few taps.</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] hover:border-emerald-300 hover:shadow-[0_10px_30px_rgba(16,185,129,0.08)] transition-all duration-300 flex items-start gap-3.5 group">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:scale-110 transition-transform">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-0.5">HD Video Calls</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Join private 1-on-1 video rooms.</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] hover:border-amber-300 hover:shadow-[0_10px_30px_rgba(245,158,11,0.08)] transition-all duration-300 flex items-start gap-3.5 group">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-0.5">Instant Messaging</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Chat with experts before &amp; after.</p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] hover:border-purple-300 hover:shadow-[0_10px_30px_rgba(147,51,234,0.08)] transition-all duration-300 flex items-start gap-3.5 group">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100 group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-0.5">Detailed Reports</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Get summary notes after calls.</p>
                </div>
              </div>

            </div>

            {/* Official App Store & Google Play Badges */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#"
                className="bg-black hover:bg-slate-900 border border-slate-800 text-white rounded-2xl px-6 py-3.5 flex items-center gap-3.5 shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer"
              >
                <svg viewBox="0 0 384 512" className="w-6 h-6 fill-white shrink-0">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                </svg>
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider mb-1">Download on the</span>
                  <span className="text-base text-white font-bold tracking-tight">App Store</span>
                </div>
              </a>

              <a
                href="#"
                className="bg-black hover:bg-slate-900 border border-slate-800 text-white rounded-2xl px-6 py-3.5 flex items-center gap-3.5 shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer"
              >
                <svg className="w-7 h-7 shrink-0" viewBox="0 0 512 512">
                  <path fill="#00C4FF" d="M47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0z"/>
                  <path fill="#00E676" d="M104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
                  <path fill="#FF3D00" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z"/>
                  <path fill="#FFC107" d="M472.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8z"/>
                </svg>
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider mb-1">GET IT ON</span>
                  <span className="text-base text-white font-bold tracking-tight">Google Play</span>
                </div>
              </a>
            </div>

          </div>

          {/* Right Column: 3D Pedestal & Phone Illustration from CTA Section */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[460px] lg:min-h-[520px] mt-8 lg:mt-0">
            <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center translate-y-9">
              {/* Base 3D Render (Pedestal, plant, speech bubble, stars) */}
              <img 
                src="/cta-illustration.png" 
                alt="3D Fixpair Pedestal Illustration" 
                className="w-full h-full object-contain scale-110 lg:scale-125 absolute z-0 pointer-events-none mix-blend-multiply" 
              />

              {/* Phone Image overlay (Shifted 5-8px to the right to sit perfectly centered over the pedestal) */}
              <div className="absolute z-20 top-1/2 left-1/2 -translate-x-[48%] -translate-y-[68%] w-[60%] max-w-[300px] drop-shadow-[0_25px_60px_rgba(15,23,42,0.2)] hover:scale-[1.02] transition-transform duration-500">
                <img 
                  src="/cta-mobile-illustration.png" 
                  alt="Fixpair Mobile App Screen" 
                  className="w-full h-auto object-contain" 
                />
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Stats Banner */}
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200/80 flex flex-col lg:flex-row items-center justify-between gap-8 relative z-20 w-full shadow-[0_10px_35px_-10px_rgba(0,0,0,0.05)]">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full lg:w-auto flex-1">
            
            {/* Stat 1 */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Download className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-slate-900 leading-tight">10K+</span>
                <span className="text-xs font-medium text-slate-500">Downloads</span>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 text-amber-500 flex items-center justify-center shrink-0">
                <Star className="w-5 h-5 fill-amber-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-slate-900 leading-tight">4.9</span>
                <span className="text-xs font-medium text-slate-500">Average Rating</span>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-slate-900 leading-tight">100%</span>
                <span className="text-xs font-medium text-slate-500">Secure &amp; Private</span>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-slate-900 leading-tight">50K+</span>
                <span className="text-xs font-medium text-slate-500">Happy Users</span>
              </div>
            </div>
            
          </div>

          <div className="w-full h-px bg-slate-200 block lg:hidden" />
          <div className="w-px h-12 bg-slate-200 hidden lg:block" />

          {/* QR Code Area */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex flex-col text-center lg:text-left">
              <h3 className="text-xs font-bold text-slate-900 mb-0.5">Scan to Download</h3>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                Scan with phone camera<br />to get the app instantly!
              </p>
            </div>
            <div className="w-16 h-16 bg-white rounded-2xl shadow-md p-2 flex items-center justify-center shrink-0 border border-slate-200">
              <QrCode className="w-full h-full text-slate-900" strokeWidth={1.5} />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
