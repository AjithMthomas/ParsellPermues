import {
  Component,
  inject,
  ElementRef,
  viewChild,
  afterNextRender,
  OnDestroy,
} from "@angular/core";
import { UiService } from "../../services/ui.service";
import { CartService } from "../../services/cart.service";
import { ScrollService } from "../../core/scroll.service";
import { CapabilitiesService } from "../../core/capabilities.service";

interface NavLink {
  label: string;
  target: string;
}

@Component({
  selector: "bdp-navbar",
  imports: [],
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.css",
})
export class NavbarComponent implements OnDestroy {
  protected links: NavLink[] = [
    { label: "Collections", target: "collection" },
    { label: "Shop", target: "collection" },
    { label: "Our story", target: "maison" },
    { label: "Journal", target: "journal" },
    { label: "Contact", target: "contact" },
  ];

  protected readonly ui = inject(UiService);
  protected readonly cart = inject(CartService);
  private readonly scroll = inject(ScrollService);
  private readonly caps = inject(CapabilitiesService);
  private readonly el = inject(ElementRef);

  private readonly sections = viewChild<ElementRef<HTMLElement>>("sections");
  private raf = 0;
  private els: HTMLElement[] = [];
  private lastTheme: "ink" | "ivory" | "" = "";
  private lastRaised = false;

  constructor() {
    afterNextRender(() => this.setup());
  }

  private setup(): void {
    // collect theme sections once the page has painted
    requestAnimationFrame(() => {
      this.els = Array.from(
        document.querySelectorAll<HTMLElement>("[data-nav]"),
      );
      const onScroll = () => {
        if (this.raf) return;
        this.raf = requestAnimationFrame(() => {
          this.raf = 0;
          this.update();
        });
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      this.update();
    });
  }

  private update(): void {
    if (!this.els.length) return;
    const y = window.scrollY + Math.min(90, window.innerHeight * 0.14);
    let theme: "ink" | "ivory" = "ink";
    for (const s of this.els) {
      if (s.offsetTop <= y) {
        theme = s.getAttribute("data-nav") === "ivory" ? "ivory" : "ink";
      } else {
        break;
      }
    }
    // pinned (sticky) film stages: their section top sits far above; fall back
    // to whatever is painted under the nav bar
    if (theme === "ink" && this.caps.desktop) {
      const probe = document.elementFromPoint(window.innerWidth - 12, 60);
      const dark = probe?.closest("[data-dark]");
      if (dark) theme = "ivory";
    }

    if (theme !== this.lastTheme) {
      this.lastTheme = theme;
      this.ui.navTheme.set(theme);
    }
    const raised = window.scrollY > 30;
    if (raised !== this.lastRaised) {
      this.lastRaised = raised;
      this.ui.navHidden.set(false);
      this.el.nativeElement.classList.toggle("nav--raised", raised);
    }
  }

  protected go(target: string, e?: Event): void {
    e?.preventDefault();
    if (target === "top") {
      this.scroll.scrollToTop();
      return;
    }
    this.scroll.scrollToId(target);
  }

  protected openBag(e: Event): void {
    e.preventDefault();
    this.ui.openCart();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.raf);
  }
}
