"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Video, Calendar, PhoneCall, User, Clock, Check, X, Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import api from '@/lib/axios';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { getImageUrl } from '@/lib/utils';

interface RequestData {
  id: string;
  tabType: "Instant" | "Schedule" | "Callback";
  name: string;
  image?: string;
  requestType: string;
  time: string;
  scheduledAt?: number; // timestamp for countdown
  notes: string;
  status: "pending" | "accepted" | string;
}


// Helper Component to handle independent Live Countdowns and State Transitions for accepted requests
const AcceptedActionState = ({ req }: { req: RequestData }) => {
  const router = useRouter();

  const handleJoinCall = () => {
    if (req.tabType === "Schedule" && req.scheduledAt && !isNaN(req.scheduledAt)) {
      const diffMs = req.scheduledAt - Date.now();
      if (diffMs > 5 * 60 * 1000) {
        toast.error("You can only join the call 5 minutes before the scheduled time.");
        return;
      }
    }
    router.push(`/call?consultationId=${req.id}`);
  };

  // If it's an Instant request and we're joining via popup, hide the manual Join Call button
  if (req.tabType === "Instant") {
    return (
      <span className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200/80 select-none cursor-default">
        <Check className="w-3.5 h-3.5" /> Accepted
      </span>
    );
  }

  // Once the time arrives (or if it's a Callback default)
  return (
    <button
      onClick={handleJoinCall}
      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-sm shadow-emerald-500/20 transition-transform active:scale-95 animate-in zoom-in duration-300"
    >
      {req.tabType === "Callback" ? <PhoneCall className="w-4 h-4" /> : <Video className="w-4 h-4" />} 
      {req.tabType === "Callback" ? "Call Now" : "Join Call"}
    </button>
  );
};


