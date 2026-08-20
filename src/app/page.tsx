"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Lock, Users, CalendarDays, Star, ShieldCheck, Search, Calendar, Video, FileText, ChevronLeft, ChevronRight, Mic, VideoOff, MessageSquare, PhoneOff, CheckCircle2, Scale, Briefcase, HeartPulse, LineChart, User, Home as HomeIcon, GraduationCap, LayoutGrid, Quote, Download, QrCode, Zap, Clock, ThumbsUp, Trophy, Sparkles, DollarSign, TrendingUp, Heart, ClipboardList, Bot, Award } from 'lucide-react';
import FaqSection from '@/components/sections/FaqSection';
import PricingSection from '@/components/sections/PricingSection';
import CtaSection from '@/components/sections/CtaSection';
import Footer from '@/components/sections/Footer';

const TESTIMONIALS = [
  {
    text: "I needed legal guidance for my business and found an expert who made the whole process smooth and stress-free.",
    name: "Michael T.", role: "Business Owner", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
  },
  {
    text: "The consultant helped me clarify my career path and build a plan that actually works. Highly recommended!",
    name: "Sarah L.", role: "Marketing Manager", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
  },
  {
    text: "Quick booking, great communication, and very helpful advice. Will definitely use Fixpair again.",
    name: "David R.", role: "Startup Founder", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
  },
  {
    text: "Very professional service. The experts are highly vetted and I got my problems solved efficiently.",
    name: "Emma W.", role: "Freelance Designer", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
  },
  {
    text: "Outstanding experience! The platform is intuitive and finding the right professional was a breeze.",
    name: "James K.", role: "Tech Lead", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
  }
];

