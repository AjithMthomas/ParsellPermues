import {
  Component,
  ElementRef,
  inject,
  viewChild,
  afterNextRender,
} from "@angular/core";
import { gsap } from "gsap";
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
  imports: [],
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

  /** Scroll film:
   * 1. Hero scroll start: bottle pops up out of pedestal bottle (Screenshot 2 style).
   *    Hero typography, side labels, vignette, and photo plate STAY 100% visible (Screenshot 1 look).
   * 2. Continuous scroll to Section 2 ("The olfactory journey"): single bottle moves smoothly
   *    down into the right-side empty space (Screenshot 3 style).
   * 3. Stops right there in Section 2's right-side center (NO double bottle!).
   * 4. Fades out smoothly only when user scrolls past Section 2 header into note family cards.
   */
  private scrollFilm(sec: HTMLElement, stage: HTMLElement, host: HTMLElement): void {
    if (this.caps.rm) return;
    const isMobile = this.caps.mobile;

    const bottle = this.bottleFloat;
    const notesSec = document.querySelector("bdp-act-notes") as HTMLElement;

    const tl = gsap.timeline({
      defaults: { ease: "power1.inOut" },
      scrollTrigger: {
        trigger: sec,
        endTrigger: notesSec || sec,
        start: "top top",
        end: "bottom top",
        scrub: 0.5,
      },
    });

    // --- PHASE 1: POP-UP IN HERO (Progress 0.0 -> 0.25) ---
    // Hero typography & background stay completely untouched.
    // The single bottle pops up out of the pedestal bottle.
    tl.fromTo(
      bottle,
      { opacity: 0, y: 0, scale: 0.94 },
      {
        opacity: 1,
        y: isMobile ? -40 : -70,
        scale: isMobile ? 1.08 : 1.18,
        duration: 0.25,
        ease: "power2.out",
      },
      0,
    );

    // Light sweep across the popped-up bottle
    if (this.sweepEl) {
      tl.fromTo(
        this.sweepEl,
        { xPercent: -140, opacity: 0 },
        { xPercent: 90, opacity: 0.45, duration: 0.2, ease: "none" },
        0.05,
      );
      tl.to(this.sweepEl, { opacity: 0, duration: 0.05 }, 0.25);
    }

    // --- PHASE 2: MOVE TO SECTION 2 RIGHT SIDE CENTER & STOP THERE (Progress 0.25 -> 0.65) ---
    // Floating bottle glides smoothly down and stops right in the center of Section 2 header space!
    tl.to(
      bottle,
      {
        y: isMobile ? 20 : 10,
        x: 0,
        scale: isMobile ? 0.88 : 0.95,
        duration: 0.45,
        ease: "power1.inOut",
      },
      0.25,
    );

    // --- PHASE 3: FADE OUT WHEN SCROLLING DOWN PAST SECTION 2 HEADER (Progress 0.85 -> 1.0) ---
    // When user scrolls past Section 2 header into the note family cards, bottle fades cleanly.
    tl.to(
      bottle,
      {
        opacity: 0,
        duration: 0.15,
        ease: "power1.in",
      },
      0.85,
    );

    void host;
    void stage;
  }
}
