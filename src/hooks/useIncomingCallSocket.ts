"use client";

import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { toast } from "sonner";
import { audioManager } from "@/lib/audioManager";
import {
  requestDesktopNotificationPermission,
  showDesktopNotification,
} from "@/lib/notifications";
import { initWebPush } from "@/lib/firebase";

export interface IncomingCallPayload {
  sessionId: string;
  channelName: string;
  token: string;
  uid: number;
  callerName?: string;
  callerImage?: string;
  callerAvatar?: string;
  consultationId?: string;
  bookingType?: string;
  type?: string;
}

function getSocketUrl(): string {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://10.10.7.106:5000/api/v1";
  try {
    const url = new URL(apiUrl);
    return url.origin;
  } catch {
    return "http://10.10.7.106:5000";
  }
}

export function useIncomingCallSocket() {
  const [incomingCall, setIncomingCall] = useState<IncomingCallPayload | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    // Request notification permission and init Web Push FCM once mounted
    requestDesktopNotificationPermission()
      .then((granted) => {
        if (granted) {
          initWebPush().catch(() => {});
        }
      })
      .catch(() => {});

    const token = Cookies.get("accessToken");
    if (!token) {
      console.warn("🔌 No auth token – skipping incoming call socket connection");
      return;
    }

    const socketUrl = getSocketUrl();
    const socket: Socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      auth: { token: `Bearer ${token}` },
    });

    socket.on("connect", () => {
      console.log("🔌 Consultant Socket connected for incoming calls & notifications");
    });

    // 1. Incoming Call Event
    socket.on("incoming-call", (payload: IncomingCallPayload) => {
      console.log("📞 Incoming call received!", payload);
      setIncomingCall(payload);

      // Play looping ringtone
      audioManager.playRingtone();

      // Show OS Desktop Notification banner on screen corner
      const caller = payload.callerName || "A client";
      showDesktopNotification(`📞 Incoming Call: ${caller}`, {
        body: "Click to answer the consultation call",
        icon: payload.callerAvatar || payload.callerImage || "/favicon.png",
        requireInteraction: true,
        tag: payload.sessionId || "incoming-call",
        url: `/consultant/overview`,
      }).catch(console.error);
    });

    // 2. Call Cancelled / Ended / Rejected Handlers
    const handleCallCancelled = (data: any) => {
      console.log("🚫 Call cancelled or ended event received:", data);
      audioManager.stopRingtone();
      toast.info("Call was cancelled or ended by the caller");
      setIncomingCall(null);
    };

    socket.on("call-cancelled", handleCallCancelled);
    socket.on("call_cancelled", handleCallCancelled);
    socket.on("call-rejected", handleCallCancelled);
    socket.on("call_rejected", handleCallCancelled);
    socket.on("call-ended", handleCallCancelled);
    socket.on("call_ended", handleCallCancelled);
    socket.on("session-ended", handleCallCancelled);
    socket.on("session_ended", handleCallCancelled);
    socket.on("consultation-cancelled", handleCallCancelled);

    // 3. General In-App Notifications (Callbacks, Scheduled Bookings, System updates)
    socket.on("notification", (data: any) => {
      console.log("🔔 Real-time notification received:", data);

      // Play pleasant notification chime
      audioManager.playNotificationChime();

      const notifTitle = data?.title || "New Notification";
      const notifMsg = data?.message || "You have a new update";

      // Show OS Desktop Notification banner on screen corner
      showDesktopNotification(notifTitle, {
        body: notifMsg,
        icon: "/favicon.png",
        tag: data?._id || data?.relatedBooking || `notif-${Date.now()}`,
        url: "/consultant/requests",
        requireInteraction: false,
      }).catch(console.error);

      // Show in-app toast
      toast.info(notifTitle, {
        description: notifMsg,
        duration: 6000,
        action: data?.relatedBooking
          ? {
              label: "View Request",
              onClick: () => router.push("/consultant/requests"),
            }
          : undefined,
      });

      // Dispatch event for UI (e.g., NotificationDropdown) to update unread badge in real time
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("fixpair:new-notification", { detail: data })
        );
      }
    });

    // 4. AI Summary Ready Event
    socket.on("ai-summary-ready", (data: any) => {
      console.log("✨ AI Summary Ready event received:", data);
      audioManager.playNotificationChime();
      toast.success("✨ Gemini AI Consultation Summary is ready!", {
        description: "AI action items and consultation breakdown have been generated.",
        action: data?.consultationId
          ? {
              label: "View Report",
              onClick: () => router.push(`/consultant/reports`),
            }
          : undefined,
        duration: 8000,
      });
    });

    socket.on("disconnect", (reason) => {
      console.log("🔌 Consultant Socket disconnected:", reason);
    });

    return () => {
      audioManager.stopRingtone();
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [router]);

  const acceptCall = useCallback(async () => {
    if (incomingCall) {
      audioManager.stopRingtone();
      const toastId = toast.loading("Joining call...");
      try {
        const consId = incomingCall.consultationId || incomingCall.sessionId;
        if (consId) {
          try {
            await api.patch(`/consultation/status/${consId}`, { status: "accepted" });
          } catch (statusErr) {
            console.warn("Notice: Status update warning (non-fatal):", statusErr);
          }
        }

        let joinData: any = null;
        if (incomingCall.sessionId) {
          try {
            const joinResponse = await api.post("/video-session/join", {
              sessionId: incomingCall.sessionId,
            });
            joinData = joinResponse.data?.data;
          } catch (joinErr) {
            console.warn("Notice: video-session/join warning, page will attempt fallback session check:", joinErr);
          }
        }

        toast.success("Joining call...", { id: toastId });

        const queryParams = new URLSearchParams();
        const finalConsId = joinData?.consultation || consId;
        if (finalConsId) {
          queryParams.append("consultationId", finalConsId);
        }

        const channelName = joinData?.channelName || incomingCall.channelName;
        if (channelName) {
          queryParams.append("channelName", channelName);
        }

        const token = joinData?.token || incomingCall.token;
        if (token) {
          queryParams.append("token", token);
        }

        const uid = joinData?.uid || incomingCall.uid;
        if (uid !== undefined && uid !== null) {
          queryParams.append("uid", uid.toString());
        }

        const sessId =
          joinData?.sessionId || joinData?.id || joinData?._id || incomingCall.sessionId;
        if (sessId) {
          queryParams.append("sessionId", sessId);
        }

        router.push(`/call?${queryParams.toString()}`);
        setIncomingCall(null);
      } catch (error: any) {
        console.error("Error on acceptCall:", error);
        const fallbackId = incomingCall.consultationId || incomingCall.sessionId;
        if (fallbackId) {
          router.push(`/call?consultationId=${fallbackId}`);
        }
        setIncomingCall(null);
      }
    }
  }, [incomingCall, router]);

  const declineCall = useCallback(async () => {
    if (incomingCall) {
      audioManager.stopRingtone();
      try {
        const consId = incomingCall.consultationId || incomingCall.sessionId;
        if (consId) {
          await api
            .patch(`/consultation/status/${consId}`, { status: "rejected" })
            .catch(() => null);
        }
        if (incomingCall.sessionId) {
          await api
            .post("/video-session/action", {
              sessionId: incomingCall.sessionId,
              action: "REJECT",
            })
            .catch(() => null);
        }
        toast.info("Call declined");
      } catch (error) {
        console.error("Error on decline API:", error);
      }

      setIncomingCall(null);
    }
  }, [incomingCall]);

  return { incomingCall, acceptCall, declineCall };
}
