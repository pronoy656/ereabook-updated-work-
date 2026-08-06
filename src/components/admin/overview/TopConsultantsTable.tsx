'use client';
import React, { useState, useEffect } from 'react';
import { Star, Loader2, User } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/axios';
import { getImageUrl } from '@/lib/utils';

interface TopConsultant {
  consultantId: string;
  name: string;
  image?: string;
  totalSessions: number;
  averageRating: number;
  earnings: number;
}

export function TopConsultantsTable() {
  const [data, setData] = useState<TopConsultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchTopConsultants = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/top-consultants?limit=5');
        if (response.data?.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch top consultants', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopConsultants();
  }, []);

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex flex-col h-full transition-colors relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-800 dark:text-white">Top Consultants</h3>
      </div>

      <div className="overflow-x-auto relative min-h-[200px]">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-[#1e293b]/50 z-10 backdrop-blur-[1px]">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        )}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <th className="pb-3 text-xs font-semibold text-slate-400 dark:text-slate-500 w-8">#</th>
              <th className="pb-3 text-xs font-semibold text-slate-400 dark:text-slate-500">Consultant</th>
              <th className="pb-3 text-xs font-semibold text-slate-400 dark:text-slate-500 text-center">Sessions</th>
              <th className="pb-3 text-xs font-semibold text-slate-400 dark:text-slate-500 text-center">Rating</th>
              <th className="pb-3 text-xs font-semibold text-slate-400 dark:text-slate-500 text-right">Earnings</th>
            </tr>
          </thead>
          <tbody>
            {data.map((consultant, index) => (
              <tr key={consultant.consultantId || index} className="border-b border-slate-50 dark:border-slate-800/50 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="py-3 text-sm font-semibold text-slate-500 dark:text-slate-400">{index + 1}</td>
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    {consultant.image && !imageErrors[consultant.consultantId || index] ? (
                      <img 
                        src={getImageUrl(consultant.image)} 
                        alt={consultant.name} 
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700" 
                        onError={() => setImageErrors(prev => ({ ...prev, [consultant.consultantId || index]: true }))}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{consultant.name || "Unknown Consultant"}</span>
                  </div>
                </td>
                <td className="py-3 text-sm font-semibold text-slate-600 dark:text-slate-400 text-center">{consultant.totalSessions || 0}</td>
                <td className="py-3 text-sm font-bold text-slate-700 dark:text-slate-300 text-center">
                  <div className="flex items-center justify-center gap-1">
                    {consultant.averageRating ? consultant.averageRating.toFixed(1) : "0.0"}
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  </div>
                </td>
                <td className="py-3 text-sm font-bold text-slate-700 dark:text-slate-300 text-right">${(consultant.earnings || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
