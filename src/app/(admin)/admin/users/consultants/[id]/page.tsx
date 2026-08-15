'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { ArrowLeft, User, Mail, Phone, Calendar as CalendarIcon, CheckCircle2, Video, Clock, Star } from 'lucide-react';
import { getImageUrl } from '@/lib/utils';
import { ConsultantStatCard } from '@/components/consultant/Overview/ConsultantStatCard';
import { ConsultantPerformanceChart } from '@/components/admin/users/ConsultantPerformanceChart';

export default function ConsultantPerformancePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;
  
  const [consultant, setConsultant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Stats can be fetched from a specific admin endpoint if available
  // For now, we mock some performance data to showcase the UI
  const [stats, setStats] = useState({
    upcomingConsultations: { value: 12, changePct: 5, direction: 'up' },
    completedConsultations: { value: 145, changePct: 12, direction: 'up' },
    totalSessions: { value: 180, changePct: 8, direction: 'up' },
    cancelledConsultations: { value: 5, changePct: -2, direction: 'down' },
    averageRating: 4.8,
  });

  useEffect(() => {
    const fetchConsultantDetails = async () => {
      if (!id || id === 'undefined') {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // Fetch users and find the one matching the ID
        const response = await api.get('/user', { params: { role: 'CONSULTANT', limit: 100 } });
        const users = response.data?.data?.result || [];
        const found = users.find((u: any) => u._id === id);
        
        if (found) {
          setConsultant(found);
        } else {
          // If not found in the list, attempt direct fetch if backend supports it
          try {
            const directRes = await api.get(`/user/${id}`);
            if (directRes.data?.data) {
              setConsultant(directRes.data.data);
            }
          } catch (e) {
            console.error("User not found directly");
          }
        }
      } catch (err) {
        console.error("Failed to fetch consultant details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultantDetails();
  }, [id]);

  const getTrendValue = (metric: any) => {
    if (!metric) return 0;
    return metric.direction === 'down' ? -Math.abs(metric.changePct) : Math.abs(metric.changePct);
  };

  if (loading) {
    return (
      <div className="w-full min-h-[500px] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!consultant) {
    return (
      <div className="w-full min-h-[500px] flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold text-slate-800">Consultant not found</h2>
        <button 
          onClick={() => router.back()}
          className="text-blue-600 hover:underline flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Users
        </button>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto space-y-6 animate-in fade-in duration-500 pb-10 bg-[#FAFAFA] dark:bg-[#0f172a] min-h-screen transition-colors">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pt-6 px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2 transition-colors">
              Consultant Performance
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors">Viewing detailed metrics for {consultant.name}</p>
          </div>
        </div>
      </header>

      <div className="px-6 lg:px-8 flex flex-col gap-8">
        
        {/* Profile Info Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 flex-shrink-0 border-4 border-blue-50 dark:border-slate-800">
            {consultant.image || consultant.avatar ? (
              <img src={getImageUrl(consultant.image || consultant.avatar)} alt={consultant.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold text-3xl">
                {consultant.name?.charAt(0) || <User className="w-10 h-10" />}
              </div>
            )}
          </div>
          <div className="flex-1 text-center md:text-left space-y-3">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{consultant.name}</h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-medium text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
                <Mail className="w-4 h-4" /> {consultant.email}
              </div>
              {consultant.phone && (
                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
                  <Phone className="w-4 h-4" /> {consultant.phone}
                </div>
              )}
              <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-lg">
                <Star className="w-4 h-4 fill-current" /> {stats.averageRating} Avg Rating
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Active Status
              </div>
            </div>
          </div>
        </div>

        {/* Row 1: Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ConsultantStatCard 
            title="Upcoming Consultations" 
            value={stats.upcomingConsultations.value} 
            trendValue={getTrendValue(stats.upcomingConsultations)} 
            trendText="from last 30 days"
            Icon={CalendarIcon}
            iconBgColor="bg-purple-50 dark:bg-purple-900/30"
            iconColor="text-purple-600 dark:text-purple-400"
          />
          <ConsultantStatCard 
            title="Completed Consultations" 
            value={stats.completedConsultations.value} 
            trendValue={getTrendValue(stats.completedConsultations)} 
            trendText="from last 30 days"
            Icon={CheckCircle2}
            iconBgColor="bg-emerald-50 dark:bg-emerald-900/30"
            iconColor="text-emerald-600 dark:text-emerald-400"
          />
          <ConsultantStatCard 
            title="Total Sessions" 
            value={stats.totalSessions.value} 
            trendValue={getTrendValue(stats.totalSessions)} 
            trendText="from last 30 days"
            Icon={Video}
            iconBgColor="bg-blue-50 dark:bg-blue-900/30"
            iconColor="text-blue-600 dark:text-blue-400"
          />
          <ConsultantStatCard 
            title="Cancelled Consultations" 
            value={stats.cancelledConsultations.value} 
            trendValue={getTrendValue(stats.cancelledConsultations)} 
            trendText="from last 30 days"
            Icon={Clock}
            iconBgColor="bg-orange-50 dark:bg-orange-900/30"
            iconColor="text-orange-600 dark:text-orange-400"
          />
        </div>

        {/* Charts & Reviews Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* Consultation Chart */}
          <div className="w-full">
            <ConsultantPerformanceChart />
          </div>

          {/* Recent Reviews Section */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm h-[400px] flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Recent Reviews</h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-5">
              {[
                { id: 1, name: 'Alice Smith', rating: 5, date: 'Oct 24, 2023', comment: 'Excellent consultation! John was extremely helpful and resolved all my doubts.' },
                { id: 2, name: 'Michael Doe', rating: 4, date: 'Oct 20, 2023', comment: 'Very insightful session. Would recommend to others looking for expert advice.' },
                { id: 3, name: 'Sarah Connor', rating: 5, date: 'Oct 15, 2023', comment: 'The best consultant I have ever worked with. Highly professional.' },
                { id: 4, name: 'David Lee', rating: 5, date: 'Oct 10, 2023', comment: 'Great communication and deep knowledge of the subject matter.' }
              ].map((review) => (
                <div key={review.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 pb-5 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs shrink-0">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-800 dark:text-slate-200">{review.name}</div>
                        <div className="text-xs text-slate-500">{review.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
