"use client";

import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import RecurringHours from './RecurringHours';
import CustomAvailability from './CustomAvailability';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

export interface TimeSlot {
  start: string;
  end: string;
}

export default function AvailabilityManagement() {
  const t = useTranslations('consultant_availability');
  const [availabilityData, setAvailabilityData] = useState<Record<string, TimeSlot[]>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch all availability on mount
  useEffect(() => {
    const fetchAllAvailability = async () => {
      const userId = user?._id || user?.id;
      if (!userId) return;

      try {
        const response = await api.get(`/consultation/unavailability`);
        if (response.data.success && response.data.data?.slots) {
          const fetchedData: Record<string, TimeSlot[]> = {};
          
          response.data.data.slots.forEach((slot: any) => {
            const d = new Date(slot.date);
            const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            if (!fetchedData[dateKey]) {
              fetchedData[dateKey] = [];
            }
            fetchedData[dateKey].push({
              start: slot.startTime,
              end: slot.endTime
            });
          });
          
          setAvailabilityData(fetchedData);
        }
      } catch (error) {
        console.error("Error fetching initial availability:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllAvailability();
  }, [user?._id, user?.id]);

  // Handle Save Changes
  const handleSave = async () => {
    console.log("handleSave function triggered");
    setSaving(true);
    try {
      console.log("Current availabilityData state:", availabilityData);
      const today = new Date();
      const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

      const slots: any[] = [];
      Object.entries(availabilityData).forEach(([date, daySlots]) => {
        if (date >= todayString) {
          daySlots.forEach(slot => {
            slots.push({
              date: date,
              startTime: slot.start,
              endTime: slot.end
            });
          });
        }
      });

      console.log("Saving slots payload (filtered):", { slots });

      const response = await api.post('/consultation/unavailability', { slots });
      console.log("Save Response:", response.data);
      toast.success(t('unavailability_saved_success'));
    } catch (error: any) {
      console.error("Error saving availability:", error);
      console.error("Error response data:", error.response?.data);
      toast.error(error.response?.data?.message || t('unavailability_saved_error'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('unavailability_management')}</h1>
          <p className="text-slate-500 text-[15px]">{t('subtitle')}</p>
        </div>
      </div>

      {/* Main Tabs Card */}
      <div className="bg-white rounded-[1.25rem] border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] pt-2 overflow-hidden flex flex-col min-h-[500px]">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-slate-500 font-medium text-sm">{t('loading_unavailability')}</p>
          </div>
        ) : (
          <Tabs defaultValue="recurring" className="w-full flex-1">
            <div className="px-6">
              <TabsList className="flex w-full border-b border-slate-100 p-0 h-auto bg-transparent rounded-none gap-0">
                <TabsTrigger
                  value="recurring"
                  className="flex-1 py-4 text-[13px] font-bold transition-none rounded-none border-b-2 border-transparent data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none data-[state=inactive]:text-slate-400 hover:text-slate-700"
                >
                  {t('recurring_hours')}
                </TabsTrigger>
                <TabsTrigger
                  value="custom"
                  className="flex-1 py-4 text-[13px] font-bold transition-none rounded-none border-b-2 border-transparent data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none data-[state=inactive]:text-slate-400 hover:text-slate-700"
                >
                  {t('custom_unavailability')}
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="recurring" className="m-0 focus-visible:outline-none focus:outline-none">
                <RecurringHours
                  availabilityData={availabilityData}
                  setAvailabilityData={setAvailabilityData}
                />
                {/* Save Button only for Recurring Hours tab */}
                <div className="flex justify-end pt-8 border-t border-slate-100 mt-8">
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-[#FE6D2C] hover:bg-[#E85D20] text-white px-8 py-3 rounded-xl text-sm font-bold shadow-sm shadow-[#FE6D2C]/20 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? t('saving') : t('save_changes')}
                  </button>
                </div>
              </TabsContent>

              <TabsContent value="custom" className="m-0 focus-visible:outline-none focus:outline-none">
                <CustomAvailability />
              </TabsContent>
            </div>
          </Tabs>
        )}
      </div>
    </div>
  );
}
