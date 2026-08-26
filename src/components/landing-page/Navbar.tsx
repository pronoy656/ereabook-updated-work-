"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Menu, X } from 'lucide-react';
import { useLandingLanguage } from '@/context/LandingLanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const { locale, switchLanguage, t } = useLandingLanguage();

  const navItems = [
    { label: t('nav.why_us'), href: '#why-choose-us' },
    { label: t('nav.how_it_works'), href: '#how-it-works' },
    { label: t('nav.services'), href: '#services' },
    { label: t('nav.experts'), href: '#experts' },
    { label: t('nav.pricing'), href: '#pricing' },
  ];

  const activeSectionRef = useRef<string>('');
  const isClickScrollingRef = useRef<boolean>(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let ticking = false;

    const updateActiveSection = () => {
      if (isClickScrollingRef.current) {
        ticking = false;
        return;
      }

      if (window.scrollY < 180) {
        if (activeSectionRef.current !== '') {
          activeSectionRef.current = '';
          setActiveSection('');
        }
        ticking = false;
        return;
      }

      const sectionIds = navItems.map(item => item.href.replace('#', ''));
      let currentActive = '';

      for (const id of sectionIds) {
        const elem = document.getElementById(id);
        if (elem) {
          const rect = elem.getBoundingClientRect();
          if (rect.top <= 280 && rect.bottom >= 120) {
            currentActive = id;
          }
        }
      }

      if (currentActive && currentActive !== activeSectionRef.current) {
        activeSectionRef.current = currentActive;
        setActiveSection(currentActive);
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateActiveSection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateActiveSection();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, [navItems]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.replace('#', '');
      const elem = document.getElementById(targetId);

      if (elem) {
        isClickScrollingRef.current = true;
        activeSectionRef.current = targetId;
        setActiveSection(targetId);
        setMobileMenuOpen(false);

        elem.scrollIntoView({ behavior: 'smooth' });

        if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = setTimeout(() => {
          isClickScrollingRef.current = false;
        }, 800);
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_4px_30px_rgba(15,23,42,0.06)] transition-all duration-300">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-3.5 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link 
          href="/" 
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            activeSectionRef.current = '';
            setActiveSection('');
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-600/25 group-hover:scale-105 transition-transform duration-300">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white">
              <path d="M14 6C14 4.89543 13.1046 4 12 4H8C6.89543 4 6 4.89543 6 6V18C6 19.1046 6.89543 20 8 20H10V14H13C14.1046 14 15 13.1046 15 12V10M14 6H16C17.1046 6 18 6.89543 18 8V10M14 6V10M14 10H10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">Fixpair</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-3 xl:gap-4 text-sm font-medium">
          {navItems.map((item) => {
            const sectionId = item.href.replace('#', '');
            const isActive = activeSection === sectionId;

            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className={`relative px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 scale-[1.03]'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100/70'
                }`}
              >
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>

        {/* Right Actions & Language Switcher */}
        <div className="hidden lg:flex items-center gap-3.5">
          
          {/* Dashboard Language Switcher Dropdown (Globe + Menu) */}
          <LanguageSwitcher />

          <Link href="/login" className="text-xs font-bold text-slate-700 hover:text-blue-600 px-3 py-2 transition-colors">
            {t('nav.sign_in')}
          </Link>

          <a
            href="#mobile-app"
            onClick={(e) => scrollToSection(e, '#mobile-app')}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/35 hover:-translate-y-0.5 cursor-pointer"
          >
            {t('nav.get_app')}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Mobile Toggle & Language Switcher */}
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher />

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-6 flex flex-col gap-3 animate-in slide-in-from-top-2 duration-200 shadow-xl">
          {navItems.map((item) => {
            const sectionId = item.href.replace('#', '');
            const isActive = activeSection === sectionId;

            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className={`text-sm font-bold px-4 py-2.5 rounded-xl transition-all flex items-center justify-between ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                <span>{item.label}</span>
                {isActive && <span className="w-2 h-2 rounded-full bg-white" />}
              </a>
            );
          })}

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
            <Link 
              href="/login" 
              className="w-full text-center text-xs font-bold text-slate-900 hover:text-blue-600 py-2.5 rounded-xl border border-slate-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.sign_in')}
            </Link>
            <a
              href="#mobile-app"
              onClick={(e) => scrollToSection(e, '#mobile-app')}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-3 rounded-xl text-xs font-bold shadow-md shadow-blue-600/25"
            >
              {t('nav.get_app')}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
