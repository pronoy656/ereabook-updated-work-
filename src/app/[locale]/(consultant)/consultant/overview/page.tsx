'use client';
import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { ConsultantStatCard } from '@/components/consultant/Overview/ConsultantStatCard';
import { ConsultationOverviewChart } from '@/components/consultant/Overview/ConsultationOverviewChart';
import { MyRatingCard } from '@/components/consultant/Overview/MyRatingCard';
import { RecentBookings } from '@/components/consultant/Overview/RecentBookings';
import RecentFeedback from '@/components/consultant/Overview/RecentFeedback';
import { UpcomingScheduledBookings } from '@/components/consultant/Overview/UpcomingScheduledBookings';
import { Calendar as CalendarIcon, CheckCircle2, Video, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/AuthContext';

export default function ConsultantOverviewPage() {
  const t = useTranslations('consultant_overview');
  const { user } = useAuth();
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await api.get('/consultant/dashboard-summary');
        setSummary(response.data?.data || null);
      } catch (err) {
        console.error("Failed to fetch dashboard summary:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const getTrendValue = (metric: any) => {
    if (!metric) return 0;
    return metric.direction === 'down' ? -Math.abs(metric.changePct) : Math.abs(metric.changePct);
  };

  const userName = user?.name?.split(' ')[0] || user?.fullName?.split(' ')[0] || 'John';

  return (
    <div className="w-full mx-auto space-y-6 animate-in fade-in duration-500 pb-10 bg-[#FAFAFA] dark:bg-[#0f172a] min-h-screen transition-colors">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pt-6 px-6 lg:px-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2 transition-colors">
            {t('welcome_back', { name: userName })} <span className="text-2xl">👋</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors">{t('subtitle')}</p>
        </div>
      </header>

      <div className="px-6 lg:px-8 flex flex-col gap-6">
        {/* Row 1: Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ConsultantStatCard 
            title={t('upcoming_consultations')} 
            value={loading ? "..." : (summary?.upcomingConsultations?.value || 0)} 
            trendValue={getTrendValue(summary?.upcomingConsultations)} 
            trendText={t('from_last_30_days')}
            Icon={CalendarIcon}
            iconBgColor="bg-purple-50 dark:bg-purple-900/30"
            iconColor="text-purple-600 dark:text-purple-400"
          />
          <ConsultantStatCard 
            title={t('completed_consultations')} 
            value={loading ? "..." : (summary?.completedConsultations?.value || 0)} 
            trendValue={getTrendValue(summary?.completedConsultations)} 
            trendText={t('from_last_30_days')}
            Icon={CheckCircle2}
            iconBgColor="bg-emerald-50 dark:bg-emerald-900/30"
            iconColor="text-emerald-600 dark:text-emerald-400"
          />
          <ConsultantStatCard 
            title={t('total_sessions')} 
            value={loading ? "..." : (summary?.totalSessions?.value || 0)} 
            trendValue={getTrendValue(summary?.totalSessions)} 
            trendText={t('from_last_30_days')}
            Icon={Video}
            iconBgColor="bg-blue-50 dark:bg-blue-900/30"
            iconColor="text-blue-600 dark:text-blue-400"
          />
          <ConsultantStatCard 
            title={t('cancelled_consultations')} 
            value={loading ? "..." : (summary?.cancelledConsultations?.value || 0)} 
            trendValue={getTrendValue(summary?.cancelledConsultations)} 
            trendText={t('from_last_30_days')}
            Icon={Clock}
            iconBgColor="bg-orange-50 dark:bg-orange-900/30"
            iconColor="text-orange-600 dark:text-orange-400"
          />
        </div>

        {/* Row 2: Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <ConsultationOverviewChart />
          </div>
          <div className="lg:col-span-4">
            <MyRatingCard />
          </div>
        </div>

        {/* Row 3: Upcoming Scheduled Bookings */}
        <div className="grid grid-cols-1 gap-6 w-full items-stretch">
          <UpcomingScheduledBookings />
        </div>

        {/* Row 4: Recent Bookings and Feedback */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full items-stretch">
          <RecentBookings />
          <RecentFeedback />
        </div>
      </div>

    </div>
  );
}
