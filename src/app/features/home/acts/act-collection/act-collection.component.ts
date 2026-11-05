import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from "@angular/core";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FRAGRANCES, Fragrance, VOLUME_OPTIONS, priceForVolume } from "../../../../data/fragrances";
import { CartService } from "../../../../services/cart.service";
import { ProductsService } from "../../../../services/products.service";
import { WhatsAppService } from "../../../../services/whatsapp.service";
import { BagFeedbackService } from "../../../../services/bag-feedback.service";
import { CapabilitiesService } from "../../../../core/capabilities.service";
import { ScrollService } from "../../../../core/scroll.service";
import { RevealDirective } from "../../../../core/reveal.directive";

interface WorldStyle {
  vars: string;
  nav: "ink" | "ivory";
  side: "l" | "r";
}

const STYLE: Record<string, WorldStyle> = {
  symphony: {
    vars:
      "--w-bg:#FDFCF8;--w-ink:#2D251D;--w-mut:#5A4A3B;--w-line:rgb(201 162 77 / 0.28);",
    nav: "ink",
    side: "l",
  },
  obsidian: {
    vars:
      "--w-bg:#181614;--w-ink:#FAF7F2;--w-mut:#C8B9A6;--w-line:rgb(201 162 77 / 0.32);",
    nav: "ivory",
    side: "r",
  },
  "elin-lush": {
    vars:
      "--w-bg:#F2F6ED;--w-ink:#25301F;--w-mut:#4C5840;--w-line:rgb(74 88 62 / 0.24);",
    nav: "ink",
    side: "l",
  },
  iris: {
    vars:
      "--w-bg:#F8F4F9;--w-ink:#2A212E;--w-mut:#57485E;--w-line:rgb(168 132 184 / 0.28);",
    nav: "ink",
    side: "r",
  },
  aube: {
    vars:
      "--w-bg:#FDFCF8;--w-ink:#2D251D;--w-mut:#5A4A3B;--w-line:rgb(201 162 77 / 0.28);",
    nav: "ink",
    side: "l",
  },
  velours: {
    vars:
      "--w-bg:#181614;--w-ink:#FAF7F2;--w-mut:#C8B9A6;--w-line:rgb(201 162 77 / 0.32);",
    nav: "ivory",
    side: "r",
  },
  lune: {
    vars:
      "--w-bg:#F2F6ED;--w-ink:#25301F;--w-mut:#4C5840;--w-line:rgb(74 88 62 / 0.24);",
    nav: "ink",
    side: "l",
  },
};

/**
 * THE COLLECTION — four creations, travelled horizontally.
 *
 * The four fragrance worlds sit in one reel. The section pins while the four
 * panels pan across; when the last creation has passed, the page releases and
 * continues down the film. Very short viewports and reduced-motion users get
 * the same four worlds as a calm vertical stack.
 */
@Component({
  selector: "bdp-act-collection",
  imports: [RevealDirective],
  templateUrl: "./act-collection.component.html",
  styleUrl: "./act-collection.component.css",
})
export class ActCollectionComponent {
  protected fragrances = FRAGRANCES;
  protected readonly volumeOptions = VOLUME_OPTIONS;
  protected selectedVolumes = signal<Record<string, number>>({});
  protected activeViews = signal<Record<string, string>>({});
  protected added = signal<string[]>([]);

  /** Horizontal reel state (always true so reel scrolls horizontally on all screens). */
  protected readonly reelMode = signal(true);
  protected readonly activeIndex = signal(0);
  protected readonly navLive = signal(false);

