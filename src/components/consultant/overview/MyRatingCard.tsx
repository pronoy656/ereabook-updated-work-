import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import api from '@/lib/axios';
import { useTranslations } from 'next-intl';

export function MyRatingCard() {
  const t = useTranslations('consultant_overview');
  const [ratingData, setRatingData] = useState<any>(null);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await api.get('/consultant/my-ratings');
        setRatingData(response.data?.data);
      } catch (err) {
        console.error("Failed to fetch my ratings:", err);
      }
    };
    fetchRatings();
  }, []);

  const average = ratingData?.averageRating || 0;
  const dashArray = 198;
  const ratingPct = average / 5;
  const dashOffset = dashArray - (dashArray * ratingPct);

  const breakdown = ratingData?.breakdown || [
    { stars: 5, percentage: 0 },
    { stars: 4, percentage: 0 },
    { stars: 3, percentage: 0 },
    { stars: 2, percentage: 0 },
    { stars: 1, percentage: 0 },
  ];

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex flex-col h-full relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">{t('my_rating')}</h3>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 flex-1 justify-center py-4">
        {/* Left Circular Display */}
        <div className="flex flex-col items-center">
          <div className="relative w-[140px] h-[140px] flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full drop-shadow-sm" viewBox="0 0 100 100">
              {/* Background Track */}
              <path 
                d="M 16 75 A 42 42 0 1 1 84 75" 
                fill="none" 
                className="stroke-amber-100/50 dark:stroke-amber-900/30"
                strokeWidth="5" 
                strokeLinecap="round" 
              />
              {/* Foreground Track */}
              <path 
                d="M 16 75 A 42 42 0 1 1 84 75" 
                fill="none" 
                className="stroke-amber-400"
                strokeWidth="5" 
                strokeLinecap="round" 
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
              <span className="text-[44px] font-extrabold text-slate-900 dark:text-white leading-none tracking-tight">
                {average > 0 ? average.toFixed(1) : "0.0"}
              </span>
            </div>
            <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1.5 z-10">
              {[...Array(5)].map((_, i) => {
                const isFull = i < Math.floor(average);
                const isPartial = i === Math.floor(average) && average % 1 !== 0;
                const partialPct = isPartial ? (average % 1) * 100 : 0;
                
                return (
                  <div key={i} className="relative w-[18px] h-[18px]">
                    <Star className="w-[18px] h-[18px] text-slate-200 fill-slate-200 absolute inset-0" />
                    {(isFull || isPartial) && (
                      <Star 
                        className="w-[18px] h-[18px] text-amber-400 fill-amber-400 absolute inset-0" 
                        style={isPartial ? { clipPath: `inset(0 ${100 - partialPct}% 0 0)` } : {}}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-400 mt-2">
            {ratingData?.label || t('no_ratings_yet')}
          </span>
        </div>

        {/* Right Bars */}
        <div className="flex flex-col gap-3.5 flex-1 w-full max-w-[240px]">
          {breakdown.map((row: any) => (
            <div key={row.stars} className="flex items-center gap-4">
              <span className="text-[13px] font-semibold text-slate-600 dark:text-slate-400 w-[48px]">{row.stars} {row.stars === 1 ? t('star') : t('stars')}</span>
              <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${row.percentage}%` }}></div>
              </div>
              <span className="text-[13px] font-semibold text-slate-900 dark:text-slate-300 w-8 text-right">{row.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Stats Container */}
      <div className="bg-[#f8fafc] dark:bg-slate-800/50 rounded-2xl p-5 flex items-center justify-between mt-4">
        <div className="flex flex-col items-center justify-center flex-1 border-r border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Star className="w-[22px] h-[22px] text-amber-400 stroke-[2.5px]" fill="none" />
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              {average > 0 ? average.toFixed(1) : "0.0"}
            </span>
          </div>
          <span className="text-[13px] font-medium text-slate-500 dark:text-slate-400 mt-1">{t('average_rating')}</span>
        </div>
        <div className="flex flex-col items-center justify-center flex-1">
          <span className="text-xl font-bold text-slate-900 dark:text-white">
            {ratingData?.totalRatings || 0}
          </span>
          <span className="text-[13px] font-medium text-slate-500 dark:text-slate-400 mt-1">{t('total_reviews')}</span>
        </div>
      </div>
    </div>
  );
}
