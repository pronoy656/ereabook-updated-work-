'use client';
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import api from '@/lib/axios';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "next-intl";

const STATUS_COLORS: Record<string, string> = {
  'COMPLETED': '#22c55e',
  'PENDING': '#eab308',
  'CANCELLED': '#ef4444',
  'ONGOING': '#3b82f6',
  'ACCEPTED': '#10b981',
  'REJECTED': '#f97316',
  'CONFIRMED': '#6366f1',
  'EXPIRED': '#64748b',
};

export function ConsultationStatusChart() {
  const t = useTranslations("admin_overview");
  const [data, setData] = useState<{name: string, value: number, color: string}[]>([]);
  const [total, setTotal] = useState(0);
  const [months, setMonths] = useState(6);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/admin/consultation-status-distribution?months=${months}`);
        if (response.data?.success) {
          const distribution = response.data.data;
          setTotal(distribution.total || 0);
          
          const formatted = (distribution.items || []).map((item: any) => {
            const statusKey = (item.status || '').toUpperCase();
            const translationKey = `status_${statusKey.toLowerCase()}`;
            return {
              name: t(translationKey as any) || (statusKey.charAt(0) + statusKey.slice(1).toLowerCase()),
              value: item.count || 0,
              color: STATUS_COLORS[statusKey] || '#8b5cf6'
            };
          });
          setData(formatted);
        }
      } catch (error) {
        console.error("Failed to fetch status distribution", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, [months, t]);

  return (
    <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col h-full transition-colors relative">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-bold text-slate-800 dark:text-white">{t("consultation_status")}</h3>
        <Select value={months.toString()} onValueChange={(val) => setMonths(Number(val))}>
          <SelectTrigger className="w-[140px] h-8 text-xs font-medium border-slate-200 dark:border-slate-800 bg-transparent text-slate-500 dark:text-slate-400 focus:ring-0 focus:ring-offset-0">
            <SelectValue placeholder={t("select_timeframe")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6">{t("last_6_months")}</SelectItem>
            <SelectItem value="12">{t("last_year")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 flex-1 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-[#1e293b]/50 z-10 rounded-xl backdrop-blur-[1px]">
            <div className="w-8 h-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
          </div>
        )}
        
        <div className="relative w-40 h-40 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontWeight: 700 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-lg font-bold text-slate-900 dark:text-white">{total.toLocaleString()}</span>
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("total")}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 flex-1 w-full max-w-[160px] max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
          {data.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <div 
                className="w-3 h-3 rounded-full mt-1 flex-shrink-0" 
                style={{ backgroundColor: item.color }} 
              />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{item.name}</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {item.value.toLocaleString()} ({total > 0 ? Math.round((item.value / total) * 100) : 0}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
