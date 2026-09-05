import { Component, inject } from "@angular/core";
import { ScrollService } from "../../core/scroll.service";

@Component({
  selector: "bdp-footer",
  imports: [],
  template: `
    <footer class="footer" data-nav="ink" aria-label="Footer">
      <div class="footer__statement">
        <p class="label footer__kicker">PARADISA — The scent of elegance</p>
        <h2 class="footer__big" aria-label="Leave a trace">
          <span class="mask-line"><span>LEAVE</span></span>
          <span class="mask-line"><span>A</span></span>
          <span class="mask-line"><span class="footer__trace">TRACE.</span></span>
        </h2>
      </div>

      <div class="footer__cols">
        <div class="footer__col">
          <p class="label footer__col-title">The house</p>
          @for (l of maison; track l.label) {
            <a class="footer__link" href="#{{ l.target }}" (click)="nav(l.target, $event)">{{ l.label }}</a>
          }
        </div>
        <div class="footer__col">
          <p class="label footer__col-title">Maison</p>
          <a class="footer__link" href="https://wa.me/918075265863" target="_blank" rel="noreferrer">WhatsApp — +91 8075 265 863</a>
          <a class="footer__link" href="mailto:hello@paradisa.fr">hello@paradisa.fr</a>
          <a class="footer__link" href="https://instagram.com/paradisa" target="_blank" rel="noreferrer">Instagram</a>
        </div>
        <div class="footer__col">
          <p class="label footer__col-title">Client care</p>
          <span class="footer__muted">Shipping — worldwide</span>
          <span class="footer__muted">Returns — 30 days</span>
          <span class="footer__muted">Privacy</span>
          <span class="footer__muted">Terms</span>
        </div>
        <div class="footer__emblem">
          <img src="assets/brand/bdp-logo.png" alt="PARADISA emblem" width="120" height="120" />
        </div>
      </div>

      <div class="footer__bottom">
        <p class="footer__muted">© MMXXVI Maison Paradisa</p>
        <p class="footer__muted">Composed in Grasse · Bottled at 8 Rue Royale</p>
      </div>
    </footer>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .footer {
        background: var(--color-ivory);
        padding: clamp(6rem, 13vh, 10rem) var(--gutter) 2.4rem;
        border-top: 1px solid var(--hairline);
      }
      .footer__statement {
        padding-bottom: clamp(4rem, 9vh, 7rem);
      }
      .footer__kicker {
        color: var(--color-champagne);
      }
      .footer__big {
        margin-top: 1.6rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.02em;
        font-family: var(--font-display);
        font-weight: 300;
        font-size: clamp(3rem, 10.5vw, 10.5rem);
        line-height: 0.92;
        letter-spacing: 0.01em;
        text-align: center;
        color: var(--color-ink);
      }
      .footer__trace {
        font-style: italic;
        color: var(--color-champagne);
      }
      .footer__cols {
        display: grid;
        grid-template-columns: repeat(3, 1fr) auto;
        gap: 2.4rem;
        padding: 2.4rem 0;
        border-top: 1px solid var(--hairline);
      }
      .footer__col {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
      }
      .footer__col-title {
        color: var(--color-champagne);
        margin-bottom: 0.5rem;
      }
      .footer__link,
      .footer__muted {
        font-size: 0.8rem;
        letter-spacing: 0.08em;
        color: var(--color-mocha);
        width: fit-content;
      }
      .footer__link {
        border-bottom: 1px solid transparent;
        transition: border-color 0.5s var(--ease-luxe), color 0.5s var(--ease-luxe);
      }
      .footer__link:hover {
        border-color: var(--color-champagne);
        color: var(--color-ink);
      }
      .footer__muted {
        color: var(--color-taupe);
      }
      .footer__emblem {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .footer__emblem img {
        width: clamp(84px, 9vw, 120px);
        height: auto;
        object-fit: contain;
        opacity: 0.92;
      }
      .footer__bottom {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        flex-wrap: wrap;
        border-top: 1px solid var(--hairline);
        padding-top: 1.6rem;
        font-size: 0.68rem;
        letter-spacing: 0.1em;
      }
      @media (max-width: 1023px) {
        .footer__cols {
          grid-template-columns: repeat(2, 1fr);
        }
        .footer__emblem {
          justify-content: flex-start;
        }
      }
      @media (max-width: 767px) {
        .footer {
          padding: 5rem 1.4rem 2rem;
        }
        .footer__cols {
          grid-template-columns: 1fr;
        }
        .footer__big {
          font-size: clamp(2.6rem, 16vw, 5rem);
        }
      }
    `,
  ],
})
export class FooterComponent {
  protected maison = [
    { label: "The collection", target: "collection" },
    { label: "The signature", target: "signature" },
    { label: "Our story", target: "maison" },
    { label: "Journal", target: "journal" },
    { label: "Contact", target: "contact" },
  ];

  private readonly scroll = inject(ScrollService);

  protected nav(target: string, e: Event): void {
    e.preventDefault();
    this.scroll.scrollToId(target);
  }
}
