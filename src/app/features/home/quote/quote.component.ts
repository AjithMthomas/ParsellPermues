import { Component, input } from "@angular/core";
import { RevealDirective } from "../../../core/reveal.directive";

/**
 * Breathing-space typographic interlude — huge stacked serif lines between
 * major scenes. Wholly decorative but semantically a blockquote.
 */
@Component({
  selector: "bdp-quote",
  imports: [RevealDirective],
  template: `<section class="quote" bdpReveal="lines" aria-label="Editorial interlude">
      <span class="quote__kicker label" aria-hidden="true">{{ kicker() }}</span>
      <blockquote class="quote__words">
        @for (line of lines(); track line) {
          <span class="mask-line"><span rv-line class="quote__line">{{ line }}</span></span>
        }
      </blockquote>
    </section>`,
  styles: `
    :host {
      display: block;
      background: var(--color-ivory);
    }
    .quote {
      padding: clamp(9rem, 22vh, 17rem) var(--gutter);
      text-align: center;
    }
    .quote__kicker {
      color: var(--color-champagne);
      display: inline-block;
    }
    .quote__words {
      margin-top: 2.4rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.08em;
    }
    .quote__line {
      font-family: var(--font-display);
      font-weight: 300;
      font-size: clamp(2.6rem, 7.2vw, 7rem);
      line-height: 1.02;
      letter-spacing: 0.01em;
      color: var(--color-ink);
      font-style: italic;
    }
    .mask-line {
      display: block;
    }
    @media (max-width: 767px) {
      .quote {
        padding: 7rem 1.4rem;
        text-align: center;
      }
    }
  `,
})
export class QuoteComponent {
  readonly lines = input<string[]>([]);
  readonly kicker = input("");
}
