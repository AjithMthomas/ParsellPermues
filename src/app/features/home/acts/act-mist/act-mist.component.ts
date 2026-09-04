import {
  Component,
  DestroyRef,
  inject,
  ElementRef,
  viewChild,
  afterNextRender,
} from "@angular/core";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ProductArtComponent } from "../../../../art/product-art/product-art.component";
import { DustComponent } from "../../../../art/dust/dust.component";
import { FRAGRANCES } from "../../../../data/fragrances";
import { CapabilitiesService } from "../../../../core/capabilities.service";

const NO1 = FRAGRANCES[0];

interface Droplet {
  x: number;
  y: number;
  vx: number; // css px / s
  vy: number;
  r: number; // radius (css px)
  hue: number; // 0 white … 1 champagne
  alpha: number;
  life: number; // seconds remaining
  max: number;
  wob: number;
  wobSpeed: number;
}

const MAX_DROPS = 560;
const GRAVITY = 26; // px/s² — fine mist barely falls

/**
 * SCENE V — THE MIST.
 * The flacon floats in daylight. Scrolling drives the atomiser: each scroll
 * movement fires a burst of fine droplets from the nozzle into an upward cone,
 * and the mist drifts, glistens and dissolves into the light — a real
 * perfume-spray feel, not a videogame particle effect.
 */
@Component({
  selector: "bdp-act-mist",
  imports: [ProductArtComponent, DustComponent],
  templateUrl: "./act-mist.component.html",
  styleUrl: "./act-mist.component.css",
})
export class ActMistComponent {
  protected no1 = NO1;

  private readonly caps = inject(CapabilitiesService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly el = inject(ElementRef);
  private readonly secEl = viewChild<ElementRef<HTMLElement>>("sec");
  private readonly canvasEl = viewChild<ElementRef<HTMLCanvasElement>>("spray");

  private sprayCtx!: CanvasRenderingContext2D;
  private drops: Droplet[] = [];
  private raf = 0;
  private lastT = 0;
  private power = 0; // scroll-fed spray energy
  private prevProgress = 0;
  private spraying = false;
  private origin = { x: 0, y: 0 };
  private cssW = 0;
  private cssH = 0;
  private dpr = 1;
  private isMobile = false;

  constructor() {
    afterNextRender(() => this.setup());
  }

  private setup(): void {
    const sec = this.secEl()?.nativeElement;
    const canvas = this.canvasEl()?.nativeElement;
    const host = this.el.nativeElement as HTMLElement;
    if (!sec || !canvas || this.caps.rm) return;

    this.isMobile = this.caps.mobile;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    this.sprayCtx = ctx;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    const q = (sel: string) => host.querySelector(sel) as HTMLElement;
    const bottle = q(".mist-bottle");
    const stage = q(".mist-stage");
    const shadow = q(".mist-shadow");
    const typeBlock = q(".mist-type");
    const bright = q(".mist-bright");
    const glint = q(".mist-glint");
    const veilEl = q(".mist-veil");
    if (!bottle || !typeBlock || !stage) return;

    const updateOrigin = () => {
      const b = bottle.getBoundingClientRect();
      const s = stage.getBoundingClientRect();
      // the nozzle sits at the top-centre of the flacon cutout
      this.origin = {
        x: b.left - s.left + b.width / 2,
        y: b.top - s.top + Math.max(2, b.height * 0.03),
      };
    };
    const resize = () => {
      const r = stage.getBoundingClientRect();
      this.cssW = r.width;
      this.cssH = r.height;
      canvas.width = Math.max(1, Math.round(r.width * this.dpr));
      canvas.height = Math.max(1, Math.round(r.height * this.dpr));
      canvas.style.width = `${r.width}px`;
      canvas.style.height = `${r.height}px`;
      updateOrigin();
    };
    resize();
    window.addEventListener("resize", resize);

    // ---------- scroll film ----------
    const tl = gsap.timeline({
      defaults: { ease: "power1.inOut" },
      scrollTrigger: {
        trigger: sec,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        onUpdate: (st: ScrollTrigger) => {
          const p = st.progress;
          const delta = Math.abs(p - this.prevProgress);
          this.prevProgress = p;
          this.spraying = p > 0.14 && p < 0.62;
          // each scroll movement re-presses the atomiser
          if (this.spraying) this.power = Math.min(240, this.power + delta * 340);
          updateOrigin();
        },
      },
    });

    // arrival
    tl.fromTo(
      bottle,
      { y: this.isMobile ? 60 : 90, scale: 0.94, opacity: 0 },
      { y: 0, scale: 1, opacity: 1, duration: 0.16, ease: "power2.out" },
      0,
    );
    tl.fromTo(shadow, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.16 }, 0.02);
    tl.fromTo(
      typeBlock,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.16, ease: "power2.out" },
      0.1,
    );
    tl.fromTo(glint, { opacity: 0, scale: 0.4 }, { opacity: 0.9, scale: 1, duration: 0.12 }, 0.16);
    tl.to(glint, { opacity: 0, duration: 0.08 }, 0.34);
    tl.to(veilEl, { opacity: 1, duration: 0.06 }, 0.2);
    tl.to(veilEl, { opacity: 0, duration: 0.06 }, 0.5);

    // the room brightens
    tl.to(bright, { opacity: 1, duration: 0.3 }, 0.38);
    tl.to(typeBlock, { opacity: 0.35, y: -14, duration: 0.2 }, 0.62);

    // the fragrance leaves
    tl.to(bottle, { y: this.isMobile ? 130 : 190, opacity: 0, duration: 0.22, ease: "power2.in" }, 0.76);
    tl.to(shadow, { opacity: 0, duration: 0.18 }, 0.78);
    tl.to(bright, { opacity: 1, duration: 0.2 }, 0.76);

