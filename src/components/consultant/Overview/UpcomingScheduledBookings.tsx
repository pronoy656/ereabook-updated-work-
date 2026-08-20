"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, User, Clock, Check, X, Loader2, Video, PhoneCall } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { getImageUrl } from '@/lib/utils';
import { useTranslations, useLocale } from 'next-intl';

interface RequestData {
  id: string;
  tabType: "Schedule";
  name: string;
  image?: string;
  requestType: string;
  time: string;
  scheduledAt?: number;
  notes: string;
  status: "pending" | "accepted" | string;
}

const AcceptedActionState = ({ req }: { req: RequestData }) => {
  const router = useRouter();
  const t = useTranslations('consultant_overview');

  const handleJoinCall = () => {
    if (req.tabType === "Schedule" && req.scheduledAt && !isNaN(req.scheduledAt)) {
      const diffMs = req.scheduledAt - Date.now();
      if (diffMs > 5 * 60 * 1000) {
        toast.error(t('join_call_5min_error'));
        return;
      }
    }
    router.push(`/call?consultationId=${req.id}`);
  };

  return (
    <button
      onClick={handleJoinCall}
      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-sm shadow-emerald-500/20 transition-transform active:scale-95 animate-in zoom-in duration-300"
    >
      <Video className="w-4 h-4" /> 
      {t('join_call')}
    </button>
  );
};

export function UpcomingScheduledBookings() {
  const t = useTranslations('consultant_overview');
  const locale = useLocale();
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [processing, setProcessing] = useState<{ id: string, type: 'accept' | 'reject' } | null>(null);

  const fetchRequests = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const response = await api.get("/consultation/my-bookings");
      
      if (response.data.success) {
        const allData = response.data.data;
        
        const mappedData = allData
          .filter((item: any) => 
            (item.bookingType?.toLowerCase() === "scheduled" || item.bookingType?.toLowerCase() === "schedule") && 
            item.status?.toLowerCase() !== "completed" && 
            item.status?.toLowerCase() !== "rejected" &&
            item.status?.toLowerCase() !== "cancelled"
          )
          .map((item: any) => {
            let dateStr = new Date(item.date).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            let timeDisplay = `${item.startTime} - ${item.endTime}, ${dateStr}`;
            let scheduledAt = new Date(item.createdAt).getTime();
            if (item.date && item.startTime) {
              const datePart = item.date.split('T')[0];
              const timeMatch = item.startTime.match(/(\d+):(\d+)\s*(AM|PM)?/i);
              if (timeMatch) {
                let hours = parseInt(timeMatch[1], 10);
                const mins = timeMatch[2];
                const ampm = timeMatch[3]?.toUpperCase();
                if (ampm === 'PM' && hours < 12) hours += 12;
                if (ampm === 'AM' && hours === 12) hours = 0;
                const paddedHours = hours.toString().padStart(2, '0');
                scheduledAt = new Date(`${datePart}T${paddedHours}:${mins}:00`).getTime();
              } else {
                scheduledAt = new Date(`${datePart}T${item.startTime}:00`).getTime();
              }
            }
            return {
              id: item._id,
              tabType: "Schedule" as const,
              name: item.user?.name || "Guest User",
              image: getImageUrl(item.user?.image || item.user?.avatar),
              requestType: "Scheduled",
              time: timeDisplay,
              scheduledAt,
              notes: item.notes || "No additional notes.",
              status: item.status,
            };
          });
        
        setRequests(mappedData);
      }
    } catch (error: any) {
      if (!silent) toast.error(t('fetch_bookings_error'));
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [locale]);

  const handleStatusUpdate = async (id: string, status: string, type: 'accept' | 'reject', shouldRefresh = true) => {
    try {
      setProcessing({ id, type });
      const response = await api.patch(`/consultation/status/${id}`, { status });
      if (response.data.success) {
        if (shouldRefresh) {
          toast.success(`Booking ${status} successfully!`);
          fetchRequests(true);
        }
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to update booking status`);
      return false;
    } finally {
      if (shouldRefresh) {
        setProcessing(null);
      }
    }
  };

  const handleAccept = async (id: string) => {
    const success = await handleStatusUpdate(id, "accepted", "accept", false);
    if (success) {
      await handleStatusUpdate(id, "confirmed", "accept", true);
    } else {
      setProcessing(null);
    }
  };

  const handleReject = async (id: string) => {
    await handleStatusUpdate(id, "rejected", "reject");
  };

  return (
    <div className="bg-white rounded-[1.25rem] border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden w-full h-full flex flex-col transition-colors">
      <div className="flex items-center justify-between p-6 border-b border-slate-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="text-base font-bold text-slate-800">{t('upcoming_scheduled_bookings')}</h3>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-4 bg-[#FAFAFA] min-h-[300px] flex flex-col">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-48 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
             <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
             <p className="text-slate-500 font-medium">{t('fetching_scheduled_bookings')}</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-500 font-medium">{t('no_upcoming_scheduled_bookings')}</p>
          </div>
        ) : (
          requests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex gap-4">
                <div className="shrink-0 w-14 h-14 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl overflow-hidden shadow-sm">
                  {req.image && !imageErrors[req.id] ? (
                    <img 
                      src={req.image} 
                      alt={req.name} 
                      className="w-full h-full object-cover" 
                      onError={() => setImageErrors(prev => ({ ...prev, [req.id]: true }))}
                    />
                  ) : (
                    req.name ? req.name.charAt(0).toUpperCase() : <User className="w-6 h-6" />
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900">{req.name}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-[13px] font-medium text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      {req.requestType}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {req.time}
                    </div>
                  </div>
                  <div className="inline-flex max-w-lg mt-1">
                    <p className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-[13px] text-slate-600">
                      <strong className="text-slate-800">{t('notes')} </strong>{req.notes}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-row md:flex-col gap-3 shrink-0 self-start md:self-center w-full md:w-auto">
                {req.status === "accepted" || req.status === "confirmed" ? (
                  <AcceptedActionState req={req} />
                ) : (
                  <>
                    <button
                      onClick={() => handleAccept(req.id)}
                      disabled={processing?.id === req.id}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#FE6D2C] hover:bg-[#E85D20] text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-sm shadow-[#FE6D2C]/20 transition-transform active:scale-95 disabled:opacity-70"
                    >
                      {processing?.id === req.id && processing?.type === 'accept' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )} 
                      {t('accept')}
                    </button>
                    <button
                      onClick={() => handleReject(req.id)}
                      disabled={processing?.id === req.id}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 px-8 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors cursor-pointer disabled:opacity-70"
                    >
                      {processing?.id === req.id && processing?.type === 'reject' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <X className="w-4 h-4" />
                      )} 
                      {t('reject')}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
