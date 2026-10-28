"use client";

import React, { useState, useEffect } from "react";
import { Bell, X, AlertTriangle } from "lucide-react";
import { requestDesktopNotificationPermission, showDesktopNotification } from "@/lib/notifications";
import { audioManager } from "@/lib/audioManager";
import { initWebPush } from "@/lib/firebase";
import { toast } from "sonner";

export default function NotificationPermissionBanner() {
  const [mounted, setMounted] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("granted");
  const [dismissed, setDismissed] = useState(false);

  const checkPermission = () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPermission("unsupported");
      return;
    }
    setPermission(Notification.permission);
  };

  useEffect(() => {
    setMounted(true);
    checkPermission();

    window.addEventListener("focus", checkPermission);
    return () => window.removeEventListener("focus", checkPermission);
  }, []);

  if (!mounted || permission === "granted" || permission === "unsupported" || dismissed) {
    return null;
  }

  const handleEnable = async () => {
    try {
      audioManager.unlockAudio();
      const status = await requestDesktopNotificationPermission();
      setPermission(status);

      if (status === "granted") {
        toast.success("Desktop notifications enabled!");
        initWebPush().catch(() => {});
        audioManager.playNotificationChime();
        showDesktopNotification("🔔 Notifications Enabled!", {
          body: "Fixpair will now notify you on the corner of your screen for calls and requests.",
          icon: "/favicon.png",
          requireInteraction: false,
        });
      } else if (status === "denied") {
        toast.error("Notifications are blocked in your browser settings", {
          description: "Click the 🔒 icon in your browser URL bar to change Notifications to 'Allow'.",
          duration: 8000,
        });
      }
    } catch (e: any) {
      console.error(e);
      toast.error("Failed to request permission: " + (e?.message || e));
    }
  };

  return (
    <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white px-6 py-3 shadow-md flex flex-wrap items-center justify-between gap-3 text-sm sticky top-0 z-50 animate-in slide-in-from-top duration-300">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          {permission === "denied" ? (
            <AlertTriangle className="w-4 h-4 text-amber-200" />
          ) : (
            <Bell className="w-4 h-4 text-white animate-bounce" />
          )}
        </div>
        <div className="text-xs sm:text-sm">
          {permission === "denied" ? (
            <span>
              <strong className="text-amber-200">Notifications are blocked: </strong>
              Please click the <strong>🔒 lock / tune icon</strong> in your browser URL bar, set <strong>Notifications</strong> to <strong>Allow</strong>, and refresh the page.
            </span>
          ) : (
            <span>
              <strong className="font-bold">Desktop Notifications are off: </strong>
              Enable notifications to get incoming call popups on your screen corner even when working on other tabs or apps.
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-auto">
        {permission === "denied" ? (
          <button
            onClick={checkPermission}
            className="bg-white text-emerald-800 hover:bg-emerald-50 px-3 py-1.5 rounded-xl font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            Check Again
          </button>
        ) : (
          <button
            onClick={handleEnable}
            className="bg-white text-emerald-800 hover:bg-emerald-50 px-4 py-1.5 rounded-xl font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <Bell className="w-3.5 h-3.5" />
            Enable Notifications
          </button>
        )}

        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss banner"
          className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
