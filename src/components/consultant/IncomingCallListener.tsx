"use client";

import React from "react";
import { useIncomingCallSocket } from "@/hooks/useIncomingCallSocket";
import { PhoneIncoming, PhoneOff, PhoneCall, Video, User } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

const getInitials = (name?: string) => {
  if (!name) return "C";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

export default function IncomingCallListener() {
  const { incomingCall, acceptCall, declineCall } = useIncomingCallSocket();

  if (!incomingCall) return null;

  const callerName = incomingCall.callerName || "Client";
  const callType =
    incomingCall.bookingType ||
    incomingCall.type ||
    "Instant Consultation";
  const avatarUrl = incomingCall.callerAvatar || incomingCall.callerImage;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md mx-4 bg-white dark:bg-[#1e293b] rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-8 flex flex-col items-center text-center overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Background Ambient Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Animated Ringing Ripple & Avatar */}
        <div className="relative mb-6 mt-2 flex items-center justify-center">
          <span className="absolute w-28 h-28 rounded-full bg-emerald-500/20 animate-ping duration-1000" />
          <span className="absolute w-36 h-36 rounded-full bg-emerald-500/10 animate-pulse duration-1000" />

          {avatarUrl ? (
            <img
              src={getImageUrl(avatarUrl)}
              alt={callerName}
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
          <PhoneIncoming className="w-3.5 h-3.5" />
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
