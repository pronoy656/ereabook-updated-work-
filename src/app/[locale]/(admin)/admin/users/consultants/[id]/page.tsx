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
  const [stats, setStats] = useState<any>({
    upcomingConsultations: { value: 0, changePct: 0, direction: 'neutral' },
    completedConsultations: { value: 0, changePct: 0, direction: 'neutral' },
    totalSessions: { value: 0, changePct: 0, direction: 'neutral' },
    cancelledConsultations: { value: 0, changePct: 0, direction: 'neutral' },
    totalEarnings: { value: 0, changePct: 0, direction: 'neutral' },
    averageRating: 0,
  });

  useEffect(() => {
    const fetchConsultantDetails = async () => {
      if (!id || id === 'undefined') {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await api.get(`/user/${id}`);
        if (response.data?.success || response.data?.data) {
          const data = response.data.data || response.data;
          setConsultant(data);
          
          if (data.stats) {
            setStats((prev: any) => ({
              ...prev,
              upcomingConsultations: data.stats.upcomingConsultations || prev.upcomingConsultations,
              completedConsultations: data.stats.completedConsultations || prev.completedConsultations,
              totalSessions: data.stats.totalSessions || prev.totalSessions,
              cancelledConsultations: data.stats.cancelledConsultations || prev.cancelledConsultations,
              totalEarnings: data.stats.totalEarnings || prev.totalEarnings,
              averageRating: data.averageRating || data.stats.averageRating || 0,
            }));
          } else if (data.averageRating !== undefined) {
             setStats((prev: any) => ({ ...prev, averageRating: data.averageRating }));
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
              
              {consultant.perMinuteRate && (
                <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1.5 rounded-lg font-bold">
                  ${consultant.perMinuteRate}/min
                </div>
              )}
              
              {consultant.consultancyType?.name && (
                <div className="flex items-center gap-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-3 py-1.5 rounded-lg capitalize">
                  {consultant.consultancyType.name}
                </div>
              )}
              
              {consultant.experience && (
                <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg">
                  {consultant.experience} Exp
                </div>
              )}

              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${consultant.activeStatus || consultant.status === 'active' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                <span className={`w-2 h-2 rounded-full ${consultant.activeStatus || consultant.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                {consultant.activeStatus || consultant.status === 'active' ? 'Active' : 'Inactive'}
              </div>

              {consultant.verified && (
                <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg">
                  <CheckCircle2 className="w-4 h-4" /> Verified
                </div>
              )}
            </div>
            
            {/* Bio & Details */}
            {consultant.bio && (
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed mt-4">
                {consultant.bio}
              </p>
            )}
            
            {(consultant.expertise?.length > 0 || consultant.languages?.length > 0) && (
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm">
                {consultant.expertise?.length > 0 && (
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Expertise:</span>
                    <span className="text-slate-600 dark:text-slate-400">{consultant.expertise.join(', ')}</span>
                  </div>
                )}
                {consultant.languages?.length > 0 && (
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Languages:</span>
                    <span className="text-slate-600 dark:text-slate-400">{consultant.languages.join(', ')}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Row 1: Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <ConsultantStatCard 
            title="Total Earnings" 
            value={`$${stats.totalEarnings?.value || 0}`} 
            trendValue={getTrendValue(stats.totalEarnings)} 
            trendText="from last 30 days"
            Icon={Star}
            iconBgColor="bg-yellow-50 dark:bg-yellow-900/30"
            iconColor="text-yellow-600 dark:text-yellow-400"
          />
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
            <ConsultantPerformanceChart data={consultant.chartData} />
          </div>

          {/* Recent Reviews Section */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm h-[400px] flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Recent Reviews</h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-5">
              {(!consultant.reviews || consultant.reviews.length === 0) ? (
                <div className="flex items-center justify-center h-full text-slate-500 text-sm">
                  No reviews available yet.
                </div>
              ) : (
                consultant.reviews.map((review: any) => (
                  <div key={review._id || review.id || Math.random()} className="border-b border-slate-100 dark:border-slate-800 last:border-0 pb-5 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs shrink-0">
                          {(review.name || review.reviewerName || "U").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-800 dark:text-slate-200">{review.name || review.reviewerName || "Anonymous"}</div>
                          <div className="text-xs text-slate-500">{review.date || (review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recent')}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < (review.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                      {review.comment || review.content || review.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
