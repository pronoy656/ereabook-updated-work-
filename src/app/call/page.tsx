"use client";

import React, { useEffect, useState, Suspense, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import VideoWorkspace from '@/components/call/VideoWorkspace';
import SessionSidebar from '@/components/call/SessionSidebar';
import { useRealTimeCall } from '@/hooks/useRealTimeCall';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

function CallPageContent() {
  const router = useRouter();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const consultationId = searchParams.get('consultationId');
  const isCallback = searchParams.get('isCallback') === 'true';

  const [sessionData, setSessionData] = useState<{
    sessionId: string;
    token: string;
    channelName: string;
    appId: string;
    uid: number;
  } | null>(() => {
    const urlChannelName = searchParams.get('channelName');
    const urlToken = searchParams.get('token');
    const urlUid = searchParams.get('uid');
    const urlSessionId = searchParams.get('sessionId');
    if (urlChannelName && urlToken) {
      let cleanToken = urlToken.replace(/['"]+/g, '').trim();
      if (cleanToken === 'null' || cleanToken === 'undefined' || cleanToken === '') {
        return null;
      }
      return {
        sessionId: urlSessionId || "",
        token: cleanToken,
        channelName: urlChannelName.trim(),
        appId: process.env.NEXT_PUBLIC_AGORA_APP_ID || "",
        uid: urlUid ? (isNaN(Number(urlUid)) ? 2001 : Number(urlUid)) : 2001,
      };
    }
    return null;
  });

  const [consultationDetails, setConsultationDetails] = useState<{
    topic: string;
    context: string;
    notes: string;
    clientName: string;
    clientRole: string;
    clientImage: string | null;
    clientInitials: string;
    ratePerMinute?: number;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(() => {
    const urlChannelName = searchParams.get('channelName');
    const urlToken = searchParams.get('token');
    return !(urlChannelName && urlToken);
  });
  const initializationStartedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!consultationId) {
      setError("No consultation ID provided.");
      setIsLoading(false);
      return;
    }

    // Function to fetch sidebar metadata asynchronously in background without blocking video call
    const fetchSidebarDetails = async () => {
      try {
        let consultantRate = 1.0;
        let consultantName = "Consultant";
        let consultantImage = null;
        
        try {
          const profileRes = await api.get('/user/profile');
          if (profileRes.data?.success && profileRes.data?.data) {
            const data = profileRes.data.data;
            if (data.perMinuteRate) consultantRate = Number(data.perMinuteRate);
            if (data.name) consultantName = data.name;
            consultantImage = data.image || data.profileImage || data.avatar || null;
          }
        } catch (profileErr) {
          console.warn("Failed to fetch profile:", profileErr);
        }

        const bookingsRes = await api.get('/consultation/my-bookings');
        const allBookings = bookingsRes.data?.data || bookingsRes.data;
        if (Array.isArray(allBookings)) {
          const currentBooking = allBookings.find((b: any) => b._id === consultationId || b.id === consultationId);
          if (currentBooking) {
            const clientName = currentBooking.user?.name || currentBooking.name || "Client User";
            const clientImage = currentBooking.user?.image || currentBooking.user?.avatar || currentBooking.image || null;
            const initials = clientName.charAt(0).toUpperCase();
            const bookingRate = currentBooking.perMinuteRate || currentBooking.rate || currentBooking.price || consultantRate;
            
            setConsultationDetails({
              topic: (currentBooking.bookingType || "Consultation").toUpperCase() + " BOOKING",
              context: currentBooking.notes ? `Consultation scheduled for ${currentBooking.bookingType} request.` : "Reviewing consultation details and client requirements.",
              notes: currentBooking.notes || "No additional private notes provided by the client.",
              clientName: clientName,
              clientRole: "Client",
              clientImage: clientImage,
              clientInitials: initials,
              ratePerMinute: bookingRate,
              consultantName,
              consultantImage
            } as any);
          }
        }
      } catch (bookingErr) {
        console.warn("Failed to fetch booking details for sidebar:", bookingErr);
      }
    };

    // If sessionData was already populated directly from searchParams (instant join from call accept),
    // start video room instantly and fetch sidebar metadata in background.
    if (sessionData && sessionData.channelName && sessionData.token) {
      setIsLoading(false);
      fetchSidebarDetails();
      return;
    }

    // Prevent double initialization in StrictMode or re-renders
    if (initializationStartedRef.current === consultationId) {
      return;
    }
    
    initializationStartedRef.current = consultationId;

    const initializeSession = async () => {
      try {
        setIsLoading(true);
        let sessionId: string | null = null;
        let resData: any = null;

        // Step 1: Check for existing active video session first (prevents 500 duplicate session errors)
        try {
          const listRes = await api.get('/video-session');
          console.log("Active sessions check:", listRes.data);
          const sessions = listRes.data?.data || listRes.data;
          if (Array.isArray(sessions)) {
            const existing = sessions.find((s: any) => 
              s.consultation === consultationId || 
              s.consultation?._id === consultationId || 
              s.consultationId === consultationId
            );
            if (existing) {
              console.log("Found existing video session:", existing);
              resData = existing;
              sessionId = existing.sessionId || existing.id || existing._id;
            }
          }
        } catch (listErr: any) {
          console.warn("Check for existing video session failed:", listErr?.message);
        }

        // If no existing session found, create a new one
        if (!sessionId) {
          try {
            const createRes = await api.post('/video-session/create', { consultationId });
            console.log("Create session response:", createRes.data);
            resData = createRes.data?.data || createRes.data;
            sessionId = resData?.sessionId || resData?.id || resData?._id || resData?.session?.sessionId || resData?.session?.id || resData?.session?._id;
          } catch (createErr: any) {
            console.warn("Create video session failed:", createErr?.response?.data?.message || createErr.message);
            throw createErr;
          }
        }

        if (!sessionId) {
          throw new Error(`Could not extract sessionId for consultation: ${consultationId}`);
        }

        // Step 2: Join session to start billing
        const joinRes = await api.post('/video-session/join', { sessionId });
        console.log("Join session response:", joinRes.data);
        
        const joinData = joinRes.data?.data || joinRes.data;
        let token = joinData?.token || resData?.token || joinData?.session?.token;
        
        // Clean token: Remove quotes and trim whitespace
        if (typeof token === 'string') {
          token = token.replace(/['"]+/g, '').trim();
          if (token === 'null' || token === 'undefined' || token === '') {
            token = null;
          }
        }

        const channelName = (joinData?.channelName || resData?.channelName || joinData?.session?.channelName || "").trim();
        const appId = (joinData?.appId || resData?.appId || joinData?.session?.appId || process.env.NEXT_PUBLIC_AGORA_APP_ID || "").trim();
        const rawUid = joinData?.uid ?? resData?.uid ?? joinData?.session?.uid ?? 2001;

        const finalSessionData = {
          sessionId,
          token,
          channelName,
          appId,
          uid: rawUid, 
        };

        console.log("🛠️ AGORA JOIN PAYLOAD (REFINED):", {
          ...finalSessionData,
          token: token ? `${token.substring(0, 10)}...` : null
        });
        setSessionData(finalSessionData);

        // Fetch sidebar details in background
        fetchSidebarDetails();
      } catch (err: any) {
        console.error("Error initializing session:", err);
        const serverMsg = err.response?.data?.message || err.response?.data?.error || err.message || "";
        if (serverMsg.includes("no active status") || serverMsg.includes("activeStatus") || err.response?.status === 500) {
          setError(serverMsg || "Session initialization failed (500 / no active status). Please check that your status is set to Available in the top bar, or check your Agora credentials.");
        } else {
          setError(serverMsg || "Failed to initialize video session.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();
  }, [consultationId, searchParams]);

  const {
    joined,
    connectionState,
    localVideoTrack,
    remoteUsers,
    isMuted,
    isVideoOff,
    toggleMute,
    toggleVideo,
    leaveCall,
    mediaError,
    sendTranscript
  } = useRealTimeCall({
    appId: sessionData?.appId || "",
    channel: sessionData?.channelName || "",
    token: sessionData?.token || null,
    uid: sessionData?.uid !== undefined && sessionData?.uid !== null ? sessionData.uid : 2001,
    consultationId: consultationId 
  });

  const remoteUsersList = Object.entries(remoteUsers)
    .filter(([uid]) => uid.toString() !== '9001')
    .map(([_, user]) => user);
  const hasRemoteUserJoined = remoteUsersList.length > 0;
  const firstRemoteUser = remoteUsersList[0];

  const socketRef = useRef<Socket | null>(null);
  const sessionDataRef = useRef(sessionData);
  sessionDataRef.current = sessionData;
  const consultationIdRef = useRef(consultationId);
  consultationIdRef.current = consultationId;
  const isCallbackRef = useRef(isCallback);
  isCallbackRef.current = isCallback;
  const isEndingRef = useRef(false);
  const hasEverJoinedRef = useRef(false);

  const [hasEverJoined, setHasEverJoined] = useState(false);

  const handleEndCall = useCallback(async (shouldEmit = true, forcedReason?: 'cancelled' | 'completed') => {
    if (isEndingRef.current) return;
    isEndingRef.current = true;

    const currentSession = sessionDataRef.current;
    const currentConsId = consultationIdRef.current;
    const currentIsCallback = isCallbackRef.current;
    const sessId = currentSession?.sessionId || searchParams.get('sessionId') || currentConsId;

    // Check if this was a completed consultation or a pre-join cancellation (ringing hang-up)
    const isCompletedCall = forcedReason === 'completed' || (forcedReason !== 'cancelled' && hasEverJoinedRef.current);

    console.log("🛑 Call termination initiated:", {
      sessId,
      consultationId: currentConsId,
      isCallback: currentIsCallback,
      isCompletedCall,
      hasEverJoined: hasEverJoinedRef.current,
      forcedReason
    });

    // 1. Emit socket events
    if (shouldEmit && socketRef.current && socketRef.current.connected) {
      const payload = {
        sessionId: sessId,
        consultationId: currentConsId,
        bookingId: currentConsId,
        isCallback: currentIsCallback,
        reason: isCompletedCall ? "consultant_ended" : "consultant_cancelled",
        sender: "consultant",
        action: isCompletedCall ? "END" : "CANCEL"
      };

      if (isCompletedCall) {
        console.log("🔌 Emitting call-ended & session-ended socket events to peer:", payload);
        socketRef.current.emit("call-ended", payload);
        socketRef.current.emit("call_ended", payload);
        socketRef.current.emit("session-ended", payload);
        socketRef.current.emit("session_ended", payload);
        socketRef.current.emit("end-call", payload);
        socketRef.current.emit("end_call", payload);
      } else {
        console.log("🔌 Emitting call-cancelled socket events to peer (Pre-join / Ringing hang-up):", payload);
        socketRef.current.emit("call-cancelled", payload);
        socketRef.current.emit("call_cancelled", payload);
      }
    }

    // 2. Fire backend APIs with Promise.allSettled
    const apiTasks: Promise<any>[] = [];

    if (sessId) {
      if (isCompletedCall) {
        console.log("🚀 Fired POST /video-session/end and POST /video-session/action (END) for sessionId:", sessId);
        apiTasks.push(
          api.post('/video-session/end', { 
            sessionId: sessId,
            consultationId: currentConsId
          }).catch(err => {
            console.warn("POST /video-session/end error:", err?.response?.data || err.message);
          })
        );
        apiTasks.push(
          api.post('/video-session/action', { 
            sessionId: sessId, 
            action: 'END' 
          }).catch(err => {
            console.warn("POST /video-session/action (END) error:", err?.response?.data || err.message);
          })
        );
      } else {
        console.log("🚀 Fired POST /video-session/action (CANCEL) for sessionId (Pre-join):", sessId);
        apiTasks.push(
          api.post('/video-session/action', { 
            sessionId: sessId, 
            action: 'CANCEL' 
          }).catch(() => null)
        );
      }
    }

    if (currentConsId && currentConsId !== sessId) {
      if (isCompletedCall) {
        apiTasks.push(
          api.post('/video-session/end', { 
            sessionId: currentConsId 
          }).catch(() => null)
        );
        apiTasks.push(
          api.post('/video-session/action', { 
            sessionId: currentConsId, 
            action: 'END' 
          }).catch(() => null)
        );
      } else {
        apiTasks.push(
          api.post('/video-session/action', { 
            sessionId: currentConsId, 
            action: 'CANCEL' 
          }).catch(() => null)
        );
      }
    }

    if (currentConsId) {
      if (isCompletedCall) {
        apiTasks.push(
          api.patch(`/consultation/status/${currentConsId}`, { 
            status: 'completed' 
          }).catch(statusErr => {
            console.warn("Consultation status update warning:", statusErr?.response?.data || statusErr.message);
          })
        );
        apiTasks.push(
          api.post(`/consultation/complete/${currentConsId}`).catch(() => null)
        );
        if (currentIsCallback) {
          apiTasks.push(
            api.post(`/consultation/end-callback/${currentConsId}`).catch(() => null)
          );
          apiTasks.push(
            api.post(`/consultation/complete-callback/${currentConsId}`).catch(() => null)
          );
        }
      } else {
        apiTasks.push(
          api.patch(`/consultation/status/${currentConsId}`, { 
            status: 'cancelled' 
          }).catch(() => null)
        );
      }
    }

    try {
      await Promise.allSettled(apiTasks);
    } catch (e) {
      console.warn("API execution warning on end call:", e);
    }

    // 3. Leave Agora call UI
    try {
      leaveCall();
    } catch (e) {
      console.warn("Agora leave call warning:", e);
    }
    
    // 4. Redirect accordingly
    setTimeout(() => {
      if (isCompletedCall) {
        const reportRoute = currentConsId 
          ? `/consultant/reports/create?consultationId=${currentConsId}`
          : '/consultant/reports/create';
        router.push(reportRoute);
      } else {
        toast.info("Call was cancelled before starting");
        router.push('/consultant/requests');
      }
    }, 200);
  }, [searchParams, leaveCall, router]);

  useEffect(() => {
    if (hasRemoteUserJoined && !hasEverJoined) {
      hasEverJoinedRef.current = true;
      setHasEverJoined(true);
    } else if (!hasRemoteUserJoined && hasEverJoined) {
      // The remote user has left the call, so end the session automatically for the consultant too
      console.log("Remote user left. Auto-ending the call...");
      handleEndCall(true, 'completed');
    }
  }, [hasRemoteUserJoined, hasEverJoined, handleEndCall]);

  // Real-time persistent socket listener for call termination
  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (!token) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://10.10.7.106:5000/api/v1";
    let socketUrl = "http://10.10.7.106:5000";
    try {
      socketUrl = new URL(apiUrl).origin;
    } catch {}

    const socket: Socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
    socketRef.current = socket;

    const joinRooms = () => {
      const consId = consultationIdRef.current;
      const sessId = sessionDataRef.current?.sessionId;
      console.log("🔌 Joining consultation socket rooms:", { consId, sessId });
      if (consId) {
        socket.emit("join-consultation", consId);
        socket.emit("join_room", consId);
        socket.emit("join", consId);
        socket.emit("joinConsultation", consId);
      }
      if (sessId) {
        socket.emit("join-session", sessId);
        socket.emit("join_room", sessId);
        socket.emit("join", sessId);
        socket.emit("joinSession", sessId);
      }
    };

    socket.on("connect", () => {
      console.log("🔌 Consultant call page socket connected, socket id:", socket.id);
      joinRooms();
    });

    // If socket is already connected when effect runs
    if (socket.connected) {
      joinRooms();
    }

    const handleRemoteEnd = (data: any, isCancellation = false) => {
      console.log("🔌 Call ended or cancelled via socket from remote peer:", { data, isCancellation });
      const currentSessionId = sessionDataRef.current?.sessionId;
      const currentConsId = consultationIdRef.current;
      
      const incomingSessId = data?.sessionId || data?.data?.sessionId || data?.session?._id || data?.session?.id || data?._id || data?.id;
      const incomingConsId = data?.consultationId || data?.data?.consultationId || data?.consultation?._id || data?.consultation?.id || data?.bookingId || data?.data?.bookingId;

      const isTarget = !data || !currentConsId || 
        (!incomingConsId && !incomingSessId) ||
        (currentSessionId && incomingSessId && String(incomingSessId) === String(currentSessionId)) ||
        (currentConsId && incomingConsId && String(incomingConsId) === String(currentConsId)) ||
        (currentConsId && incomingSessId && String(incomingSessId) === String(currentConsId));

      if (isTarget) {
        if (isCancellation || !hasEverJoinedRef.current) {
          toast.info("Call was cancelled by the user");
          handleEndCall(false, 'cancelled');
        } else {
          toast.info("Call was ended by the user");
          handleEndCall(false, 'completed');
        }
      }
    };

    socket.on("call-cancelled", (data) => handleRemoteEnd(data, true));
    socket.on("call_cancelled", (data) => handleRemoteEnd(data, true));
    socket.on("call-rejected", (data) => handleRemoteEnd(data, true));
    socket.on("call_rejected", (data) => handleRemoteEnd(data, true));
    socket.on("consultation-cancelled", (data) => handleRemoteEnd(data, true));

    socket.on("call-ended", (data) => handleRemoteEnd(data, false));
    socket.on("call_ended", (data) => handleRemoteEnd(data, false));
    socket.on("session-ended", (data) => handleRemoteEnd(data, false));
    socket.on("session_ended", (data) => handleRemoteEnd(data, false));
    socket.on("consultation-ended", (data) => handleRemoteEnd(data, false));
    socket.on("consultation-auto-ended", (data) => handleRemoteEnd(data, false));
    socket.on("end-call", (data) => handleRemoteEnd(data, false));
    socket.on("end_call", (data) => handleRemoteEnd(data, false));
    socket.on("video-session-ended", (data) => handleRemoteEnd(data, false));
    socket.on("video-session-action", (data: any) => {
      if (data?.action === 'CANCEL' || data?.action === 'REJECT') {
        handleRemoteEnd(data, true);
      } else {
        handleRemoteEnd(data, false);
      }
    });
    socket.on("action", (data: any) => {
      if (data?.action === 'CANCEL' || data?.action === 'REJECT') {
        handleRemoteEnd(data, true);
      } else if (data?.action === 'END') {
        handleRemoteEnd(data, false);
      }
    });

    return () => {
      socketRef.current = null;
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [handleEndCall]);

  // Re-join rooms whenever sessionData becomes available
  useEffect(() => {
    if (socketRef.current && socketRef.current.connected) {
      const sessId = sessionData?.sessionId;
      const consId = consultationId;
      if (sessId) {
        socketRef.current.emit("join-session", sessId);
        socketRef.current.emit("join_room", sessId);
        socketRef.current.emit("join", sessId);
      }
      if (consId) {
        socketRef.current.emit("join-consultation", consId);
        socketRef.current.emit("join_room", consId);
      }
    }
  }, [sessionData?.sessionId, consultationId]);

  if (error) {
    const isEnded = error?.toLowerCase().includes('ended');
    return (
      <div className="w-full h-screen flex items-center justify-center bg-slate-955 text-white p-4 select-none">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col items-center gap-5 text-center max-w-md w-full shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-300">
           <div className={`w-16 h-16 rounded-full border flex items-center justify-center mb-2 font-bold text-3xl shadow-inner ${isEnded ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
             {isEnded ? "🔒" : "!"}
           </div>
           <h2 className="text-2xl font-bold text-white tracking-wide">
             {isEnded ? "Session Closed" : "Session Error"}
           </h2>
           <p className="text-slate-300 text-sm leading-relaxed mb-4">
             {isEnded 
               ? "This consultation session has already been completed and closed. You cannot rejoin an ended session."
               : (error || "Failed to initialize secure video session.")
             }
           </p>
           <button 
             onClick={() => router.back()}
             className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/30 text-white cursor-pointer"
           >
             Return to Dashboard
           </button>
         </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col md:flex-row bg-slate-50 animate-in fade-in duration-500">
      
      {/* 🎥 Left Section (Video) */}
      <VideoWorkspace 
        localVideoTrack={localVideoTrack}
        remoteVideoTrack={firstRemoteUser?.video}
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        toggleMute={toggleMute}
        toggleVideo={toggleVideo}
        leaveCall={handleEndCall}
        joined={joined}
        mediaError={mediaError}
        hasRemoteUserJoined={hasRemoteUserJoined}
        connectionState={connectionState}
        remoteUsers={remoteUsers}
        isCallback={isCallback}
        clientName={consultationDetails?.clientName}
        clientImage={consultationDetails?.clientImage}
        consultantName={(consultationDetails as any)?.consultantName}
        consultantImage={(consultationDetails as any)?.consultantImage}
      />

      {/* 📊 Right Section (Context & Transcription) */}
      <SessionSidebar
        consultationDetails={consultationDetails}
        consultationId={consultationId}
        sessionId={sessionData?.sessionId}
        consultantUid={sessionData?.uid}
        onAutoEnd={handleEndCall}
        hasRemoteUserJoined={hasRemoteUserJoined}
      />

    </div>
  );
}

export default function CallPage() {
  return (
    <Suspense fallback={
      <div className="w-full h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
      </div>
    }>
      <CallPageContent />
    </Suspense>
  );
}
