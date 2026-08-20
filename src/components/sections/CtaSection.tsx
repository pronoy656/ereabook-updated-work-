import React from 'react';
import { Rocket, ArrowRight, Play, CheckCircle2, Search, Scale, Briefcase, HeartPulse, LineChart } from 'lucide-react';

export default function CtaSection() {
  return (
    <section className="relative w-full bg-white py-12 lg:py-16 z-10 overflow-hidden">
      <div className="max-w-[1300px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">

        {/* Main CTA Card */}
        <div className="w-full bg-gradient-to-br from-[#F4F8FF] to-[#E8F2FF] rounded-[2rem] p-8 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 overflow-hidden relative border border-blue-50 shadow-sm">

          {/* Left Content */}
          <div className="flex-1 w-full max-w-[540px] flex flex-col items-center lg:items-start text-center lg:text-left z-10">

            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-[11px] font-bold tracking-wider uppercase mb-6">
              <Rocket className="w-3.5 h-3.5" />
              READY TO GET STARTED?
            </div>

            <h2 className="text-4xl lg:text-[3rem] font-bold text-[#0B1B3D] tracking-tight mb-6 leading-[1.15]">
              Get Expert Advice <span className="text-blue-600">Today!</span>
            </h2>

            <p className="text-[16px] text-slate-600 font-medium leading-relaxed mb-10 max-w-[480px]">
              Thousands of people are already getting the help they need. Join them and take the first step toward smarter decisions.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-10">
              <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-[15px] px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-600/20">
                Book a Consultation
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="w-full sm:w-auto bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-[15px] px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
                  <Play className="w-3 h-3 fill-white" />
                </div>
                How It Works
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-[13px] text-slate-600 font-bold">Verified Experts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-[13px] text-slate-600 font-bold">Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-[13px] text-slate-600 font-bold">Satisfaction Guaranteed</span>
              </div>
            </div>

          </div>

          {/* Right Image/Illustration */}
          <div className="flex-1 w-full flex items-center justify-center lg:justify-end relative z-10 mt-4 lg:mt-0">
            <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center">
              {/* The base 3D render (pedestal, plant, bubbles) */}
              <img src="/cta-illustration.png" alt="Get Started Illustration" className="w-full h-full object-contain scale-110 lg:scale-125 origin-center lg:origin-right absolute z-0 pointer-events-none mix-blend-multiply" />

              {/* Phone Image overlay */}
              <div className="absolute z-20 top-1/2 left-1/2 -translate-x-[65%] -translate-y-[68%] w-[60%] max-w-[300px]">
                <img src="/cta-mobile-illustration.png" alt="Mobile App UI" className="w-full h-auto object-contain drop-shadow-2xl" />
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
