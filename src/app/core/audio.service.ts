import { Injectable, signal } from "@angular/core";

/**
 * AudioService uses the Web Audio API to procedurally synthesize a warm, luxury
 * ambient soundscape (chime & pad tones). It activates softly when the user scrolls
 * for the first time and decays smoothly when scrolling stops.
 */
@Injectable({ providedIn: "root" })
export class AudioService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private lfo: OscillatorNode | null = null;

  private isUnlocked = false;
  private scrollTimer: any = null;

  // Signal for UI toggle state
  readonly isMuted = signal<boolean>(false);
  readonly isPlaying = signal<boolean>(false);

  constructor() {
    if (typeof window === "undefined") return;
    this.setupUnlockListeners();
  }

  private setupUnlockListeners(): void {
    const unlock = () => {
      if (this.isUnlocked) return;
      this.initAudioContext();
      window.removeEventListener("scroll", unlock);
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("touchstart", unlock);
    };

    window.addEventListener("scroll", unlock, { passive: true, once: true });
    window.addEventListener("pointerdown", unlock, { passive: true, once: true });
    window.addEventListener("touchstart", unlock, { passive: true, once: true });
  }

  private initAudioContext(): void {
    if (this.ctx) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      this.ctx = new AudioCtx();
      this.isUnlocked = true;

      // Master Gain for volume control & fade effects
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);

      // Warm lowpass filter to give a deep, velvety, luxury sound
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = "lowpass";
      this.filter.frequency.setValueAtTime(450, this.ctx.currentTime);
      this.filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

      this.filter.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      // Create rich luxury chord harmonic oscillators:
      // A2 (110Hz), E3 (164.81Hz), C#4 (277.18Hz), E5 shimmer (659.25Hz)
      const frequencies = [110, 164.81, 277.18, 659.25];
      const types: OscillatorType[] = ["sine", "sine", "triangle", "sine"];

      frequencies.forEach((freq, idx) => {
        if (!this.ctx || !this.filter) return;

        const osc = this.ctx.createOscillator();
        osc.type = types[idx];
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        const oscGain = this.ctx.createGain();
        // Give higher shimmer lower volume for delicacy
        const gainVal = idx === 3 ? 0.08 : idx === 2 ? 0.12 : 0.2;
        oscGain.gain.setValueAtTime(gainVal, this.ctx.currentTime);

        osc.connect(oscGain);
        oscGain.connect(this.filter);
        osc.start();
        this.oscillators.push(osc);
      });

      // LFO for subtle luxury warmth movement
      this.lfo = this.ctx.createOscillator();
      this.lfo.frequency.setValueAtTime(0.2, this.ctx.currentTime); // slow breathing
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(80, this.ctx.currentTime);
      this.lfo.connect(lfoGain);
      lfoGain.connect(this.filter.frequency);
      this.lfo.start();
    } catch {
      // Graceful fallback if Web Audio API fails
    }
  }

  /**
   * Triggered on user scroll events. Swells the sound softly.
   */
  onScroll(velocity = 1): void {
    if (this.isMuted()) return;

    if (!this.isUnlocked) {
      this.initAudioContext();
    }

    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }

    const now = this.ctx.currentTime;
    const targetVolume = Math.min(0.18, 0.08 + Math.abs(velocity) * 0.04);

    // Smooth gain ramp-up on scroll
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setTargetAtTime(targetVolume, now, 0.12);

    // Open lowpass filter slightly with scroll speed for shimmer
    if (this.filter) {
      const targetFreq = Math.min(950, 450 + Math.abs(velocity) * 150);
      this.filter.frequency.setTargetAtTime(targetFreq, now, 0.15);
    }

    this.isPlaying.set(true);

    // Reset decay timer: soft decay after scroll pauses
    clearTimeout(this.scrollTimer);
    this.scrollTimer = setTimeout(() => {
      this.decayAudio();
    }, 800);
  }

  private decayAudio(): void {
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    // Fade out softly when scroll stops
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setTargetAtTime(0.001, now, 0.4);

    if (this.filter) {
      this.filter.frequency.setTargetAtTime(400, now, 0.5);
    }

    setTimeout(() => {
      if (this.masterGain && this.masterGain.gain.value < 0.01) {
        this.isPlaying.set(false);
      }
    }, 900);
  }

  /**
   * Toggle mute/unmute state from UI button
   */
  toggleMute(): void {
    const nextMute = !this.isMuted();
    this.isMuted.set(nextMute);

    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    if (nextMute) {
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setTargetAtTime(0, now, 0.05);
      this.isPlaying.set(false);
    } else {
      if (this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
    }
  }
}
