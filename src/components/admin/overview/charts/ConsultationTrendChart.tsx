'use client';
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '@/lib/axios';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ConsultationTrendChart() {
  const [data, setData] = useState<{name: string, value: number}[]>([]);
  const [months, setMonths] = useState(6);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrend = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/admin/consultation-trend?months=${months}`);
        if (response.data?.success) {
          setData(response.data.data.points.map((point: any) => ({
            name: point.label,
            value: point.count
          })));
        }
      } catch (error) {
        console.error("Failed to fetch consultation trend", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrend();
  }, [months]);
  return (
    <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col h-full transition-colors">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-bold text-slate-800 dark:text-white">Consultations Trend</h3>
        <Select value={months.toString()} onValueChange={(val) => setMonths(Number(val))}>
          <SelectTrigger className="w-[140px] h-8 text-xs font-medium border-slate-200 dark:border-slate-800 bg-transparent text-slate-500 dark:text-slate-400 focus:ring-0 focus:ring-offset-0">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6">Last 6 Months</SelectItem>
            <SelectItem value="12">Last Year</SelectItem>
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
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
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
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              labelStyle={{ color: '#64748b', fontWeight: 600, fontSize: '12px' }}
              itemStyle={{ color: '#8b5cf6', fontWeight: 700 }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorValue)" 
              activeDot={{ r: 6, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