export default function Home() {
  const [testIdx, setTestIdx] = useState(0);

  const nextTestimonial = () => setTestIdx(p => p >= TESTIMONIALS.length - 3 ? 0 : p + 1);
  const prevTestimonial = () => setTestIdx(p => p <= 0 ? TESTIMONIALS.length - 3 : p - 1);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden relative">

      {/* Header / Navigation */}
      <nav className="relative z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/20">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white">
                <path d="M14 6C14 4.89543 13.1046 4 12 4H8C6.89543 4 6 4.89543 6 6V18C6 19.1046 6.89543 20 8 20H10V14H13C14.1046 14 15 13.1046 15 12V10M14 6H16C17.1046 6 18 6.89543 18 8V10M14 6V10M14 10H10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Fixpair</span>
          </div>

          <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="#" className="text-slate-900 font-bold">How It Works</Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">Consultants</Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">Services</Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">For Professionals</Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">About Us</Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">FAQ</Link>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <Link href="/login" className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors">
              Sign In
            </Link>
            <Link href="#" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/30">
              Book a Consultation
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-6 lg:pt-10 pb-12 relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-14">
        
        {/* Left Column (Content) */}
        <div className="space-y-6 lg:w-[48%] flex flex-col items-start relative z-20">
          
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[12px] font-bold shadow-sm">
            <div className="bg-blue-600 rounded-full w-4 h-4 flex items-center justify-center shrink-0">
               <CheckCircle2 className="w-2.5 h-2.5 text-white" />
            </div>
            <span>Trusted by thousands across Germany</span>
          </div>

          {/* Large Bold Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight text-slate-900">
            Expert advice, <br />
            <span className="relative inline-block text-blue-600">
              when it matters most.
              {/* Subtle curved blue underline */}
              <svg className="absolute -bottom-2.5 left-0 w-full h-3.5 text-blue-600" viewBox="0 0 320 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 10C80 2 220 2 317 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-[1.05rem] text-slate-600 leading-relaxed max-w-lg font-normal pt-1">
            Connect with verified professionals, book secure consultations, and get personalized reports that help you make confident decisions.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-1 w-full sm:w-auto">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-xl text-sm font-bold transition-all shadow-xl shadow-blue-600/30">
              Find an Expert
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="w-full sm:w-auto flex items-center justify-center bg-white border border-blue-600/35 hover:border-blue-600 hover:bg-blue-50/50 text-blue-600 px-7 py-3.5 rounded-xl text-sm font-bold transition-all shadow-sm">
              Become a Consultant
            </button>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-3">
            <div className="flex -space-x-2.5 shrink-0">
              <div className="w-9 h-9 rounded-full border-2 border-white bg-slate-200 overflow-hidden relative shadow-sm">
                 <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Client 1" />
              </div>
              <div className="w-9 h-9 rounded-full border-2 border-white bg-slate-300 overflow-hidden relative shadow-sm">
                 <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Client 2" />
              </div>
              <div className="w-9 h-9 rounded-full border-2 border-white bg-slate-400 overflow-hidden relative shadow-sm">
                 <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Client 3" />
              </div>
              <div className="w-9 h-9 rounded-full border-2 border-white bg-slate-500 overflow-hidden relative shadow-sm">
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
                <span className="font-bold text-slate-900">4.9/5</span> from 25,000+ consultations
              </div>
            </div>
          </div>
        </div>

        {/* Right Hero Visual */}
        <div className="relative lg:w-[52%] w-full flex justify-center lg:justify-end z-10 pt-6 lg:pt-0">
          
          <div className="relative w-full max-w-2xl">

            {/* Background Organic Gradient Blob & Soft Lavender Glow */}
            <div className="absolute -inset-8 bg-gradient-to-tr from-blue-50 via-indigo-50 to-blue-100 rounded-3xl blur-2xl -z-10 opacity-80" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-100/60 rounded-full blur-3xl -z-10" />

            {/* Small Blue Dotted Grid on Left */}
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 z-0 hidden sm:grid grid-cols-4 gap-2.5 opacity-40">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              ))}
            </div>

            {/* Top-Left Floating Card: 10,000+ Verified Professionals */}
            <div className="absolute -top-6 -left-4 sm:-left-8 bg-white p-4 sm:p-5 rounded-2xl shadow-2xl border border-slate-200 z-30 flex flex-col gap-2 min-w-[210px]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold text-slate-900 leading-tight">10,000+</span>
                  <span className="text-xss font-medium text-slate-600">Verified Professionals</span>
                </div>
              </div>
              {/* Minimalist Blue Line Chart */}
              <div className="w-full h-5 pt-1">
                <svg className="w-full h-full text-blue-600" viewBox="0 0 140 24" fill="none">
                  <path d="M0 20 C 25 20, 35 12, 55 14 C 75 16, 85 4, 105 10 C 120 14, 130 2, 140 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                </svg>
              </div>
            </div>

            {/* Main Hero Image: Large Rounded Border Radius */}
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white z-10 bg-slate-100">
              <img 
                src="/hero_woman.jpg" 
                className="w-full h-full object-cover" 
                alt="Professional Consultant working in modern office" 
              />
            </div>

            {/* Top-Right: Floating Circular Blue Shield Icon */}
            <div className="absolute -top-4 -right-3 sm:-right-6 z-30">
              <div className="w-14 h-14 rounded-full bg-white p-1 shadow-xl border border-slate-200 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Bottom-Right Floating Card: Secure & Private */}
            <div className="absolute -bottom-6 -right-3 sm:-right-6 bg-white p-4 sm:p-5 rounded-2xl shadow-2xl border border-slate-200 z-30 flex items-start gap-3.5 max-w-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900 leading-tight mb-1">Secure &amp; Private</span>
                <span className="text-xss text-slate-600 font-medium leading-relaxed">
                  End-to-end encrypted sessions for your complete privacy
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 ml-1.5 align-middle" />
                </span>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Bottom Statistics Bar */}
      <div className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 mt-2 z-20 pb-16">
        <div className="bg-white rounded-3xl py-6 px-8 sm:px-12 shadow-lg border border-slate-200 flex flex-wrap lg:flex-nowrap items-center justify-between gap-6 lg:gap-8">
          
          {/* Col 1 */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="text-2xl font-bold text-slate-900 leading-tight mb-0.5">10,000+</div>
              <div className="text-sm font-medium text-slate-600">Verified Professionals</div>
            </div>
          </div>

          <div className="w-px h-10 bg-slate-200 hidden lg:block" />

          {/* Col 2 */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="text-2xl font-bold text-slate-900 leading-tight mb-0.5">25,000+</div>
              <div className="text-sm font-medium text-slate-600">Consultations Completed</div>
            </div>
          </div>

          <div className="w-px h-10 bg-slate-200 hidden lg:block" />

          {/* Col 3 */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="text-2xl font-bold text-slate-900 leading-tight mb-0.5">4.9/5</div>
              <div className="text-sm font-medium text-slate-600">Average Client Rating</div>
            </div>
          </div>

          <div className="w-px h-10 bg-slate-200 hidden lg:block" />

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="text-2xl font-bold text-slate-900 leading-tight mb-0.5">100%</div>
              <div className="text-sm font-medium text-slate-600">Secure &amp; Private</div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Services Section */}
      <section className="max-w-[85rem] mx-auto px-6 sm:px-8 lg:px-12 py-20 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold tracking-wider uppercase mb-5">
            OUR SERVICES
          </div>
          <h2 className="text-4xl lg:text-[2.75rem] font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-4">
            Expertise for <span className="text-blue-600">every area of life</span>
          </h2>
          <p className="text-[15px] text-slate-600 leading-relaxed max-w-xl mx-auto font-medium">
            Get professional guidance across a wide range of categories <br className="hidden sm:block"/> from trusted experts.
          </p>
        </div>

        {/* Categories Tabs */}
        <div className="flex items-center justify-center w-full max-w-5xl mx-auto mb-10 overflow-x-auto no-scrollbar pb-2">
          <div className="flex items-center space-x-3 sm:space-x-8 shrink-0">
            {/* Active Tab */}
            <button className="flex items-center gap-2.5 px-6 py-3 rounded-[1rem] bg-blue-50 text-blue-600 font-bold transition-all">
              <LayoutGrid className="w-5 h-5" />
              <span className="text-sm">All Categories</span>
            </button>

            {/* Inactive Tabs */}
            <button className="flex items-center gap-2.5 px-3 py-2 text-slate-500 font-semibold hover:text-slate-800 transition-colors">
              <Scale className="w-5 h-5" /> <span className="text-sm">Legal</span>
            </button>

            <div className="hidden sm:block w-px h-5 bg-slate-200"></div>

            <button className="flex items-center gap-2.5 px-3 py-2 text-slate-500 font-semibold hover:text-slate-800 transition-colors">
              <Briefcase className="w-5 h-5" /> <span className="text-sm">Business</span>
            </button>

            <div className="hidden sm:block w-px h-5 bg-slate-200"></div>

            <button className="flex items-center gap-2.5 px-3 py-2 text-slate-500 font-semibold hover:text-slate-800 transition-colors">
              <Users className="w-5 h-5" /> <span className="text-sm">Relationships</span>
            </button>

            <div className="hidden sm:block w-px h-5 bg-slate-200"></div>

            <button className="flex items-center gap-2.5 px-3 py-2 text-slate-500 font-semibold hover:text-slate-800 transition-colors">
              <LineChart className="w-5 h-5" /> <span className="text-sm">Career</span>
            </button>

            <div className="hidden sm:block w-px h-5 bg-slate-200"></div>

            <button className="flex items-center gap-2.5 px-3 py-2 text-slate-500 font-semibold hover:text-slate-800 transition-colors">
              <DollarSign className="w-5 h-5" /> <span className="text-sm">Finance</span>
            </button>

            <button className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:shadow-md transition-all shrink-0 ml-4 hidden lg:flex">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          {/* Card 1: Legal Advice */}
          <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0_4px_25px_rgba(15,23,42,0.04)] border border-slate-50 flex flex-col group hover:-translate-y-1 transition-transform duration-300 hover:shadow-xl">
            <div className="h-36 w-full relative">
              <img src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&auto=format&fit=crop&q=80" alt="Legal Advice" className="w-full h-full object-cover" />
            </div>
            <div className="p-6 pt-0 relative flex-1 flex flex-col">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center -mt-7 mb-5 relative z-10 border border-slate-50">
                <Scale className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Legal Advice</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">Get clarity on your legal matters from experienced lawyers.</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-[18px] h-[18px] text-purple-600 mt-0.5 shrink-0" />
                  <span className="text-sm text-slate-600 font-medium">Contracts & Agreements</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-[18px] h-[18px] text-purple-600 mt-0.5 shrink-0" />
                  <span className="text-sm text-slate-600 font-medium">Family Law</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-[18px] h-[18px] text-purple-600 mt-0.5 shrink-0" />
                  <span className="text-sm text-slate-600 font-medium">Property Disputes</span>
                </li>
              </ul>
              <div className="mt-auto">
                <Link href="#" className="inline-flex items-center font-bold text-purple-600 hover:text-purple-700 text-sm group-hover:gap-2 gap-1.5 transition-all">
                  Find an Expert <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Business Consulting */}
          <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0_4px_25px_rgba(15,23,42,0.04)] border border-slate-50 flex flex-col group hover:-translate-y-1 transition-transform duration-300 hover:shadow-xl">
            <div className="h-36 w-full relative">
              <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=80" alt="Business Consulting" className="w-full h-full object-cover" />
            </div>
            <div className="p-6 pt-0 relative flex-1 flex flex-col">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center -mt-7 mb-5 relative z-10 border border-slate-50">
                <Briefcase className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Business Consulting</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">Grow your business with strategic advice from industry experts.</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-[18px] h-[18px] text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-slate-600 font-medium">Business Strategy</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-[18px] h-[18px] text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-slate-600 font-medium">Operations Management</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-[18px] h-[18px] text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-slate-600 font-medium">Startup Guidance</span>
                </li>
              </ul>
              <div className="mt-auto">
                <Link href="#" className="inline-flex items-center font-bold text-emerald-600 hover:text-emerald-700 text-sm group-hover:gap-2 gap-1.5 transition-all">
                  Find an Expert <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 3: Relationship Advice */}
          <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0_4px_25px_rgba(15,23,42,0.04)] border border-slate-50 flex flex-col group hover:-translate-y-1 transition-transform duration-300 hover:shadow-xl">
            <div className="h-36 w-full relative">
              <img src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=500&auto=format&fit=crop&q=80" alt="Relationship Advice" className="w-full h-full object-cover" />
            </div>
            <div className="p-6 pt-0 relative flex-1 flex flex-col">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center -mt-7 mb-5 relative z-10 border border-slate-50">
                <Users className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Relationship Advice</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">Improve relationships and build stronger connections.</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-[18px] h-[18px] text-amber-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-slate-600 font-medium">Marriage Counseling</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-[18px] h-[18px] text-amber-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-slate-600 font-medium">Communication Issues</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-[18px] h-[18px] text-amber-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-slate-600 font-medium">Relationship Coaching</span>
                </li>
              </ul>
              <div className="mt-auto">
                <Link href="#" className="inline-flex items-center font-bold text-amber-500 hover:text-amber-600 text-sm group-hover:gap-2 gap-1.5 transition-all">
                  Find an Expert <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 4: Career Coaching */}
          <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0_4px_25px_rgba(15,23,42,0.04)] border border-slate-50 flex flex-col group hover:-translate-y-1 transition-transform duration-300 hover:shadow-xl">
            <div className="h-36 w-full relative">
              <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format&fit=crop&q=80" alt="Career Coaching" className="w-full h-full object-cover" />
            </div>
            <div className="p-6 pt-0 relative flex-1 flex flex-col">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center -mt-7 mb-5 relative z-10 border border-slate-50">
                <LineChart className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Career Coaching</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">Advance your career with personalized coaching and guidance.</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-[18px] h-[18px] text-blue-600 mt-0.5 shrink-0" />
                  <span className="text-sm text-slate-600 font-medium">Career Planning</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-[18px] h-[18px] text-blue-600 mt-0.5 shrink-0" />
                  <span className="text-sm text-slate-600 font-medium">Resume & LinkedIn Review</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-[18px] h-[18px] text-blue-600 mt-0.5 shrink-0" />
                  <span className="text-sm text-slate-600 font-medium">Interview Preparation</span>
                </li>
              </ul>
              <div className="mt-auto">
                <Link href="#" className="inline-flex items-center font-bold text-blue-600 hover:text-blue-700 text-sm group-hover:gap-2 gap-1.5 transition-all">
                  Find an Expert <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="bg-slate-50 rounded-3xl p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6 lg:gap-10 w-full shadow-sm border border-slate-100">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0 relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-50/50"></div>
              <ClipboardList className="w-10 h-10 text-blue-600 relative z-10" />
              <Sparkles className="w-5 h-5 text-blue-400 absolute top-2 right-2 z-10" />
            </div>
            <div>
              <h3 className="text-[22px] font-extrabold text-slate-900 mb-1.5">Can&apos;t find what you need?</h3>
              <p className="text-[15px] text-slate-600 font-medium">Our experts cover 100+ areas of expertise. Tell us what you&apos;re looking for.</p>
            </div>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[15px] px-6 py-3.5 rounded-[12px] shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 w-full md:w-auto shrink-0">
            Request Custom Consultation <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Why Choose Fixpair Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-20 relative z-10">
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
                <h3 className="text-base font-bold text-slate-900 mb-1.5 relative z-10">Quick & Easy Process</h3>
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
                <h3 className="text-base font-bold text-slate-900 mb-1.5 relative z-10">Safe & Secure</h3>
                <p className="text-sm text-slate-600 leading-relaxed relative z-10">
                  End-to-end encrypted sessions for your complete peace of mind.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Real people. Real results. (Testimonials Section) */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10 relative z-10">
        <div className="bg-slate-50 rounded-[2.5rem] p-8 sm:p-10 lg:p-12 relative shadow-sm border border-slate-100">
          
          {/* Navigation Arrows */}
          <button onClick={prevTestimonial} className="hidden lg:flex absolute -left-5 lg:-left-6 xl:-left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-[0_4px_25px_rgba(15,23,42,0.08)] border border-slate-100 items-center justify-center text-slate-700 hover:text-blue-600 hover:scale-105 transition-all z-20">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={nextTestimonial} className="hidden lg:flex absolute -right-5 lg:-right-6 xl:-right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-[0_4px_25px_rgba(15,23,42,0.08)] border border-slate-100 items-center justify-center text-slate-700 hover:text-blue-600 hover:scale-105 transition-all z-20">
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 lg:gap-14">
            
            {/* Left Info Column */}
            <div className="lg:w-[32%] flex flex-col items-start shrink-0">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold tracking-wider uppercase mb-5">
                What Our Clients Say
              </div>

              <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-5">
                Real people. <br />
                <span className="text-blue-600">Real results.</span>
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed max-w-[320px] mb-8 font-medium">
                Thousands of clients have found the right advice and achieved their goals with the help of our experts.
              </p>

              <div className="flex items-center gap-3">
                <div className="flex -space-x-2.5 shrink-0">
                  <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Client 1" />
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Client 2" />
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm">
                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Client 3" />
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Client 4" />
                  </div>
                </div>
                
                <span className="inline-flex items-center justify-center bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                  2.5K+
                </span>
                
                <span className="text-sm font-bold text-slate-900">
                  Happy Clients
                </span>
              </div>
            </div>

            {/* Right 3 Testimonial Cards */}
            <div className="lg:w-[68%] w-full grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.slice(testIdx, testIdx + 3).map((testimonial, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-8 border-none shadow-[0_4px_25px_rgba(15,23,42,0.04)] flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(37,99,235,0.08)] transition-all duration-300">
                  <div>
                    <svg className="w-7 h-7 mb-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z" fill="#93C5FD" />
                    </svg>
                    <p className="text-[15px] text-slate-700 font-medium leading-relaxed mb-6 min-h-[70px]">
                      {testimonial.text}
                    </p>
                    <div className="flex items-center gap-0.5 mb-6">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <div className="pt-5 border-t border-slate-100 flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                      <img src={testimonial.avatar} className="w-full h-full object-cover" alt={testimonial.name} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 leading-tight">{testimonial.name}</span>
                      <span className="text-xs text-slate-500 font-medium mt-0.5">{testimonial.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Carousel Pagination Dots */}
          <div className="flex items-center justify-center gap-2 mt-10">
            {Array.from({ length: Math.ceil(TESTIMONIALS.length - 2) }).map((_, i) => (
              <button 
                key={i}
                onClick={() => setTestIdx(i)}
                className={`rounded-full transition-all duration-300 ${testIdx === i ? 'w-4 h-2 bg-blue-600' : 'w-2 h-2 bg-slate-200 hover:bg-slate-300'}`} 
              />
            ))}
          </div>

        </div>
      </section>

      {/* Our Process Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-20 relative z-10">
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          
          {/* Left Column: Title & Timeline Steps */}
          <div className="lg:w-[45%] w-full flex flex-col items-start space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xss font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Our Process
            </div>

            <h2 className="text-[2.75rem] lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Simple process. <br />
              <span className="text-blue-600">Powerful</span> results.
            </h2>

            <p className="text-base text-slate-600 leading-relaxed max-w-[460px] font-normal">
              We&apos;ve made it easy to connect with the right expert and get the guidance you need—fast and secure.
            </p>

            {/* Vertical Steps Timeline */}
            <div className="relative pl-6 space-y-8 pt-4 w-full">
              
              {/* Connecting Dashed Line */}
              <div className="absolute left-[39px] top-6 bottom-6 w-0.5 border-l-2 border-dashed border-blue-600/25" />

              {/* Step 01 */}
              <div className="relative flex items-start gap-5 group">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-sm border border-blue-100 z-10 group-hover:scale-105 transition-transform">
                  <Search className="w-5 h-5" />
                </div>
                <div className="flex flex-col pt-0.5">
                  <span className="text-xss font-bold text-blue-600 uppercase tracking-wider mb-1">01</span>
                  <h3 className="text-base font-bold text-slate-900 mb-1">Find the Right Expert</h3>
                  <p className="text-sm text-slate-600 leading-relaxed max-w-[340px]">
                    Browse profiles, read reviews, and choose the expert that best fits your needs.
                  </p>
                </div>
              </div>

              {/* Step 02 */}
              <div className="relative flex items-start gap-5 group">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-xsurple-600 flex items-center justify-center shrink-0 shadow-sm border border-purple-100 z-10 group-hover:scale-105 transition-transform">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="flex flex-col pt-0.5">
                  <span className="text-xss font-bold text-xsurple-600 uppercase tracking-wider mb-1">02</span>
                  <h3 className="text-base font-bold text-slate-900 mb-1">Book Your Session</h3>
                  <p className="text-sm text-slate-600 leading-relaxed max-w-[340px]">
                    Pick a convenient time and book your consultation in just a few clicks.
                  </p>
                </div>
              </div>

              {/* Step 03 */}
              <div className="relative flex items-start gap-5 group">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm border border-emerald-100 z-10 group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="flex flex-col pt-0.5">
                  <span className="text-xss font-bold text-emerald-600 uppercase tracking-wider mb-1">03</span>
                  <h3 className="text-base font-bold text-slate-900 mb-1">Get Expert Advice</h3>
                  <p className="text-sm text-slate-600 leading-relaxed max-w-[340px]">
                    Connect, discuss your concerns, and get actionable advice that makes a difference.
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Live Video Consultation & Session Summary Mockup */}
          <div className="lg:w-[55%] w-full flex flex-col items-center relative">
            
            {/* Background Blob & Decorative Elements */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-100/40 via-purple-50/30 to-blue-50/50 rounded-[3rem] blur-xl -z-10" />
            
            {/* Dot Grid Motif */}
            <div className="absolute -left-6 top-12 z-0 hidden sm:grid grid-cols-5 gap-2.5 opacity-35">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              ))}
            </div>

            {/* Doodle arrow pointing to video */}
            <div className="absolute -top-4 -right-2 text-blue-600 hidden sm:block">
              <svg className="w-10 h-10 -rotate-12" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M40 10 C30 20, 20 15, 10 35 M10 35 L12 25 M10 35 L20 37" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="relative w-full max-w-[560px]">
              
              {/* Main Video Call Card */}
              <div className="bg-white rounded-3xl p-3 sm:p-4 shadow-2xl border border-slate-200 relative z-10">
                
                {/* Header status */}
                <div className="flex items-center justify-between px-3 py-1.5 mb-2 text-[12px] font-medium text-slate-500 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">Consultation</span>
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-xss bg-emerald-50 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                    </span>
                  </div>
                  <span className="font-mono text-slate-400">00:28:34</span>
                </div>

                {/* Main Video Frame */}
                <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900 shadow-inner">
                  <img 
                    src="/hero_woman.jpg" 
                    alt="Consultant Video Stream" 
                    className="w-full h-full object-cover" 
                  />

                  {/* Picture-in-Picture Client Stream */}
                  <div className="absolute top-3 right-3 w-32 sm:w-36 aspect-[4/3] rounded-xl overflow-hidden border-2 border-white shadow-lg bg-slate-800">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80" 
                      alt="Client Video Stream" 
                      className="w-full h-full object-cover" 
                    />
                    {/* Audio Level Graphic */}
                    <div className="absolute bottom-1.5 right-1.5 flex items-end gap-0.5 bg-black/50 backdrop-blur-sm px-1.5 py-1 rounded">
                      <span className="w-1 h-1.5 bg-emerald-400 rounded-full" />
                      <span className="w-1 h-3 bg-emerald-400 rounded-full" />
                      <span className="w-1 h-2 bg-emerald-400 rounded-full" />
                    </div>
                  </div>

                  {/* Bottom Video Floating Controls */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-3 shadow-lg border border-slate-100">
                    <button className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors">
                      <Mic className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors">
                      <Video className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-colors shadow-sm">
                      <PhoneOff className="w-4 h-4" />
                    </button>
                  </div>

                </div>

              </div>

              {/* Floating Session Summary Card (Overlapping Right) */}
              <div className="absolute -bottom-8 -right-4 sm:-right-8 bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-[0_15px_35px_rgba(15,23,42,0.12)] border border-slate-200 z-20 w-[230px] sm:w-[250px] flex flex-col gap-3">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[12px] font-bold text-slate-900">Session Summary</span>
                </div>

                <div className="space-y-1.5 text-xss font-medium text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Issue Discussed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Key Points</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Expert Recommendations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Next Steps</span>
                  </div>
                </div>

                <button className="w-full mt-1 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 text-xss font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all">
                  <Download className="w-3.5 h-3.5" />
                  Download Report
                </button>
              </div>

            </div>

            {/* Bottom Security Info Badge */}
            <div className="mt-12 inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-blue-50 text-slate-600 text-[12px] font-medium border border-slate-200 shadow-sm">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              <span>End-to-end encrypted</span>
              <span className="text-slate-300">•</span>
              <span>100% private</span>
              <span className="text-slate-300">•</span>
              <span>Your data is always secure</span>
            </div>

          </div>

        </div>

      </section>

      {/* Ready to get expert advice? (Conversion Section) */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10 lg:py-16 relative z-10">
        <div className="bg-gradient-to-b from-[#F5F8FE] to-[#F8FAFD] rounded-[2.5rem] border border-slate-200 p-8 sm:p-12 lg:p-14 relative shadow-[0_10px_40px_-15px_rgba(15,23,42,0.04)]">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Col: Trophy Card */}
            <div className="lg:col-span-3 flex flex-col items-center text-center">
              
              <div className="w-20 h-20 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm mb-4">
                <Trophy className="w-10 h-10" />
              </div>

              <div className="flex -space-x-2 mb-4">
                <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-sm">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="User 1" />
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-sm">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="User 2" />
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-sm">
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="User 3" />
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-sm">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="User 4" />
                </div>
              </div>

              <div className="bg-white rounded-2xl px-5 py-3 border border-slate-200 shadow-sm w-full max-w-[200px]">
                <div className="text-lg font-bold text-blue-600 leading-tight">25,000+</div>
                <div className="text-xss font-medium text-slate-600">Successful Consultations</div>
              </div>

            </div>

            {/* Center Col: Text & Buttons */}
            <div className="lg:col-span-5 flex flex-col items-start">
              
              <h2 className="text-[2.25rem] lg:text-[2.75rem] font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-3">
                Ready to get expert advice?
              </h2>

              <p className="text-base text-slate-600 leading-relaxed max-w-[420px] mb-6">
                Join thousands of people who&apos;ve found the right solutions with the help of trusted professionals.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-xl text-sm font-bold transition-all shadow-xl shadow-blue-600/30">
                  Find an Expert
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button className="w-full sm:w-auto flex items-center justify-center bg-white border border-blue-600/40 hover:bg-blue-50/50 text-blue-600 px-7 py-3.5 rounded-xl text-sm font-bold transition-all">
                  Become a Consultant
                </button>
              </div>

            </div>

            {/* Right Col: 3 Trust Rows */}
            <div className="lg:col-span-4 flex flex-col gap-4 border-t lg:border-t-0 lg:border-l border-slate-200 pt-6 lg:pt-0 lg:pl-8">
              
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900 leading-tight mb-0.5">Trusted by Thousands</span>
                  <span className="text-[12px] text-slate-600">Professionals across Germany you can rely on.</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900 leading-tight mb-0.5">Save Time &amp; Effort</span>
                  <span className="text-[12px] text-slate-600">Get the right advice without the endless search.</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <ThumbsUp className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900 leading-tight mb-0.5">Satisfaction Guaranteed</span>
                  <span className="text-[12px] text-slate-600">We&apos;re here until you get the answers you need.</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Our Services / Expertise for every area of life Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-24 relative z-10">
        
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
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 text-sm font-bold shadow-sm transition-all">
              <LayoutGrid className="w-4 h-4" />
              <span>All Categories</span>
            </button>

            <div className="w-px h-5 bg-slate-200 hidden sm:block mx-1" />

            {/* Tab 2: Legal */}
            <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-50 text-sm font-semibold transition-all">
              <Scale className="w-4 h-4" />
              <span>Legal</span>
            </button>

            <div className="w-px h-5 bg-slate-200 hidden sm:block mx-1" />

            {/* Tab 3: Business */}
            <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-50 text-sm font-semibold transition-all">
              <Briefcase className="w-4 h-4" />
              <span>Business</span>
            </button>

            <div className="w-px h-5 bg-slate-200 hidden sm:block mx-1" />

            {/* Tab 4: Relationships */}
            <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-50 text-sm font-semibold transition-all">
              <Users className="w-4 h-4" />
              <span>Relationships</span>
            </button>

            <div className="w-px h-5 bg-slate-200 hidden sm:block mx-1" />

            {/* Tab 5: Career */}
            <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-50 text-sm font-semibold transition-all">
              <TrendingUp className="w-4 h-4" />
              <span>Career</span>
            </button>

            <div className="w-px h-5 bg-slate-200 hidden sm:block mx-1" />

            {/* Tab 6: Finance */}
            <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-50 text-sm font-semibold transition-all">
              <DollarSign className="w-4 h-4" />
              <span>Finance</span>
            </button>

            {/* Right Arrow Button */}
            <button className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors ml-1">
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
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-xsurple-600 shadow-md flex items-center justify-center -mt-6 relative z-10">
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
                    <CheckCircle2 className="w-4 h-4 text-xsurple-500 shrink-0" />
                    <span>Contracts &amp; Agreements</span>
                  </div>
                  <div className="flex items-center gap-2 text-[12px] font-medium text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-xsurple-500 shrink-0" />
                    <span>Family Law</span>
                  </div>
                  <div className="flex items-center gap-2 text-[12px] font-medium text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-xsurple-500 shrink-0" />
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

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-xl text-sm font-bold transition-all shadow-[0_4px_14px_rgba(37,99,235,0.25)] shrink-0 flex items-center gap-2">
            Request Custom Consultation
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </section>

      {/* Meet our top verified experts Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-24 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xss font-bold tracking-wider uppercase mb-4 border border-slate-200 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Top Experts
            </div>
            <h2 className="text-3xl lg:text-[2.6rem] font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Meet our top <span className="text-blue-600">verified experts</span>
            </h2>
            <p className="text-sm text-slate-600 font-normal max-w-md mt-2 leading-relaxed">
              Browse handpicked professionals with proven experience and excellent client feedback.
            </p>
          </div>

          <Link href="#" className="inline-flex items-center gap-2 bg-white border border-blue-600/40 hover:border-blue-600 hover:bg-blue-50/50 text-blue-600 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm shrink-0">
            View All Experts
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Carousel Container with Left/Right Arrow Buttons */}
        <div className="relative">
          
          {/* Navigation Arrows */}
          <button className="hidden sm:flex absolute -left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-[0_4px_15px_rgba(0,0,0,0.08)] border border-slate-200 items-center justify-center text-slate-700 hover:text-blue-600 hover:scale-105 transition-all z-20">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="hidden sm:flex absolute -right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-[0_4px_15px_rgba(0,0,0,0.08)] border border-slate-200 items-center justify-center text-slate-700 hover:text-blue-600 hover:scale-105 transition-all z-20">
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* 4 Expert Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Expert 1: Sarah Johnson */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.04)] hover:shadow-[0_15px_35px_rgba(37,99,235,0.08)] hover:border-blue-200 transition-all duration-300 p-6 flex flex-col justify-between group">
              <div>
                {/* Header row: Pill & Verified Icon */}
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-purple-50 text-xsurple-700 text-xss font-bold px-2.5 py-1 rounded-md">
                    Legal Advice
                  </span>
                  <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>

                {/* Avatar & Name */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                    <img 
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80" 
                      alt="Sarah Johnson" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-[17px] font-bold text-slate-900 leading-tight mb-1">Sarah Johnson</h3>
                    <span className="text-[12px] text-slate-600 font-medium">Senior Legal Consultant</span>
                  </div>
                </div>

                {/* Rating & Exp Row */}
                <div className="flex items-center gap-2 text-[12px] text-slate-600 mb-5">
                  <div className="flex items-center gap-1 font-bold text-slate-900">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>4.9</span>
                  </div>
                  <span className="text-slate-400">(128 reviews)</span>
                  <span className="text-slate-300">|</span>
                  <span className="font-medium text-slate-900">8+ years exp.</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  <span className="bg-slate-50 text-slate-600 text-xss font-medium px-2.5 py-1 rounded-lg border border-slate-100">
                    Contracts
                  </span>
                  <span className="bg-slate-50 text-slate-600 text-xss font-medium px-2.5 py-1 rounded-lg border border-slate-100">
                    Disputes
                  </span>
                  <span className="bg-slate-50 text-slate-600 text-xss font-medium px-2.5 py-1 rounded-lg border border-slate-100">
                    Corporate Law
                  </span>
                </div>
              </div>

              {/* Bottom Link */}
              <Link href="#" className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 group-hover:gap-2.5 transition-all pt-2 border-t border-slate-100">
                View Profile <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Expert 2: Michael Chen */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.04)] hover:shadow-[0_15px_35px_rgba(16,185,129,0.08)] hover:border-emerald-200 transition-all duration-300 p-6 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-emerald-50 text-emerald-700 text-xss font-bold px-2.5 py-1 rounded-md">
                    Business Consulting
                  </span>
                  <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80" 
                      alt="Michael Chen" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-[17px] font-bold text-slate-900 leading-tight mb-1">Michael Chen</h3>
                    <span className="text-[12px] text-slate-600 font-medium">Business Strategist</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[12px] text-slate-600 mb-5">
                  <div className="flex items-center gap-1 font-bold text-slate-900">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>4.8</span>
                  </div>
                  <span className="text-slate-400">(96 reviews)</span>
                  <span className="text-slate-300">|</span>
                  <span className="font-medium text-slate-900">10+ years exp.</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  <span className="bg-slate-50 text-slate-600 text-xss font-medium px-2.5 py-1 rounded-lg border border-slate-100">
                    Strategy
                  </span>
                  <span className="bg-slate-50 text-slate-600 text-xss font-medium px-2.5 py-1 rounded-lg border border-slate-100">
                    Operations
                  </span>
                  <span className="bg-slate-50 text-slate-600 text-xss font-medium px-2.5 py-1 rounded-lg border border-slate-100">
                    Growth
                  </span>
                </div>
              </div>

              <Link href="#" className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 group-hover:gap-2.5 transition-all pt-2 border-t border-slate-100">
                View Profile <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Expert 3: Emily Davis */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.04)] hover:shadow-[0_15px_35px_rgba(245,158,11,0.08)] hover:border-amber-200 transition-all duration-300 p-6 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-amber-50 text-amber-700 text-xss font-bold px-2.5 py-1 rounded-md">
                    Relationship Advice
                  </span>
                  <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                    <img 
                      src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80" 
                      alt="Emily Davis" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-[17px] font-bold text-slate-900 leading-tight mb-1">Emily Davis</h3>
                    <span className="text-[12px] text-slate-600 font-medium">Relationship Coach</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[12px] text-slate-600 mb-5">
                  <div className="flex items-center gap-1 font-bold text-slate-900">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>4.9</span>
                  </div>
                  <span className="text-slate-400">(112 reviews)</span>
                  <span className="text-slate-300">|</span>
                  <span className="font-medium text-slate-900">6+ years exp.</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  <span className="bg-slate-50 text-slate-600 text-xss font-medium px-2.5 py-1 rounded-lg border border-slate-100">
                    Communication
                  </span>
                  <span className="bg-slate-50 text-slate-600 text-xss font-medium px-2.5 py-1 rounded-lg border border-slate-100">
                    Marriage
                  </span>
                  <span className="bg-slate-50 text-slate-600 text-xss font-medium px-2.5 py-1 rounded-lg border border-slate-100">
                    Counseling
                  </span>
                </div>
              </div>

              <Link href="#" className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 group-hover:gap-2.5 transition-all pt-2 border-t border-slate-100">
                View Profile <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Expert 4: David Wilson */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.04)] hover:shadow-[0_15px_35px_rgba(37,99,235,0.08)] hover:border-blue-200 transition-all duration-300 p-6 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-blue-50 text-blue-700 text-xss font-bold px-2.5 py-1 rounded-md">
                    Career Coaching
                  </span>
                  <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                    <img 
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80" 
                      alt="David Wilson" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-[17px] font-bold text-slate-900 leading-tight mb-1">David Wilson</h3>
                    <span className="text-[12px] text-slate-600 font-medium">Career Coach</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[12px] text-slate-600 mb-5">
                  <div className="flex items-center gap-1 font-bold text-slate-900">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>4.8</span>
                  </div>
                  <span className="text-slate-400">(76 reviews)</span>
                  <span className="text-slate-300">|</span>
                  <span className="font-medium text-slate-900">7+ years exp.</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  <span className="bg-slate-50 text-slate-600 text-xss font-medium px-2.5 py-1 rounded-lg border border-slate-100">
                    Career Growth
                  </span>
                  <span className="bg-slate-50 text-slate-600 text-xss font-medium px-2.5 py-1 rounded-lg border border-slate-100">
                    Resume
                  </span>
                  <span className="bg-slate-50 text-slate-600 text-xss font-medium px-2.5 py-1 rounded-lg border border-slate-100">
                    Interview Prep
                  </span>
                </div>
              </div>

              <Link href="#" className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 group-hover:gap-2.5 transition-all pt-2 border-t border-slate-100">
                View Profile <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

          {/* Carousel Indicator Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-8">
            <div className="w-5 h-1.5 rounded-full bg-blue-600" />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          </div>

        </div>

        {/* Can't find the right expert? Match Card */}
        <div className="bg-gradient-to-r from-[#F5F8FE] via-white to-[#F5F8FE] rounded-[2.25rem] border border-slate-200 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 mt-16 shadow-[0_4px_25px_rgba(15,23,42,0.03)]">
          
          <div className="flex items-center gap-6 text-center sm:text-left flex-col sm:flex-row">
            {/* Robot Orb Graphic */}
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shrink-0">
              <Bot className="w-10 h-10" />
              {/* Floating badges around orb */}
              <div className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-blue-600">
                <Calendar className="w-3 h-3" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-blue-600">
                <ShieldCheck className="w-3 h-3" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-blue-600">
                <Users className="w-3 h-3" />
              </div>
            </div>

            <div className="flex flex-col">
              <h3 className="text-2xl font-extrabold text-slate-900 mb-1">Can&apos;t find the right expert?</h3>
              <p className="text-sm text-slate-600">
                Tell us what you need, and we&apos;ll match you with the perfect professional.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-end shrink-0">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-xl text-sm font-bold transition-all shadow-[0_4px_16px_rgba(37,99,235,0.3)] flex items-center gap-2">
              Request a Custom Consultation
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 text-[12px] text-slate-600 font-medium mt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>No commitment</span>
              <span className="text-slate-300">•</span>
              <span>100% free</span>
            </div>
          </div>

        </div>

        {/* Bottom 4 Trust Pillars Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-16 pt-12 border-t border-slate-200">
          
          {/* Pillar 1 */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-sm border border-blue-100">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <h4 className="text-sm font-bold text-slate-900 mb-1">Your trust is our priority</h4>
              <p className="text-[12px] text-slate-600 leading-relaxed">We ensure a safe and reliable experience for every client.</p>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-xsurple-600 flex items-center justify-center shrink-0 shadow-sm border border-purple-100">
              <Lock className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <h4 className="text-sm font-bold text-slate-900 mb-1">Secure &amp; Private</h4>
              <p className="text-[12px] text-slate-600 leading-relaxed">End-to-end encrypted sessions and data protection.</p>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm border border-emerald-100">
              <Users className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <h4 className="text-sm font-bold text-slate-900 mb-1">Verified Professionals</h4>
              <p className="text-[12px] text-slate-600 leading-relaxed">All experts are thoroughly screened and verified.</p>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 shadow-sm border border-amber-100">
              <Award className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <h4 className="text-sm font-bold text-slate-900 mb-1">Satisfaction Guaranteed</h4>
              <p className="text-[12px] text-slate-600 leading-relaxed">We&apos;re here until you get the results you need.</p>
            </div>
          </div>

        </div>

      </section>

      {/* Mobile App Section */}
      <section className="relative w-full bg-white py-12 lg:py-16 z-10 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 mb-16">
            {/* Left Column: Content */}
            <div className="flex-1 w-full flex flex-col items-start text-left relative z-20">
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#F0F6FF] text-blue-700 text-xss font-bold tracking-wider uppercase mb-6">
                <Download className="w-3.5 h-3.5" />
                OUR MOBILE APP
              </div>
              
              <h2 className="text-4xl lg:text-[2.75rem] font-bold text-[#0B1B3D] tracking-tight mb-4 leading-tight">
                Expert Help,<br />
                Right in Your <span className="text-blue-600">Pocket</span>
              </h2>
              
              <p className="text-base text-slate-500 font-medium mb-10 max-w-md leading-relaxed">
                Connect with experts, book sessions, and get personalized advice anytime, anywhere.
              </p>

              <div className="flex flex-col gap-6 mb-10 w-full">
                
                {/* Feature 1 */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F0F6FF] flex items-center justify-center shrink-0">
                    <CalendarDays className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex flex-col pt-0.5">
                    <h4 className="text-base font-bold text-slate-900 mb-1">Book on the Go</h4>
                    <p className="text-sm text-slate-500 font-medium">Find experts and book sessions in just a few taps.</p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F0F6FF] flex items-center justify-center shrink-0">
                    <Video className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex flex-col pt-0.5">
                    <h4 className="text-base font-bold text-slate-900 mb-1">Secure Video Consultations</h4>
                    <p className="text-sm text-slate-500 font-medium">Join private, high-quality video calls from anywhere.</p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F0F6FF] flex items-center justify-center shrink-0">
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex flex-col pt-0.5">
                    <h4 className="text-base font-bold text-slate-900 mb-1">Chat & Messages</h4>
                    <p className="text-sm text-slate-500 font-medium">Stay connected with experts before and after sessions.</p>
                  </div>
                </div>

                {/* Feature 4 */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F0F6FF] flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex flex-col pt-0.5">
                    <h4 className="text-base font-bold text-slate-900 mb-1">Get Your Reports</h4>
                    <p className="text-sm text-slate-500 font-medium">Receive detailed reports and recommendations instantly.</p>
                  </div>
                </div>

              </div>

              {/* App Store Buttons */}
              <div className="flex items-center gap-4">
                <button className="bg-slate-900 hover:bg-black transition-colors rounded-xl px-5 py-2.5 flex items-center gap-3 shadow-md hover:shadow-lg hover:-translate-y-0.5 duration-200">
                  <svg viewBox="0 0 384 512" className="w-6 h-6 fill-white"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] text-white/80 font-medium leading-none mb-1 tracking-wide">Download on the</span>
                    <span className="text-base text-white font-bold leading-none tracking-tight">App Store</span>
                  </div>
                </button>

                <button className="bg-slate-900 hover:bg-black transition-colors rounded-xl px-5 py-2.5 flex items-center gap-3 shadow-md hover:shadow-lg hover:-translate-y-0.5 duration-200">
                  <svg viewBox="0 0 512 512" className="w-6 h-6 fill-white"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/></svg>
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] text-white/80 font-medium leading-none mb-1 tracking-wide">GET IT ON</span>
                    <span className="text-base text-white font-bold leading-none tracking-tight">Google Play</span>
                  </div>
                </button>
              </div>

            </div>

            {/* Right Column: Image */}
            <div className="flex-1 w-full relative flex items-center justify-center lg:justify-end mt-12 lg:mt-0">
              
              {/* Decorative Solid Blue Circle Background */}
              <div className="absolute top-1/2 left-1/2 -translate-x-[40%] -translate-y-1/2 w-[400px] md:w-[600px] lg:w-[700px] h-[400px] md:h-[600px] lg:h-[700px] bg-[#F0F6FF] rounded-full pointer-events-none -z-20" />
              
              {/* Dotted Patterns */}
              <svg className="absolute top-0 right-0 w-24 h-24 text-slate-200 opacity-60 pointer-events-none -z-10 translate-x-1/4" fill="none" viewBox="0 0 100 100">
                <pattern id="dots_app_rt" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="2" fill="currentColor" />
                </pattern>
                <rect width="100" height="100" fill="url(#dots_app_rt)" />
              </svg>
              
              <svg className="absolute bottom-10 left-10 w-24 h-24 text-slate-200 opacity-60 pointer-events-none -z-10 -translate-x-1/4" fill="none" viewBox="0 0 100 100">
                <pattern id="dots_app_lb" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="2" fill="currentColor" />
                </pattern>
                <rect width="100" height="100" fill="url(#dots_app_lb)" />
              </svg>

              <div className="relative z-10 w-full max-w-[500px] h-[550px] flex items-center justify-center -ml-4 lg:ml-0">
                
                {/* Phone 1 (Back Left) */}
                <div className="absolute left-0 lg:left-4 top-20 w-[240px] h-[480px] bg-[#FAFCFF] rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col border-[6px] border-slate-900 z-10 origin-bottom-left">
                  {/* Dynamic Island */}
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-6 bg-slate-900 rounded-full z-20" />
                  
                  {/* Screen Content - Left Phone */}
                  <div className="flex-1 w-full relative z-10 pt-12 px-4 pb-6 flex flex-col gap-5">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-medium text-slate-500">Good Morning,</span>
                        <span className="text-base font-bold text-slate-900">Jessica 👋</span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center">
                        <div className="w-3 h-3 bg-blue-100 rounded-full" />
                      </div>
                    </div>
                    
                    {/* Search */}
                    <div className="w-full h-10 bg-white border border-slate-100 shadow-sm rounded-xl flex items-center px-3 gap-2">
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[10px] text-slate-400">Search experts or categories</span>
                    </div>

                    {/* Upcoming Session */}
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-bold text-slate-900">Upcoming Session</span>
                      <div className="w-full bg-white border border-slate-100 shadow-sm rounded-xl p-3 flex flex-col gap-3">
                        <div className="flex gap-3">
                          <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop" alt="Dr. Daniel" className="w-10 h-10 rounded-full object-cover" />
                          <div className="flex flex-col">
                            <span className="text-[12px] font-bold text-slate-900">Dr. Daniel Carter</span>
                            <span className="text-[9px] text-slate-500">Medical Specialist</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center gap-1.5 text-[9px] font-medium text-slate-500">
                            <CalendarDays className="w-3 h-3" /> Today, 10:00 AM
                          </div>
                          <button className="bg-blue-600 text-white text-[9px] font-bold px-3 py-1.5 rounded-lg">Join Session</button>
                        </div>
                      </div>
                    </div>

                    {/* Top Experts */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900">Top Experts</span>
                        <span className="text-[10px] font-bold text-blue-600">View all</span>
                      </div>
                      <div className="w-full bg-white border border-slate-100 shadow-sm rounded-xl p-3 flex items-center gap-3">
                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop" alt="Sarah" className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex flex-col">
                          <span className="text-[12px] font-bold text-slate-900">Sarah Mitchell</span>
                          <span className="text-[9px] text-slate-500">Legal Advisor</span>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Star className="w-2.5 h-2.5 text-blue-600 fill-blue-600" />
                            <span className="text-[9px] font-bold text-slate-700">4.9</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Phone 2 (Front Right) */}
                <div className="absolute right-0 top-0 w-[270px] h-[550px] bg-white rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col border-[8px] border-slate-900 z-20">
                  {/* Dynamic Island */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-7 bg-slate-900 rounded-full z-20" />
                  
                  {/* Screen Content - Right Phone */}
                  <div className="flex-1 w-full relative z-10 pt-14 px-5 pb-6 flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-6 h-6 flex flex-col justify-center gap-1 text-slate-900">
                        <div className="w-4 h-0.5 bg-slate-900 rounded-full" />
                        <div className="w-3 h-0.5 bg-slate-900 rounded-full" />
                        <div className="w-4 h-0.5 bg-slate-900 rounded-full" />
                      </div>
                      <span className="text-sm font-bold text-slate-900">Hello, Jessica</span>
                      <div className="w-8 h-8 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-blue-100" />
                      </div>
                    </div>
                    
                    <h3 className="text-xsxl font-bold text-slate-900 leading-[1.15] mb-6">
                      Find the Right<br/><span className="text-blue-600">Expert</span> for You
                    </h3>
                    
                    <p className="text-xss text-slate-500 font-medium mb-6 leading-relaxed pr-4">
                      Get professional advice from verified experts across various fields.
                    </p>
                    
                    {/* Search */}
                    <div className="w-full h-12 bg-[#FAFCFF] border border-blue-100 rounded-xl mb-8 flex items-center px-1">
                       <div className="flex-1 pl-3 text-xss text-slate-400 font-medium">Search experts or categories</div>
                       <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm">
                         <Search className="w-4 h-4" strokeWidth={3} />
                       </div>
                    </div>

                    {/* Popular Categories */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-bold text-slate-900">Popular Categories</span>
                      <span className="text-xss font-bold text-blue-600">View all</span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mb-8">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-2xl bg-[#F0F6FF] flex items-center justify-center text-blue-600">
                          <Scale className="w-5 h-5" />
                        </div>
                        <span className="text-[9px] font-bold text-slate-600">Legal</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-2xl bg-[#F0F6FF] flex items-center justify-center text-blue-600">
                          <Briefcase className="w-5 h-5" />
                        </div>
                        <span className="text-[9px] font-bold text-slate-600">Business</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-2xl bg-[#F0F6FF] flex items-center justify-center text-blue-600">
                          <HeartPulse className="w-5 h-5" />
                        </div>
                        <span className="text-[9px] font-bold text-slate-600">Medical</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-2xl bg-[#F0F6FF] flex items-center justify-center text-blue-600">
                          <LineChart className="w-5 h-5" />
                        </div>
                        <span className="text-[9px] font-bold text-slate-600">Finance</span>
                      </div>
                    </div>
                    
                    {/* Promo Banner */}
                    <div className="flex-1 w-full bg-blue-50/80 border border-blue-100/50 rounded-2xl flex flex-col justify-center px-5 relative overflow-hidden mb-2">
                      <div className="relative z-10 w-2/3">
                        <span className="text-sm font-bold text-slate-900 leading-tight block mb-2">Book your first session and get 10% OFF</span>
                        <span className="text-[9px] font-medium text-slate-500">Limited time offer for new users!</span>
                      </div>
                      <div className="absolute -right-4 bottom-0 w-28 h-28 opacity-20 bg-blue-600 rounded-full blur-2xl" />
                    </div>
                    
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom CTA Banner with Stats */}
          <div className="bg-[#FAFCFF] rounded-[2rem] p-8 lg:p-10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 relative z-20 w-full max-w-[1100px] mx-auto border border-slate-100/50">
            
            {/* Stats Area */}
            <div className="flex flex-wrap md:flex-nowrap items-center justify-around w-full lg:w-auto flex-1 gap-6 lg:gap-8">
              
              {/* Stat 1 */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full border-[1.5px] border-blue-200 bg-transparent flex items-center justify-center shrink-0 text-blue-600">
                  <Download className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-slate-900 leading-tight">10K+</span>
                  <span className="text-sm font-medium text-slate-500">Downloads</span>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full border-[1.5px] border-blue-200 bg-transparent flex items-center justify-center shrink-0 text-blue-600">
                  <Star className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-slate-900 leading-tight">4.9</span>
                  <span className="text-sm font-medium text-slate-500">Average Rating</span>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full border-[1.5px] border-blue-200 bg-transparent flex items-center justify-center shrink-0 text-blue-600">
                  <ShieldCheck className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-slate-900 leading-tight">100%</span>
                  <span className="text-sm font-medium text-slate-500">Secure & Private</span>
                </div>
              </div>

              {/* Stat 4 */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full border-[1.5px] border-blue-200 bg-transparent flex items-center justify-center shrink-0 text-blue-600">
                  <Users className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-slate-900 leading-tight">50K+</span>
                  <span className="text-sm font-medium text-slate-500">Happy Users</span>
                </div>
              </div>
              
            </div>

            <div className="w-full h-px bg-slate-200 block lg:hidden" />
            <div className="w-px h-16 bg-slate-200 hidden lg:block opacity-70" />

            {/* QR Code Area */}
            <div className="flex items-center gap-5 min-w-[220px] justify-center lg:justify-end shrink-0">
              <div className="flex flex-col text-center lg:text-left">
                <h3 className="text-sm font-bold text-slate-900 mb-0.5">Scan to Download</h3>
                <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
                  Get the app now<br />and start your journey!
                </p>
              </div>
              <div className="w-[72px] h-[72px] bg-white border border-slate-200 rounded-lg shadow-sm p-1.5 flex items-center justify-center shrink-0">
                <QrCode className="w-full h-full text-slate-800" strokeWidth={1} />
              </div>
            </div>

          </div>

        </div>
      </section>

      <PricingSection />

      <FaqSection />

      <CtaSection />

      <Footer />

    </div>
  );
}
