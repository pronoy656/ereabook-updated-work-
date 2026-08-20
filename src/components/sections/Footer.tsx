import React from 'react';
import Link from 'next/link';
import { Twitter, Instagram, Linkedin, Facebook, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#0B1426] pt-20 pb-10 relative overflow-hidden text-white z-0">
      
      {/* Background glowing effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1300px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column (Spans 4) */}
          <div className="lg:col-span-4 flex flex-col items-start pr-0 lg:pr-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] group-hover:scale-105 transition-transform">
                E
              </div>
              <span className="text-[22px] font-bold tracking-tight text-white">Ebreabuk</span>
            </Link>
            
            <p className="text-[15px] text-slate-400 font-medium leading-relaxed mb-8 max-w-[320px]">
              The world's leading platform connecting you with verified experts across business, health, finance, and legal fields instantly.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-300">
                <Twitter className="w-4 h-4 fill-current" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-300">
                <Facebook className="w-4 h-4 fill-current" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-300">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-300">
                <Linkedin className="w-4 h-4 fill-current" />
              </a>
            </div>
          </div>

          {/* Platform Links (Spans 2) */}
          <div className="lg:col-span-2 lg:col-start-6 flex flex-col">
            <h4 className="text-[16px] font-bold text-white mb-6">Platform</h4>
            <ul className="flex flex-col gap-4">
              <li><Link href="#" className="text-[14px] text-slate-400 hover:text-blue-400 font-medium transition-colors">Browse Experts</Link></li>
              <li><Link href="#" className="text-[14px] text-slate-400 hover:text-blue-400 font-medium transition-colors">Categories</Link></li>
              <li><Link href="#" className="text-[14px] text-slate-400 hover:text-blue-400 font-medium transition-colors">How it Works</Link></li>
              <li><Link href="#" className="text-[14px] text-slate-400 hover:text-blue-400 font-medium transition-colors">Pricing</Link></li>
              <li><Link href="#" className="text-[14px] text-slate-400 hover:text-blue-400 font-medium transition-colors">Success Stories</Link></li>
            </ul>
          </div>

          {/* Company Links (Spans 2) */}
          <div className="lg:col-span-2 flex flex-col">
            <h4 className="text-[16px] font-bold text-white mb-6">Company</h4>
            <ul className="flex flex-col gap-4">
              <li><Link href="#" className="text-[14px] text-slate-400 hover:text-blue-400 font-medium transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-[14px] text-slate-400 hover:text-blue-400 font-medium transition-colors flex items-center gap-2">Careers <span className="bg-blue-600/20 text-blue-400 text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Hiring</span></Link></li>
              <li><Link href="#" className="text-[14px] text-slate-400 hover:text-blue-400 font-medium transition-colors">Press</Link></li>
              <li><Link href="#" className="text-[14px] text-slate-400 hover:text-blue-400 font-medium transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-[14px] text-slate-400 hover:text-blue-400 font-medium transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Support Links (Spans 2) */}
          <div className="lg:col-span-2 flex flex-col">
            <h4 className="text-[16px] font-bold text-white mb-6">Support</h4>
            <ul className="flex flex-col gap-4">
              <li><Link href="#" className="text-[14px] text-slate-400 hover:text-blue-400 font-medium transition-colors">Help Center</Link></li>
              <li><Link href="#" className="text-[14px] text-slate-400 hover:text-blue-400 font-medium transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-[14px] text-slate-400 hover:text-blue-400 font-medium transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-[14px] text-slate-400 hover:text-blue-400 font-medium transition-colors">Cookie Policy</Link></li>
              <li><Link href="#" className="text-[14px] text-slate-400 hover:text-blue-400 font-medium transition-colors">Security</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="w-full pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[14px] text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} Ebreabuk. All rights reserved.
          </p>
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
            <Globe className="w-4 h-4 text-slate-400" />
            <span className="text-[13px] text-slate-300 font-medium">English (US)</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
