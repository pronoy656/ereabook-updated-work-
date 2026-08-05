"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Clock, Check, Loader2, ArrowLeft } from 'lucide-react';
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
}

export default function HistoryRequests() {
  const router = useRouter();
  const [requests, setRequests] = useState<HistoryRequestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const refreshData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/consultation/my-bookings");
      
      if (response.data.success) {
        const allData = response.data.data;
        
        const mappedData = allData
          .filter((item: any) => 
            item.bookingType?.toLowerCase() === "instant" && 
            item.status?.toLowerCase() === "completed"
          )
          .map((item: any) => {
            return {
              id: item._id,
              name: item.user?.name || "Guest User",
              image: getImageUrl(item.user?.image || item.user?.avatar),
              requestType: (item.bookingType || "Request").charAt(0).toUpperCase() + (item.bookingType || "Request").slice(1),
              time: format(new Date(item.createdAt), 'MMM dd, yyyy - hh:mm a'),
              notes: item.notes || "No additional notes.",
              status: item.status,
            };
          });
        
        // Sort by newest first
        mappedData.sort((a: any, b: any) => new Date(b.time).getTime() - new Date(a.time).getTime());

        setRequests(mappedData);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch history");
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className="w-full mx-auto space-y-8 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Request History</h1>
          <p className="text-slate-500 mt-1 font-medium text-[15px]">
            View your past completed instant requests.
          </p>
        </div>
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-bold transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Requests
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[1.25rem] border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
        
        {/* Requests List */}
        <div className="p-4 sm:p-6 space-y-4 bg-[#FAFAFA] min-h-[400px] flex flex-col">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
               <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
               <p className="text-slate-500 font-medium">Fetching history...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-slate-500 font-medium">No completed history found.</p>
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

                <div className="flex flex-row md:flex-col gap-3 shrink-0 self-start md:self-center w-full md:w-auto">
                   <span className="text-emerald-600 text-[13px] font-bold uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-6 py-2.5 rounded-xl text-center shadow-sm flex items-center justify-center gap-1.5 animate-in zoom-in duration-300">
                     <Check className="w-4 h-4" /> Completed
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
