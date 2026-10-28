'use client';
import React from 'react';
import Link from 'next/link';
import { Twitter, Instagram, Linkedin, Facebook, Globe } from 'lucide-react';
import { useLandingLanguage } from '@/context/LandingLanguageContext';

export default function Footer() {
  const { locale, switchLanguage, t } = useLandingLanguage();

  return (
    <footer className="w-full bg-[#0B1426] pt-20 pb-10 relative overflow-hidden text-white z-0">
      
      {/* Background glowing effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column (Spans 4) */}
          <div className="lg:col-span-4 flex flex-col items-start pr-0 lg:pr-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] group-hover:scale-105 transition-transform">
                F
              </div>
              <span className="text-[22px] font-bold tracking-tight text-white">Fixpair</span>
            </Link>
            
            <p className="text-[15px] text-slate-400 font-medium leading-relaxed mb-8 max-w-[320px]">
              {t('footer.description')}
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

          {/* Platform Links */}
          <div className="lg:col-span-2 lg:col-start-6 flex flex-col">
            <h4 className="text-[16px] font-bold text-white mb-6">{t('footer.quick_links')}</h4>
            <ul className="flex flex-col gap-4">
              <li><a href="#experts" className="text-[14px] text-slate-400 hover:text-blue-400 font-medium transition-colors">{t('nav.experts')}</a></li>
              <li><a href="#services" className="text-[14px] text-slate-400 hover:text-blue-400 font-medium transition-colors">{t('nav.services')}</a></li>
              <li><a href="#how-it-works" className="text-[14px] text-slate-400 hover:text-blue-400 font-medium transition-colors">{t('nav.how_it_works')}</a></li>
              <li><a href="#pricing" className="text-[14px] text-slate-400 hover:text-blue-400 font-medium transition-colors">{t('nav.pricing')}</a></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="lg:col-span-2 flex flex-col">
            <h4 className="text-[16px] font-bold text-white mb-6">{t('footer.legal')}</h4>
            <ul className="flex flex-col gap-4">
              <li><Link href="#" className="text-[14px] text-slate-400 hover:text-blue-400 font-medium transition-colors">{t('footer.terms')}</Link></li>
              <li><Link href="#" className="text-[14px] text-slate-400 hover:text-blue-400 font-medium transition-colors">{t('footer.privacy')}</Link></li>
              <li><Link href="#" className="text-[14px] text-slate-400 hover:text-blue-400 font-medium transition-colors">{t('footer.imprint')}</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="w-full pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[14px] text-slate-500 font-medium">
            {t('footer.rights')}
          </p>
          
          <div 
            onClick={() => switchLanguage(locale === 'de' ? 'en' : 'de')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
          >
            <Globe className="w-4 h-4 text-blue-400" />
            <span className="text-[13px] text-slate-300 font-medium">
              {locale === 'de' ? '🇩🇪 Deutsch' : '🇬🇧 English'}
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
