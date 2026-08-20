'use client';
import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations, useLocale } from 'next-intl';

const mockData = [
  { date: 'May 20', upcoming: 24, completed: 14, cancelled: 2 },
  { date: 'May 23', upcoming: 27, completed: 15, cancelled: 3 },
  { date: 'May 25', upcoming: 26, completed: 12, cancelled: 3 },
  { date: 'May 27', upcoming: 28, completed: 16, cancelled: 2 },
  { date: 'May 29', upcoming: 27, completed: 15, cancelled: 1 },
  { date: 'Jun 1', upcoming: 30, completed: 19, cancelled: 2 },
  { date: 'Jun 3', upcoming: 32, completed: 23, cancelled: 4 },
  { date: 'Jun 6', upcoming: 32, completed: 22, cancelled: 3 },
  { date: 'Jun 8', upcoming: 35, completed: 21, cancelled: 3 },
  { date: 'Jun 10', upcoming: 34, completed: 23, cancelled: 4 },
  { date: 'Jun 12', upcoming: 37, completed: 22, cancelled: 4 },
  { date: 'Jun 14', upcoming: 35, completed: 24, cancelled: 5 },
  { date: 'Jun 16', upcoming: 32, completed: 23, cancelled: 4 },
  { date: 'Jun 18', upcoming: 33, completed: 24, cancelled: 3 },
  { date: 'Jun 19', upcoming: 34, completed: 26, cancelled: 5 },
];

export function ConsultationOverviewChart() {
  const t = useTranslations('consultant_overview');
  const locale = useLocale();
  const [daysFilter, setDaysFilter] = useState<number>(30);
  const [chartData, setChartData] = useState<any[]>(mockData);

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        const response = await api.get(`/consultant/consultation-trend?days=${daysFilter}`);
        const points = response.data?.data?.points;
        
        if (Array.isArray(points) && points.length > 0) {
          const formattedData = points.map((p: any) => {
            const dateObj = new Date(p.date);
            const formattedDate = dateObj.toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', { month: 'short', day: 'numeric' });
            return {
              date: formattedDate,
              upcoming: p.upcoming || 0,
              completed: p.completed || 0,
              cancelled: p.cancelled || 0
            };
          });
          setChartData(formattedData);
        }
      } catch (err) {
        console.error("Failed to fetch consultation trend:", err);
      }
    };
    
    fetchTrendData();
  }, [daysFilter, locale]);

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex flex-col h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-bold text-slate-800 dark:text-white">{t('consultation_overview')}</h3>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              {daysFilter === 7 ? t('last_7_days') : t('last_30_days')} <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem onClick={() => setDaysFilter(7)}>{t('last_7_days')}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDaysFilter(30)}>{t('last_30_days')}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-6 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{t('upcoming')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{t('completed')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{t('cancelled')}</span>
        </div>
      </div>

      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorUpcoming" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorCancelled" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#64748b' }} 
              dy={10} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#64748b' }} 
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Area type="monotone" dataKey="upcoming" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorUpcoming)" dot={{ r: 3, fill: '#a855f7', strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} />
            <Area type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorCompleted)" dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} />
            <Area type="monotone" dataKey="cancelled" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorCancelled)" dot={{ r: 3, fill: '#f97316', strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