export default function IncomingRequests() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const highlightId = searchParams.get("highlight");    // URL থেকে highlight booking ID
  const tabParam    = searchParams.get("tab");           // URL থেকে tab (callback | schedule)
  const highlightRef = useRef<HTMLDivElement>(null);
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [loading, setLoading] = useState(true);

  // URL এ tab param থাকলে সেই tab এ auto-switch করো
  const getInitialTab = (): "Schedule" | "Callback" => {
    if (tabParam?.toLowerCase().includes("callback")) return "Callback";
    if (tabParam?.toLowerCase().includes("schedule")) return "Schedule";
    return "Schedule"; // default
  };
  const [activeTab, setActiveTab] = useState<"Schedule" | "Callback">(getInitialTab);
  const [counts, setCounts] = useState({ Schedule: 0, Callback: 0 });
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const extractList = (res: any): any[] => {
    if (!res?.data) return [];
    const payload = res.data.data !== undefined ? res.data.data : res.data;
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.appointments)) return payload.appointments;
    if (Array.isArray(payload?.bookings)) return payload.bookings;
    if (Array.isArray(payload?.results)) return payload.results;
    if (Array.isArray(payload?.data)) return payload.data;
    return [];
  };

  // API response থেকে সাঠিক total count পড়ার জন্য helper
  // প্রথমে API এর metadata field দেখবে, না পেলে items এর length দিয়ে fallback
  const extractTotal = (res: any): number => {
    if (!res?.data) return 0;
    const payload = res.data.data !== undefined ? res.data.data : res.data;
    // Common API total fields
    const total =
      res.data?.total ??
      res.data?.totalCount ??
      res.data?.count ??
      payload?.total ??
      payload?.totalCount ??
      payload?.count ??
      payload?.pagination?.total ??
      payload?.meta?.total ??
      null;
    if (total !== null) return Number(total);
    // Fallback: list এর length
    return extractList(res).length;
  };

  const mapAppointmentItem = (item: any, currentTab: "Schedule" | "Callback"): RequestData => {
    let timeDisplay = "Instant";
    let scheduledAt = item.createdAt ? new Date(item.createdAt).getTime() : Date.now();

    try {
      if (item.date || item.startTime || currentTab === "Schedule" || item.bookingType?.toLowerCase() === "scheduled" || item.bookingType?.toLowerCase() === "schedule") {
        const formattedDate = item.date ? format(new Date(item.date), 'MMM dd, yyyy') : (item.createdAt ? format(new Date(item.createdAt), 'MMM dd, yyyy') : "Scheduled");
        const start = item.startTime || "";
        const end = item.endTime || "";
        timeDisplay = start && end ? `${start} - ${end}, ${formattedDate}` : (start ? `${start}, ${formattedDate}` : formattedDate);
        
        if (item.date && item.startTime) {
          const datePart = typeof item.date === 'string' ? item.date.split('T')[0] : format(new Date(item.date), 'yyyy-MM-dd');
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
      } else if (currentTab === "Callback" || item.bookingType?.toLowerCase() === "callback") {
        timeDisplay = item.preferredWindow || item.time || (item.createdAt ? format(new Date(item.createdAt), 'MMM dd, yyyy - hh:mm a') : "Today");
      }
    } catch (err) {
      console.warn("Date parsing error for item:", item, err);
      timeDisplay = item.startTime || "Scheduled";
    }

    return {
      id: item._id || item.id,
      tabType: currentTab,
      name: item.user?.name || item.patient?.name || item.userName || "Guest User",
      image: getImageUrl(item.user?.image || item.user?.avatar || item.patient?.image),
      requestType: (item.bookingType || (currentTab === "Callback" ? "Callback" : "Scheduled")).charAt(0).toUpperCase() + (item.bookingType || (currentTab === "Callback" ? "Callback" : "Scheduled")).slice(1),
      time: timeDisplay,
      scheduledAt,
      notes: item.notes || item.reason || item.description || "No additional notes.",
      status: (item.status || "pending").toLowerCase(),
    };
  };

  const refreshData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      
      const activeParam = activeTab === "Schedule" ? "scheduled" : "callback";
      const otherParam = activeTab === "Schedule" ? "callback" : "scheduled";

      // Fetch active tab appointments and other tab count
      // limit=500 দিয়ে pagination bypass করা যাতে সব ইতেম আসে
      const API_PARAMS = { limit: 500, page: 1 };
      const [activeRes, otherRes] = await Promise.allSettled([
        api.get(`/consultation/my-appointments`, { params: { bookingType: activeParam, ...API_PARAMS } }).catch(() =>
          api.get(`/consultation/my-bookings`, { params: API_PARAMS })
        ),
        api.get(`/consultation/my-appointments`, { params: { bookingType: otherParam, ...API_PARAMS } }).catch(() =>
          api.get(`/consultation/my-bookings`, { params: API_PARAMS })
        ),
      ]);

      let activeItems: any[] = [];
      let otherItems: any[] = [];
      let activeTotal = 0;
      let otherTotal  = 0;

      if (activeRes.status === 'fulfilled') {
        activeItems = extractList(activeRes.value);
        activeTotal = extractTotal(activeRes.value); // API থেকে সাঠিক total
      }
      if (otherRes.status === 'fulfilled') {
        otherItems = extractList(otherRes.value);
        otherTotal  = extractTotal(otherRes.value);
      }

      // Count এ এখন API এর total field ব্যবহার হবে, items.length নয়
      const newCounts = {
        Schedule: activeTab === "Schedule" ? activeTotal : otherTotal,
        Callback: activeTab === "Callback" ? activeTotal : otherTotal,
      };
      setCounts(newCounts);

      // Map requests for current tab
      const mappedData = activeItems.map((item: any) => mapAppointmentItem(item, activeTab));
      
      // Sort: pending first, then by scheduled date/created date descending
      mappedData.sort((a: any, b: any) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        return (b.scheduledAt || 0) - (a.scheduledAt || 0);
      });

      setRequests(mappedData);
    } catch (error: any) {
      if (!silent) toast.error(error.response?.data?.message || "Failed to fetch appointments");
      console.error("Fetch Error:", error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const [processing, setProcessing] = useState<{ id: string, type: 'accept' | 'reject' } | null>(null);

  const handleStatusUpdate = async (id: string, status: string, type: 'accept' | 'reject', shouldRefresh = true) => {
    try {
      console.log(`[Status Update] Sending PATCH request to /consultation/status/${id}`);
      console.log(`[Status Update] Request Body:`, { status });
      setProcessing({ id, type });
      const response = await api.patch(`/consultation/status/${id}`, { status });
      if (response.data.success) {
        if (shouldRefresh) {
          toast.success(`Booking ${status} successfully!`);
          refreshData(true);
        }
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("[Status Update Error]:", error);
      console.error("[Status Update Error] Response:", error?.response?.status, error?.response?.data);
      toast.error(error.response?.data?.message || `Failed to update booking status`);
      return false;
    } finally {
      if (shouldRefresh) {
        setProcessing(null);
      }
    }
  };

  useEffect(() => {
    refreshData();
  }, [activeTab]);

  // Highlight করা card এ auto-scroll — render হওয়ার পরে scroll করা
  useEffect(() => {
    if (!highlightId || loading) return;

    // render শেষ হওয়ার পরে scroll করার জন্য timeout
    const timer = setTimeout(() => {
      if (highlightRef.current) {
        highlightRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 600); // data load + render এর জন্য যথেষ্ট সময়

    return () => clearTimeout(timer);
  }, [highlightId, loading, activeTab]); // activeTab বদলালেও re-run হবে

  // Real-time count update: শুধুমাত্র booking-related notification আসলে
  // silently data re-fetch করবে। AI Summary বা অন্য notification এ করবে না।
  useEffect(() => {
    const BOOKING_TYPES = ["callback", "schedule", "scheduled", "appointment", "booking", "instant"];

    const handleNewNotification = (event: Event) => {
      const data = (event as CustomEvent)?.detail;

      // Notification data তে booking-related কিছু আছে কিনা চেক করো
      const isBookingRelated =
        data?.relatedBooking ||                                          // booking ID আছে
        data?.bookingId ||
        BOOKING_TYPES.some((type) =>
          data?.type?.toLowerCase().includes(type) ||                   // type field match
          data?.title?.toLowerCase().includes(type) ||                  // title এ booking word
          data?.message?.toLowerCase().includes(type)                   // message তে booking word
        );

      if (isBookingRelated) {
        refreshData(true); // silent = true → কোনো loading spinner দেখাবে না
      }
    };

    window.addEventListener("fixpair:new-notification", handleNewNotification);

    return () => {
      window.removeEventListener("fixpair:new-notification", handleNewNotification);
    };
  }, [activeTab]); // activeTab dependency রাখা হয়েছে যাতে সঠিক tab এর data আসে

  const handleAccept = async (id: string) => {
    // First mark as accepted
    const success = await handleStatusUpdate(id, "accepted", "accept", false);
    if (success) {
      // Then immediately move to confirmed to keep mobile app in sync
      await handleStatusUpdate(id, "confirmed", "accept", true);
    } else {
      setProcessing(null);
    }
  };

  const handleInstantAccept = async (id: string) => {
    // For instant requests, we accept, confirm, and instantly route to the call page
    setProcessing({ id, type: 'accept' });
    const success = await handleStatusUpdate(id, "accepted", "accept", false);
    if (success) {
      await handleStatusUpdate(id, "confirmed", "accept", false);
      try {
        let createRes = await api.post('/video-session/create', { consultationId: id }).catch(() => null);
        let resData = createRes?.data?.data || createRes?.data;
        let sessionId = resData?.sessionId || resData?.id || resData?._id;
        
        if (!sessionId) {
          const listRes = await api.get('/video-session').catch(() => null);
          const sessions = listRes?.data?.data || listRes?.data;
          if (Array.isArray(sessions)) {
            const existing = sessions.find((s: any) => s.consultation === id || s.consultation?._id === id || s.consultationId === id);
            if (existing) sessionId = existing.sessionId || existing.id || existing._id;
          }
        }
        
        if (sessionId) {
          const joinRes = await api.post('/video-session/join', { sessionId }).catch(() => null);
          const joinData = joinRes?.data?.data || joinRes?.data;
          const token = joinData?.token || resData?.token;
          const channelName = joinData?.channelName || resData?.channelName;
          const uid = joinData?.uid || resData?.uid;
          
          if (token && channelName) {
            const queryParams = new URLSearchParams({
              consultationId: id,
              channelName,
              token,
              uid: (uid || 2001).toString(),
              sessionId
            });
            router.push(`/call?${queryParams.toString()}`);
            return;
          }
        }
      } catch (e) {
        console.warn("Pre-fetch video session error in table accept:", e);
      }
      router.push(`/call?consultationId=${id}`);
    } else {
      setProcessing(null);
    }
  };

  const handleCallbackAccept = async (id: string) => {
    try {
      setProcessing({ id, type: 'accept' });
      const response = await api.post(`/consultation/initiate-callback/${id}`);
      if (response.data.success) {
        toast.success(response.data.message || "Callback initiated successfully!");
        
        const resData = response.data?.data || response.data;
        let sessionId = resData?.sessionId || resData?.id || resData?._id || resData?.session?.sessionId || resData?.session?._id;
        let channelName = resData?.channelName || resData?.session?.channelName;
        let token = resData?.token || resData?.session?.token;
        let uid = resData?.uid || resData?.session?.uid;
        let appId = resData?.appId || resData?.session?.appId || process.env.NEXT_PUBLIC_AGORA_APP_ID;

        // If sessionId is found, call /video-session/join to register consultant join on the backend
        if (sessionId) {
          try {
            const joinRes = await api.post('/video-session/join', { sessionId }).catch(() => null);
            const joinData = joinRes?.data?.data || joinRes?.data;
            if (joinData) {
              if (joinData.token) token = joinData.token;
              if (joinData.channelName) channelName = joinData.channelName;
              if (joinData.uid !== undefined && joinData.uid !== null) uid = joinData.uid;
              if (joinData.appId) appId = joinData.appId;
            }
          } catch (joinErr: any) {
            console.warn("Notice: video-session/join in handleCallbackAccept warning:", joinErr);
          }
        }

        const queryParams = new URLSearchParams({
          consultationId: id,
          isCallback: "true"
        });

        if (sessionId) queryParams.set("sessionId", sessionId);
        if (channelName) queryParams.set("channelName", channelName);
        if (token) queryParams.set("token", token);
        if (uid) queryParams.set("uid", uid.toString());
        if (appId) queryParams.set("appId", appId);

        router.push(`/call?${queryParams.toString()}`);
      }
    } catch (error: any) {
      console.error("[Callback Init Error]:", error);
      toast.error(error.response?.data?.message || "Failed to initiate callback");
      setProcessing(null);
    }
  };

  const handleReject = async (id: string) => {
    await handleStatusUpdate(id, "rejected", "reject");
  };

  const scheduleCount = counts.Schedule;
  const callbackCount = counts.Callback;

  const currentRequests = requests.filter(r => r.tabType === activeTab);

  return (
    <div className="w-full mx-auto space-y-8 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Incoming Requests</h1>
          <p className="text-slate-500 mt-1 font-medium text-[15px]">
            Manage your consultation requests and bookings.
          </p>
        </div>
        <button 
          onClick={() => router.push('/consultant/requests/history')}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-colors shadow-sm"
        >
          <Clock className="w-4 h-4" /> History
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[1.25rem] border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">

        {/* Custom Tabs Navigation */}
        <div className="flex flex-col sm:flex-row border-b border-slate-100 px-2 sm:px-6">


          <button
            onClick={() => setActiveTab("Schedule")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-4 text-[14px] font-bold border-b-2 transition-colors",
              activeTab === "Schedule"
                ? "text-blue-500 border-blue-500"
                : "text-slate-500 hover:text-slate-700 border-transparent"
            )}
          >
            <Calendar className="w-4 h-4" />
            Schedule Bookings
            <span className={cn(
              "text-[11px] w-5 h-5 rounded-full flex items-center justify-center font-bold",
              activeTab === "Schedule" ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
            )}>
              {scheduleCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("Callback")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-4 text-[14px] font-bold border-b-2 transition-colors",
              activeTab === "Callback"
               ? "text-blue-500 border-blue-500"
               : "text-slate-500 hover:text-slate-700 border-transparent"
            )}
          >
            <PhoneCall className="w-4 h-4" />
            Callback Requests
            <span className={cn(
              "text-[11px] w-5 h-5 rounded-full flex items-center justify-center font-bold",
              activeTab === "Callback" ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
            )}>
              {callbackCount}
            </span>
          </button>
        </div>

        {/* Requests List */}
        <div className="p-4 sm:p-6 space-y-4 bg-[#FAFAFA] min-h-[400px] flex flex-col">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
               <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
               <p className="text-slate-500 font-medium">Fetching requests...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-slate-500 font-medium">No pending requests in this category.</p>
            </div>
          ) : (
            requests.map((req) => (
              <div
                key={req.id}
                ref={highlightId === req.id ? highlightRef : null}
                className={cn(
                  "bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6",
                  highlightId === req.id
                    ? "border-blue-400 shadow-blue-100 shadow-lg ring-2 ring-blue-300 ring-offset-2 animate-pulse-highlight"
                    : "border-slate-100"
                )}
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

                <div className="flex flex-row md:flex-col gap-3 shrink-0 self-start md:self-center w-full md:w-auto">
                  {req.status?.toLowerCase() === "completed" ? (
                    <span className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200/80 select-none cursor-default">
                      <Check className="w-3.5 h-3.5" /> Completed
                    </span>
                  ) : req.status?.toLowerCase() === "rejected" ? (
                    <span className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-rose-50 text-rose-700 border border-rose-200/80 select-none cursor-default">
                      <X className="w-3.5 h-3.5" /> Rejected
                    </span>
                  ) : req.status?.toLowerCase() === "cancelled" ? (
                    <span className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-slate-100 text-slate-600 border border-slate-200 select-none cursor-default">
                      <X className="w-3.5 h-3.5" /> Cancelled
                    </span>
                  ) : req.status === "accepted" || req.status === "confirmed" ? (
                      <AcceptedActionState req={req} />
                  ) : req.tabType === "Instant" ? (
                      <>
                        <button
                          onClick={() => handleInstantAccept(req.id)}
                          disabled={processing?.id === req.id}
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-sm shadow-emerald-500/20 transition-transform active:scale-95 disabled:opacity-70"
                        >
                          {processing?.id === req.id && processing?.type === 'accept' ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )} 
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(req.id)}
                          disabled={processing?.id === req.id}
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-sm shadow-rose-500/20 transition-transform active:scale-95 disabled:opacity-70"
                        >
                          {processing?.id === req.id && processing?.type === 'reject' ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <X className="w-4 h-4" />
                          )} 
                          Decline
                        </button>
                      </>
                  ) : req.tabType === "Callback" ? (
                      <button
                        onClick={() => handleCallbackAccept(req.id)}
                        disabled={processing?.id === req.id}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-sm shadow-emerald-500/20 transition-transform active:scale-95 disabled:opacity-70"
                      >
                        {processing?.id === req.id && processing?.type === 'accept' ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <PhoneCall className="w-4 h-4" />
                        )} 
                        Call Back
                      </button>
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
                          Accept
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
                          Reject
                        </button>
                      </>
                   )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
