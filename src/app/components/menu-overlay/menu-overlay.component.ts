import {
  Component,
  inject,
  effect,
  HostListener,
  AfterViewInit,
} from "@angular/core";
import { gsap } from "gsap";
import { UiService } from "../../services/ui.service";
import { ScrollService } from "../../core/scroll.service";
import { CartService } from "../../services/cart.service";
import { CapabilitiesService } from "../../core/capabilities.service";

@Component({
  selector: "bdp-menu-overlay",
  imports: [],
  template: `
    @if (ui.menuOpen()) {
      <div class="menu" role="dialog" aria-modal="true" aria-label="Site menu">
        <div class="menu__top">
          <span class="menu__word label-thin">BEAUX DE PARIS — Menu</span>
          <button class="menu__close" type="button" (click)="ui.closeMenu()" aria-label="Close the menu">
            <span>Close</span>
          </button>
        </div>

        <nav class="menu__list" aria-label="Menu">
          @for (l of links; track l.target) {
            <a
              class="menu__item"
              href="#{{ l.target }}"
              (click)="nav(l.target, $event)"
            >
              <span class="menu__num label-num">{{ $index + 1 }}</span>
              <span class="menu__label">{{ l.label }}</span>
            </a>
          }
        </nav>

        <div class="menu__foot">
          <a class="menu__foot-link" href="mailto:hello@beauxdeparis.fr">hello@beauxdeparis.fr</a>
          <a class="menu__foot-link" href="tel:+33142604444">+33 1 42 60 44 44</a>
          <a
            class="menu__foot-link"
            href="https://instagram.com/beauxdeparis"
            target="_blank"
            rel="noreferrer"
          >Instagram</a>
          <button class="menu__foot-link menu__foot-link--bag" type="button" (click)="openBag()">
            Bag — {{ cart.count() }}
          </button>
        </div>
      </div>
    }
  `,
  styles: [
    `
      :host {
        position: fixed;
        inset: 0;
        z-index: 130;
        pointer-events: none;
      }
      .menu {
        position: absolute;
        inset: 0;
        background: var(--color-ivory);
        color: var(--color-ink);
        pointer-events: auto;
        display: flex;
        flex-direction: column;
        padding: 1.4rem var(--gutter) 2.2rem;
        overflow: hidden auto;
      }
      .menu__top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--hairline);
      }
      .menu__word {
        color: var(--color-champagne);
      }
      .menu__close {
        font-family: var(--font-body);
        font-size: 0.65rem;
        font-weight: 500;
        letter-spacing: 0.34em;
        text-transform: uppercase;
        display: inline-flex;
        align-items: center;
        gap: 0.9rem;
      }
      .menu__close::after {
        content: "×";
        font-size: 1.4rem;
        font-weight: 300;
        line-height: 1;
        color: var(--color-ink);
      }
      .menu__list {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: clamp(0.4rem, 1.6vh, 1.1rem);
        max-width: 60rem;
        margin: 0 auto;
        width: 100%;
        padding: 4vh 0;
      }
      .menu__item {
        display: flex;
        align-items: baseline;
        gap: 2rem;
        border-bottom: 1px solid rgb(48 36 29 / 0.1);
        padding: 0.4rem 0.2rem;
        transition: padding-left 0.6s var(--ease-luxe);
      }
      .menu__item:hover {
        padding-left: 1rem;
      }
      .menu__num {
        color: var(--color-champagne);
        font-size: 0.7rem;
      }
      .menu__label {
        font-family: var(--font-display);
        font-weight: 300;
        font-size: clamp(2.6rem, 8vh, 4.6rem);
        line-height: 1.05;
        text-transform: capitalize;
      }
      .menu__foot {
        display: flex;
        gap: 2.4rem;
        flex-wrap: wrap;
        padding-top: 1.4rem;
        border-top: 1px solid var(--hairline);
      }
      .menu__foot-link {
        font-size: 0.65rem;
        font-weight: 500;
        letter-spacing: 0.26em;
        text-transform: uppercase;
        color: var(--color-mocha);
        border-bottom: 1px solid transparent;
        transition: border-color 0.5s var(--ease-luxe), color 0.5s var(--ease-luxe);
      }
      .menu__foot-link:hover {
        border-color: var(--color-champagne);
        color: var(--color-ink);
      }
      @media (min-width: 768px) {
        .menu {
          display: none;
        }
      }
    `,
  ],
})
export class MenuOverlayComponent {
  protected links = [
    { label: "The collection", target: "collection" },
    { label: "Our story", target: "maison" },
    { label: "Journal", target: "journal" },
    { label: "Contact", target: "contact" },
  ];

  protected readonly ui = inject(UiService);
  protected readonly cart = inject(CartService);
  private readonly scroll = inject(ScrollService);
  private readonly caps = inject(CapabilitiesService);

  constructor() {
    effect(() => {
      if (!this.ui.menuOpen()) return;
      if (this.caps.rm) return;
      const items = Array.from(
        document.querySelectorAll<HTMLElement>(".menu__item"),
      );
      gsap.fromTo(
        items,
        { opacity: 0, y: 34 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.07,
          ease: "power3.out",
          delay: 0.08,
        },
      );
    });
  }

  protected nav(target: string, e: Event): void {
    e.preventDefault();
    this.ui.closeMenu();
    setTimeout(() => this.scroll.scrollToId(target), 60);
  }

  protected openBag(): void {
    this.ui.closeMenu();
    this.ui.openCart();
  }

  @HostListener("document:keydown.escape")
  onEsc(): void {
    if (this.ui.menuOpen()) this.ui.closeMenu();
  }
}
