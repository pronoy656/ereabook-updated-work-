"use client";

import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { TimeSlot } from './AvailabilityManagement';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { useTranslations, useLocale } from 'next-intl';

export default function CustomAvailability() {
  const t = useTranslations('consultant_availability');
  const locale = useLocale();
  const [availabilityData, setAvailabilityData] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSlots = async () => {
      const consultantId = user?._id || user?.id;
      if (!consultantId) return;

      try {
        setLoading(true);
        const response = await api.get(`/consultation/unavailability`);
        if (response.data.success && response.data.data?.slots) {
          const fetchedData: Record<string, any[]> = {};
          response.data.data.slots.forEach((slot: any) => {
            const d = new Date(slot.date);
            const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            if (!fetchedData[dateKey]) {
              fetchedData[dateKey] = [];
            }
            fetchedData[dateKey].push({
              start: slot.startTime,
              end: slot.endTime,
              isBooked: slot.isBooked,
              status: slot.status
            });
          });
          setAvailabilityData(fetchedData);
        }
      } catch (error) {
        console.error("Error fetching custom availability:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [user?._id, user?.id]);

  // Extract and sort dates
  const dates = Object.keys(availabilityData)
    .filter(key => availabilityData[key].length > 0)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-500 text-sm">{t('loading_unavailability')}</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
             <CalendarIcon className="w-5 h-5 text-blue-500" />
             {t('readonly_view')}
          </h3>
        </div>

        {dates.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center p-12 text-center min-h-[300px]">
            <div className="w-16 h-16 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center mb-4">
              <CalendarIcon className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">{t('no_custom_unavailability')}</h3>
            <p className="text-slate-500 text-[14px] max-w-sm">
              {t('no_custom_unavailability_desc')}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {dates.map((dateStr) => {
              const d = new Date(dateStr);
              const slots = availabilityData[dateStr];
              
              return (
                <div key={dateStr} className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8 bg-[#FAFAFA] border border-slate-100 rounded-xl p-5">
                  <div className="w-48 shrink-0 flex flex-col pt-1">
                    <span className="font-bold text-slate-800">
                      {d.toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', { weekday: 'long' })}
                    </span>
                    <span className="text-slate-500 text-sm">
                      {d.toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <div className="flex-1 flex flex-wrap gap-3">
                    {slots.map((slot, i) => {
                      const isUnavailable = true;
                      return (
                        <div key={i} className={cn(
                          "flex flex-col gap-1 px-3 py-2 rounded-xl shadow-sm border transition-all",
                          isUnavailable 
                            ? "bg-slate-50/50 border-slate-200" 
                            : "bg-white border-emerald-200 hover:border-emerald-300 hover:shadow-md"
                        )}>
                          <div className={cn(
                            "flex items-center gap-1.5 font-bold text-[14px]",
                            isUnavailable ? "text-slate-400 line-through decoration-slate-300" : "text-slate-700"
                          )}>
                            <Clock className={cn("w-3.5 h-3.5", isUnavailable ? "text-slate-400" : "text-emerald-500")} />
                            {slot.start} - {slot.end}
                          </div>
                          <div className={cn(
                            "flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider",
                            isUnavailable ? "text-rose-500" : "text-emerald-600"
                          )}>
                            {isUnavailable ? (
                              <><XCircle className="w-3 h-3" /> {t('unavailable')}</>
                            ) : (
                              <><CheckCircle2 className="w-3 h-3" /> {t('available')}</>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
