import {
  Component,
  input,
  signal,
  inject,
  afterNextRender,
} from "@angular/core";
import type { Fragrance } from "../../data/fragrances";
import { FlaconComponent } from "../flacon/flacon.component";
import { AssetArtService } from "../../services/asset-art.service";

/**
 * Chooses the product visual for a scene:
 *  · real campaign cutout from /assets/products/<slug>/ if present
 *  · the procedural flacon artwork otherwise (identical in every scene)
 */
@Component({
  selector: "bdp-product-art",
  imports: [FlaconComponent],
  template: `@if (imgSrc(); as src) {
    <img
      class="art"
      [src]="src"
      [alt]="alt()"
      loading="lazy"
      decoding="async"
    />
  } @else if (state() === 'pending') {
    <bdp-flacon [fragrance]="fragrance()" />
  } @else {
    <bdp-flacon [fragrance]="fragrance()" />
  }`,
  styles: `
    :host {
      display: block;
      width: 100%;
      height: 100%;
      line-height: 0;
    }
    .art {
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: 50% 100%;
      filter: drop-shadow(0 1.4rem 2.2rem rgb(74 55 41 / 0.16));
    }
  `,
})
export class ProductArtComponent {
  readonly fragrance = input<Fragrance>();
  readonly alt = input("");
  protected readonly state = signal<"pending" | "ready">("pending");
  protected readonly imgSrc = signal<string | null>(null);

  private readonly assets = inject(AssetArtService);

  constructor() {
    afterNextRender(() => this.resolve());
  }

  private async resolve(): Promise<void> {
    const f = this.fragrance();
    if (!f) {
      this.state.set("ready");
      return;
    }
    const path = await this.assets.find(f.slug);
    if (path) this.imgSrc.set(path);
    this.state.set("ready");
  }
}
