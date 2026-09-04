import {
  Component,
  inject,
  signal,
  effect,
  HostListener,
} from "@angular/core";
import { UiService } from "../../services/ui.service";
import { ProductsService } from "../../services/products.service";
import { ScrollService } from "../../core/scroll.service";
import { FRAGRANCES, Fragrance } from "../../data/fragrances";
import { ProductArtComponent } from "../../art/product-art/product-art.component";

interface PageHit {
  id: string;
  target: string;
  title: string;
  kind: string;
}

const PAGES: PageHit[] = [
  { id: "maison", target: "maison", title: "The House of Beaux de Paris", kind: "Our story" },
  { id: "collection", target: "collection", title: "The collection", kind: "Shop" },
  { id: "journal", target: "journal", title: "From the journal", kind: "Journal" },
  { id: "contact", target: "contact", title: "Contact the maison", kind: "Contact" },
];

@Component({
  selector: "bdp-search-overlay",
  imports: [ProductArtComponent],
  template: `
    @if (ui.searchOpen()) {
      <div class="search" role="dialog" aria-modal="true" aria-label="Search the house">
        <header class="search__head">
          <span class="label-thin">Search — Beaux de Paris</span>
          <button class="search__close" type="button" (click)="close()" aria-label="Close search">Close</button>
        </header>

        <div class="search__body">
          <input
            #box
            class="search__input"
            type="search"
            autofocus
            placeholder="Search a fragrance, a note, a word…"
            aria-label="Search"
            (input)="query.set(box.value)"
          />
          <p class="label-num search__hint">{{ query() ? 'Results' : 'The house holds' }} — {{ results().length }}</p>

          <ul class="search__results">
            @for (r of results(); track r.id) {
              <li>
                <button class="hit" type="button" (click)="open(r)">
                  @if (r.fragrance; as f) {
                    <span class="hit__thumb" aria-hidden="true">
                      <bdp-product-art [fragrance]="f" alt="" />
                    </span>
                    <span class="hit__text">
                      <span class="hit__title">{{ f.code }} — {{ f.name }}</span>
                      <span class="hit__meta label-thin">{{ f.descriptor }} · {{ fmt(f.price) }}</span>
                    </span>
                    <span class="hit__go label" data-cursor="">Discover</span>
                  } @else {
                    <span class="hit__text">
                      <span class="hit__title">{{ r.title }}</span>
                      <span class="hit__meta label-thin">{{ r.kind }}</span>
                    </span>
                    <span class="hit__go label" data-cursor="">View</span>
                  }
                </button>
              </li>
            } @empty {
              @if (query()) {
                <li class="search__none serif-i">
                  Nothing found for “{{ query() }}” — write to the maison instead.
                </li>
              }
            }
          </ul>

          <p class="search__foot label-thin">
            @if (query()) {
              Press escape to return to the house
            } @else {
              Discover Nº1 L'Aube · Nº2 Le Velours · Nº3 Jardin de Lune
            }
          </p>
        </div>
      </div>
    }
  `,
  styles: [
    `
      :host {
        position: fixed;
        inset: 0;
        z-index: 140;
        pointer-events: none;
      }
      .search {
        position: absolute;
        inset: 0;
        background: var(--color-ivory);
        color: var(--color-ink);
        pointer-events: auto;
        display: flex;
        flex-direction: column;
        padding: 1.4rem var(--gutter) 2.4rem;
        overflow: hidden auto;
      }
      .search__head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 1.1rem;
        border-bottom: 1px solid var(--hairline);
      }
      .search__close {
        font-size: 0.62rem;
        font-weight: 500;
        letter-spacing: 0.32em;
        text-transform: uppercase;
      }
      .search__body {
        width: min(58rem, 100%);
        margin: 0 auto;
        flex: 1;
        display: flex;
        flex-direction: column;
        padding-top: 2.6rem;
      }
      .search__input {
        background: transparent;
        border: 0;
        border-bottom: 1px solid rgb(48 36 29 / 0.25);
        font-family: var(--font-display);
        font-weight: 300;
        font-size: clamp(1.5rem, 3.4vw, 2.6rem);
        color: var(--color-ink);
        padding: 0.4rem 0.1rem 0.9rem;
      }
      .search__input::placeholder {
        color: var(--color-taupe);
      }
      .search__input:focus {
        outline: none;
        border-bottom-color: var(--color-champagne);
      }
      .search__hint {
        margin-top: 1.1rem;
        color: var(--color-champagne);
      }
      .search__results {
        list-style: none;
        margin-top: 1.4rem;
        flex: 1;
        overflow-y: auto;
      }
      .hit {
        width: 100%;
        display: grid;
        grid-template-columns: 3.4rem 1fr auto;
        gap: 1.4rem;
        align-items: center;
        text-align: left;
        padding: 1.1rem 0.2rem;
        border-bottom: 1px solid rgb(48 36 29 / 0.09);
        transition: padding-left 0.5s var(--ease-luxe);
      }
      .hit:hover {
        padding-left: 0.9rem;
      }
      .hit__thumb {
        background: var(--color-cream);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.4rem;
      }
      .hit__title {
        display: block;
        font-family: var(--font-display);
        font-weight: 400;
        font-size: 1.3rem;
        letter-spacing: 0.02em;
      }
      .hit__meta {
        display: block;
        margin-top: 0.3rem;
        color: var(--color-taupe);
      }
      .hit__go {
        color: var(--color-champagne);
        border-bottom: 1px solid transparent;
      }
      .hit:hover .hit__go {
        border-bottom-color: var(--color-champagne);
      }
      .search__none {
        color: var(--color-mocha);
        font-size: 1.3rem;
        padding: 2rem 0.2rem;
      }
      .search__foot {
        padding-top: 1.6rem;
        color: var(--color-taupe);
        text-align: center;
      }
    `,
  ],
})
export class SearchOverlayComponent {
  protected query = signal("");
  protected readonly ui = inject(UiService);
  private readonly products = inject(ProductsService);
  private readonly scroll = inject(ScrollService);
  private boxEl?: HTMLInputElement;

