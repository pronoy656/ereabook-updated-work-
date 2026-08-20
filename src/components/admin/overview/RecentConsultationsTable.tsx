'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Loader2 } from 'lucide-react';
import { cn, getImageUrl } from '@/lib/utils';
import api from '@/lib/axios';
import { useTranslations } from "next-intl";

interface RecentConsultation {
  consultationId: string;
  consultantName: string;
  consultantImage?: string;
  patientName: string;
  patientImage?: string;
  scheduledAt: string;
  bookingType: string;
  status: string;
  paymentAmount: number;
}

function formatDateTime(isoString: string) {
  if (!isoString) return 'N/A';
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function RecentConsultationsTable() {
  const t = useTranslations("admin_overview");
  const [data, setData] = useState<RecentConsultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchRecentConsultations = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/recent-consultations?limit=10');
        if (response.data?.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch recent consultations', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentConsultations();
  }, []);

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex flex-col h-full overflow-hidden transition-colors relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-800 dark:text-white">{t("recent_consultations")}</h3>
      </div>

      <div className="overflow-x-auto relative min-h-[200px]">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-[#1e293b]/50 z-10 backdrop-blur-[1px]">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        )}
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <th className="py-3 px-2 text-xs font-semibold text-slate-500 dark:text-slate-400 rounded-l-lg">{t("customer")}</th>
              <th className="py-3 px-2 text-xs font-semibold text-slate-500 dark:text-slate-400">{t("consultant")}</th>
              <th className="py-3 px-2 text-xs font-semibold text-slate-500 dark:text-slate-400">{t("date_time")}</th>
              <th className="py-3 px-2 text-xs font-semibold text-slate-500 dark:text-slate-400">{t("status")}</th>
              <th className="py-3 px-2 text-xs font-semibold text-slate-500 dark:text-slate-400 rounded-r-lg">{t("payment")}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              const statusKey = item.status ? `status_${item.status.toLowerCase()}` : 'unknown';
              const translatedStatus = t(statusKey as any) || item.status || 'Unknown';
              return (
                <tr key={item.consultationId || index} className="border-b border-slate-50 dark:border-slate-800/50 last:border-0 hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      {item.patientImage && !imageErrors[`patient_${item.consultationId || index}`] ? (
                        <img 
                          src={getImageUrl(item.patientImage)} 
                          alt={item.patientName || t("patient")} 
                          className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700" 
                          onError={() => setImageErrors(prev => ({ ...prev, [`patient_${item.consultationId || index}`]: true }))}
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                          <User className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{item.patientName || t("unknown_user")}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      {item.consultantImage && !imageErrors[`consultant_${item.consultationId || index}`] ? (
                        <img 
                          src={getImageUrl(item.consultantImage)} 
                          alt={item.consultantName || t("consultant")} 
                          className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700" 
                          onError={() => setImageErrors(prev => ({ ...prev, [`consultant_${item.consultationId || index}`]: true }))}
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                          <User className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{item.consultantName || t("unknown_consultant")}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-xs font-medium text-slate-500 dark:text-slate-500">{formatDateTime(item.scheduledAt)}</td>
                  <td className="py-3 px-2">
                    <span className={cn(
                      "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                      item.status?.toLowerCase() === 'completed' ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400" :
                      item.status?.toLowerCase() === 'ongoing' ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400" :
                      item.status?.toLowerCase() === 'cancelled' ? "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400" :
                      "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400"
                    )}>
                      {translatedStatus}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-800 dark:text-white">${(item.paymentAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      <span className={cn(
                        "text-[10px] font-bold uppercase",
                        (item.paymentAmount || 0) > 0 ? "text-emerald-500" : "text-amber-500"
                      )}>
                        {(item.paymentAmount || 0) > 0 ? t("paid") : t("payment_pending")}
                      </span>
                    </div>
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
