import { Injectable } from "@angular/core";

/**
 * AudioService drives calm luxury background music.
 * Immediately starts playing upon the first scroll, touch, or click anywhere on the site.
 */
@Injectable({ providedIn: "root" })
export class AudioService {
  private audioEl: HTMLAudioElement | null = null;
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isUnlocked = false;

  constructor() {
    if (typeof window === "undefined") return;
    this.setupListeners();
  }

  private setupListeners(): void {
    const unlockAndPlay = () => {
      this.playAudio();
    };

    // Attach unlock listeners across all common browser interaction events
    const events = ["pointerdown", "touchstart", "click", "keydown", "scroll", "wheel"];
    events.forEach((evt) => {
      window.addEventListener(evt, unlockAndPlay, { passive: true });
    });
  }

  playAudio(): void {
    // 1. HTML5 Audio File (/assets/audio/luxury-ambient.wav)
    if (!this.audioEl) {
      try {
        this.audioEl = new Audio("/assets/audio/luxury-ambient.wav");
        this.audioEl.loop = true;
        this.audioEl.volume = 0.35;
      } catch {
        // Fallback handled
      }
    }

    if (this.audioEl && this.audioEl.paused) {
      this.audioEl.play().then(() => {
        this.isUnlocked = true;
      }).catch(() => {
        // Retry web audio synth if file playback is deferred by browser
        this.initWebAudio();
      });
    }

    // 2. Web Audio API synthesized calm luxury soundscape
    if (!this.audioCtx) {
      this.initWebAudio();
    } else if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume().catch(() => {});
    }
  }

  private initWebAudio(): void {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      this.audioCtx = new AudioCtx();
      this.audioCtx.resume().catch(() => {});

      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(0.25, this.audioCtx.currentTime);

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(360, this.audioCtx.currentTime);

      filter.connect(this.masterGain);
      this.masterGain.connect(this.audioCtx.destination);

      // Warm Dbmaj7 luxury chord (Db3 138.59Hz, F3 174.61Hz, Ab3 207.65Hz, Db4 277.18Hz)
      const freqs = [138.59, 174.61, 207.65, 277.18];
      freqs.forEach((f, idx) => {
        if (!this.audioCtx || !this.masterGain) return;
        const osc = this.audioCtx.createOscillator();
        osc.type = idx % 2 === 0 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(f, this.audioCtx.currentTime);

        const g = this.audioCtx.createGain();
        g.gain.setValueAtTime(0.12, this.audioCtx.currentTime);

        osc.connect(g);
        g.connect(filter);
        osc.start(0);
      });
    } catch {
      // Graceful fallback
    }
  }

  onScroll(velocity = 1): void {
    this.playAudio();
  }
}
