import { Component, inject, HostListener } from "@angular/core";
import { UiService } from "../../services/ui.service";
import { CartService } from "../../services/cart.service";
import { ProductsService } from "../../services/products.service";
import { WhatsAppService } from "../../services/whatsapp.service";
import { ScrollService } from "../../core/scroll.service";
import { ProductArtComponent } from "../../art/product-art/product-art.component";

@Component({
  selector: "bdp-cart-drawer",
  imports: [ProductArtComponent],
  template: `
    <div class="drawer" [class.drawer--open]="ui.cartOpen()" aria-hidden="true">
      <div class="drawer__scrim" (click)="ui.closeCart()" tabindex="-1"></div>

      <aside
        class="drawer__panel"
        role="dialog"
        aria-modal="true"
        [attr.aria-hidden]="!ui.cartOpen()"
        [attr.aria-label]="'Your bag — ' + cart.count() + ' items'"
      >
        <header class="drawer__head">
          <p class="drawer__title">
            <span class="label">Your bag</span>
            <span class="label-num drawer__count">({{ cart.count() }})</span>
          </p>
          <button class="drawer__close" type="button" (click)="ui.closeCart()" aria-label="Close the bag">
            Close
          </button>
        </header>

        @if (cart.lines().length === 0) {
          <div class="drawer__empty">
            <img class="drawer__emblem" src="assets/brand/bdp-logo.png" alt="PARADISA emblem" width="96" height="96" />
            <p class="serif-i drawer__empty-line">Your bag is empty —</p>
            <p class="t-caption drawer__empty-sub">the collection is waiting.</p>
            <a class="link-line drawer__empty-cta" href="#collection" (click)="explore($event)">
              Explore the collection
            </a>
          </div>
        } @else {
          <ul class="drawer__lines">
            @for (line of cart.lines(); track line.fragranceId + line.volume) {
              @if (lineFrag(line); as f) {
                <li class="line">
                  <div class="line__thumb" aria-hidden="true">
                    <bdp-product-art [fragrance]="f" alt="" />
                  </div>
                  <div class="line__info">
                    <p class="line__code label-thin">{{ f.code }} — {{ f.name }}</p>
                    <p class="line__vol t-caption">{{ line.volume }} ml — Eau de parfum</p>
                    <p class="line__price label-num">{{ fmt(f.price) }}</p>
                    <div class="line__qty" aria-label="Quantity for {{ f.name }}">
                      <button type="button" (click)="cart.setQty(line.fragranceId, line.volume, line.qty - 1)" [attr.aria-label]="'Decrease quantity of ' + f.name">−</button>
                      <span class="label-num">{{ line.qty }}</span>
                      <button type="button" (click)="cart.setQty(line.fragranceId, line.volume, line.qty + 1)" [attr.aria-label]="'Increase quantity of ' + f.name">+</button>
                    </div>
                  </div>
                  <button class="line__remove" type="button" (click)="cart.remove(line.fragranceId, line.volume)" [attr.aria-label]="'Remove ' + f.name + ' from your bag'">
                    ×
                  </button>
                </li>
              }
            }
          </ul>

          <footer class="drawer__foot">
            <div class="drawer__subtotal">
              <span class="label">Subtotal</span>
              <span class="drawer__total">{{ fmt(cart.subtotal()) }}</span>
            </div>
            <p class="t-caption drawer__note">
              Complimentary delivery on orders over ₹18,000 — worldwide.
            </p>
            <button class="btn-editorial drawer__checkout" type="button" (click)="checkout()">
              Order on WhatsApp
            </button>
            <p class="t-caption drawer__wa">
              Your order opens in WhatsApp — {{ wa.display }} · product, size, quantity &amp; total included.
            </p>
          </footer>
        }
      </aside>
    </div>
  `,
  styles: [
    `
      .drawer {
        position: fixed;
        inset: 0;
        z-index: 150;
        pointer-events: none;
        visibility: hidden;
        transition: visibility 0s linear 0.6s;
      }
      .drawer--open {
        pointer-events: auto;
        visibility: visible;
        transition: none;
      }
      .drawer__scrim {
        position: absolute;
        inset: 0;
        background: rgb(27 18 11 / 0.16);
        opacity: 0;
        transition: opacity 0.6s var(--ease-luxe);
      }
      .drawer--open .drawer__scrim {
        opacity: 1;
      }
      .drawer__panel {
        position: absolute;
        top: 0;
        right: 0;
        height: 100dvh;
        width: min(26rem, 94vw);
        background: var(--color-porcelain);
        color: var(--color-ink);
        display: flex;
        flex-direction: column;
        transform: translateX(102%);
        transition: transform 0.9s var(--ease-luxe);
        box-shadow: -1.2rem 0 3rem -1.6rem rgb(48 36 29 / 0.3);
      }
      .drawer--open .drawer__panel {
        transform: translateX(0);
      }
      .drawer__head {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        padding: 1.5rem 2rem 1.2rem;
        border-bottom: 1px solid var(--hairline);
      }
      .drawer__title {
        display: flex;
        gap: 0.6rem;
        align-items: baseline;
      }
      .drawer__count {
        color: var(--color-champagne);
      }
      .drawer__close {
        font-size: 0.6rem;
        font-weight: 500;
        letter-spacing: 0.3em;
        text-transform: uppercase;
      }
      .drawer__lines {
        list-style: none;
        flex: 1;
        overflow-y: auto;
        padding: 0 2rem;
      }
      .line {
        display: grid;
        grid-template-columns: 4.2rem 1fr auto;
        gap: 1.1rem;
        padding: 1.6rem 0;
        border-bottom: 1px solid rgb(48 36 29 / 0.08);
        position: relative;
      }
      .line__thumb {
        background: var(--color-cream);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem;
      }
      .line__code {
        color: var(--color-mocha);
      }
      .line__vol {
        color: var(--color-taupe);
        margin-top: 0.15rem;
      }
      .line__price {
        margin-top: 0.5rem;
        display: inline-block;
      }
      .line__qty {
        display: inline-flex;
        align-items: center;
        gap: 0.9rem;
        margin-top: 0.9rem;
        border: 1px solid rgb(48 36 29 / 0.2);
        padding: 0.25rem 0.7rem;
      }
      .line__qty button {
        font-size: 1rem;
        line-height: 1;
        color: var(--color-mocha);
      }
      .line__remove {
        position: absolute;
        top: 1.2rem;
        right: 0.1rem;
        font-size: 1.2rem;
        font-weight: 300;
        color: var(--color-taupe);
        transition: color 0.4s;
      }
      .line__remove:hover {
        color: var(--color-ink);
      }
      .drawer__foot {
        border-top: 1px solid var(--hairline);
        padding: 1.4rem 2rem 2rem;
        background: var(--color-porcelain);
      }
      .drawer__subtotal {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
      }
      .drawer__total {
        font-family: var(--font-display);
        font-size: 1.6rem;
      }
      .drawer__note {
        color: var(--color-taupe);
        margin-top: 0.6rem;
      }
      .drawer__checkout {
        margin-top: 1.2rem;
        width: 100%;
        justify-content: center;
      }
      .drawer__wa {
        margin-top: 0.7rem;
        color: var(--color-taupe);
        line-height: 1.6;
      }
      .drawer__empty {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 2rem;
        gap: 0.4rem;
      }
      .drawer__emblem {
        width: 84px;
        height: 84px;
        object-fit: contain;
        opacity: 0.9;
        margin-bottom: 1.2rem;
      }
      .drawer__empty-line {
        font-size: 1.4rem;
        color: var(--color-ink);
      }
      .drawer__empty-sub {
        color: var(--color-taupe);
      }
      .drawer__empty-cta {
        margin-top: 2rem;
        color: var(--color-champagne);
      }
    `,
  ],
})
export class CartDrawerComponent {
  protected readonly ui = inject(UiService);
  protected readonly cart = inject(CartService);
  protected readonly wa = inject(WhatsAppService);
  private readonly products = inject(ProductsService);
  private readonly scroll = inject(ScrollService);

  protected fmt(price: number): string {
    return this.products.format(price);
  }

  protected lineFrag(line: { fragranceId: string }): ReturnType<ProductsService["bySlug"]> {
    return this.products.bySlug(line.fragranceId);
  }

  protected explore(e: Event): void {
    e.preventDefault();
    this.ui.closeCart();
    setTimeout(() => this.scroll.scrollToId("collection"), 80);
  }

  protected checkout(): void {
    const lines = this.cart.lines();
    if (!lines.length) return;
    this.wa.open(this.wa.bag(lines, this.cart.subtotal()));
  }

  @HostListener("document:keydown.escape")
  onEsc(): void {
    if (this.ui.cartOpen()) this.ui.closeCart();
  }
}