  private readonly cart = inject(CartService);
  private readonly products = inject(ProductsService);
  private readonly wa = inject(WhatsAppService);
  private readonly feedback = inject(BagFeedbackService);
  private readonly caps = inject(CapabilitiesService);
  private readonly scroll = inject(ScrollService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly reelEl = viewChild<ElementRef<HTMLElement>>("reel");
  private readonly viewportEl = viewChild<ElementRef<HTMLElement>>("viewport");
  private readonly trackEl = viewChild<ElementRef<HTMLElement>>("track");
  private st?: ScrollTrigger;

  constructor() {
    this.reelMode.set(true);
    afterNextRender(() => {
      this.setupReel();
    });
  }

  protected styleOf = (f: Fragrance): string => {
    return (STYLE[f.world] ?? STYLE["symphony"]).vars;
  };
  protected navOf = (f: Fragrance): "ink" | "ivory" => {
    return (STYLE[f.world] ?? STYLE["symphony"]).nav;
  };
  protected sideOf = (f: Fragrance): "l" | "r" => {
    return (STYLE[f.world] ?? STYLE["symphony"]).side;
  };

  /** Nav theme of the creation currently under the viewport. */
  protected panelNav(): "ink" | "ivory" {
    return this.navOf(this.fragrances[this.activeIndex()] ?? this.fragrances[0]);
  }

  protected getVolume(f: Fragrance): number {
    return this.selectedVolumes()[f.slug] ?? 100;
  }

  protected setVolume(f: Fragrance, vol: number): void {
    this.selectedVolumes.update((m) => ({ ...m, [f.slug]: vol }));
  }

  protected price(f: Fragrance): string {
    const vol = this.getVolume(f);
    return this.products.format(priceForVolume(vol));
  }

  protected join(notes: string[]): string {
    return notes.join(" · ");
  }

  protected activeImg(f: Fragrance): string {
    const view = this.activeViews()[f.slug] || "scene";
    if (view === "cover" && f.images?.cover) return f.images.cover;
    if (view === "ad" && f.images?.ad) return f.images.ad;
    if (view === "poster" && f.images?.poster) return f.images.poster;
    if (view === "bottle8ml" && f.images?.bottle8ml) return f.images.bottle8ml;
    return f.images?.scene || `/assets/products/${f.slug}/scene.png`;
  }

  protected setView(f: Fragrance, viewKey: string): void {
    this.activeViews.update((m) => ({ ...m, [f.slug]: viewKey }));
  }

  protected addToBag(f: Fragrance, ev?: Event): void {
    const vol = this.getVolume(f);
    this.cart.add(f, vol, 1);
    const world = (ev?.currentTarget as HTMLElement | null)?.closest(".world");
    this.feedback.added(f, vol, world as HTMLElement | null);
    const slug = f.slug;
    this.added.update((a) => [...a, slug]);
    setTimeout(() => {
      this.added.update((a) => a.filter((s) => s !== slug));
    }, 2400);
  }

  protected orderOnWhatsApp(f: Fragrance): void {
    const vol = this.getVolume(f);
    this.wa.open(this.wa.order(f, vol, 1));
  }

  /** Jump the film to one creation — the HUD dots and deep links use this. */
  protected goToPanel(index: number): void {
    const y = this.panelTop(index);
    if (y === null) return;
    this.scroll.scrollToY(y);
  }

  private panelTop(index: number): number | null {
    const reel = this.reelEl()?.nativeElement;
    if (!reel) return null;
    const span = Math.max(0, reel.offsetHeight - window.innerHeight);
    const ratio = index / Math.max(1, this.fragrances.length - 1);
    return reel.getBoundingClientRect().top + window.scrollY + ratio * span;
  }

  private setupReel(): void {
    const reel = this.reelEl()?.nativeElement;
    const viewport = this.viewportEl()?.nativeElement;
    const track = this.trackEl()?.nativeElement;
    if (!reel || !viewport || !track) return;

    const count = this.fragrances.length;
    const distance = () => Math.max(0, (count - 1) * viewport.clientWidth);

    // the section's height is exactly how far the reel has to travel
    const sizeReel = () => {
      reel.style.setProperty("--reel-span", `${distance()}px`);
    };

    // one author for the pan: scroll progress → track offset
    const paint = (progress: number) => {
      const x = -distance() * progress;
      track.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
    };

    sizeReel();
    paint(0);

    this.st = ScrollTrigger.create({
      trigger: reel,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      invalidateOnRefresh: true,
      onRefresh: () => paint(this.st?.progress ?? 0),
      onUpdate: (self) => {
        paint(self.progress);
        const index = Math.min(
          count - 1,
          Math.round(self.progress * (count - 1)),
        );
        if (index !== this.activeIndex()) this.activeIndex.set(index);
      },
      onToggle: (self) => this.navLive.set(self.isActive),
    });

    ScrollTrigger.refresh();

    // the reel's height is derived from the panel width, so re-measure and
    // refresh whenever the viewport itself changes size
    let lastDistance = distance();
    let raf = 0;
    const ro = new ResizeObserver(() => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const newDist = distance();
        if (Math.abs(newDist - lastDistance) > 2) {
          lastDistance = newDist;
          sizeReel();
          ScrollTrigger.refresh();
        }
      });
    });
    ro.observe(viewport);

    this.destroyRef.onDestroy(() => {
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      this.st?.kill();
      this.navLive.set(false);
      track.style.transform = "";
    });
  }
}
