"use client";

import React, { useState, useEffect } from "react";
import { Bell, Search, Loader2, Check, CheckCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import api from "@/lib/axios";
import { toast } from "sonner";

interface NotificationItem {
  _id: string;
  user?: string;
  title: string;
  message: string;
  type?: string;
  relatedBooking?: string;
  read: boolean;
  metadata?: {
    userName?: string;
    bookingType?: string;
  };
  createdAt: string;
}

interface NotificationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRead, setFilterRead] = useState<string>("all"); // "all", "unread", "read"
  const [pagination, setPagination] = useState<NotificationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: 10,
        sort: "-createdAt"
      };

      if (searchQuery.trim()) {
        params.searchTerm = searchQuery.trim();
      }

      if (filterRead === "unread") {
        params.read = false;
      } else if (filterRead === "read") {
        params.read = true;
      }

      const response = await api.get("/notification", { params });

      if (response.data?.success || response.data?.data) {
        const rawData = response.data.data || response.data;
        const results: NotificationItem[] = Array.isArray(rawData.result)
          ? rawData.result
          : Array.isArray(rawData) ? rawData : [];
        const meta: NotificationMeta = rawData.meta || { page: 1, limit: 10, total: results.length, totalPage: 1 };

        setNotifications(results);
        setPagination(meta);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [currentPage, filterRead, searchQuery]);

  const markAsRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    try {
      await api.patch(`/notification/${id}`, { read: true });
    } catch (e) {
      // Ignore API failure fallback
    }
  };

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await api.patch("/notification/read-all", { read: true });
      toast.success("All notifications marked as read");
    } catch (e) {
      try {
        await api.patch("/notification", { read: true });
        toast.success("All notifications marked as read");
      } catch (err) {
        // Fallback
      }
    }
  };

  return (
    <div className="w-full space-y-8 pb-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-slate-900 dark:text-white tracking-tight">Notifications</h1>
          <p className="text-[15px] text-slate-500 font-medium mt-1">
            Manage and view all your system and activity notifications
          </p>
        </div>
        <button
          onClick={markAllAsRead}
          className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-2.5 rounded-xl text-sm font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all shadow-sm cursor-pointer"
        >
          <CheckCheck className="w-4 h-4" />
          Mark all as read
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white dark:bg-[#1e293b] rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => { setFilterRead("all"); setCurrentPage(1); }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                filterRead === "all"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              All Notifications
            </button>
            <button
              onClick={() => { setFilterRead("unread"); setCurrentPage(1); }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                filterRead === "unread"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Unread Only
            </button>
            <button
              onClick={() => { setFilterRead("read"); setCurrentPage(1); }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                filterRead === "read"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Read Only
            </button>
          </div>

          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by title or message..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-10 h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl text-sm"
            />
          </div>
        </div>

        {/* Notification List */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm font-medium text-slate-500">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-2">
              <Bell className="w-10 h-10 text-slate-300 dark:text-slate-600" />
              <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">No notifications found</h4>
              <p className="text-sm text-slate-400 max-w-sm">You're all caught up! There are no notifications matching your current filters.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif._id}
                onClick={() => markAsRead(notif._id)}
                className={`p-6 flex items-start justify-between gap-4 transition-colors cursor-pointer ${
                  !notif.read
                    ? "bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50/70 dark:hover:bg-blue-900/30"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    !notif.read ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400" : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                  }`}>
                    <Bell className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {notif.title}
                      </h3>
                      {!notif.read && (
                        <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
                      {notif.message}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium pt-1">
                      {new Date(notif.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {!notif.read && (
                  <button
                    onClick={(e) => { e.stopPropagation(); markAsRead(notif._id); }}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 shrink-0 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" /> Mark as read
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPage > 1 && (
          <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <p className="text-xs text-slate-500 font-medium">
              Page <strong className="text-slate-900 dark:text-white">{pagination.page}</strong> of <strong className="text-slate-900 dark:text-white">{pagination.totalPage}</strong> (Total {pagination.total})
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, pagination.totalPage))}
                disabled={currentPage === pagination.totalPage}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