  constructor() {
    effect(() => {
      if (!this.ui.searchOpen()) {
        this.query.set("");
        return;
      }
      setTimeout(() => {
        this.boxEl?.focus();
      }, 60);
    });
  }

  protected results(): Array<PageHit & { fragrance?: Fragrance }> {
    const q = this.query().trim().toLowerCase();
    const out: Array<PageHit & { fragrance?: Fragrance }> = [];
    if (!q) {
      FRAGRANCES.forEach((f) =>
        out.push({ id: f.slug, target: "world-" + f.slug, title: f.name, kind: f.descriptor, fragrance: f }),
      );
      return out;
    }
    for (const f of FRAGRANCES) {
      const hay = [
        f.name, f.code, f.descriptor, f.line, f.intro,
        ...f.topNotes, ...f.heartNotes, ...f.baseNotes, ...f.ingredients,
      ]
        .join(" ")
        .toLowerCase();
      if (hay.includes(q)) {
        out.push({ id: f.slug, target: "world-" + f.slug, title: f.name, kind: f.descriptor, fragrance: f });
      }
    }
    for (const p of PAGES) {
      if ((p.title + " " + p.kind).toLowerCase().includes(q)) {
        out.push(p);
      }
    }
    return out.slice(0, 8);
  }

  protected fmt(price: number): string {
    return this.products.format(price);
  }

  protected close(): void {
    this.ui.closeSearch();
  }

  protected open(r: { target: string }): void {
    this.ui.closeSearch();
    setTimeout(() => this.scroll.scrollToId(r.target), 80);
  }

  @HostListener("document:keydown.escape")
  onEsc(): void {
    if (this.ui.searchOpen()) this.ui.closeSearch();
  }
}
