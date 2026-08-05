"use client";

import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Trash2, Plus, Loader2, Clock } from 'lucide-react';
import { TimeSlot } from './AvailabilityManagement';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';

interface RecurringHoursProps {
  availabilityData: Record<string, TimeSlot[]>;
  setAvailabilityData: React.Dispatch<React.SetStateAction<Record<string, TimeSlot[]>>>;
}

const generateTimeOptions = (minTime?: string) => {
  const options = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const timeString = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      if (!minTime || timeString >= minTime) {
        options.push({
          value: timeString,
          label: new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
    }
  }
  return options;
};

export default function RecurringHours({ availabilityData, setAvailabilityData }: RecurringHoursProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const { user } = useAuth();

  // Simple calendar math
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }, (_, i) => i); 

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  const isSelected = (day: number) => {
    return selectedDate && day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear();
  };

  const getDateKey = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const hasHours = (day: number) => {
    const key = getDateKey(day);
    return availabilityData[key] && availabilityData[key].length > 0;
  };

  const isSelectable = (day: number) => {
    const dateToCheck = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30); // 30 days from today

    return dateToCheck >= today && dateToCheck <= thirtyDaysFromNow;
  };

  const selectedDateKey = selectedDate 
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}` 
    : '';

  // Fetch slots for selected date
  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDateKey || !user?._id) return;

      setLoadingSlots(true);
      try {
        const response = await api.get(`/consultation/available-slots/${user._id}?date=${selectedDateKey}`);
        
        if (response.data.success) {
          const fetchedSlots = response.data.data.map((slot: any) => ({
            start: slot.startTime,
            end: slot.endTime
          }));
          
          setAvailabilityData(prev => ({
            ...prev,
            [selectedDateKey]: fetchedSlots
          }));
        }
      } catch (error) {
        console.error("Error fetching slots:", error);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedDateKey, user?._id, setAvailabilityData]);

  const slots = selectedDate ? (availabilityData[selectedDateKey] || []) : [];

  const handleAddSlot = () => {
    if (!selectedDateKey) return;

    let defaultStart = "09:00";
    let defaultEnd = "10:00";

    if (selectedDate) {
      const today = new Date();
      const isSelectedToday = selectedDate.getDate() === today.getDate() && 
                              selectedDate.getMonth() === today.getMonth() && 
                              selectedDate.getFullYear() === today.getFullYear();
      
      if (isSelectedToday) {
        const currentHour = today.getHours();
        const nextHour = currentHour + 1;
        if (nextHour < 24) {
          defaultStart = `${String(nextHour).padStart(2, '0')}:00`;
          defaultEnd = `${String(Math.min(nextHour + 1, 23)).padStart(2, '0')}:00`;
        } else {
          defaultStart = "23:00";
          defaultEnd = "23:45";
        }
      }
    }

    setAvailabilityData(prev => {
      const existingSlots = prev[selectedDateKey] || [];
      
      let candidateHour = parseInt(defaultStart.split(':')[0]);
      let isOverlapping = (startStr: string) => existingSlots.some(s => startStr >= s.start && startStr < s.end);
      
      while (isOverlapping(defaultStart) && candidateHour < 23) {
        candidateHour++;
        defaultStart = `${String(candidateHour).padStart(2, '0')}:00`;
        defaultEnd = `${String(candidateHour + 1).padStart(2, '0')}:00`;
      }
      
      if (isOverlapping(defaultStart)) {
        toast.error("No free time slots available to add on this date.");
        return prev;
      }
      
      return {
        ...prev,
        [selectedDateKey]: [...existingSlots, { start: defaultStart, end: defaultEnd }]
      };
    });
  };

  const handleUpdateSlot = (index: number, field: 'start' | 'end', value: string) => {
    if (!selectedDateKey) return;

    setAvailabilityData(prev => {
      const daySlots = [...(prev[selectedDateKey] || [])];
      
      let proposedStart = field === 'start' ? value : daySlots[index].start;
      let proposedEnd = field === 'end' ? value : daySlots[index].end;

      // Auto-correct end time if start time > end time
      if (field === 'start' && proposedStart > proposedEnd) {
        proposedEnd = proposedStart;
      }
      if (field === 'end' && proposedEnd < proposedStart) {
        proposedStart = proposedEnd;
      }

      // Check for exact duplicates
      const isDuplicate = daySlots.some((slot, i) => 
        i !== index && slot.start === proposedStart && slot.end === proposedEnd
      );

      if (isDuplicate) {
        toast.error("This exact time slot already exists for this date.");
        return prev; // Do not apply the change
      }

      daySlots[index] = { ...daySlots[index], start: proposedStart, end: proposedEnd };
      return { ...prev, [selectedDateKey]: daySlots };
    });
  };

  const handleRemoveSlot = (index: number) => {
    if (!selectedDateKey) return;
    setAvailabilityData(prev => {
      const daySlots = [...(prev[selectedDateKey] || [])];
      daySlots.splice(index, 1);
      return { ...prev, [selectedDateKey]: daySlots };
    });
  };

  const isSelectedToday = selectedDate 
    ? (selectedDate.getDate() === new Date().getDate() && 
       selectedDate.getMonth() === new Date().getMonth() && 
       selectedDate.getFullYear() === new Date().getFullYear()) 
    : false;
  
  const today = new Date();
  const currentTimeString = `${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`;
  const startOptions = generateTimeOptions(isSelectedToday ? currentTimeString : undefined);

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-300">
      
      {/* Calendar View */}
      <div className="w-full lg:w-[400px] shrink-0">
        <div className="border border-slate-100 rounded-2xl shadow-sm bg-white p-5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-slate-800 text-[17px]">
              {monthNames[month]} {year}
            </h2>
            <div className="flex items-center gap-1">
              <button onClick={prevMonth} className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={nextMonth} className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => (
              <div key={d} className="text-center text-xs font-bold text-slate-400 py-2">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {blanks.map((_, i) => (
              <div key={`blank-${i}`} className="aspect-square" />
            ))}
            {days.map((day) => {
              const selected = isSelected(day);
              const custom = hasHours(day);
              const selectable = isSelectable(day);

              return (
                <button
                  key={day}
                  disabled={!selectable}
                  onClick={() => selectable && setSelectedDate(new Date(year, month, day))}
                  className={`
                    relative aspect-square flex items-center justify-center rounded-xl text-[14px] font-medium transition-all
                    ${!selectable ? 'opacity-40 cursor-not-allowed bg-slate-50' : selected ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'hover:bg-slate-50 text-slate-700'}
                    ${isToday(day) && !selected && selectable ? 'border border-blue-500 text-blue-600 font-bold' : ''}
                  `}
                >
                  {day}
                  {custom && !selected && (
                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-orange-500" />
                  )}
                  {custom && selected && (
                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Side Panel for Selected Date */}
      <div className="flex-1 flex flex-col">
        {selectedDate ? (
          <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 sm:p-8 flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-blue-500" />
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </h3>
              {loadingSlots && <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />}
            </div>
            <p className="text-slate-500 text-sm mb-8">
              Configure your specific unavailability for this date.
            </p>

            <div className="space-y-4">
               {slots.length > 0 ? slots.map((slot, idx) => {
                 const otherSlots = slots.filter((_, i) => i !== idx);

                 // Filter start options: opt.value cannot fall strictly inside any other slot's time range
                 const availableStartOptions = startOptions.filter(opt => {
                   return !otherSlots.some(os => opt.value >= os.start && opt.value < os.end);
                 });

                 // Find the closest upcoming slot start time to restrict end options
                 const subsequentSlots = otherSlots.filter(os => os.start >= slot.start);
                 let maxEndTime = "24:00";
                 if (subsequentSlots.length > 0) {
                   maxEndTime = subsequentSlots.reduce((min, s) => s.start < min ? s.start : min, "24:00");
                 }

                 const baseEndOptions = generateTimeOptions(slot.start);
                 const availableEndOptions = baseEndOptions.filter(opt => opt.value <= maxEndTime);
                 
                 // Fallbacks
                 const validStart = availableStartOptions.find(o => o.value === slot.start) ? slot.start : (availableStartOptions[0]?.value || slot.start);
                 const validEnd = availableEndOptions.find(o => o.value === slot.end) ? slot.end : (availableEndOptions[0]?.value || slot.end);

                 return (
                   <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 flex-1">
                        
                        <div className="relative flex-1 max-w-[160px]">
                          <Select 
                            value={validStart} 
                            onValueChange={(val) => handleUpdateSlot(idx, 'start', val)}
                          >
                            <SelectTrigger className="bg-slate-50 font-semibold shadow-none border-slate-200 h-10">
                              <SelectValue placeholder="Start" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[240px]">
                              {availableStartOptions.length > 0 ? availableStartOptions.map(opt => (
                                <SelectItem key={opt.value} value={opt.value} className="font-medium">
                                  {opt.label}
                                </SelectItem>
                              )) : (
                                <div className="p-3 text-sm text-slate-500 text-center font-medium">No valid times left</div>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <span className="text-slate-400 font-medium px-1">-</span>
                        
                        <div className="relative flex-1 max-w-[160px]">
                          <Select 
                            value={validEnd} 
                            onValueChange={(val) => handleUpdateSlot(idx, 'end', val)}
                          >
                            <SelectTrigger className="bg-slate-50 font-semibold shadow-none border-slate-200 h-10">
                              <SelectValue placeholder="End" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[240px]">
                              {availableEndOptions.map(opt => (
                                <SelectItem key={opt.value} value={opt.value} className="font-medium">
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                      </div>
                      
                      <button 
                        onClick={() => handleRemoveSlot(idx)}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors self-end sm:self-auto shrink-0"
                        title="Remove Time Slot"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                   </div>
                 );
               }) : !loadingSlots && (
                 <div className="text-center py-8 bg-white rounded-xl border border-slate-100 shadow-sm border-dashed">
                   <Clock className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                   <p className="text-slate-600 font-bold text-[15px]">No time slots yet</p>
                   <p className="text-slate-400 text-sm mt-1">You are currently available on this date.</p>
                 </div>
               )}

               <button 
                 onClick={handleAddSlot}
                 className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold text-[15px] hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 mt-2"
               >
                 <Plus className="w-4 h-4" /> {slots.length === 0 ? 'Add Your First Time Slot' : 'Add Another Time Slot'}
               </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-2xl border border-slate-100 flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
            <div className="w-16 h-16 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center mb-4">
              <CalendarIcon className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Select Date</h3>
            <p className="text-slate-500 text-[14px] max-w-sm">
              Select specific dates on the calendar to configure unavailability.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
