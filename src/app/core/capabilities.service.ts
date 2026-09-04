import { Injectable, signal } from "@angular/core";

/**
 * Device & preference capabilities, read once and updated on change.
 * Drives choreography: desktop film vs mobile film, particles, pointer-light,
 * reduced-motion behaviour.
 */
export interface CapabilitySnapshot {
  reducedMotion: boolean;
  coarsePointer: boolean;
  finePointer: boolean;
  mobile: boolean;
  tablet: boolean;
  desktop: boolean;
  touch: boolean;
}

const read = (): CapabilitySnapshot => {
  const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const fine = window.matchMedia("(pointer: fine)").matches;
  const w = window.innerWidth;
  return {
    reducedMotion: rm,
    coarsePointer: coarse,
    finePointer: fine,
    touch: coarse || window.matchMedia("(hover: none)").matches,
    mobile: w < 768,
    tablet: w >= 768 && w < 1024,
    desktop: w >= 1024,
  };
};

@Injectable({ providedIn: "root" })
export class CapabilitiesService {
  readonly snap = signal<CapabilitySnapshot>(read());
  private media: MediaQueryList[] = [];

  constructor() {
    if (typeof window === "undefined") return;
    const queries = [
      "(prefers-reduced-motion: reduce)",
      "(pointer: coarse)",
      "(pointer: fine)",
      "(max-width: 767px)",
      "(min-width: 768px) and (max-width: 1023px)",
      "(min-width: 1024px)",
    ];
    this.media = queries.map((q) => window.matchMedia(q));
    this.media.forEach((m) =>
      m.addEventListener("change", () => this.snap.set(read())),
    );
  }

  get rm(): boolean {
    return this.snap().reducedMotion;
  }
  get coarse(): boolean {
    return this.snap().coarsePointer;
  }
  get fine(): boolean {
    return this.snap().finePointer;
  }
  get mobile(): boolean {
    return this.snap().mobile;
  }
  get desktop(): boolean {
    return this.snap().desktop;
  }
}