    // ---------- particle loop ----------
    this.raf = requestAnimationFrame((t) => this.loop(t));

    this.destroyRef.onDestroy(() => {
      cancelAnimationFrame(this.raf);
      window.removeEventListener("resize", resize);
      void tl;
    });
  }

  private loop = (t: number): void => {
    const ctx = this.sprayCtx;
    if (!ctx) return;
    if (!this.lastT) this.lastT = t;
    const dt = Math.min(0.05, (t - this.lastT) / 1000); // seconds, clamp tab-switch
    this.lastT = t;

    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.cssW, this.cssH);

    // --- emit: continuous soft mist + scroll-driven press bursts ---
    if (this.spraying) {
      const base = this.isMobile ? 2 : 4;
      for (let i = 0; i < base; i++) this.emit();
      // burst energy: 60 fps × dt ≈ frames
      const burst = Math.min(18, Math.ceil(this.power * dt * 22));
      for (let i = 0; i < burst; i++) this.emit(true);
      this.power *= Math.pow(0.2, dt); // fast decay when scrolling stops
      this.drawPlume();
    }

    // --- step droplets ---
    const keep: Droplet[] = [];
    for (const d of this.drops) {
      d.life -= dt;
      if (d.life <= 0) continue;

      d.wob += d.wobSpeed * dt;
      const drag = Math.pow(0.86, dt * 60);
      d.vx *= drag;
      d.vy = d.vy * drag + GRAVITY * dt;

      // fine mist drifts sideways as it travels
      d.x += (d.vx + Math.sin(d.wob) * 14) * dt;
      d.y += d.vy * dt;

      const fade = Math.min(1, d.life / (d.max * 0.55));
      const a = Math.max(0, Math.min(1, fade)) * d.alpha;
      const r = Math.max(0.15, d.r * (0.35 + 0.65 * Math.min(1, d.life / d.max)));

      // visible droplet on ivory: soft champagne halo + bright core
      const halo = 2.4 * r;
      const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, halo);
      const tint = d.hue;
      g.addColorStop(0, `rgba(255, 252, 242, ${a.toFixed(3)})`);
      g.addColorStop(0.45, `rgba(${255 - tint * 26}, ${248 - tint * 34}, ${224 - tint * 40}, ${(a * 0.85).toFixed(3)})`);
      g.addColorStop(1, "rgba(200, 178, 132, 0)");
      ctx.globalAlpha = 1;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(d.x, d.y, halo, 0, Math.PI * 2);
      ctx.fill();

      keep.push(d);
    }
    this.drops = keep;

    this.raf = requestAnimationFrame((nt) => this.loop(nt));
  };

  /** Draw the visible mist cone that leaves the nozzle while spraying. */
  private drawPlume(): void {
    const ctx = this.sprayCtx;
    const { x, y } = this.origin;
    const strength = this.isMobile ? 0.2 : 0.3;
    const cone = Math.min(150, 60 + this.power * 0.55);

    const g = ctx.createRadialGradient(x, y - cone * 0.2, 4, x, y - cone, cone * 0.9);
    g.addColorStop(0, `rgba(255, 252, 240, ${strength.toFixed(3)})`);
    g.addColorStop(0.6, `rgba(250, 244, 224, ${(strength * 0.5).toFixed(3)})`);
    g.addColorStop(1, "rgba(250, 244, 224, 0)");
    ctx.globalAlpha = 1;
    ctx.fillStyle = g;
    // an upward fan from the nozzle
    ctx.beginPath();
    ctx.moveTo(x - cone * 0.42, y - cone * 0.15);
    ctx.quadraticCurveTo(x, y - cone, x + cone * 0.42, y - cone * 0.15);
    ctx.closePath();
    ctx.fill();

    // bright nozzle glow
    const n = ctx.createRadialGradient(x, y, 0, x, y, 26);
    n.addColorStop(0, `rgba(255, 254, 248, ${(strength + 0.15).toFixed(3)})`);
    n.addColorStop(1, "rgba(255, 254, 248, 0)");
    ctx.fillStyle = n;
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Emit one droplet. Burst droplets are heavier & brighter, the ambient ones
   * are finer. The cone is narrow and travels upward, then softens into mist.
   */
  private emit(burst = false): void {
    if (this.drops.length >= MAX_DROPS) return;
    const { x, y } = this.origin;
    // narrow upward cone (± ~18°) with a whisper of outward lean
    const spread = (Math.random() - 0.5) * (burst ? 0.62 : 0.5);
    const tilt = this.isMobile ? 0.06 : 0.1; // slightly toward the camera side
    const speed =
      (this.isMobile ? 60 : 90) + Math.random() * (this.isMobile ? 60 : 110) + (burst ? 46 : 0);

    this.drops.push({
      x: x + (Math.random() - 0.5) * 4,
      y: y + (Math.random() - 0.5) * 3,
      vx: Math.sin(spread) * speed + Math.sin(tilt) * speed,
      vy: -Math.cos(spread - tilt) * speed,
      r: burst
        ? 1.1 + Math.random() * 2.2
        : 0.5 + Math.random() * 1.5,
      hue: burst ? Math.random() * 0.5 : Math.random(),
      alpha: burst ? 0.5 + Math.random() * 0.4 : 0.3 + Math.random() * 0.35,
      life: (burst ? 1.1 : 0.8) + Math.random() * 0.8,
      max: 1.6,
      wob: Math.random() * Math.PI * 2,
      wobSpeed: 2 + Math.random() * 5,
    });
  }
}
