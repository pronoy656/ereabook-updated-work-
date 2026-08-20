"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="relative z-50 bg-transparent">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-6 flex items-center justify-between">
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
  );
}
