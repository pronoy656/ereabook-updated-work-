"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { toast } from "sonner";

export interface IncomingCallPayload {
  sessionId: string;
  channelName: string;
  token: string;
  uid: number;
  callerName?: string;
  consultationId?: string;
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
    const token = Cookies.get("accessToken");
    if (!token) {
      console.warn("🔌 No auth token – skipping incoming call socket connection");
      return;
    }

    const socketUrl = getSocketUrl();
    const socket: Socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      auth: { token },
      // Optional: add path if backend uses specific socket path
    });

    socket.on("connect", () => {
      console.log("🔌 Consultant Socket connected for incoming calls");
    });

    socket.on("incoming-call", (payload: IncomingCallPayload) => {
      console.log("📞 Incoming call received!", payload);
      setIncomingCall(payload);
    });

    const handleCallCancelled = (data: any) => {
      console.log("🚫 Call cancelled or ended event received:", data);
      toast.info("Call was cancelled by the caller");
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

    socket.on("ai-summary-ready", (data: any) => {
      console.log("✨ AI Summary Ready event received:", data);
      toast.success("✨ Gemini AI Consultation Summary is ready!", {
        description: "AI action items and consultation breakdown have been generated.",
        action: data?.consultationId ? {
          label: "View Report",
          onClick: () => router.push(`/consultant/reports`),
        } : undefined,
        duration: 8000,
      });
    });

    socket.on("disconnect", (reason) => {
      console.log("🔌 Consultant Socket disconnected:", reason);
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, []);

  const acceptCall = async () => {
    if (incomingCall) {
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
            const joinResponse = await api.post("/video-session/join", { sessionId: incomingCall.sessionId });
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

        const sessId = joinData?.sessionId || joinData?.id || joinData?._id || incomingCall.sessionId;
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
  };

  const declineCall = async () => {
    if (incomingCall) {
      try {
        const consId = incomingCall.consultationId || incomingCall.sessionId;
        if (consId) {
          await api.patch(`/consultation/status/${consId}`, { status: "rejected" }).catch(() => null);
        }
        if (incomingCall.sessionId) {
          await api.post("/video-session/action", { sessionId: incomingCall.sessionId, action: "REJECT" }).catch(() => null);
        }
        toast.info("Call declined");
      } catch (error) {
        console.error("Error on decline API:", error);
      }
      
      setIncomingCall(null);
    }
  };

  return { incomingCall, acceptCall, declineCall };
}
