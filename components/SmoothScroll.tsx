"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/** Soft inertial scrolling on pointer devices; native scrolling for touch and reduced motion. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, prevent: (node) => !!node.closest?.(".drawer, .stage, .mobile-menu") });
    let id = 0;
    const raf = (t: number) => {
      lenis.raf(t);
      id = requestAnimationFrame(raf);
    };
    id = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, []);
  return null;
}
