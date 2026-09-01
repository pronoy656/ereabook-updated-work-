"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Clock, Check, Loader2, ArrowLeft, PhoneCall, Calendar, Zap, X } from 'lucide-react';
import { cn } from "@/lib/utils";
import api from '@/lib/axios';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { getImageUrl } from '@/lib/utils';

interface HistoryRequestData {
  id: string;
  name: string;
  image?: string;
  requestType: string;
  time: string;
  notes: string;
  status: string;
  createdAt?: string;
}

export default function HistoryRequests() {
  const router = useRouter();
  const [requests, setRequests] = useState<HistoryRequestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"instant" | "callback" | "scheduled">("instant");
  const [counts, setCounts] = useState({ instant: 0, callback: 0, scheduled: 0 });
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const extractList = (res: any): any[] => {
    if (!res?.data) return [];
    const payload = res.data.data !== undefined ? res.data.data : res.data;
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.appointments)) return payload.appointments;
    if (Array.isArray(payload?.bookings)) return payload.bookings;
    if (Array.isArray(payload?.history)) return payload.history;
    if (Array.isArray(payload?.results)) return payload.results;
    if (Array.isArray(payload?.data)) return payload.data;
    return [];
  };

  const mapHistoryItem = (item: any, currentTab: "instant" | "callback" | "scheduled"): HistoryRequestData => {
    let timeDisplay = "History Record";

    try {
      if (currentTab === "scheduled" || item.date || item.startTime) {
        const formattedDate = item.date ? format(new Date(item.date), 'MMM dd, yyyy') : (item.createdAt ? format(new Date(item.createdAt), 'MMM dd, yyyy') : "Scheduled");
        const start = item.startTime || "";
        const end = item.endTime || "";
        timeDisplay = start && end ? `${start} - ${end}, ${formattedDate}` : (start ? `${start}, ${formattedDate}` : formattedDate);
      } else if (currentTab === "callback" || item.preferredWindow || item.time) {
        timeDisplay = item.preferredWindow || item.time || (item.createdAt ? format(new Date(item.createdAt), 'MMM dd, yyyy - hh:mm a') : "Today");
      } else if (item.createdAt) {
        timeDisplay = format(new Date(item.createdAt), 'MMM dd, yyyy - hh:mm a');
      }
    } catch (err) {
      console.warn("History date parsing error for item:", item, err);
      timeDisplay = item.createdAt ? format(new Date(item.createdAt), 'MMM dd, yyyy - hh:mm a') : "Past Appointment";
    }

    const typeLabel = (item.bookingType || (currentTab === "instant" ? "Instant" : currentTab === "callback" ? "Callback" : "Scheduled"));

    return {
      id: item._id || item.id,
      name: item.user?.name || item.patient?.name || item.userName || "Guest User",
      image: getImageUrl(item.user?.image || item.user?.avatar || item.patient?.image),
      requestType: typeLabel.charAt(0).toUpperCase() + typeLabel.slice(1),
      time: timeDisplay,
      notes: item.notes || item.reason || item.description || "No additional notes.",
      status: (item.status || "completed").toLowerCase(),
      createdAt: item.createdAt,
    };
  };

  const refreshData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);

      // Call GET /api/v1/consultation/my-appointments?bookingType=...&tab=history for instant, callback, scheduled
      const [instantRes, callbackRes, scheduledRes] = await Promise.allSettled([
        api.get(`/consultation/my-appointments`, { params: { bookingType: "instant", tab: "history" } }),
        api.get(`/consultation/my-appointments`, { params: { bookingType: "callback", tab: "history" } }),
        api.get(`/consultation/my-appointments`, { params: { bookingType: "scheduled", tab: "history" } }),
      ]);

      let instantItems = instantRes.status === 'fulfilled' ? extractList(instantRes.value) : [];
      let callbackItems = callbackRes.status === 'fulfilled' ? extractList(callbackRes.value) : [];
      let scheduledItems = scheduledRes.status === 'fulfilled' ? extractList(scheduledRes.value) : [];

      // Fallback: If any category returned 0 items from my-appointments, query /consultation/my-bookings
      try {
        const bookingsRes = await api.get('/consultation/my-bookings');
        const allBookings = extractList(bookingsRes);
        if (Array.isArray(allBookings) && allBookings.length > 0) {
          const historyList = allBookings.filter((item: any) => {
            const st = (item.status || "").toLowerCase();
            return st === "completed" || st === "cancelled" || st === "rejected";
          });

          if (callbackItems.length === 0) {
            callbackItems = historyList.filter((i: any) => (i.bookingType || "").toLowerCase() === "callback");
          }
          if (instantItems.length === 0) {
            instantItems = historyList.filter((i: any) => (i.bookingType || "").toLowerCase() === "instant");
          }
          if (scheduledItems.length === 0) {
            scheduledItems = historyList.filter((i: any) => (i.bookingType || "").toLowerCase() === "scheduled" || (i.bookingType || "").toLowerCase() === "schedule");
          }
        }
      } catch (fallbackErr) {
        console.warn("History fallback to my-bookings warning:", fallbackErr);
      }

      // Update Counts
      setCounts({
        instant: instantItems.length,
        callback: callbackItems.length,
        scheduled: scheduledItems.length,
      });

      // Get active items
      const activeItems = activeTab === "instant" ? instantItems : activeTab === "callback" ? callbackItems : scheduledItems;
      const mappedData = activeItems.map((item: any) => mapHistoryItem(item, activeTab));
      
      // Sort by newest first
      mappedData.sort((a: any, b: any) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });

      setRequests(mappedData);
    } catch (error: any) {
      if (!silent) toast.error(error.response?.data?.message || "Failed to fetch history");
      console.error("Fetch Error:", error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [activeTab]);

  return (
    <div className="w-full mx-auto space-y-8 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Request History</h1>
          <p className="text-slate-500 mt-1 font-medium text-[15px]">
            View your past completed instant calls, callback records, and scheduled consultations.
          </p>
        </div>
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-bold transition-colors shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Requests
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[1.25rem] border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
        
        {/* Custom Tabs Navigation */}
        <div className="flex flex-col sm:flex-row border-b border-slate-100 px-2 sm:px-6">
          <button
            onClick={() => setActiveTab("instant")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-4 text-[14px] font-bold border-b-2 transition-colors cursor-pointer",
              activeTab === "instant"
                ? "text-blue-500 border-blue-500"
                : "text-slate-500 hover:text-slate-700 border-transparent"
            )}
          >
            <Zap className="w-4 h-4" />
            Instant History
            <span className={cn(
              "text-[11px] w-5 h-5 rounded-full flex items-center justify-center font-bold",
              activeTab === "instant" ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
            )}>
              {counts.instant}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("callback")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-4 text-[14px] font-bold border-b-2 transition-colors cursor-pointer",
              activeTab === "callback"
                ? "text-blue-500 border-blue-500"
                : "text-slate-500 hover:text-slate-700 border-transparent"
            )}
          >
            <PhoneCall className="w-4 h-4" />
            Callback History
            <span className={cn(
              "text-[11px] w-5 h-5 rounded-full flex items-center justify-center font-bold",
              activeTab === "callback" ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
            )}>
              {counts.callback}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("scheduled")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-4 text-[14px] font-bold border-b-2 transition-colors cursor-pointer",
              activeTab === "scheduled"
                ? "text-blue-500 border-blue-500"
                : "text-slate-500 hover:text-slate-700 border-transparent"
            )}
          >
            <Calendar className="w-4 h-4" />
            Schedule History
            <span className={cn(
              "text-[11px] w-5 h-5 rounded-full flex items-center justify-center font-bold",
              activeTab === "scheduled" ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
            )}>
              {counts.scheduled}
            </span>
          </button>
        </div>

        {/* Requests List */}
        <div className="p-4 sm:p-6 space-y-4 bg-[#FAFAFA] min-h-[400px] flex flex-col">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
               <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
               <p className="text-slate-500 font-medium">Fetching history...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-slate-500 font-medium">No history records found for this category.</p>
            </div>
          ) : (
            requests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Left side details */}
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
                        <strong className="text-slate-800">Notes: </strong>{req.notes}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-start md:justify-end shrink-0 self-start md:self-center w-full md:w-auto">
                   <span className={cn(
                     "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide select-none cursor-default shadow-none transition-none",
                     req.status === 'completed' ? "text-emerald-700 bg-emerald-50 border border-emerald-200/80" :
                     req.status === 'rejected' ? "text-rose-700 bg-rose-50 border border-rose-200/80" :
                     req.status === 'cancelled' ? "text-slate-600 bg-slate-100 border border-slate-200" :
                     req.status === 'accepted' || req.status === 'confirmed' ? "text-blue-700 bg-blue-50 border border-blue-200/80" :
                     "text-slate-600 bg-slate-100 border border-slate-200"
                   )}>
                     {req.status === 'completed' || req.status === 'accepted' || req.status === 'confirmed' ? (
                       <Check className="w-3.5 h-3.5" />
                     ) : req.status === 'rejected' || req.status === 'cancelled' ? (
                       <X className="w-3.5 h-3.5" />
                     ) : (
                       <Clock className="w-3.5 h-3.5" />
                     )}
                     {req.status ? req.status.charAt(0).toUpperCase() + req.status.slice(1) : "Completed"}
                   </span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
