import { Component, inject, signal, HostListener } from "@angular/core";
import { UiService } from "../../services/ui.service";
import { ProductsService, FinderAnswers } from "../../services/products.service";
import { CartService } from "../../services/cart.service";
import { FRAGRANCES, Fragrance } from "../../data/fragrances";
import { WorldStageComponent } from "../../art/world-stage/world-stage.component";

interface Question {
  key: keyof FinderAnswers;
  q: string;
  opts: string[];
}

const QUESTIONS: Question[] = [
  { key: "mood", q: "What mood describes you?", opts: ["Fresh", "Elegant", "Sensual", "Warm", "Mysterious"] },
  { key: "atmosphere", q: "What atmosphere draws you?", opts: ["Daylight", "Night", "Nature", "City", "Velvet"] },
  { key: "impression", q: "What impression do you wish to leave?", opts: ["Subtle", "Memorable", "Bold", "Romantic"] },
];

@Component({
  selector: "bdp-finder-overlay",
  imports: [WorldStageComponent],
  template: `
    @if (ui.finderOpen()) {
      <div class="finder" role="dialog" aria-modal="true" aria-label="Find your signature scent">
        <header class="finder__head">
          <span class="label-thin">Find your signature scent</span>
          <button class="finder__close" type="button" (click)="ui.closeFinder()" aria-label="Close">Close</button>
        </header>

        <div class="finder__body">
          @if (step() < questions.length) {
            <p class="label-num finder__progress">Question {{ step() + 1 }} / {{ questions.length }}</p>
            <h2 class="t-display finder__question">{{ q()?.q }}</h2>
            <div class="finder__options">
              @for (opt of q()?.opts; track opt) {
                <button class="finder__opt" type="button" (click)="choose(opt)">
                  {{ opt }}
                </button>
              }
            </div>
            <p class="finder__aside label-thin">Answer as you are — there is no wrong fragrance.</p>
          } @else {
            @if (result(); as r) {
              <div class="finder__result">
                <p class="label finder__result-kicker">Votre signature — {{ r.code }}</p>
                <h2 class="t-display finder__result-name">{{ r.name }}</h2>
                <p class="serif-i finder__result-line">{{ r.line }}</p>

                <div class="finder__stage">
                  <div class="finder__stage-glow" aria-hidden="true"></div>
                  <bdp-world-stage [fragrance]="r" />
                </div>

                <p class="t-caption finder__result-notes">
                  {{ r.topNotes.join(' · ') }} — {{ r.heartNotes.join(' · ') }} — {{ r.baseNotes.join(' · ') }}
                </p>
                <p class="finder__result-price">{{ fmt(r.price) }} — 100 ml</p>

                @if (!added()) {
                  <button class="btn-editorial finder__add" type="button" (click)="add(r)">
                    Add {{ r.name }} to your bag
                  </button>
                } @else {
                  <p class="finder__added serif-i" role="status">Added to your bag — merci.</p>
                }
                <div class="finder__again">
                  <button type="button" class="link-line" (click)="reset()">Begin again</button>
                </div>
              </div>
            }
          }
        </div>
      </div>
    }
  `,
  styles: [
    `
      :host {
        position: fixed;
        inset: 0;
        z-index: 145;
        pointer-events: none;
      }
      .finder {
        position: absolute;
        inset: 0;
        background: var(--color-porcelain);
        color: var(--color-ink);
        pointer-events: auto;
        display: flex;
        flex-direction: column;
        padding: 1.4rem var(--gutter) 2.2rem;
        overflow: hidden auto;
      }
      .finder__head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 1.1rem;
        border-bottom: 1px solid var(--hairline);
      }
      .finder__head span {
        color: var(--color-champagne);
      }
      .finder__close {
        font-size: 0.62rem;
        font-weight: 500;
        letter-spacing: 0.32em;
        text-transform: uppercase;
      }
      .finder__body {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        width: min(54rem, 100%);
        margin: 0 auto;
      }
      .finder__progress {
        color: var(--color-champagne);
      }
      .finder__question {
        margin-top: 1.6rem;
      }
      .finder__options {
        margin-top: 3.2rem;
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: center;
        max-width: 44rem;
      }
      .finder__opt {
        font-family: var(--font-display);
        font-weight: 300;
        font-size: clamp(1.2rem, 2vw, 1.7rem);
        letter-spacing: 0.06em;
        text-transform: uppercase;
        padding: 0.7em 1.5em;
        border: 1px solid rgb(48 36 29 / 0.24);
        transition: background-color 0.6s var(--ease-luxe), color 0.6s var(--ease-luxe), border-color 0.6s;
      }
      .finder__opt:hover,
      .finder__opt:focus-visible {
        background: var(--color-ink);
        border-color: var(--color-ink);
        color: var(--color-porcelain);
      }
      .finder__aside {
        margin-top: 2.4rem;
        color: var(--color-taupe);
      }
      .finder__result {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .finder__result-kicker {
        color: var(--color-champagne);
      }
      .finder__result-name {
        margin-top: 0.8rem;
      }
      .finder__result-line {
        margin-top: 0.5rem;
        color: var(--color-mocha);
        font-size: 1.3rem;
      }
      .finder__stage {
        position: relative;
        width: min(15rem, 46vw);
        margin: 1.6rem auto 1.4rem;
      }
      .finder__stage-glow {
        position: absolute;
        inset: -24%;
        border-radius: 50%;
        background: radial-gradient(circle, rgb(246 236 208 / 0.9), transparent 70%);
        filter: blur(10px);
      }
      .finder__result-notes {
        color: var(--color-mocha);
        max-width: 36rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        line-height: 2.2;
      }
      .finder__result-price {
        font-family: var(--font-display);
        font-size: 1.3rem;
        margin-top: 0.6rem;
      }
      .finder__add {
        margin-top: 1.6rem;
      }
      .finder__added {
        margin-top: 1.6rem;
        font-size: 1.2rem;
        color: var(--color-champagne);
      }
      .finder__again {
        margin-top: 1.6rem;
      }
      @media (max-width: 767px) {
        .finder {
          padding: 1.2rem 1.4rem;
        }
        .finder__question {
          font-size: clamp(1.8rem, 8vw, 2.6rem);
        }
      }
    `,
  ],
})
export class FinderOverlayComponent {
  protected questions = QUESTIONS;
  protected step = signal(0);
  protected answers = signal<FinderAnswers>({ mood: "", atmosphere: "", impression: "" });
  protected added = signal(false);

  protected readonly ui = inject(UiService);
  private readonly products = inject(ProductsService);
  private readonly cart = inject(CartService);

  protected q(): Question | undefined {
    return QUESTIONS[this.step()];
  }

  protected result(): Fragrance {
    return this.products.recommend(this.answers());
  }

  protected choose(opt: string): void {
    const q = this.q();
    if (!q) return;
    this.answers.update((a) => ({ ...a, [q.key]: opt.toUpperCase() }));
    this.step.update((s) => s + 1);
  }

  protected reset(): void {
    this.added.set(false);
    this.answers.set({ mood: "", atmosphere: "", impression: "" });
    this.step.set(0);
  }

  protected add(f: Fragrance): void {
    this.cart.add(f, 100, 1);
    this.added.set(true);
  }

  protected fmt(price: number): string {
    return this.products.format(price);
  }

  @HostListener("document:keydown.escape")
  onEsc(): void {
    if (this.ui.finderOpen()) this.ui.closeFinder();
  }
}
