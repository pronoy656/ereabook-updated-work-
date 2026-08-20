'use client';
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '@/lib/axios';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "next-intl";

export function UserGrowthChart() {
  const t = useTranslations("admin_overview");
  const [data, setData] = useState<{name: string, users: number, consultants: number}[]>([]);
  const [months, setMonths] = useState(6);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrowth = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/admin/user-growth?months=${months}`);
        if (response.data?.success) {
          setData(response.data.data.points.map((point: any) => ({
            name: point.label,
            users: point.users,
            consultants: point.consultants
          })));
        }
      } catch (error) {
        console.error("Failed to fetch user growth", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGrowth();
  }, [months]);
  return (
    <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col h-full transition-colors">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-bold text-slate-800 dark:text-white">{t("user_growth")}</h3>
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
      
      <div className="flex-1 w-full min-h-[200px] relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-[#1e293b]/50 z-10 rounded-xl backdrop-blur-[1px]">
            <div className="w-8 h-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            barSize={24}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#94a3b8' }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#94a3b8' }}
              tickFormatter={(value) => value >= 1000 ? `${value / 1000}K` : value}
            />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              labelStyle={{ color: '#64748b', fontWeight: 600, fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Bar dataKey="users" name={t("customers")} fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="consultants" name={t("consultants")} fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
