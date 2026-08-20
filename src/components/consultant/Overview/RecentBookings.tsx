'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, Check, X, User } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/axios';
import { getImageUrl } from '@/lib/utils';
import { useTranslations, useLocale } from 'next-intl';

export function RecentBookings() {
  const t = useTranslations('consultant_overview');
  const locale = useLocale();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/consultant/recent-bookings?limit=5');
        const data = response.data?.data;
        if (Array.isArray(data)) {
          if (data.length > 0) {
            const formatted = data.map((b: any) => {
              const dateObj = new Date(b.scheduledAt);
              const formattedDate = dateObj.toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' });
              const formattedTime = dateObj.toLocaleTimeString(locale === 'de' ? 'de-DE' : 'en-US', { hour: '2-digit', minute: '2-digit' });
              
              return {
                id: b.consultationId || Math.random().toString(),
                client: { 
                  name: b.clientName || 'Client', 
                  avatar: b.clientImage || '' 
                },
                datetime: `${formattedDate} • ${formattedTime}`,
                rawStatus: b.status ? b.status.toLowerCase() : 'pending',
                status: b.status ? b.status.charAt(0).toUpperCase() + b.status.slice(1) : 'Pending'
              };
            });
            setBookings(formatted.slice(0, 5));
          } else {
            setBookings([]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch recent bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [locale]);

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'upcoming' || s === 'pending') {
      return 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800';
    }
    if (s === 'confirmed' || s === 'completed') {
      return 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800';
    }
    if (s === 'cancelled' || s === 'rejected') {
      return 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800';
    }
    return 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
  };

  const getTranslatedStatus = (rawStatus: string, fallback: string) => {
    if (rawStatus === 'upcoming') return t('upcoming');
    if (rawStatus === 'completed') return t('completed');
    if (rawStatus === 'cancelled') return t('cancelled');
    return fallback;
  };

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm w-full h-full flex flex-col transition-colors overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-slate-50 dark:border-slate-800/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white">{t('recent_bookings')}</h3>
        </div>
      </div>

      <div className="w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/20 border-b border-slate-100 dark:border-slate-800">
              <th className="px-4 xl:px-6 py-4 text-[13px] font-bold text-slate-800 dark:text-slate-200">{t('client')}</th>
              <th className="px-4 xl:px-6 py-4 text-[13px] font-bold text-slate-800 dark:text-slate-200">{t('date_time')}</th>
              <th className="px-4 xl:px-6 py-4 text-[13px] font-bold text-slate-800 dark:text-slate-200">{t('status')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
            {loading ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-sm text-slate-500">{t('loading_bookings')}</td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-12">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                      <Calendar className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                    </div>
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">{t('no_recent_bookings')}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t('no_recent_bookings_desc')}</p>
                  </div>
                </td>
              </tr>
            ) : bookings.map((booking, index) => {
              const avatarUrl = getImageUrl(booking.client.avatar);
              return (
                <tr key={booking.id || index} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="px-4 xl:px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm shrink-0 overflow-hidden border border-slate-200 dark:border-slate-700">
                        {avatarUrl && !imageErrors[booking.id || index] ? (
                          <img 
                            src={avatarUrl} 
                            alt={booking.client.name} 
                            className="w-full h-full object-cover" 
                            onError={() => setImageErrors(prev => ({ ...prev, [booking.id || index]: true }))}
                          />
                        ) : (
                          <User className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-[14px] whitespace-nowrap">{booking.client.name}</span>
                        {booking.client.email && (
                          <span className="text-slate-500 dark:text-slate-400 text-[13px] mt-0.5 whitespace-nowrap hidden sm:block">{booking.client.email}</span>
                        )}
                      </div>
                    </div>
                  </td>
                <td className="px-4 xl:px-6 py-4">
                  <span className="text-slate-700 dark:text-slate-300 text-[13px] xl:text-[14px] font-medium whitespace-nowrap">{booking.datetime}</span>
                </td>
                <td className="px-4 xl:px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] xl:text-[12px] font-bold border ${getStatusBadge(booking.status)}`}>
                    {getTranslatedStatus(booking.rawStatus, booking.status)}
                  </span>
                </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
