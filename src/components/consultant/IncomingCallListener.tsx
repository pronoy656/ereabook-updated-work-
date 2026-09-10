"use client";

import React, { useEffect, useState } from "react";
import { useIncomingCallSocket, resolveCallerInfo } from "@/hooks/useIncomingCallSocket";
import { PhoneIncoming, PhoneOff, PhoneCall, Video } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

const getInitials = (name?: string) => {
  if (!name || name === "Client" || name === "A user") return "U";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export default function IncomingCallListener() {
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { incomingCall, acceptCall, declineCall } = useIncomingCallSocket();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset image error state whenever a new incoming call arrives
  useEffect(() => {
    if (incomingCall) {
      setImageError(false);
    }
  }, [incomingCall?.sessionId, incomingCall?.consultationId]);

  // Web Audio Ringing Synthesizer (standard phone ring: 440Hz + 480Hz)
  useEffect(() => {
    let audioCtx: AudioContext | null = null;
    let intervalId: any = null;

    if (incomingCall) {
      try {
        const AudioContextClass =
          window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioCtx = new AudioContextClass();

          const playRing = () => {
            if (!audioCtx || audioCtx.state === "closed") return;
            if (audioCtx.state === "suspended") {
              audioCtx.resume();
            }

            const osc1 = audioCtx.createOscillator();
            const osc2 = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            osc1.connect(gainNode);
            osc2.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            osc1.type = "sine";
            osc1.frequency.setValueAtTime(440, audioCtx.currentTime); // 440 Hz

            osc2.type = "sine";
            osc2.frequency.setValueAtTime(480, audioCtx.currentTime); // 480 Hz

            // Fade in and out to produce clean phone ring tone
            gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.25, audioCtx.currentTime + 0.08);
            gainNode.gain.setValueAtTime(0.25, audioCtx.currentTime + 1.5);
            gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.6);

            osc1.start(audioCtx.currentTime);
            osc1.stop(audioCtx.currentTime + 1.6);
            osc2.start(audioCtx.currentTime);
            osc2.stop(audioCtx.currentTime + 1.6);
          };

          // Ring pattern: 1.6s ring, 2.4s silence
          playRing();
          intervalId = setInterval(playRing, 4000);
        }
      } catch (err) {
        console.warn("Web Audio ringing initialization warning:", err);
      }
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (audioCtx) {
        audioCtx.close().catch(() => {});
      }
    };
  }, [incomingCall]);

  if (!mounted || !incomingCall) return null;

  const resolved = resolveCallerInfo(incomingCall);
  const callerName = resolved.name || incomingCall.callerName || "Client";
  const avatarUrl = resolved.image || incomingCall.callerAvatar || incomingCall.callerImage;
  const callType = resolved.bookingType || "Instant Consultation";
  const finalImageUrl = getImageUrl(avatarUrl);

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md mx-4 bg-white dark:bg-[#1e293b] rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-8 flex flex-col items-center text-center overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Background Ambient Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Animated Ringing Ripple & Avatar */}
        <div className="relative mb-6 mt-2 flex items-center justify-center">
          <span className="absolute w-28 h-28 rounded-full bg-emerald-500/25 animate-ping duration-1000" />
          <span className="absolute w-36 h-36 rounded-full bg-emerald-500/15 animate-pulse duration-1000" />

          {finalImageUrl && !imageError ? (
            <img
              src={finalImageUrl}
              alt={callerName}
              onError={() => setImageError(true)}
              className="relative w-24 h-24 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-xl shadow-emerald-500/20"
            />
          ) : (
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-white dark:border-slate-800 shadow-xl shadow-emerald-500/20">
              {getInitials(callerName)}
            </div>
          )}

          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-md">
            <Video className="w-4 h-4 animate-bounce" />
          </div>
        </div>

        {/* Call Info */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <PhoneIncoming className="w-3.5 h-3.5 animate-pulse" />
          <span>{callType}</span>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
          {callerName}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-xs">
          Incoming video consultation call. Click accept to join the session.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-6 w-full max-w-xs">
          {/* Decline Button */}
          <div className="flex flex-col items-center gap-1.5 flex-1">
            <button
              onClick={declineCall}
              aria-label="Decline Call"
              className="w-16 h-16 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:hover:bg-rose-900/50 dark:text-rose-400 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-rose-500/10 cursor-pointer"
            >
              <PhoneOff className="w-7 h-7" />
            </button>
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
              Decline
            </span>
          </div>

          {/* Accept Button */}
          <div className="flex flex-col items-center gap-1.5 flex-1">
            <button
              onClick={acceptCall}
              aria-label="Accept Call"
              className="w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-xl shadow-emerald-500/30 cursor-pointer"
            >
              <PhoneCall className="w-7 h-7 animate-pulse" />
            </button>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Accept
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
