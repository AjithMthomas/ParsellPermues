import { Injectable } from "@angular/core";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { CapabilitiesService } from "./capabilities.service";
import { AudioService } from "./audio.service";

gsap.registerPlugin(ScrollTrigger);

/**
 * Owns Lenis smooth scrolling, the GSAP ticker loop, ScrollTrigger updates
 * and animated in-page navigation. Initialised once, before first paint work.
 */
@Injectable({ providedIn: "root" })
export class ScrollService {
  private lenis?: Lenis;

  constructor(
    private caps: CapabilitiesService,
    private audio: AudioService
  ) {
    if (typeof window === "undefined") return;

    // Prevent browser from restoring scroll position on reload
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    // Smooth wheel scrolling is a luxury; under reduced-motion we keep native.
    if (this.caps.rm) return;

    const w = window as unknown as Record<string, unknown>;
    w["__stCount"] = () => ScrollTrigger.getAll().length;
    w["__stList"] = () =>
      ScrollTrigger.getAll().map((t: unknown) => {
        const s = t as ScrollTrigger;
        return {
          start: s.start,
          end: s.end,
          prog: +s.progress.toFixed(3),
          active: s.isActive,
        };
      });

    this.lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.92,
      touchMultiplier: 1.35,
      // native touch scrolling keeps momentum without interception
      syncTouch: false,
    });

    this.lenis.scrollTo(0, { immediate: true });
    window.addEventListener("beforeunload", () => {
      window.scrollTo(0, 0);
    });

    // Belt and braces: keep ScrollTrigger and AudioService in sync
    this.lenis.on("scroll", (e: { velocity?: number }) => {
      ScrollTrigger.update();
      this.audio.onScroll(e?.velocity ?? 1);
    });

    window.addEventListener(
      "scroll",
      () => {
        ScrollTrigger.update();
        this.audio.onScroll(1);
      },
      { passive: true }
    );

    gsap.ticker.add((time) => {
      this.lenis?.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  scrollToId(id: string, offset = 0): void {
    const el = document.getElementById(id);
    if (!el) return;
    this.scrollToEl(el, offset);
  }

  scrollToEl(el: HTMLElement, offset = 0): void {
    if (this.caps.rm || !this.lenis) {
      el.scrollIntoView({ behavior: "auto", block: "start" });
      return;
    }
    this.lenis.scrollTo(el, {
      offset,
      duration: 1.6,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
    });
  }

  scrollToTop(): void {
    if (this.lenis) this.lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0 });
  }

  stop(): void {
    this.lenis?.stop();
  }
  start(): void {
    this.lenis?.start();
  }

  refresh(): void {
    ScrollTrigger.refresh();
  }
}
