"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import type { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack, IRemoteVideoTrack, IRemoteAudioTrack } from 'agora-rtc-sdk-ng';
import api from '@/lib/axios';
import * as pako from 'pako';

/**
 * Agora RTT v7.x publishes transcription results as protobuf-encoded stream messages.
 *
 * Relevant fields from the Agora RTT proto3 schema:
 *   Text.uid         = 4  (uint32)  — speaker UID
 *   Text.words       = 10 (repeated Word)
 *   Text.end_of_segment = 11 (bool) — true when the segment is finalised
 *   Text.text        = 17 (string)  — full sentence (if present, preferred over word concat)
 *   Word.text        = 1  (string)
 *   Word.start_ms    = 2  (int32)
 *   Word.is_final    = 4  (bool)
 */
function parseAgoraSttPayload(data: Uint8Array): {
  uid: number;
  text: string;
  isFinal: boolean;
  startMs: number;
} | null {
  const textDecoder = new TextDecoder('utf-8');
  let pos = 0;

  function readVarint(): number {
    let result = 0;
    let shift = 0;
    while (pos < data.length) {
      const b = data[pos++];
      result |= (b & 0x7f) << shift;
      if ((b & 0x80) === 0) break;
      shift += 7;
    }
    return result >>> 0; // unsigned 32-bit
  }

  function skipField(wireType: number): void {
    if (wireType === 0) { readVarint(); }
    else if (wireType === 1) { pos += 8; }
    else if (wireType === 2) { pos += readVarint(); }
    else if (wireType === 5) { pos += 4; }
  }

  let uid = 0;
  let wordTexts: string[] = [];
  let isFinal = false;
  let startMs = 0;
  let sentenceText = '';

  while (pos < data.length) {
    const tag = readVarint();
    const fieldNum = tag >> 3;
    const wireType = tag & 0x07;

    if (fieldNum === 4 && wireType === 0) {
      uid = readVarint();

    } else if (fieldNum === 10 && wireType === 2) {
      // Embedded Word message
      const msgLen = readVarint();
      const msgEnd = pos + msgLen;
      let wText = '';
      let wFinal = false;
      let wStart = 0;

      while (pos < msgEnd) {
        const wTag = readVarint();
        const wField = wTag >> 3;
        const wType = wTag & 0x07;

        if (wField === 1 && wType === 2) {
          const len = readVarint();
          wText = textDecoder.decode(data.slice(pos, pos + len));
          pos += len;
        } else if (wField === 2 && wType === 0) {
          wStart = readVarint();
        } else if (wField === 4 && wType === 0) {
          wFinal = readVarint() !== 0;
        } else {
          skipField(wType);
        }
      }
      pos = msgEnd;
      if (wText) { wordTexts.push(wText); isFinal = wFinal; if (!startMs) startMs = wStart; }

    } else if (fieldNum === 11 && wireType === 0) {
      if (readVarint() !== 0) isFinal = true; // end_of_segment overrides word-level flag

    } else if (fieldNum === 17 && wireType === 2) {
      const len = readVarint();
      sentenceText = textDecoder.decode(data.slice(pos, pos + len));
      pos += len;

    } else {
      skipField(wireType);
    }
  }

  const text = (sentenceText || wordTexts.join(' ')).trim();
  if (!uid || !text) return null;
  return { uid, text, isFinal, startMs: startMs || Date.now() };
}

export interface UseRealTimeCallProps {
  appId: string;
  channel: string;
  token: string | null;
  uid?: string | number | null;
  consultationId?: string | null;
}

