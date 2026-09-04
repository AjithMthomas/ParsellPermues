import {
  Component,
  ElementRef,
  inject,
  viewChild,
  afterNextRender,
} from "@angular/core";
import { gsap } from "gsap";
import { BotanicalComponent } from "../../../../art/botanical/botanical.component";
import { DustComponent } from "../../../../art/dust/dust.component";
import { FRAGRANCES } from "../../../../data/fragrances";
import { CapabilitiesService } from "../../../../core/capabilities.service";
import { ScrollService } from "../../../../core/scroll.service";

const NO1 = FRAGRANCES[0];

/**
 * SCENE 01 — THE ARRIVAL → SCENE 02 — THE AWAKENING → SCENE 03 — INSIDE THE GLASS
 * Editorial hero with massive vertical typography, a photographic plate,
 * and a floating bottle that lifts from the scene during scroll.
 */
@Component({
  selector: "bdp-act-hero",
  imports: [BotanicalComponent, DustComponent],
  templateUrl: "./act-hero.component.html",
  styleUrl: "./act-hero.component.css",
})
export class ActHeroComponent {
  protected no1 = NO1;

  private readonly caps = inject(CapabilitiesService);
  private readonly scroll = inject(ScrollService);

  protected scrollTo(e: Event, id: string): void {
    e.preventDefault();
    this.scroll.scrollToId(id);
  }
  private readonly el = inject(ElementRef);

  private readonly stageEl = viewChild<ElementRef<HTMLElement>>("stage");
  private readonly secEl = viewChild<ElementRef<HTMLElement>>("sec");

  private typeBlock!: HTMLElement;
  private plateNode!: HTMLElement;
  private bottleFloat!: HTMLElement;
  private vignette!: HTMLElement;
  private cueEl!: HTMLElement;
  private sweepEl!: HTMLElement;
  private washEl!: HTMLElement;
  private worldEl!: HTMLElement;
  private heroLines!: HTMLElement[];

  constructor() {
    afterNextRender(() => this.setup());
  }

  private setup(): void {
    const sec = this.secEl()?.nativeElement;
    const stage = this.stageEl()?.nativeElement;
    const host = this.el.nativeElement as HTMLElement;
    if (!sec || !stage) return;

    const q = (sel: string) => host.querySelector(sel) as HTMLElement;
    this.typeBlock = q(".hero__type");
    this.plateNode = q(".hero__plate");
    this.bottleFloat = q(".hero__bottle-float");
    this.vignette = q(".hero__vignette");
    this.cueEl = q(".hero__cue");
    this.sweepEl = q(".hero__sweep");
    this.washEl = q(".hero__wash");
    this.worldEl = q(".hero__world");
    this.heroLines = Array.from(
      host.querySelectorAll<HTMLElement>(".hero__line-inner"),
    );

    this.entrance(host);
    this.scrollFilm(sec, stage, host);
  }

  /** Entrance animation: lines reveal, plate fades in. The floating bottle
      stays hidden until the scroll film lifts it off the scene. */
  private entrance(host: HTMLElement): void {
    const rm = this.caps.rm;
    if (rm) {
      gsap.set([this.typeBlock, this.plateNode, this.vignette, this.cueEl], { opacity: 1 });
      gsap.set(this.bottleFloat, { opacity: 0 });
      gsap.set(this.heroLines, { yPercent: 0 });
      return;
    }
    const tl = gsap.timeline({ delay: 0.2, defaults: { ease: "power3.out" } });

    // staggered line reveal
    tl.fromTo(
      this.heroLines,
      { yPercent: 120, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1.4, stagger: 0.12, ease: "power4.out" },
    );
    // plate settles in from the right — afterwards it stays, always visible
    tl.fromTo(
      this.plateNode,
      { opacity: 0, xPercent: 6 },
      { opacity: 1, xPercent: 0, duration: 1.8, ease: "power3.out" },
      0.15,
    );
    // vignette scales up
    tl.fromTo(
      this.vignette,
      { opacity: 0, scale: 0.7 },
      { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" },
      0.5,
    );
    // side labels + cue
    tl.fromTo(
      [host.querySelector(".hero__side--l"), host.querySelector(".hero__side--r"), this.cueEl],
      { opacity: 0 },
      { opacity: 1, duration: 1.4, stagger: 0.15 },
      0.6,
    );
    void host;
  }

  /** Scroll film: type lifts → bottle lifts and floats → sweep → through the glass. */
  private scrollFilm(sec: HTMLElement, stage: HTMLElement, host: HTMLElement): void {
    if (this.caps.rm) return;
    const isMobile = this.caps.mobile;

    const tl = gsap.timeline({
      defaults: { ease: "power1.inOut" },
      scrollTrigger: {
        trigger: sec,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
      },
    });

    const type = this.typeBlock;
    const plate = this.plateNode;
    const bottle = this.bottleFloat;
    const vignette = this.vignette;

    // --- PHASE 1: type lifts, vignette shrinks (0.06 – 0.16) ---
    tl.to(type, { yPercent: -14, opacity: 0, ease: "power2.in", duration: 0.12 }, 0.06);
    tl.to(vignette, { scale: 0.3, opacity: 0, duration: 0.1, ease: "power2.in" }, 0.06);
    tl.to([host.querySelector(".hero__side--l"), host.querySelector(".hero__side--r"), this.cueEl], {
      opacity: 0,
      duration: 0.08,
    }, 0.06);

    // --- PHASE 2: the scene stays — only the bottle wakes and lifts.
    // The plate is the campaign photograph and remains fully visible;
    // a gentle push-in keeps the film alive without ever hiding the image.
    tl.to(plate, { scale: 1.06, duration: 0.55, ease: "power1.inOut" }, 0.12);
    tl.fromTo(bottle,
      { opacity: 0, y: 0, scale: 0.96 },
      { opacity: 1, y: isMobile ? -70 : -120, scale: isMobile ? 1.2 : 1.35, duration: 0.1, ease: "power2.out" },
      0.16,
    );

    // --- PHASE 3: light sweep across the floating bottle (0.24 – 0.44) ---
    tl.fromTo(
      this.sweepEl,
      { xPercent: -140, opacity: 0 },
      { xPercent: 90, opacity: 0.55, duration: 0.2, ease: "none" },
      0.24,
    );
    tl.to(this.sweepEl, { opacity: 0, duration: 0.05 }, 0.46);

    // --- PHASE 4: the bottle alone travels toward the camera (0.34 – 0.52) ---
    tl.to(bottle, {
      y: isMobile ? -150 : -230,
      x: isMobile ? 6 : -20,
      rotation: 0,
      scale: isMobile ? 2.1 : 2.6,
      duration: 0.2,
      ease: "power2.in",
    }, 0.34);

    // --- PHASE 5: it passes into the light — plate still visible behind ---
    tl.to(bottle, { opacity: 0, scale: isMobile ? 3.1 : 3.9, duration: 0.14, ease: "power1.in" }, 0.54);
    tl.to(plate, { scale: 1.14, duration: 0.3, ease: "power1.in" }, 0.6);

    void host;
  }
}
