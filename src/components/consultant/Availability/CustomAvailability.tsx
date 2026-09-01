"use client";

import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Loader2, CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import { TimeSlot } from './AvailabilityManagement';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { useTranslations, useLocale } from 'next-intl';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CustomAvailability() {
  const t = useTranslations('consultant_availability');
  const locale = useLocale();
  const [availabilityData, setAvailabilityData] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Delete Confirmation Modal State
  const [selectedSlotToDelete, setSelectedSlotToDelete] = useState<{ id: string; date: string; time: string } | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
              id: slot._id || slot.id,
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

  const handleOpenDeleteModal = (slotId: string, dateStr: string, timeRange: string) => {
    setSelectedSlotToDelete({ id: slotId, date: dateStr, time: timeRange });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedSlotToDelete) return;
    setDeleting(true);
    try {
      const response = await api.delete(`/consultation/unavailability/${selectedSlotToDelete.id}`);
      if (response.data.success) {
        toast.success(response.data.message || t('delete_slot_success'));
        
        // Remove slot locally from state
        setAvailabilityData(prev => {
          const dateKey = selectedSlotToDelete.date;
          const currentSlots = prev[dateKey] || [];
          const updatedSlots = currentSlots.filter(s => s.id !== selectedSlotToDelete.id);
          
          const newObj = { ...prev };
          if (updatedSlots.length === 0) {
            delete newObj[dateKey];
          } else {
            newObj[dateKey] = updatedSlots;
          }
          return newObj;
        });
      }
    } catch (error: any) {
      console.error("Error deleting unavailable slot:", error);
      toast.error(error.response?.data?.message || t('delete_slot_error'));
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setSelectedSlotToDelete(null);
    }
  };

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
                      const timeRange = `${slot.start} - ${slot.end}`;

                      return (
                        <div key={i} className={cn(
                          "flex items-center justify-between gap-4 px-4 py-2.5 rounded-xl shadow-sm border transition-all group",
                          isUnavailable 
                            ? "bg-slate-50/80 border-slate-200 hover:border-slate-300" 
                            : "bg-white border-emerald-200 hover:border-emerald-300 hover:shadow-md"
                        )}>
                          <div className="flex flex-col gap-1">
                            <div className={cn(
                              "flex items-center gap-1.5 font-bold text-[14px]",
                              isUnavailable ? "text-slate-700" : "text-slate-700"
                            )}>
                              <Clock className={cn("w-3.5 h-3.5", isUnavailable ? "text-rose-500" : "text-emerald-500")} />
                              {timeRange}
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

                          {/* Delete Unavailable Slot Button */}
                          {slot.id && (
                            <button
                              type="button"
                              onClick={() => handleOpenDeleteModal(slot.id, dateStr, timeRange)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title={t('remove_slot')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
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

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl p-6">
          <DialogHeader className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mx-auto sm:mx-0">
              <Trash2 className="w-6 h-6" />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900">
              {t('delete_slot_title')}
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500 font-normal leading-relaxed">
              {t('delete_slot_confirm')}
              {selectedSlotToDelete && (
                <span className="block mt-2 font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                  {selectedSlotToDelete.date} ({selectedSlotToDelete.time})
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4">
            <button
              type="button"
              disabled={deleting}
              onClick={() => setDeleteModalOpen(false)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {t('cancel')}
            </button>
            <button
              type="button"
              disabled={deleting}
              onClick={handleConfirmDelete}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-sm shadow-rose-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('deleting')}</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>{t('delete_slot_button')}</span>
                </>
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
