import {
  Component,
  ElementRef,
  input,
  afterNextRender,
  viewChild,
  inject,
} from "@angular/core";
import { CapabilitiesService } from "../../core/capabilities.service";

interface P {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  a: number;
  tw: number;
  ph: number;
  c: number;
}

/**
 * Soft floating dust / light motes. Canvas, DPR-capped, low particle counts,
 * runs only while the element is near the viewport. Disabled entirely under
 * reduced motion (a static pre-render is painted instead).
 */
@Component({
  selector: "bdp-dust",
  imports: [],
  template: `<canvas #cv class="dust" aria-hidden="true"></canvas>`,
  styles: `
    :host {
      position: absolute;
      inset: 0;
      pointer-events: none;
      display: block;
      overflow: hidden;
    }
    canvas.dust {
      width: 100%;
      height: 100%;
      display: block;
      opacity: 0.75;
    }
  `,
})
export class DustComponent {
  readonly density = input(36); // desktop count; halved on mobile automatically
  readonly palette = input([
    "184, 148, 82",
    "252, 251, 248",
    "216, 207, 192",
  ]);
  readonly lift = input(0.06);

  private readonly cv = viewChild<ElementRef<HTMLCanvasElement>>("cv");
  private readonly caps = inject(CapabilitiesService);
  private raf = 0;
  private running = false;
  private ps: P[] = [];
  private ctx?: CanvasRenderingContext2D | null;
  private w = 0;
  private h = 0;

  constructor() {
    afterNextRender(() => this.init());
  }

  private init(): void {
    const canvas = this.cv()?.nativeElement;
    if (!canvas) return;
    const host = canvas.parentElement as HTMLElement;
    if (!host) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    this.ctx = ctx;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const rect = host.getBoundingClientRect();
      this.w = Math.max(1, Math.round(rect.width));
      this.h = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(this.w * dpr);
      canvas.height = Math.round(this.h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.seed();
    };
    resize();
    window.addEventListener("resize", resize);

    if (this.caps.rm) {
      this.drawStatic();
      return;
    }

    // start/stop with visibility
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) this.start();
          else this.stop();
        });
      },
      { rootMargin: "120px" },
    );
    io.observe(host);
  }

  private seed(): void {
    const n = Math.max(
      6,
      Math.round(
        this.density() * (this.caps.desktop ? 1 : this.caps.mobile ? 0.45 : 0.7),
      ),
    );
    this.ps = Array.from({ length: n }, () => this.makeP());
  }

  private makeP(): P {
    const col = this.palette();
    return {
      x: Math.random() * this.w,
      y: Math.random() * this.h,
      r: 0.35 + Math.random() * 1.15,
      vx: (Math.random() - 0.5) * 0.08,
      vy: -(this.lift() * (0.5 + Math.random())),
      a: 0.08 + Math.random() * 0.5,
      tw: 0.35 + Math.random() * 0.6,
      ph: Math.random() * Math.PI * 2,
      c: Math.floor(Math.random() * col.length),
    };
  }

  private draw(ts: number): void {
    const ctx = this.ctx;
    const col = this.palette();
    if (!ctx) return;
    ctx.clearRect(0, 0, this.w, this.h);
    for (const p of this.ps) {
      p.x += p.vx + Math.sin(ts * 0.0004 + p.ph) * 0.04;
      p.y += p.vy;
      if (p.y < -4) {
        p.y = this.h + 4;
        p.x = Math.random() * this.w;
      }
      if (p.x < -4) p.x = this.w + 4;
      if (p.x > this.w + 4) p.x = -4;
      const alpha =
        p.a * (0.45 + 0.55 * Math.sin(ts * 0.001 * p.tw + p.ph * 3));
      ctx.beginPath();
      ctx.fillStyle = `rgba(${col[p.c]}, ${Math.max(0, alpha)})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private loop = (ts: number) => {
    if (!this.running) return;
    this.draw(ts);
    this.raf = requestAnimationFrame(this.loop);
  };

  private start(): void {
    if (this.running || this.caps.rm) return;
    this.running = true;
    this.raf = requestAnimationFrame(this.loop);
  }

  private stop(): void {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  /** reduced motion: one static faint field, no animation */
  private drawStatic(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const col = this.palette();
    for (const p of this.ps) {
      ctx.beginPath();
      ctx.fillStyle = `rgba(${col[p.c]}, ${p.a * 0.7})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
