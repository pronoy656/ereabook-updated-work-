"use client";

class AudioManager {
  private ringtone: HTMLAudioElement | null = null;
  private chime: HTMLAudioElement | null = null;
  private isUnlocked: boolean = false;
  private audioCtx: AudioContext | null = null;
  private fallbackRingtoneInterval: any = null;

  constructor() {
    if (typeof window !== "undefined") {
      try {
        this.ringtone = new Audio("/sounds/incoming-call.mp3");
        this.ringtone.loop = true;
        this.ringtone.preload = "auto";

        this.chime = new Audio("/sounds/notification-chime.mp3");
        this.chime.preload = "auto";
      } catch (err) {
        console.warn("HTML5 Audio initialization note:", err);
      }

      const unlock = () => {
        if (this.isUnlocked) return;
        this.unlockAudio();
        window.removeEventListener("click", unlock);
        window.removeEventListener("keydown", unlock);
        window.removeEventListener("touchstart", unlock);
      };

      window.addEventListener("click", unlock, { passive: true });
      window.addEventListener("keydown", unlock, { passive: true });
      window.addEventListener("touchstart", unlock, { passive: true });
    }
  }

  public unlockAudio() {
    if (this.isUnlocked) return;

    // Try unlocking HTML5 Audio
    if (this.ringtone) {
      this.ringtone
        .play()
        .then(() => {
          this.ringtone?.pause();
          if (this.ringtone) this.ringtone.currentTime = 0;
          this.isUnlocked = true;
        })
        .catch(() => {});
    }

    // Try unlocking Web Audio API Context
    try {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        if (!this.audioCtx) {
          this.audioCtx = new AudioContextClass();
        }
        if (this.audioCtx.state === "suspended") {
          this.audioCtx.resume();
        }
        this.isUnlocked = true;
      }
    } catch {}
  }

  public playRingtone() {
    if (typeof window === "undefined") return;
    this.unlockAudio();

    if (this.ringtone) {
      this.ringtone.currentTime = 0;
      this.ringtone.play().catch((err) => {
        console.warn("Ringtone autoplay prevented, using Web Audio fallback:", err);
        this.playFallbackRingtone();
      });
    } else {
      this.playFallbackRingtone();
    }
  }

  public stopRingtone() {
    if (typeof window === "undefined") return;

    if (this.ringtone) {
      try {
        this.ringtone.pause();
        this.ringtone.currentTime = 0;
      } catch {}
    }

    this.stopFallbackRingtone();
  }

  public playNotificationChime() {
    if (typeof window === "undefined") return;
    this.unlockAudio();

    if (this.chime) {
      this.chime.currentTime = 0;
      this.chime.play().catch((err) => {
        console.warn("Chime autoplay prevented, using Web Audio fallback:", err);
        this.playFallbackChime();
      });
    } else {
      this.playFallbackChime();
    }
  }

  // --- Web Audio API Fallbacks ---
  private getAudioContext(): AudioContext | null {
    try {
      if (!this.audioCtx) {
        const AudioContextClass =
          window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }
      return this.audioCtx;
    } catch {
      return null;
    }
  }

  private playFallbackChime() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const playTone = (freq: number, delay: number, dur: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + dur);
    };

    playTone(1318.5, 0, 0.35); // E6
    playTone(1975.5, 0.12, 0.5); // B6
  }

  private playFallbackRingtone() {
    this.stopFallbackRingtone();
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const ringOnce = () => {
      if (!this.audioCtx) return;
      const notes = [
        { f: 880, d: 0.2, t: 0 },
        { f: 1108.7, d: 0.2, t: 0.22 },
        { f: 1318.5, d: 0.2, t: 0.44 },
        { f: 1760, d: 0.5, t: 0.66 },
      ];

      notes.forEach(({ f, d, t }) => {
        const osc = this.audioCtx!.createOscillator();
        const gain = this.audioCtx!.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, this.audioCtx!.currentTime + t);

        gain.gain.setValueAtTime(0, this.audioCtx!.currentTime + t);
        gain.gain.linearRampToValueAtTime(0.15, this.audioCtx!.currentTime + t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx!.currentTime + t + d);

        osc.connect(gain);
        gain.connect(this.audioCtx!.destination);

        osc.start(this.audioCtx!.currentTime + t);
        osc.stop(this.audioCtx!.currentTime + t + d);
      });
    };

    ringOnce();
    this.fallbackRingtoneInterval = setInterval(ringOnce, 2500);
  }

  private stopFallbackRingtone() {
    if (this.fallbackRingtoneInterval) {
      clearInterval(this.fallbackRingtoneInterval);
      this.fallbackRingtoneInterval = null;
    }
  }
}

export const audioManager = new AudioManager();
