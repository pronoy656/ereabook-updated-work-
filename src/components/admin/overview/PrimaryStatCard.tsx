import React from 'react';
import { LucideIcon, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PrimaryStatCardProps {
  label: string;
  value: string;
  trend: string;
  trendDirection: 'up' | 'down';
  trendText: string;
  Icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  loading?: boolean;
}

export function PrimaryStatCard({
  label,
  value,
  trend,
  trendDirection,
  trendText,
  Icon,
  iconBgColor,
  iconColor,
  loading = false,
}: PrimaryStatCardProps) {
  const isUp = trendDirection === 'up';

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-6 transition-all hover:shadow-md">
      <div
        className={cn(
          "h-14 w-14 rounded-full flex flex-shrink-0 items-center justify-center",
          loading ? "bg-slate-100 animate-pulse" : iconBgColor
        )}
      >
        {!loading && <Icon className={cn("h-6 w-6", iconColor)} />}
      </div>

      <div className="flex flex-col gap-1 w-full">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {label}
        </p>
        
        {loading ? (
          <div className="h-8 w-24 bg-slate-100 dark:bg-slate-700 animate-pulse rounded-lg mt-1" />
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {value}
            </span>
            <span
              className={cn(
                "flex items-center text-xs font-semibold",
                isUp ? "text-emerald-500" : "text-rose-500"
              )}
            >
              {isUp ? <ArrowUp className="w-3 h-3 mr-0.5" /> : <ArrowDown className="w-3 h-3 mr-0.5" />}
              {trend}
            </span>
          </div>
        )}
        
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          {trendText}
        </p>
      </div>
    </div>
  );
}
