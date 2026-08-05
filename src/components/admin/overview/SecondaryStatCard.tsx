import React from 'react';
import { LucideIcon, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SecondaryStatCardProps {
  label: string;
  value: string | number;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  trendText?: string;
  Icon: LucideIcon | React.ElementType;
  iconBgColor?: string;
  iconColor?: string;
}

export function SecondaryStatCard({
  label,
  value,
  trend,
  trendDirection,
  trendText,
  Icon,
  iconBgColor = 'bg-slate-50',
  iconColor = 'text-slate-500',
}: SecondaryStatCardProps) {
  const isUp = trendDirection === 'up';
  const isDown = trendDirection === 'down';

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between gap-3 min-w-[160px] flex-1">
      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-col items-center gap-1 w-full text-center">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 line-clamp-1">{label}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-4">
        <div className={cn("h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 dark:opacity-80", iconBgColor)}>
            <Icon className={cn("h-4 w-4", iconColor)} />
        </div>
        <div className="flex flex-col">
            <div className="flex items-end gap-2">
            <span className="text-xl font-bold text-slate-900 dark:text-white leading-none">
                {value}
            </span>
            {trend && (
                <span
                className={cn(
                    "flex items-center text-[10px] font-bold",
                    isUp ? "text-emerald-500" : isDown ? "text-rose-500" : "text-emerald-500"
                )}
                >
                {isUp && <ArrowUp className="w-2.5 h-2.5 mr-0.5" />}
                {isDown && <ArrowDown className="w-2.5 h-2.5 mr-0.5" />}
                {trend}
                {trendText && <span className="ml-1">{trendText}</span>}
                </span>
            )}
            </div>
        </div>
      </div>
    </div>
  );
}
