"use client";

import React, { useTransition } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { Globe, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useLandingLanguage } from '@/context/LandingLanguageContext';

export default function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const landingContext = useLandingLanguage();
  
  let currentLocale = 'de';
  if (landingContext?.locale) {
    currentLocale = landingContext.locale;
  } else {
    try {
      currentLocale = useLocale();
    } catch (e) {
      currentLocale = 'de';
    }
  }

  let router: any = null;
  let pathname = '/';
  try {
    router = useRouter();
    pathname = usePathname();
  } catch (e) {
    // Fallback if used outside intl router
  }

  const onSelectChange = (nextLocale: 'de' | 'en') => {
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
    if (landingContext?.switchLanguage) {
      landingContext.switchLanguage(nextLocale);
    }
    
    startTransition(() => {
      if (router && pathname) {
        try {
          router.replace(pathname, { locale: nextLocale });
        } catch (err) {
          window.location.reload();
        }
      } else {
        window.location.reload();
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          disabled={isPending} 
          className="rounded-xl border-slate-200/90 bg-white hover:bg-slate-50 transition-colors gap-2 px-3 py-2 font-bold text-xs text-slate-700 shadow-xs cursor-pointer"
        >
          <Globe className={`w-4 h-4 text-blue-600 shrink-0 ${isPending ? 'animate-spin' : ''}`} />
          <span className="font-bold">{currentLocale === 'de' ? 'Deutsch' : 'English'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-xl border-slate-200/90 bg-white p-1.5 shadow-lg min-w-[140px] z-[100]">
        <DropdownMenuItem 
          onClick={() => onSelectChange('de')}
          className={`cursor-pointer rounded-lg font-bold px-3 py-2 text-xs transition-colors flex items-center justify-between ${currentLocale === 'de' ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'}`}
        >
          <span className="flex items-center gap-1.5">🇩🇪 Deutsch</span>
          {currentLocale === 'de' && <Check className="w-3.5 h-3.5 text-blue-600" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onSelectChange('en')}
          className={`cursor-pointer rounded-lg font-bold px-3 py-2 text-xs transition-colors flex items-center justify-between ${currentLocale === 'en' ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'}`}
        >
          <span className="flex items-center gap-1.5">🇬🇧 English</span>
          {currentLocale === 'en' && <Check className="w-3.5 h-3.5 text-blue-600" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
