import { Component, input } from "@angular/core";
import type { Fragrance } from "../../data/fragrances";

let uidSeq = 0;

/**
 * THE bottle. One geometry, one label, one cap — used in every scene so the
 * product is identical everywhere by construction. Only the liquid colour
 * changes per fragrance edition.
 */
@Component({
  selector: "bdp-flacon",
  imports: [],
  templateUrl: "./flacon.component.html",
  styleUrl: "./flacon.component.css",
})
export class FlaconComponent {
  readonly fragrance = input<Fragrance>();
  readonly uid = `flac${++uidSeq}`;

  get gid(): string {
    return this.uid;
  }
}
