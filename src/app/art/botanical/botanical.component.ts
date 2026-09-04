import { Component, input } from "@angular/core";

export type BotanicalKind =
  | "sprig"
  | "branch"
  | "grass"
  | "peony"
  | "blossom"
  | "buds"
  | "citrus"
  | "moonflower"
  | "iris"
  | "amber"
  | "figleaf";

/**
 * Fine editorial line-drawn botanicals — original art, drawn with hairline
 * strokes so they read as engraving rather than photography.
 * Colour is inherited from `currentColor` so scenes tint them at will.
 */
@Component({
  selector: "bdp-botanical",
  imports: [],
  templateUrl: "./botanical.component.html",
  styleUrl: "./botanical.component.css",
})
export class BotanicalComponent {
  readonly kind = input<BotanicalKind>("sprig");
  readonly className = input("");

  stroke = "currentColor";

  get pathCls(): string {
    return `botanical botanical--${this.kind()} ${this.className()}`;
  }
}
