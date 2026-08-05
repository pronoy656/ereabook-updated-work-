import React, { useState, useEffect } from "react";
import { Users, Euro, Activity, CreditCard, UserCheck, Monitor, Clock, CheckCircle2, XCircle, Star } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { AdminHeader } from "./AdminHeader";
import { PrimaryStatCard } from "./PrimaryStatCard";
import { ConsultationTrendChart } from "./charts/ConsultationTrendChart";
import { UserGrowthChart } from "./charts/UserGrowthChart";
import { ConsultationStatusChart } from "./charts/ConsultationStatusChart";
import { TopConsultantsTable } from "./TopConsultantsTable";
import { RecentActivityList } from "./RecentActivityList";
import { RecentConsultationsTable } from "./RecentConsultationsTable";

interface Metric {
  value: number;
  changePct: number;
  direction: 'up' | 'down' | 'neutral';
}

interface SummaryData {
  totalUsers: Metric;
  totalConsultants: Metric;
  totalConsultations: Metric;
  totalRevenue: Metric;
  completedConsultations: Metric;
  cancelledConsultations: Metric;
  averageRating: Metric;
}

export default function Overview() {
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/dashboard-summary");
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch dashboard summary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  // Use API data directly
  return (
    <div className="w-full mx-auto pb-10 bg-[#FAFAFA] dark:bg-[#0f172a] min-h-screen transition-colors">
      <AdminHeader />

      <div className="flex flex-col xl:flex-row gap-6 w-full items-start">
        {/* Main Left Content */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          
          {/* Row 1: Primary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <PrimaryStatCard
              label="Total Users"
              value={loading || !data ? "..." : (data?.totalUsers?.value || 0).toLocaleString()}
              trend={loading || !data ? "..." : `${data?.totalUsers?.changePct || 0}%`}
              trendDirection={data?.totalUsers?.direction === 'down' ? 'down' : 'up'}
              trendText="from last 30 days"
              Icon={Users}
              iconBgColor="bg-purple-600"
              iconColor="text-white"
              loading={loading}
            />
            <PrimaryStatCard
              label="Total Consultants"
              value={loading || !data ? "..." : (data?.totalConsultants?.value || 0).toLocaleString()}
              trend={loading || !data ? "..." : `${data?.totalConsultants?.changePct || 0}%`}
              trendDirection={data?.totalConsultants?.direction === 'down' ? 'down' : 'up'}
              trendText="from last 30 days"
              Icon={UserCheck}
              iconBgColor="bg-emerald-500"
              iconColor="text-white"
              loading={loading}
            />
            <PrimaryStatCard
              label="Total Consultations"
              value={loading || !data ? "..." : (data?.totalConsultations?.value || 0).toLocaleString()}
              trend={loading || !data ? "..." : `${data?.totalConsultations?.changePct || 0}%`}
              trendDirection={data?.totalConsultations?.direction === 'down' ? 'down' : 'up'}
              trendText="from last 30 days"
              Icon={Activity}
              iconBgColor="bg-blue-500"
              iconColor="text-white"
              loading={loading}
            />
            <PrimaryStatCard
              label="Total Revenue"
              value={loading || !data ? "..." : `$${(data?.totalRevenue?.value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              trend={loading || !data ? "..." : `${data?.totalRevenue?.changePct || 0}%`}
              trendDirection={data?.totalRevenue?.direction === 'down' ? 'down' : 'up'}
              trendText="from last 30 days"
              Icon={Euro}
              iconBgColor="bg-amber-500"
              iconColor="text-white"
              loading={loading}
            />
          </div>

          {/* Row 2: Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PrimaryStatCard 
              label="Completed Consultations" 
              value={loading || !data ? "..." : (data?.completedConsultations?.value || 0).toLocaleString()} 
              trend={loading || !data ? "..." : `${data?.completedConsultations?.changePct || 0}%`} 
              trendDirection={data?.completedConsultations?.direction === 'down' ? 'down' : 'up'} 
              trendText="from last 30 days" 
              Icon={CheckCircle2} 
              iconBgColor="bg-emerald-500" 
              iconColor="text-white" 
              loading={loading}
            />
            <PrimaryStatCard 
              label="Cancelled Consultations" 
              value={loading || !data ? "..." : (data?.cancelledConsultations?.value || 0).toLocaleString()} 
              trend={loading || !data ? "..." : `${data?.cancelledConsultations?.changePct || 0}%`} 
              trendDirection={data?.cancelledConsultations?.direction === 'down' ? 'down' : 'up'} 
              trendText="from last 30 days" 
              Icon={XCircle} 
              iconBgColor="bg-rose-500" 
              iconColor="text-white" 
              loading={loading}
            />
            <PrimaryStatCard 
              label="Average Rating" 
              value={loading || !data ? "..." : (data?.averageRating?.value || 0).toFixed(1)} 
              trend={loading || !data ? "..." : `${data?.averageRating?.changePct || 0}%`} 
              trendDirection={data?.averageRating?.direction === 'down' ? 'down' : 'up'} 
              trendText="from last 30 days" 
              Icon={Star} 
              iconBgColor="bg-amber-500" 
              iconColor="text-white" 
              loading={loading}
            />
          </div>

          {/* Row 3: Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[320px]">
            <ConsultationTrendChart />
            <UserGrowthChart />
            <ConsultationStatusChart />
          </div>

          {/* Row 4: Complex Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[380px]">
            <TopConsultantsTable />
            <RecentActivityList />
          </div>

          {/* Row 5: Recent Consultations */}
          <div className="w-full">
            <RecentConsultationsTable />
          </div>

        </div>



      </div>
    </div>
  );
}
