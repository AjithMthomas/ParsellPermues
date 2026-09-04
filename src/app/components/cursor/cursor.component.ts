import { Component, inject, afterNextRender, OnDestroy } from "@angular/core";
import { CapabilitiesService } from "../../core/capabilities.service";

/**
 * Minimal luxury cursor: a hairline ring with a dot, growing softly over
 * interactive elements and showing a micro-context label (DISCOVER / VIEW /
 * READ) when the element declares [data-cursor].
 */
@Component({
  selector: "bdp-cursor",
  imports: [],
  template: `
    <div class="bdp-cursor" aria-hidden="true">
      <span class="bdp-cursor__dot"></span>
      <span class="bdp-cursor__ring"></span>
      <span class="bdp-cursor__label">DISCOVER</span>
    </div>
  `,
  styles: [
    `
      :host {
        display: none;
      }
      .bdp-cursor {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 3000;
        pointer-events: none;
        opacity: 0;
      }
      .bdp-cursor__dot {
        position: absolute;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: var(--color-champagne);
        transform: translate(-50%, -50%);
      }
      .bdp-cursor__ring {
        position: absolute;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        border: 1px solid rgb(48 36 29 / 0.35);
        transform: translate(-50%, -50%);
        transition: width 0.5s var(--ease-luxe), height 0.5s var(--ease-luxe),
          background-color 0.5s var(--ease-luxe), border-color 0.5s var(--ease-luxe);
      }
      .bdp-cursor__label {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 0.48rem;
        font-weight: 500;
        letter-spacing: 0.28em;
        text-transform: uppercase;
        color: var(--color-porcelain);
        opacity: 0;
        transition: opacity 0.4s var(--ease-luxe);
        width: max-content;
      }
      .bdp-cursor--active {
        opacity: 1;
      }
      .bdp-cursor--grow .bdp-cursor__ring {
        width: 78px;
        height: 78px;
        background: rgb(48 36 29 / 0.9);
        border-color: transparent;
      }
      .bdp-cursor--grow .bdp-cursor__dot {
        opacity: 0;
      }
      .bdp-cursor--grow .bdp-cursor__label {
        opacity: 1;
      }
    `,
  ],
})
export class CursorComponent implements OnDestroy {
  private readonly caps = inject(CapabilitiesService);
  private root?: HTMLElement;
  private raf = 0;
  private mx = -100;
  private my = -100;
  private cx = -100;
  private cy = -100;
  private current: Element | null = null;
  private kill: Array<() => void> = [];

  constructor() {
    afterNextRender(() => this.init());
  }

  private init(): void {
    if (!this.caps.fine || this.caps.rm) return;
    const host = document.querySelector<HTMLElement>("bdp-cursor");
    const root = host?.querySelector<HTMLElement>(".bdp-cursor");
    if (!root) return;
    this.root = root;
    document.documentElement.classList.add("bdp-cursor");
    root.classList.add("bdp-cursor--active");
    const dot = root.querySelector<HTMLElement>(".bdp-cursor__dot");
    const ring = root.querySelector<HTMLElement>(".bdp-cursor__ring");
    const label = root.querySelector<HTMLElement>(".bdp-cursor__label");
    if (!dot || !ring || !label) return;

    const move = (e: MouseEvent) => {
      this.mx = e.clientX;
      this.my = e.clientY;
      const t = e.target as Element | null;
      const hit = t && typeof t.closest === "function" ? t.closest("[data-cursor]") : null;
      if (hit !== this.current) {
        this.current = hit;
        root.classList.toggle("bdp-cursor--grow", !!hit);
        label.textContent = hit?.getAttribute("data-cursor") || "discover";
      }
    };
    const docLeave = () => root.classList.remove("bdp-cursor--active");
    const docEnter = () => root.classList.add("bdp-cursor--active");

    window.addEventListener("mousemove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", docLeave);
    document.documentElement.addEventListener("mouseenter", docEnter);
    this.kill.push(() => {
      window.removeEventListener("mousemove", move);
      document.documentElement.removeEventListener("mouseleave", docLeave);
      document.documentElement.removeEventListener("mouseenter", docEnter);
    });

    const loop = () => {
      this.cx += (this.mx - this.cx) * 0.18;
      this.cy += (this.my - this.cy) * 0.18;
      const dx = this.mx - this.cx;
      const dy = this.my - this.cy;
      root.style.transform = `translate3d(${this.cx}px, ${this.cy}px, 0)`;
      dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%,-50%)`;
      ring.style.transform = `translate(${dx * 0.22}px, ${dy * 0.22}px) translate(-50%,-50%)`;
      label.style.transform = `translate(${dx}px, ${dy}px) translate(-50%,-50%)`;
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.raf);
    this.kill.forEach((fn) => fn());
    document.documentElement.classList.remove("bdp-cursor");
  }
}
