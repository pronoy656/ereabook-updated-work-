"use client";

import { useIncomingCallSocket } from "@/hooks/useIncomingCallSocket";
import { PhoneIncoming, X, Check } from "lucide-react";
import { useEffect, useRef } from "react";

export default function IncomingCallListener() {
  const { incomingCall, acceptCall, declineCall } = useIncomingCallSocket();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play ringing sound using Web Audio API when a call comes in
  useEffect(() => {
    let audioCtx: AudioContext | null = null;
    let intervalId: NodeJS.Timeout;

    if (incomingCall) {
      try {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        const playRing = () => {
          if (!audioCtx) return;
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

          // Fade in and out to avoid clicking sounds
          gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.1);
          gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime + 1.5);
          gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.6);

          osc1.start(audioCtx.currentTime);
          osc1.stop(audioCtx.currentTime + 1.6);
          osc2.start(audioCtx.currentTime);
          osc2.stop(audioCtx.currentTime + 1.6);
        };

        // Ring pattern: 1.6s ring, 2.4s silence
        playRing();
        intervalId = setInterval(playRing, 4000);
      } catch (err) {
        console.warn("Audio play blocked or Web Audio API not supported", err);
      }
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (audioCtx) {
        audioCtx.close().catch(console.error);
      }
    };
  }, [incomingCall]);

  if (!incomingCall) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 flex flex-col items-center animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <PhoneIncoming className="w-10 h-10 text-blue-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Incoming Call</h2>
        <p className="text-gray-500 mb-8 text-center">
          {incomingCall.callerName || "A user"} is calling for an instant consultation.
        </p>

        <div className="flex w-full gap-4">
          <button
            onClick={declineCall}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-100 text-red-600 rounded-xl font-semibold hover:bg-red-200 transition-colors"
          >
            <X className="w-5 h-5" />
            Decline
          </button>
          
          <button
            onClick={acceptCall}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30"
          >
            <Check className="w-5 h-5" />
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