export function useRealTimeCall({ appId, channel, token, uid = null, consultationId = null }: UseRealTimeCallProps) {
  const [joined, setJoined] = useState(false);
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [connectionState, setConnectionState] = useState<string>('DISCONNECTED');

  // Track remote users
  const [remoteUsers, setRemoteUsers] = useState<Record<string, { video?: IRemoteVideoTrack, audio?: IRemoteAudioTrack }>>({});

  // Mute states
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // Use refs for stable cleanup closures in Strict Mode
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localAudioRef = useRef<IMicrophoneAudioTrack | null>(null);
  const localVideoRef = useRef<ICameraVideoTrack | null>(null);

  useEffect(() => {
    let mounted = true;
    let AgoraRTC: any;

    const initCall = async () => {
      // Avoid starting the pipeline if unmounted or already connected
      if (!mounted) return;

      // Native browser media check requested by USER for debugging
      if (typeof window !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then(stream => {
            console.log("✅ CAMERA/MIC WORKING");
            console.log(stream);
            stream.getTracks().forEach(track => track.stop());
          })
          .catch(err => {
            console.log("❌ ERROR OCCURRED:", err.name, err.message);
          });
      } else {
        console.log("❌ ERROR OCCURRED: navigator.mediaDevices is undefined (likely non-secure HTTP context)");
      }

      const AgoraMod = await import('agora-rtc-sdk-ng');
      AgoraRTC = AgoraMod.default;

      if (!clientRef.current) {
        clientRef.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      }

      const client = clientRef.current!;

      // Handle connection state changes
      client.on('connection-state-change', (curState, revState, reason) => {
        console.log(
          `%c🌐 AGORA CONNECTION STATE CHANGED: ${revState} -> ${curState} (Reason: ${reason || 'N/A'})`,
          'color: #ffffff; background: #8B5CF6; font-weight: bold; font-size: 13px; padding: 4px; border-radius: 4px;'
        );
        if (mounted) setConnectionState(curState);
      });

      // Handle remote users joining/publishing
      client.on('user-joined', (user) => {
        console.log(
          `%c🟢 AGORA USER-JOINED: User ${user.uid} has entered the channel`,
          'color: #ffffff; background: #10B981; font-weight: bold; font-size: 14px; padding: 4px; border-radius: 4px;'
        );
        
        if (user.uid.toString() === '9001') {
          console.log("%c🤖 STT BOT DETECTED: Agora STT Service is now active in this channel.", "color: #ffffff; background: #7C3AED; font-weight: bold; padding: 4px; border-radius: 4px;");
        }

        if (!mounted) return;
        setRemoteUsers(prev => ({
          ...prev,
          [user.uid]: prev[user.uid] || {}
        }));
      });

      client.on('user-published', async (user, mediaType) => {
        console.log(
          `%c📡 AGORA USER-PUBLISHED: User ${user.uid} published [${mediaType}]`,
          'color: #ffffff; background: #3B82F6; font-weight: bold; font-size: 13px; padding: 3px; border-radius: 4px;'
        );
        await client.subscribe(user, mediaType);
        console.log(
          `%c✅ AGORA SUBSCRIBED: Subscribed to ${user.uid}'s [${mediaType}] track successfully`,
          'color: #ffffff; background: #059669; font-weight: bold; font-size: 13px; padding: 3px; border-radius: 4px;'
        );

        if (!mounted) return;

        setRemoteUsers(prev => ({
          ...prev,
          [user.uid]: {
            ...prev[user.uid],
            video: mediaType === 'video' ? user.videoTrack : prev[user.uid]?.video,
            audio: mediaType === 'audio' ? user.audioTrack : prev[user.uid]?.audio,
          }
        }));

        if (mediaType === 'audio') {
          console.log(`%c🎤 AUDIO TRACK FOUND: Playing remote audio track for user ${user.uid}...`, 'color: #ffffff; background: #D97706; padding: 2px; border-radius: 2px;');
          user.audioTrack?.play();
        } else if (mediaType === 'video') {
          console.log(`%c🎥 VIDEO TRACK FOUND: Remote video track loaded for user ${user.uid}.`, 'color: #ffffff; background: #2563EB; padding: 2px; border-radius: 2px;');
        }
      });

      client.on('user-unpublished', (user, mediaType) => {
        console.log(
          `%c📡 AGORA USER-UNPUBLISHED: User ${user.uid} stopped publishing [${mediaType}]`,
          'color: #1F2937; background: #F3F4F6; font-weight: bold; font-size: 12px; padding: 3px; border-radius: 4px;'
        );
        if (!mounted) return;
        if (mediaType === 'audio' && typeof window !== 'undefined' && (window as any)._remoteVadInterval) {
          clearInterval((window as any)._remoteVadInterval);
        }
        setRemoteUsers(prev => {
          const updated = { ...prev };
          if (updated[user.uid]) {
            if (mediaType === 'video') delete updated[user.uid].video;
            if (mediaType === 'audio') delete updated[user.uid].audio;
          }
          return updated;
        });
      });

      client.on('user-left', (user) => {
        console.log(
          `%c🔴 AGORA USER-LEFT: User ${user.uid} has left the channel`,
          'color: #ffffff; background: #EF4444; font-weight: bold; font-size: 14px; padding: 4px; border-radius: 4px;'
        );
        if (!mounted) return;
        if (typeof window !== 'undefined' && (window as any)._remoteVadInterval) {
          clearInterval((window as any)._remoteVadInterval);
        }
        setRemoteUsers(prev => {
          const updated = { ...prev };
          delete updated[user.uid];
          return updated;
        });
      });

       // Listen for Agora DataStream / WebSocket live transcription messages from Agora STT bot
       client.on('stream-message', async (uid, payload) => {
         console.log(`📥 Received stream message from UID: ${uid}`);
         
         // 1. Only process if it's from the STT bot (UID 9001)
         if (uid.toString() !== '9001') {
           console.log(`ℹ️ Ignoring stream message from non-STT source (UID: ${uid})`);
           return;
         }

         let result = null;

         // Attempt JSON decoding first
         try {
           let text = '';
           try {
             // Attempt to decompress gzip payload (Agora STT enableJsonProtocol)
             const decompressed = pako.inflate(payload);
             text = new TextDecoder('utf-8').decode(decompressed);
           } catch (e) {
             // Fallback if not gzipped
             text = new TextDecoder('utf-8').decode(payload);
           }
           
           const json = JSON.parse(text);
           // console.log('RAW STT JSON:', json); // Uncomment if needed for debugging
           
           if (json && typeof json === 'object') {
             // Handle potential Agora JSON formats
             const transcriptData = json.transcript || json; // fallback to root if transcript key is absent

             result = {
               uid: transcriptData.uid || transcriptData.speakerUid,
               text: transcriptData.text || (transcriptData.words && Array.isArray(transcriptData.words) ? transcriptData.words.map((w: any) => w.text).join('') : ''),
               isFinal: transcriptData.isFinal !== undefined ? transcriptData.isFinal : (transcriptData.is_final || false),
               startMs: transcriptData.offset || transcriptData.timestamp || transcriptData.startMs || Date.now()
             };
           }
         } catch (e) {
           // Not JSON (or invalid), fallback to Protobuf parsing
           result = parseAgoraSttPayload(payload);
         }

         console.log('📥 STT BOT PARSED:', result);

         if (consultationId && result?.text) {
           // Forward to backend → persists + fans out via Socket.IO transcript:new
           // The socket event is the single source of truth for the UI — no optimistic dispatch needed.
           api.post(`/transcription/${consultationId}/ingest`, {
             uid: result.uid,
             text: result.text,
             isFinal: result.isFinal,
             timestamp: result.startMs,
           }).catch((err: any) => {
             console.error('Failed to relay transcript chunk:', err);
           });
         }
      });

      try {
        // Native stream check requested by USER to verify camera/mic access before Agora joins
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

          console.log("✅ STREAM GOT:", stream);
          stream.getTracks().forEach(track => track.stop());
        } catch (err: any) {
          console.log("❌ CAMERA ERROR:", err?.name, err?.message);
        }

        if (!appId || !channel) {
          console.warn("Agora connection aborted: Missing required credentials.", { appId, channel, token });
          return;
        }

        if (client.connectionState === 'DISCONNECTED') {
          await client.join(appId, channel, token, uid);
        }

        if (!mounted) return;

        // Ask the backend to start the Agora RTT (cloud STT) service so UID 9001
        // joins the channel and begins transcribing both participants.
        if (consultationId) {
          api.post(`/transcription/${consultationId}/start`, { channelName: channel })
            .then(() => console.log('%c✅ RTT TRANSCRIPTION SERVICE STARTED', 'color:#fff;background:#059669;font-weight:bold;padding:4px;border-radius:4px;'))
            .catch((err: any) => console.warn('⚠️ Could not start RTT transcription service:', err?.response?.data || err.message));
        }

        // Setup local tracks safely maintaining refs (Works completely offline!)
        try {

          if (!localAudioRef.current) {
            const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
            localAudioRef.current = audioTrack;
            setLocalAudioTrack(audioTrack);
          }

          if (!localVideoRef.current) {
            const videoTrack = await AgoraRTC.createCameraVideoTrack();
            localVideoRef.current = videoTrack;
            setLocalVideoTrack(videoTrack);
          }
          setMediaError(null);
        } catch (mediaErr: any) {
          console.error("Media Device Error:", mediaErr);
          let errorMsg = "Could not access camera or microphone. Please ensure permissions are granted.";
          if (typeof window !== 'undefined' && window.location.protocol === 'http:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            errorMsg = "Camera/Microphone access is blocked by your browser because you are accessing via HTTP on a non-localhost IP. Please access via http://localhost:3000 or use HTTPS.";
          } else if (mediaErr.name === 'NotAllowedError' || mediaErr.name === 'PermissionDeniedError') {
            errorMsg = "Camera or Microphone permission was denied by your browser. Please click the site settings icon in the URL bar and allow access.";
          } else if (mediaErr.name === 'NotFoundError' || mediaErr.name === 'DeviceNotFoundError') {
            errorMsg = "No camera or microphone device found on your system. Please plug in a device and retry.";
          } else if (mediaErr.name === 'NotReadableError' || mediaErr.name === 'TrackStartError') {
            errorMsg = "Your camera or microphone is currently busy or being used by another application (e.g., Zoom, Teams). Please close other apps and retry.";
          }
          setMediaError(errorMsg);
        }

        // Ensure not attempting to publish if already published or running locally offline
        const publishPayload = [];
        if (localAudioRef.current) publishPayload.push(localAudioRef.current);
        if (localVideoRef.current) publishPayload.push(localVideoRef.current);

        if (publishPayload.length > 0) {
          await client.publish(publishPayload);
        }

        if (mounted) setJoined(true);
      } catch (err) {
        // Protect against strict-double mount aborts
        console.warn("Agora connection cycle error:", err);
      }
    };

    // Always run initCall so native camera/mic checks execute immediately
    setTimeout(() => {
      if (mounted) initCall();
    }, 50);

    return () => {
      mounted = false;
      const cleanup = async () => {
        if (typeof window !== 'undefined' && (window as any)._remoteVadInterval) {
          clearInterval((window as any)._remoteVadInterval);
        }
        if (localAudioRef.current) {
          localAudioRef.current.stop();
          localAudioRef.current.close();
          localAudioRef.current = null;
        }
        if (localVideoRef.current) {
          localVideoRef.current.stop();
          localVideoRef.current.close();
          localVideoRef.current = null;
        }
        if (clientRef.current) {
          clientRef.current.removeAllListeners();
          if (clientRef.current.connectionState !== 'DISCONNECTED') {
            try { await clientRef.current.leave(); } catch (e) { /* ignore */ }
          }
        }
      };
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appId, channel, token, uid, consultationId]); // Ignore track deps to avoid rebuild loops

  // Periodic audit and debug logs
  useEffect(() => {
    const interval = setInterval(() => {
      const client = clientRef.current;
      if (!client) return;

      const remoteUsersArray = client.remoteUsers;
      console.log(`%c🕒 [PERIODIC AUDIT] AppID: ${appId} | Channel: ${channel} | My UID: ${uid} | Connection: ${client.connectionState} | Remote Users: ${remoteUsersArray.length}`, 'color: #6B7280; font-size: 11px;');

      if (remoteUsersArray.length === 0) {
        console.log("%cℹ️ No remote users detected in Agora channel yet.", "color: #9CA3AF; font-style: italic; font-size: 10px;");
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [appId, channel, uid]); // Added dependencies to fix stale closure in logs

  const toggleMute = async () => {
    if (localAudioTrack) {
      try {
        await localAudioTrack.setMuted(!isMuted);
        setIsMuted(prev => !prev);
      } catch (e) {
        console.error("Failed to toggle mute", e);
      }
    }
  };

  const toggleVideo = async () => {
    if (localVideoTrack) {
      try {
        await localVideoTrack.setMuted(!isVideoOff);
        setIsVideoOff(prev => !prev);
      } catch (e) {
        console.error("Failed to toggle video", e);
      }
    }
  };

  const sendTranscript = useCallback(async (text: string, speaker: string = "Consultant") => {
    const client = clientRef.current as any;
    if (!client || client.connectionState !== 'CONNECTED') {
      console.warn("Cannot send transcript: Agora client is not connected.");
      return;
    }
    try {
      const payload = JSON.stringify({ speaker, text });
      const encoder = new TextEncoder();
      const data = encoder.encode(payload);

      await client.sendStreamMessage(data);
      console.log("Sent transcription stream message:", { speaker, text });
    } catch (err) {
      console.warn("Failed to send transcription stream message:", err);
    }
  }, []);

  const leaveCall = async () => {
    if (localAudioRef.current) {
      localAudioRef.current.stop();
      localAudioRef.current.close();
    }
    if (localVideoRef.current) {
      localVideoRef.current.stop();
      localVideoRef.current.close();
    }
    if (clientRef.current) {
      try { await clientRef.current.leave(); } catch (e) { /* ignore */ }
    }
    setJoined(false);
  };

  return {
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
  };
}
