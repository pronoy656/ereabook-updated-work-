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
        // 1. Hit the API to join the video session and get actual Agora credentials
        const joinResponse = await api.post("/video-session/join", { sessionId: incomingCall.sessionId });
        const data = joinResponse.data?.data;
        
        // 2. Also update the consultation status if consultationId is available
        const consId = data?.consultation || incomingCall.consultationId;
        if (consId) {
          // Fire and forget status updates
          api.patch(`/consultation/status/${consId}`, { status: "accepted" }).catch(console.error);
          api.patch(`/consultation/status/${consId}`, { status: "confirmed" }).catch(console.error);
        }

        toast.success("Joined video session successfully!", { id: toastId });

        // 3. Navigate to call screen with exact params from the join API
        const queryParams = new URLSearchParams({
          channelName: data?.channelName || incomingCall.channelName,
          token: data?.token || incomingCall.token,
          uid: (data?.uid || incomingCall.uid).toString(),
        });
        
        if (consId) {
          queryParams.append("consultationId", consId);
        }
        
        router.push(`/call?${queryParams.toString()}`);
        setIncomingCall(null);
      } catch (error: any) {
        console.error("Error on accept API:", error);
        toast.error(error?.response?.data?.message || "Failed to join the call.", { id: toastId });
      }
    }
  };

  const declineCall = async () => {
    if (incomingCall) {
      try {
        if (incomingCall.consultationId) {
          await api.patch(`/consultation/status/${incomingCall.consultationId}`, { status: "rejected" });
          toast.success("Call declined and status updated");
        } else {
          toast.success("Call declined");
        }
      } catch (error) {
        console.error("Error on decline API:", error);
        toast.error("Failed to update status on decline");
      }
      
      setIncomingCall(null);
    }
  };

  return { incomingCall, acceptCall, declineCall };
}
