import { Component, inject } from "@angular/core";
import { BagFeedbackService } from "../../services/bag-feedback.service";
import { UiService } from "../../services/ui.service";

/** The confirmation that follows every "Add to bag". */
@Component({
  selector: "bdp-toast",
  imports: [],
  template: `
    <div class="toast-wrap" role="status" aria-live="polite">
      <div class="toast" [class.toast--in]="!!fb.toast()">
        @if (fb.toast(); as t) {
          <span class="toast__mark" aria-hidden="true">
            <svg viewBox="0 0 16 16" fill="none">
              <path
                d="M3.3 8.5 6.3 11.5 12.7 5.1"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <span class="toast__text">
            <span class="toast__title">{{ t.title }}</span>
            <span class="toast__meta">{{ t.meta }}</span>
          </span>
          <button class="toast__cta" type="button" (click)="viewBag()">View bag</button>
        }
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        position: fixed;
        left: 0;
        right: 0;
        bottom: clamp(1.1rem, 3.2vh, 2.2rem);
        z-index: 170;
        display: flex;
        justify-content: center;
        pointer-events: none;
        padding: 0 var(--gutter);
      }

      .toast-wrap {
        max-width: 100%;
      }

      .toast {
        display: flex;
        align-items: center;
        gap: 0.9rem;
        padding: 0.7rem 0.8rem 0.7rem 0.95rem;
        border-radius: 999px;
        background: rgb(252 251 248 / 0.94);
        -webkit-backdrop-filter: blur(18px);
        backdrop-filter: blur(18px);
        border: 1px solid rgb(184 148 82 / 0.42);
        box-shadow:
          0 1.4rem 3rem -1.2rem rgb(48 36 29 / 0.34),
          inset 0 0 0 1px rgb(255 255 255 / 0.5);
        color: var(--color-ink);
        opacity: 0;
        transform: translateY(1.1rem) scale(0.97);
        transition:
          opacity 0.45s var(--ease-luxe),
          transform 0.65s var(--ease-luxe);
        pointer-events: none;
        visibility: hidden;
      }
      .toast--in {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
        visibility: visible;
      }

      .toast__mark {
        flex: none;
        display: grid;
        place-items: center;
        width: 1.55rem;
        height: 1.55rem;
        border-radius: 50%;
        color: var(--color-porcelain);
        background: var(--color-champagne);
        box-shadow: 0 0 0 3px rgb(184 148 82 / 0.16);
      }
      .toast__mark svg {
        width: 0.78rem;
        height: 0.78rem;
      }

      .toast__text {
        display: flex;
        flex-direction: column;
        gap: 0.1rem;
        min-width: 0;
      }
      .toast__title {
        font-family: var(--font-display);
        font-size: 1rem;
        line-height: 1.2;
        letter-spacing: 0.01em;
        white-space: nowrap;
      }
      .toast__meta {
        font-family: var(--font-body);
        font-size: 0.58rem;
        font-weight: 500;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--color-taupe);
        white-space: nowrap;
      }

      .toast__cta {
        flex: none;
        margin-left: 0.4rem;
        padding: 0.5rem 0.95rem;
        border-radius: 999px;
        border: 1px solid rgb(48 36 29 / 0.16);
        font-family: var(--font-body);
        font-size: 0.56rem;
        font-weight: 500;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: var(--color-mocha);
        transition:
          background 0.35s var(--ease-luxe),
          color 0.35s var(--ease-luxe),
          border-color 0.35s var(--ease-luxe);
      }
      .toast__cta:hover {
        background: var(--color-ink);
        border-color: var(--color-ink);
        color: var(--color-porcelain);
      }

      @media (max-width: 480px) {
        .toast {
          gap: 0.7rem;
          padding: 0.6rem 0.65rem 0.6rem 0.75rem;
        }
        .toast__title {
          font-size: 0.9rem;
          white-space: normal;
        }
        .toast__meta {
          white-space: normal;
          font-size: 0.52rem;
        }
        .toast__cta {
          padding: 0.45rem 0.7rem;
          font-size: 0.5rem;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .toast {
          transition: opacity 0.2s linear;
          transform: none;
        }
        .toast--in {
          transform: none;
        }
      }
    `,
  ],
})
export class ToastComponent {
  protected readonly fb = inject(BagFeedbackService);
  private readonly ui = inject(UiService);

  protected viewBag(): void {
    this.fb.dismiss();
    this.ui.openCart();
  }
}
