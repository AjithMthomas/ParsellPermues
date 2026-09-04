import { Component, input, signal, inject, afterNextRender } from "@angular/core";
import type { Fragrance } from "../../data/fragrances";
import { ProductArtComponent } from "../product-art/product-art.component";
import { PedestalComponent, PedestalKind } from "../pedestal/pedestal.component";
import { BotanicalComponent, BotanicalKind } from "../botanical/botanical.component";
import { DustComponent } from "../dust/dust.component";
import { AssetArtService } from "../../services/asset-art.service";

const WORLD: Record<
  string,
  { ped: PedestalKind; bot: BotanicalKind[]; bot2: BotanicalKind }
> = {
  aube: { ped: "rock", bot: ["branch", "sprig"], bot2: "grass" },
  velours: { ped: "basalt", bot: ["buds", "iris"], bot2: "figleaf" },
  lune: { ped: "moon", bot: ["moonflower", "sprig"], bot2: "grass" },
};

/**
 * A fragrance "world" still.
 *
 * When `plate` is true and a real campaign photograph exists at
 * /assets/products/<slug>/scene.(webp|png), the full photographic plate is
 * shown (it already contains the bottle, pedestal and botanicals).
 * Otherwise the flacon cutout is composed on its natural material with
 * procedural botanicals — same bottle geometry everywhere.
 */
@Component({
  selector: "bdp-world-stage",
  imports: [ProductArtComponent, PedestalComponent, BotanicalComponent, DustComponent],
  template: `
    @if (plate() && plateSrc(); as src) {
      <div class="wplate" aria-hidden="true">
        <img class="wplate__img" [src]="src" alt="" loading="lazy" decoding="async" />
        <span class="wplate__veil" aria-hidden="true"></span>
        <bdp-dust class="wplate__dust" [density]="14" />
      </div>
    } @else {
      <div class="wstage" aria-hidden="true">
        <div class="wstage__bot wstage__bot--back">
          <bdp-botanical [kind]="world().bot[0]" />
        </div>
        <div class="wstage__bot wstage__bot--flank">
          <bdp-botanical [kind]="world().bot[1]" />
        </div>

        <div class="wstage__ground" aria-hidden="true"></div>
        <div class="wstage__ped">
          <bdp-pedestal [kind]="world().ped" />
        </div>
        <div class="wstage__shadow"></div>
        <div class="wstage__bottle">
          <bdp-product-art [fragrance]="fragrance()" alt="" />
        </div>

        <div class="wstage__bot wstage__bot--front">
          <bdp-botanical [kind]="world().bot2" />
        </div>
        <bdp-dust class="wstage__dust" [density]="16" />
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
      line-height: 0;
      color: rgb(48 36 29 / 0.55);
    }
    /* darker worlds need lighter botanical strokes */
    :host-context(.world--velours),
    :host-context(.final-scene) {
      color: rgb(252 251 248 / 0.45);
    }
    /* pull the campaign plate toward its copy so image & text sit together */
    :host-context(.world--l) .wplate {
      margin-left: 0;
      margin-right: auto;
    }
    :host-context(.world--r) .wplate {
      margin-right: 0;
      margin-left: auto;
    }
    .wstage {
      position: relative;
      aspect-ratio: 320 / 250;
      width: 100%;
      height: 100%;
    }
    .wstage__ped {
      position: absolute;
      inset: 0;
    }
    .wstage__ground {
      position: absolute;
      left: 2%;
      bottom: -1%;
      width: 96%;
      height: 7%;
      background: radial-gradient(ellipse at center, rgb(27 18 11 / 0.2), transparent 70%);
      border-radius: 50%;
      filter: blur(4px);
      z-index: 0;
    }
    .wstage__bottle {
      position: absolute;
      left: 29.5%;
      bottom: 6.5%;
      width: 41.5%;
      z-index: 3;
    }
    .wstage__shadow {
      position: absolute;
      left: 21%;
      bottom: 5.9%;
      width: 58%;
      height: 3%;
      background: radial-gradient(ellipse at center, rgb(40 26 17 / 0.3), transparent 65%);
      border-radius: 50%;
      filter: blur(2px);
      z-index: 2;
    }
    .wstage__bot {
      position: absolute;
      z-index: 1;
      pointer-events: none;
      opacity: 0.75;
    }
    .wstage__bot--back {
      left: -4%;
      bottom: 10%;
      width: 62%;
      transform: rotate(-30deg);
      opacity: 0.7;
    }
    .wstage__bot--flank {
      left: 78%;
      bottom: 36%;
      width: 32%;
      transform: rotate(64deg);
      opacity: 0.55;
    }
    .wstage__bot--front {
      left: 6%;
      bottom: -6%;
      width: 38%;
      transform: rotate(8deg);
      opacity: 0.75;
    }
    .wstage__dust {
      position: absolute;
      inset: 0;
      z-index: 0;
    }

    /* ---- photographic campaign plate mode ---- */
    .wplate {
      position: relative;
      width: min(30vw, 34rem);
      margin: 0 auto;
      aspect-ratio: 3 / 4;
      overflow: hidden;
      border-radius: 2px;
      border: 1px solid rgb(184 148 82 / 0.35);
      box-shadow: 0 3rem 5rem -3rem rgb(74 55 41 / 0.4);
      background: rgb(244 240 230);
    }
    .wplate__img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: 50% 26%;
    }
    .wplate__veil {
      position: absolute;
      inset: 0;
      pointer-events: none;
      box-shadow:
        inset 0 0 0 1px rgb(252 251 248 / 0.35),
        inset 0 -4rem 6rem -3rem rgb(48 36 29 / 0.28);
    }
    .wplate__dust {
      position: absolute;
      inset: 0;
      z-index: 1;
      opacity: 0.8;
    }

    @media (max-width: 1023px) {
      .wplate {
        width: min(72vw, 26rem);
      }
    }
  `,
})
export class WorldStageComponent {
  /** Prefer the full photographic campaign plate over the composed still. */
  readonly plate = input(false);
  readonly fragrance = input<Fragrance>();

  protected readonly plateSrc = signal<string | null>(null);

  private readonly assets = inject(AssetArtService);

  constructor() {
    afterNextRender(() => {
      const f = this.fragrance();
      if (!f) return;
      void (async () => {
        const path = `/assets/products/${f.slug}/scene.png`;
        if (await this.assets.available(path)) this.plateSrc.set(path);
      })();
    });
  }

  world(): { ped: PedestalKind; bot: BotanicalKind[]; bot2: BotanicalKind } {
    return WORLD[this.fragrance()?.world ?? "aube"];
  }
}
