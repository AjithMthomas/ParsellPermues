import { Injectable, signal } from "@angular/core";
import { ScrollService } from "../core/scroll.service";
import { CapabilitiesService } from "../core/capabilities.service";

/**
 * Global chrome state: overlays, menu, nav theme.
 * navTheme: 'ink' → dark text on light acts · 'ivory' → light text on dark acts
 */
@Injectable({ providedIn: "root" })
export class UiService {
  readonly cartOpen = signal(false);
  readonly menuOpen = signal(false);
  readonly searchOpen = signal(false);
  readonly finderOpen = signal(false);
  readonly navTheme = signal<"ink" | "ivory">("ink");
  readonly navHidden = signal(false);

  constructor(
    private scroll: ScrollService,
    private caps: CapabilitiesService,
  ) {}

  private lock(open: boolean): void {
    // Lenis handles scroll-locking when active; native fallback otherwise.
    if (open) this.scroll.stop();
    else this.scroll.start();
    if (this.caps.rm && typeof document !== "undefined") {
      document.documentElement.style.overflow = open ? "hidden" : "";
    }
  }

  openCart(): void {
    this.cartOpen.set(true);
    this.lock(true);
  }
  closeCart(): void {
    this.cartOpen.set(false);
    this.lock(false);
  }
  openMenu(): void {
    this.menuOpen.set(true);
    this.lock(true);
  }
  closeMenu(): void {
    this.menuOpen.set(false);
    this.lock(false);
  }
  openSearch(): void {
    this.searchOpen.set(true);
    this.lock(true);
  }
  closeSearch(): void {
    this.searchOpen.set(false);
    this.lock(false);
  }
  openFinder(): void {
    this.finderOpen.set(true);
    this.lock(true);
  }
  closeFinder(): void {
    this.finderOpen.set(false);
    this.lock(false);
  }
}
