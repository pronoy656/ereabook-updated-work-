"use client";

import React, { useState, useEffect } from "react";
import { Bell, Check, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";

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

function formatNotificationTime(dateString: string) {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  } catch (e) {
    return dateString;
  }
}

export default function NotificationDropdown({ iconColorClass = "text-slate-500 hover:text-blue-600" }: { iconColorClass?: string }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<NotificationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchNotifications = async (pageNum = 1, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const response = await api.get("/notification", {
        params: {
          page: pageNum,
          limit: 10,
          sort: "-createdAt"
        }
      });

      if (response.data?.success || response.data?.data) {
        const rawData = response.data.data || response.data;
        const results: NotificationItem[] = Array.isArray(rawData.result) 
          ? rawData.result 
          : Array.isArray(rawData) ? rawData : [];
        const metadata: NotificationMeta = rawData.meta || { page: 1, limit: 10, total: results.length, totalPage: 1 };

        if (append) {
          setNotifications(prev => [...prev, ...results]);
        } else {
          setNotifications(results);
        }
        setMeta(metadata);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchNotifications(1, false);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    try {
      await api.patch(`/notification/${id}`, { read: true });
    } catch (e) {
      // Ignore API errors if specific item endpoint differs
    }
  };

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await api.patch("/notification/read-all", { read: true });
    } catch (e) {
      try {
        await api.patch("/notification", { read: true });
      } catch (err) {
        // Fallback
      }
    }
  };

  const handleLoadMore = () => {
    if (meta && page < meta.totalPage) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNotifications(nextPage, true);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer outline-none group">
          <Bell className={`w-5 h-5 transition-colors ${iconColorClass}`} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
          )}
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80 sm:w-96 p-2 mt-2 rounded-[20px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border-slate-100 dark:border-slate-800 dark:bg-[#1e293b]">
        <div className="flex items-center justify-between px-3 py-2">
          <h3 className="font-bold text-slate-800 dark:text-slate-200">Notifications</h3>
          {unreadCount > 0 ? (
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
              {unreadCount} New
            </span>
          ) : (
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
              All read
            </span>
          )}
        </div>
        
        <DropdownMenuSeparator className="bg-slate-50 dark:bg-slate-800 mx-2" />
        
        <div className="max-h-[360px] overflow-y-auto p-1 flex flex-col gap-1">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-slate-400">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              <span className="text-xs font-medium">Loading notifications...</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs font-medium">
              No notifications found
            </div>
          ) : (
            notifications.map(notif => (
              <DropdownMenuItem 
                key={notif._id} 
                onClick={() => markAsRead(notif._id)}
                className={`flex flex-col items-start gap-1.5 p-3 rounded-xl cursor-pointer transition-all outline-none ${
                  !notif.read 
                    ? 'bg-blue-50/60 dark:bg-blue-950/40 hover:bg-blue-50 dark:hover:bg-blue-900/40' 
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between w-full gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {notif.title}
                    </span>
                    {!notif.read && (
                      <span className="text-[9px] font-bold text-white bg-blue-500 px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">
                        New
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium shrink-0">
                    {formatNotificationTime(notif.createdAt)}
                  </span>
                </div>
                <p className={`text-xs line-clamp-2 ${!notif.read ? 'text-slate-700 dark:text-slate-300 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                  {notif.message}
                </p>
              </DropdownMenuItem>
            ))
          )}

          {meta && page < meta.totalPage && (
            <button 
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="w-full py-2 text-center text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50 mt-1"
            >
              {loadingMore ? "Loading..." : "Load more notifications"}
            </button>
          )}
        </div>

        {notifications.length > 0 && unreadCount > 0 && (
          <>
            <DropdownMenuSeparator className="bg-slate-50 dark:bg-slate-800 mx-2" />
            <div className="p-1">
              <Button 
                variant="ghost" 
                onClick={markAllAsRead}
                className="w-full text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl py-2 h-auto flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                Mark all as read
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
