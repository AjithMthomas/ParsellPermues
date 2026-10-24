import { Injectable } from "@angular/core";

/**
 * AudioService — disabled automatic playback on scroll per user preference.
 */
@Injectable({ providedIn: "root" })
export class AudioService {
  private audioEl: HTMLAudioElement | null = null;
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  constructor() {
    // No automatic audio triggers on scroll
  }

  playAudio(): void {
    // Disabled automatic ambient audio
  }

  stopAudio(): void {
    if (this.audioEl) {
      this.audioEl.pause();
    }
    if (this.audioCtx && this.audioCtx.state !== "closed") {
      this.audioCtx.suspend().catch(() => {});
    }
  }

  onScroll(_velocity = 1): void {
    // No-op: user requested no audio while scrolling site
  }
}
