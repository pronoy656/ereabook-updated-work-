'use client';
import React, { useState, useEffect } from 'react';
import { UserPlus, Calendar, CreditCard, UserCheck, XCircle, CheckCircle, MessageSquare, Activity, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  timestamp: string;
}

const getActivityConfig = (type: string) => {
  switch (type) {
    case 'USER_REGISTERED': return { icon: UserPlus, color: 'text-emerald-500' };
    case 'CONSULTANT_JOINED': return { icon: UserCheck, color: 'text-blue-600' };
    case 'CONSULTATION_CANCELLED': return { icon: XCircle, color: 'text-rose-500' };
    case 'CONSULTATION_COMPLETED': return { icon: CheckCircle, color: 'text-emerald-500' };
    case 'REVIEW_SUBMITTED': return { icon: MessageSquare, color: 'text-amber-500' };
    case 'PAYMENT_RECEIVED': return { icon: CreditCard, color: 'text-emerald-600' };
    case 'CONSULTATION_BOOKED': return { icon: Calendar, color: 'text-blue-500' };
    default: return { icon: Activity, color: 'text-slate-500' };
  }
};

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hr ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} days ago`;
}

export function RecentActivityList() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/recent-activities?limit=5');
        if (response.data?.success) {
          setActivities(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch recent activities', error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex flex-col h-full transition-colors relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-800 dark:text-white">Recent Activity</h3>
      </div>

      <div className="flex flex-col gap-5 mt-2 relative min-h-[200px] flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-[#1e293b]/50 z-10 backdrop-blur-[1px] rounded-xl">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        )}
        {!loading && activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 h-full min-h-[150px] gap-2">
             <Activity className="w-8 h-8 opacity-50" />
             <span className="text-sm font-medium">No recent activities</span>
          </div>
        ) : activities.map((activity) => {
          const config = getActivityConfig(activity.type);
          const Icon = config.icon;
          return (
            <div key={activity.id} className="flex items-start gap-4">
              <Icon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", config.color)} />
              <div className="flex flex-col gap-0.5 w-full">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-tight">
                  {activity.title}
                </span>
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                  {timeAgo(activity.timestamp)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
