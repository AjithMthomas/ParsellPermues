import { Injectable, inject, signal } from "@angular/core";
import { gsap } from "gsap";
import { Fragrance } from "../data/fragrances";
import { CapabilitiesService } from "../core/capabilities.service";

export interface BagToast {
  id: number;
  title: string;
  meta: string;
}

/**
 * BAG FEEDBACK — the moment a creation is added.
 *
 * Three registers, in order of importance for comprehension:
 *  1. a small plate of the bottle travels to the bag in the navigation,
 *  2. the bag badge pulses gold as it takes the item,
 *  3. a considered toast names what was added and offers "View bag".
 *
 * Under reduced motion the flight is skipped — the toast and badge pulse
 * still confirm the action without any travel.
 */
@Injectable({ providedIn: "root" })
export class BagFeedbackService {
  readonly toast = signal<BagToast | null>(null);

  private readonly caps = inject(CapabilitiesService);
  private timer?: ReturnType<typeof setTimeout>;
  private seq = 0;

  /** Confirm one added creation. `source` is the element the item should fly from. */
  added(f: Fragrance, volume: number, source?: HTMLElement | null): void {
    const size = volume === 8 ? "8 ml Combo (3 pcs)" : `${volume} ml`;
    this.showToast(`${f.code} ${f.name}`, `${size} — added to your bag`);

    if (this.caps.rm) {
      this.pulseBag();
      return;
    }
    this.fly(source, this.pickImage(source));
  }

  dismiss(): void {
    clearTimeout(this.timer);
    this.toast.set(null);
  }

  private showToast(title: string, meta: string): void {
    this.seq += 1;
    this.toast.set({ id: this.seq, title, meta });
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.toast.set(null), 4000);
  }

  private pickImage(source?: HTMLElement | null): HTMLImageElement | null {
    if (!source) return null;
    const img = source.matches("img")
      ? (source as HTMLImageElement)
      : source.querySelector<HTMLImageElement>("img");
    return img ?? null;
  }

  private bagTarget(): HTMLElement | null {
    return document.querySelector<HTMLElement>("[data-bag-target]");
  }

  private pulseBag(): void {
    const target = this.bagTarget();
    if (!target) return;
    target.classList.remove("is-caught");
    // restart the CSS animation even on rapid repeated adds
    void target.offsetWidth;
    target.classList.add("is-caught");
    setTimeout(() => target.classList.remove("is-caught"), 950);
  }

  /** A rounded plate of the bottle arcs from the product into the bag. */
  private fly(source?: HTMLElement | null, img?: HTMLImageElement | null): void {
    const target = this.bagTarget();
    if (!source || !target || typeof document === "undefined") {
      this.pulseBag();
      return;
    }

    const from = source.getBoundingClientRect();
    const to = target.getBoundingClientRect();
    if (from.width < 8 || to.width < 8) {
      this.pulseBag();
      return;
    }

    const size = Math.round(Math.min(Math.max(from.width * 0.2, 54), 116));
    const ghost = document.createElement("div");
    ghost.className = "bdp-fly";
    ghost.setAttribute("aria-hidden", "true");
    ghost.style.width = `${size}px`;
    ghost.style.height = `${size}px`;
    const url = img?.currentSrc || img?.src;
    if (url) ghost.style.backgroundImage = `url("${url}")`;

    const sx = from.left + from.width / 2 - size / 2;
    const sy = from.top + from.height / 2 - size / 2;
    const ex = to.left + to.width / 2 - size / 2;
    const ey = to.top + to.height / 2 - size / 2;

    ghost.style.left = `${sx}px`;
    ghost.style.top = `${sy}px`;
    document.body.appendChild(ghost);

    // an arc: rise out of the product, travel, then drop into the bag
    const lift = Math.min(Math.max(window.innerHeight * 0.16, 80), 220);
    const tl = gsap.timeline({
      onComplete: () => {
        ghost.remove();
        this.pulseBag();
      },
    });

    tl.to(ghost, { scale: 1.05, duration: 0.18, ease: "power1.out" })
      .to(ghost, { left: ex, duration: 0.86, ease: "sine.inOut" }, 0.1)
      .to(ghost, { top: sy - lift, duration: 0.34, ease: "power2.out" }, 0.1)
      .to(ghost, { top: ey, duration: 0.52, ease: "power2.in" }, 0.44)
      .to(ghost, { scale: 0.12, opacity: 0.25, duration: 0.44, ease: "power2.in" }, 0.44);
  }
}
