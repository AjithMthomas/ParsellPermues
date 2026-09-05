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
  kind: "droplet" | "microbead" | "cloud";
}

const MAX_DROPS = 1600;
const LIQUID_GRAVITY = 180; // realistic gravity for liquid water drop parabolic arcs

/**
 * THE MIST — PARADISA.
 * Water droplets spraying simulation. Flacon floats in daylight.
 * Scrolling drives the atomizer: gold nozzle fires glistening liquid water droplets,
 * fine water micro-beads, and a soft ambient vapor cloud across the screen.
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
        scrub: 0.5,
        onUpdate: (st: ScrollTrigger) => {
          const p = st.progress;
          const delta = Math.abs(p - this.prevProgress);
          this.prevProgress = p;

          // Spray active only in middle phase (0.12 -> 0.52)
          this.spraying = p > 0.12 && p < 0.52;
          if (this.spraying) {
            this.power = Math.min(800, this.power + delta * 1100);
          } else if (p >= 0.68) {
            // Force immediate purge of lingering particles once departure phase completes
            this.power = 0;
            this.drops = [];
          }
          updateOrigin();
        },
      },
    });

    // 0.00 -> 0.15: Arrival
    tl.fromTo(
      bottle,
      { y: this.isMobile ? 50 : 80, scale: 0.94, opacity: 0 },
      { y: 0, scale: 1, opacity: 1, duration: 0.15, ease: "power2.out" },
      0,
    );
    tl.fromTo(shadow, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.15 }, 0.02);
    tl.fromTo(
      typeBlock,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.15, ease: "power2.out" },
      0.08,
    );
    tl.fromTo(glint, { opacity: 0, scale: 0.4 }, { opacity: 0.9, scale: 1, duration: 0.10 }, 0.14);
    tl.to(glint, { opacity: 0, duration: 0.08 }, 0.30);
    tl.to(veilEl, { opacity: 1, duration: 0.10 }, 0.16);
    tl.to(veilEl, { opacity: 0, duration: 0.14 }, 0.48);

    // 0.20 -> 0.48: Ambient full screen mist bloom
    tl.to(bright, { opacity: 1, duration: 0.28 }, 0.22);
    tl.to(typeBlock, { opacity: 0.35, y: -12, duration: 0.18 }, 0.45);

    // 0.50 -> 0.68: Complete Departure — bottle, type, spray canvas, and glow fade out to 0
    tl.to(bottle, { y: this.isMobile ? -40 : -60, opacity: 0, duration: 0.18, ease: "power2.in" }, 0.50);
    tl.to(shadow, { opacity: 0, duration: 0.14 }, 0.50);
    tl.to(typeBlock, { opacity: 0, y: -35, duration: 0.16 }, 0.50);
    tl.to(bright, { opacity: 0, duration: 0.18, ease: "power1.out" }, 0.50);
    tl.to(canvas, { opacity: 0, duration: 0.18, ease: "power1.out" }, 0.50);

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
    const dt = Math.min(0.05, (t - this.lastT) / 1000);
    this.lastT = t;

    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.cssW, this.cssH);

    // If progress is in departure buffer zone, skip rendering
    if (this.prevProgress >= 0.68) {
      this.drops = [];
      return;
    }

    // --- emit continuous water droplets & spray burst ---
    if (this.spraying) {
      const baseCount = this.isMobile ? 12 : 26;
      for (let i = 0; i < baseCount; i++) {
        const rand = Math.random();
        if (rand < 0.5) this.emit("droplet");
        else if (rand < 0.85) this.emit("microbead");
        else this.emit("cloud");
      }

      const burst = Math.min(80, Math.ceil(this.power * dt * 85));
      for (let i = 0; i < burst; i++) {
        this.emit(Math.random() < 0.6 ? "droplet" : "microbead", true);
      }
      this.power *= Math.pow(0.12, dt);

      this.drawVolumetricGlow();
    }

    // --- step & render water droplets ---
    const keep: Droplet[] = [];
    for (const d of this.drops) {
      d.life -= dt;
      if (d.life <= 0) continue;

      const ageRatio = 1 - d.life / d.max;
      d.wob += d.wobSpeed * dt;

      // Water droplet physics: air drag + natural gravity arc
      const drag = Math.pow(d.kind === "droplet" ? 0.94 : 0.88, dt * 60);
      d.vx *= drag;
      d.vy = d.vy * drag + LIQUID_GRAVITY * dt;

      // Slight wobble
      d.x += d.vx * dt + Math.sin(d.wob) * 12 * dt;
      d.y += d.vy * dt;

      // Opacity bell curve
      let fade = 1;
      if (ageRatio < 0.08) {
        fade = ageRatio / 0.08;
      } else {
        fade = Math.pow(1 - (ageRatio - 0.08) / 0.92, 1.5);
      }

      const a = Math.max(0, Math.min(1, fade)) * d.alpha;
      if (a <= 0.001) continue;

      if (d.kind === "droplet") {
        // --- REALISTIC TRANSLUCENT WATER DROPLET WITH SPECULAR LIGHT REFLECTION ---
        const speed = Math.hypot(d.vx, d.vy);
        const stretch = Math.min(1.8, 1 + speed * 0.0012);
        const angle = Math.atan2(d.vy, d.vx);

        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.rotate(angle);

        const rx = d.r * stretch;
        const ry = d.r / Math.sqrt(stretch);

        // 1. Soft water drop outer refraction shadow/glow
        const dropGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, rx * 1.6);
        dropGrad.addColorStop(0, `rgba(255, 255, 255, ${(a * 0.95).toFixed(3)})`);
        dropGrad.addColorStop(0.5, `rgba(235, 245, 255, ${(a * 0.65).toFixed(3)})`);
        dropGrad.addColorStop(0.85, `rgba(215, 230, 248, ${(a * 0.25).toFixed(3)})`);
        dropGrad.addColorStop(1, "rgba(215, 230, 248, 0)");

        ctx.fillStyle = dropGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, rx * 1.6, ry * 1.6, 0, 0, Math.PI * 2);
        ctx.fill();

        // 2. Liquid rim outline
        ctx.strokeStyle = `rgba(255, 255, 255, ${(a * 0.8).toFixed(3)})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();

        // 3. Crisp Specular Highlight Dot (Sunlight reflection on top-left of droplet)
        const hlX = -rx * 0.35;
        const hlY = -ry * 0.35;
        const hlR = Math.max(0.6, rx * 0.3);

        ctx.fillStyle = `rgba(255, 255, 255, ${(a * 0.98).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(hlX, hlY, hlR, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      } else if (d.kind === "microbead") {
        // --- FINE WATER SPRAY BEAD ---
        ctx.fillStyle = `rgba(255, 255, 255, ${(a * 0.90).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();

        // Glistening specular core for microbeads
        ctx.fillStyle = `rgba(255, 255, 255, ${(a * 0.95).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(d.x - d.r * 0.3, d.y - d.r * 0.3, Math.max(0.4, d.r * 0.35), 0, Math.PI * 2);
        ctx.fill();
      } else {
        // --- SOFT AMBIENT VAPOR FOG BEHIND THE WATER DROPLETS ---
        const cloudRadius = d.r * (1 + ageRatio * 6.5);
        const halo = 3.5 * cloudRadius;
        const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, halo);
        const tint = d.hue;

        g.addColorStop(0, `rgba(255, 255, 253, ${(a * 0.45).toFixed(3)})`);
        g.addColorStop(0.3, `rgba(${255 - tint * 8}, ${250 - tint * 14}, ${240 - tint * 22}, ${(a * 0.28).toFixed(3)})`);
        g.addColorStop(0.7, `rgba(248, 238, 214, ${(a * 0.10).toFixed(3)})`);
        g.addColorStop(1, "rgba(248, 238, 214, 0)");

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(d.x, d.y, halo, 0, Math.PI * 2);
        ctx.fill();
      }

      keep.push(d);
    }
    this.drops = keep;

    this.raf = requestAnimationFrame((nt) => this.loop(nt));
  };

  /** Draw ambient light glow behind the water spray. */
  private drawVolumetricGlow(): void {
    const ctx = this.sprayCtx;
    const { x, y } = this.origin;
    const strength = this.isMobile ? 0.30 : 0.48;

    const coreGrad = ctx.createRadialGradient(x, y, 0, x, y, 80);
    coreGrad.addColorStop(0, `rgba(255, 255, 255, ${(strength + 0.3).toFixed(3)})`);
    coreGrad.addColorStop(0.4, `rgba(252, 248, 236, ${(strength * 0.6).toFixed(3)})`);
    coreGrad.addColorStop(1, "rgba(252, 248, 236, 0)");

    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(x, y, 80, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Emit one water droplet or micro-bead with realistic ballistic cone velocity.
   */
  private emit(kind: "droplet" | "microbead" | "cloud" = "droplet", burst = false): void {
    if (this.drops.length >= MAX_DROPS) return;
    const { x, y } = this.origin;

    // Atomizer spray cone angle (-65° to +65°)
    const angle = (Math.random() - 0.5) * (burst ? 2.6 : 2.0);

    let speed = 0;
    let r = 0;
    let alpha = 0;
    let life = 0;

    if (kind === "droplet") {
      // Primary liquid water drops
      speed = (this.isMobile ? 300 : 480) + Math.random() * (this.isMobile ? 260 : 420) + (burst ? 200 : 0);
      r = 1.8 + Math.random() * (burst ? 3.2 : 2.2);
      alpha = 0.80 + Math.random() * 0.20;
      life = 1.2 + Math.random() * 1.4;
    } else if (kind === "microbead") {
      // Micro water spray beads
      speed = (this.isMobile ? 200 : 340) + Math.random() * (this.isMobile ? 220 : 340);
      r = 0.8 + Math.random() * 1.2;
      alpha = 0.70 + Math.random() * 0.30;
      life = 1.0 + Math.random() * 1.5;
    } else {
      // Background ambient vapor cloud
      speed = 100 + Math.random() * 180;
      r = 2.5 + Math.random() * 5.0;
      alpha = 0.35 + Math.random() * 0.40;
      life = 2.0 + Math.random() * 2.0;
    }

    this.drops.push({
      x: x + (Math.random() - 0.5) * 8,
      y: y + (Math.random() - 0.5) * 4,
      vx: Math.sin(angle) * speed,
      vy: -Math.cos(angle) * speed * 0.94,
      r,
      hue: Math.random() * 0.3,
      alpha,
      life,
      max: life,
      wob: Math.random() * Math.PI * 2,
      wobSpeed: 2.0 + Math.random() * 6.0,
      kind,
    });
  }
}


