"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import api from '@/lib/axios';

export interface TranscriptLine {
  speaker: string;
  text: string;
  source?: 'local' | 'stt' | 'relay' | 'history' | 'system';
  timestamp?: string | number;
  speakerUid?: number;
  isFinal?: boolean;
}

interface UseTranscriptionProps {
  consultationId: string | null;
  sessionId: string | null;
  consultantUid?: number;
  enabled?: boolean;
  onAutoEnd?: () => void;
}

/**
 * Derive the Socket.io server URL from the REST API base URL.
 * e.g. "http://10.10.7.106:5000/api/v1" → "http://10.10.7.106:5000"
 */
function getSocketUrl(): string {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || 'http://10.10.7.106:5000/api/v1';
  try {
    const url = new URL(apiUrl);
    return url.origin;
  } catch {
    return 'http://10.10.7.106:5000';
  }
}

export function useTranscription({
  consultationId,
  sessionId,
  consultantUid = 2001,
  enabled = true,
  onAutoEnd,
}: UseTranscriptionProps) {
  // ── state ──────────────────────────────────────────────────────────
  const [transcripts, setTranscripts] = useState<TranscriptLine[]>([
    {
      speaker: 'System',
      text: 'Session started. Recording and transcription enabled.',
      source: 'system',
      timestamp: Date.now(),
    },
  ]);
  const [isConnected, setIsConnected] = useState(false);
  const [sttActive, setSttActive] = useState(false);
  const [clientInterim, setClientInterim] = useState<string>('');

  const socketRef = useRef<Socket | null>(null);
  const onAutoEndRef = useRef(onAutoEnd);
  useEffect(() => { onAutoEndRef.current = onAutoEnd; }, [onAutoEnd]);

  // Helper to upsert a caption line based on speaker and timestamp
  const upsertCaptionLine = useCallback((line: TranscriptLine) => {
    setTranscripts((prev) => {
      // Find index of an existing line with the same speakerUid and timestamp
      // Only for non-system/non-history lines that have these fields
      if (line.speakerUid && line.timestamp) {
        const existingIndex = prev.findIndex(
          (t) => t.speakerUid === line.speakerUid && t.timestamp === line.timestamp
        );

        if (existingIndex !== -1) {
          // If we found an existing one, update it (e.g. replacing interim with final)
          const updated = [...prev];
          updated[existingIndex] = { ...updated[existingIndex], ...line };
          return updated;
        }
      }

      // Otherwise, just append
      return [...prev, line];
    });
  }, []);

  // ── Socket.io connection ───────────────────────────────────────────
  useEffect(() => {
    if (!enabled || !consultationId) return;

    const token = Cookies.get('accessToken');
    if (!token) {
      console.warn('🔌 No auth token – skipping socket connection');
      return;
    }

    const socketUrl = getSocketUrl();
    console.log('🔌 Connecting to socket at:', socketUrl);

    const socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('🔌✅ Socket connected for live transcription, id:', socket.id);
      // Join consultation room via all common event conventions
      socket.emit('join-consultation', consultationId);
      socket.emit('join_room', consultationId);
      socket.emit('join', consultationId);
      socket.emit('joinConsultation', consultationId);
      setIsConnected(true);
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌❌ Socket disconnected:', reason);
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.warn('🔌⚠️ Socket connection error:', err.message);
    });

    // Handle transcript incoming data from socket
    const handleTranscriptData = (data: any) => {
      console.log('📝 STT transcript received:', data);

      if (!data || !data.text || !data.text.trim()) return;
      if (data.consultationId && String(data.consultationId) !== String(consultationId)) return;

      setSttActive(true);

      const isClient = data.speakerUid ? Number(data.speakerUid) !== consultantUid : (data.speaker?.toLowerCase() !== 'you');

      if (isClient && data.isFinal === false) {
        setClientInterim(data.text);
      } else {
        if (isClient) setClientInterim('');
        upsertCaptionLine({
          speaker: isClient ? (data.speaker || 'Client') : 'You',
          text: data.text,
          source: 'stt',
          isFinal: data.isFinal !== false,
          timestamp: data.timestamp || Date.now(),
          speakerUid: data.speakerUid ? Number(data.speakerUid) : undefined,
        });
      }
    };

    // ── Register all potential socket transcript event names ───────
    socket.on('transcript:new', handleTranscriptData);
    socket.on('transcript', handleTranscriptData);
    socket.on('stt-transcript', handleTranscriptData);
    socket.on('new-transcript', handleTranscriptData);

    // ── Peer relay: receive-speech ─────────────────────────────────
    socket.on(
      'receive-speech',
      (data: { speaker?: string; text: string; sessionId?: string }) => {
        console.log('📥 Received speech relay:', data);

        if (data.text?.trim()) {
          setTranscripts((prev) => [
            ...prev,
            { speaker: data.speaker || 'Client', text: data.text, source: 'relay', timestamp: Date.now() },
          ]);
        }
      },
    );

    // ── System auto-end ────────────────────────────────────────────
    socket.on('consultation-auto-ended', (payload?: { reason?: string, message?: string }) => {
      console.log('⏹️ Consultation auto-ended by system', payload);
      
      let endMessage = 'Session ended automatically by the system.';
      if (payload?.reason === 'insufficient_funds' || payload?.reason === 'payment_failed') {
        endMessage = 'The call was disconnected due to insufficient balance from the client.';
      } else if (payload?.message) {
        endMessage = payload.message;
      }

      setTranscripts((prev) => [
        ...prev,
        {
          speaker: 'System',
          text: endMessage,
          source: 'system',
          timestamp: Date.now(),
        },
      ]);
      if (onAutoEndRef.current) {
        onAutoEndRef.current();
      }
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [consultationId, enabled, consultantUid, upsertCaptionLine]);

  // ── Web Speech API Fallback for Real-Time Local Mic Transcription ──
  useEffect(() => {
    if (!enabled || !consultationId) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log('ℹ️ WebkitSpeechRecognition not supported natively, relying solely on socket/Agora STT.');
      return;
    }

    let recognition: any = null;
    let isActive = true;

    try {
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let interimText = '';
        let finalText = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const textChunk = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalText += textChunk;
          } else {
            interimText += textChunk;
          }
        }

        if (finalText.trim()) {
          console.log('🎤 Real-Time Local Speech Recognized:', finalText);
          upsertCaptionLine({
            speaker: 'You',
            text: finalText.trim(),
            source: 'stt',
            isFinal: true,
            timestamp: Date.now(),
          });

          // Relay to backend & peer
          if (consultationId) {
            api.post(`/transcription/${consultationId}/ingest`, {
              uid: consultantUid,
              text: finalText.trim(),
              isFinal: true,
              timestamp: Date.now(),
            }).catch(() => {});
          }
        }
      };

      recognition.onerror = (err: any) => {
        if (err.error !== 'no-speech') {
          console.warn('SpeechRecognition notice:', err.error);
        }
      };

      recognition.onend = () => {
        if (isActive && recognition) {
          try {
            recognition.start();
          } catch (e) {
            // ignore
          }
        }
      };

      recognition.start();
      console.log('🎙️ Local Speech Recognition activated for live transcript fallback.');
    } catch (e) {
      console.warn('Could not initialize SpeechRecognition fallback:', e);
    }

    return () => {
      isActive = false;
      if (recognition) {
        try {
          recognition.stop();
        } catch (e) {}
      }
    };
  }, [consultationId, enabled, consultantUid, upsertCaptionLine]);


  // ── Fetch transcript history on mount ──────────────────────────────
  useEffect(() => {
    if (!consultationId || !enabled) return;

    const fetchHistory = async () => {
      try {
        const res = await api.get(`/transcription/${consultationId}/history`);
        const history = res.data?.data || res.data || [];

        if (Array.isArray(history) && history.length > 0) {
          const historyLines: TranscriptLine[] = history
            .filter((item: any) => item.isFinal && item.text?.trim())
            .map((item: any) => ({
              speaker: Number(item.speakerUid) === consultantUid ? 'You' : 'Client',
              text: item.text,
              source: 'history' as const,
              timestamp: item.timestamp,
              speakerUid: Number(item.speakerUid),
              isFinal: true
            }));

          if (historyLines.length > 0) {
            setTranscripts((prev) => {
              const systemMsgs = prev.filter((t) => t.source === 'system');
              return [...systemMsgs, ...historyLines];
            });
          }
        }
      } catch (err) {
        console.warn('Failed to fetch transcript history:', err);
      }
    };

    fetchHistory();
  }, [consultationId, enabled]);

  // ── Send local speech to the other party via socket relay ──────────
  const sendSpeech = useCallback(
    (text: string) => {
      const socket = socketRef.current;
      if (!socket?.connected || !sessionId) {
        console.warn('📤 Cannot send speech: socket not connected or no sessionId');
        return;
      }
      socket.emit('send-speech', { sessionId, text });
      console.log('📤 Sent speech relay via socket:', text.substring(0, 50));
    },
    [sessionId],
  );

  // ── Add a transcript line from a local source ──────────────────────
  const addLocalTranscript = useCallback((speaker: string, text: string) => {
    setTranscripts((prev) => [
      ...prev,
      { speaker, text, source: 'local' },
    ]);
  }, []);

  return {
    transcripts,
    isConnected,
    sttActive,
    clientInterim,
    sendSpeech,
    addLocalTranscript,
  };
}
