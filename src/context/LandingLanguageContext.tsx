"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { landingTranslations, Locale } from '../i18n/landingTranslations';

interface LandingLanguageContextType {
  locale: Locale;
  switchLanguage: (newLocale: Locale) => void;
  t: (path: string) => string;
}

const LandingLanguageContext = createContext<LandingLanguageContextType>({
  locale: 'de',
  switchLanguage: () => {},
  t: (path: string) => path,
});

export function LandingLanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('de');

  useEffect(() => {
    const userChoice = sessionStorage.getItem('USER_LOCALE_CHOICE');
    if (userChoice === 'de' || userChoice === 'en') {
      setLocale(userChoice as Locale);
    } else {
      // Default strictly to German
      setLocale('de');
      document.cookie = "NEXT_LOCALE=de; path=/; max-age=31536000; SameSite=Lax";
    }
  }, []);

  const switchLanguage = (newLocale: Locale) => {
    sessionStorage.setItem('USER_LOCALE_CHOICE', newLocale);
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    setLocale(newLocale);
  };

  const t = (path: string): string => {
    const keys = path.split('.');
    let current: any = landingTranslations[locale] || landingTranslations.de;
    
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to English dictionary if key missing in current locale
        let fallback: any = landingTranslations.en;
        for (const k of keys) {
          if (fallback && fallback[k] !== undefined) {
            fallback = fallback[k];
          } else {
            return path;
          }
        }
        return typeof fallback === 'string' ? fallback : path;
      }
    }
    
    return typeof current === 'string' ? current : path;
  };

  return (
    <LandingLanguageContext.Provider value={{ locale, switchLanguage, t }}>
      {children}
    </LandingLanguageContext.Provider>
  );
}

export function useLandingLanguage() {
  return useContext(LandingLanguageContext);
}
