'use client';
import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConsultantStatCardProps {
  title: string;
  value: string | number;
  trendValue: number;
  trendText: string;
  Icon: React.ElementType;
  iconBgColor: string;
  iconColor: string;
}

export function ConsultantStatCard({
  title,
  value,
  trendValue,
  trendText,
  Icon,
  iconBgColor,
  iconColor
}: ConsultantStatCardProps) {
  const isPositive = trendValue >= 0;

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-center transition-colors overflow-hidden">
      <div className="flex items-start gap-4">
        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0", iconBgColor)}>
          <Icon className={cn("w-6 h-6", iconColor)} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{title}</span>
          <span className="text-3xl font-extrabold text-slate-800 dark:text-white mt-1 leading-tight">{value}</span>
          <div className="flex items-center gap-1 mt-2">
            {isPositive ? (
              <ArrowUp className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <ArrowDown className="w-3.5 h-3.5 text-rose-500" />
            )}
            <span className={cn("text-xs font-bold", isPositive ? "text-emerald-500" : "text-rose-500")}>
              {Math.abs(trendValue)}%
            </span>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{trendText}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
