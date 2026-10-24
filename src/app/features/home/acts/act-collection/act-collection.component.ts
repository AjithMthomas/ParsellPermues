import { Component, inject, signal } from "@angular/core";
import { FRAGRANCES, Fragrance, VOLUME_OPTIONS, priceForVolume } from "../../../../data/fragrances";
import { WorldStageComponent } from "../../../../art/world-stage/world-stage.component";
import { CartService } from "../../../../services/cart.service";
import { ProductsService } from "../../../../services/products.service";
import { WhatsAppService } from "../../../../services/whatsapp.service";
import { RevealDirective } from "../../../../core/reveal.directive";

interface WorldStyle {
  vars: string;
  nav: "ink" | "ivory";
  side: "l" | "r";
}

const STYLE: Record<string, WorldStyle> = {
  symphony: {
    vars:
      "--w-bg:#FDFCF8;--w-ink:#2D251D;--w-mut:#5A4A3B;--w-line:rgb(201 162 77 / 0.28);",
    nav: "ink",
    side: "l",
  },
  obsidian: {
    vars:
      "--w-bg:#181614;--w-ink:#FAF7F2;--w-mut:#C8B9A6;--w-line:rgb(201 162 77 / 0.32);",
    nav: "ivory",
    side: "r",
  },
  "elin-lush": {
    vars:
      "--w-bg:#F2F6ED;--w-ink:#25301F;--w-mut:#4C5840;--w-line:rgb(74 88 62 / 0.24);",
    nav: "ink",
    side: "l",
  },
  iris: {
    vars:
      "--w-bg:#F8F4F9;--w-ink:#2A212E;--w-mut:#57485E;--w-line:rgb(168 132 184 / 0.28);",
    nav: "ink",
    side: "r",
  },
  aube: {
    vars:
      "--w-bg:#FDFCF8;--w-ink:#2D251D;--w-mut:#5A4A3B;--w-line:rgb(201 162 77 / 0.28);",
    nav: "ink",
    side: "l",
  },
  velours: {
    vars:
      "--w-bg:#181614;--w-ink:#FAF7F2;--w-mut:#C8B9A6;--w-line:rgb(201 162 77 / 0.32);",
    nav: "ivory",
    side: "r",
  },
  lune: {
    vars:
      "--w-bg:#F2F6ED;--w-ink:#25301F;--w-mut:#4C5840;--w-line:rgb(74 88 62 / 0.24);",
    nav: "ink",
    side: "l",
  },
};

@Component({
  selector: "bdp-act-collection",
  imports: [RevealDirective],
  templateUrl: "./act-collection.component.html",
  styleUrl: "./act-collection.component.css",
})
export class ActCollectionComponent {
  protected fragrances = FRAGRANCES;
  protected readonly volumeOptions = VOLUME_OPTIONS;
  protected selectedVolumes = signal<Record<string, number>>({});
  protected activeViews = signal<Record<string, string>>({});
  protected added = signal<string[]>([]);

  private readonly cart = inject(CartService);
  private readonly products = inject(ProductsService);
  private readonly wa = inject(WhatsAppService);

  protected styleOf = (f: Fragrance): string => {
    return (STYLE[f.world] ?? STYLE["symphony"]).vars;
  };
  protected navOf = (f: Fragrance): "ink" | "ivory" => {
    return (STYLE[f.world] ?? STYLE["symphony"]).nav;
  };
  protected sideOf = (f: Fragrance): "l" | "r" => {
    return (STYLE[f.world] ?? STYLE["symphony"]).side;
  };

  protected getVolume(f: Fragrance): number {
    return this.selectedVolumes()[f.slug] ?? 100;
  }

  protected setVolume(f: Fragrance, vol: number): void {
    this.selectedVolumes.update((m) => ({ ...m, [f.slug]: vol }));
  }

  protected price(f: Fragrance): string {
    const vol = this.getVolume(f);
    return this.products.format(priceForVolume(vol));
  }

  protected join(notes: string[]): string {
    return notes.join(" · ");
  }

  protected activeImg(f: Fragrance): string {
    const view = this.activeViews()[f.slug] || "scene";
    if (view === "cover" && f.images?.cover) return f.images.cover;
    if (view === "ad" && f.images?.ad) return f.images.ad;
    if (view === "poster" && f.images?.poster) return f.images.poster;
    if (view === "bottle8ml" && f.images?.bottle8ml) return f.images.bottle8ml;
    return f.images?.scene || `/assets/products/${f.slug}/scene.png`;
  }

  protected setView(f: Fragrance, viewKey: string): void {
    this.activeViews.update((m) => ({ ...m, [f.slug]: viewKey }));
  }

  protected addToBag(f: Fragrance): void {
    const vol = this.getVolume(f);
    this.cart.add(f, vol, 1);
    const slug = f.slug;
    this.added.update((a) => [...a, slug]);
    setTimeout(() => {
      this.added.update((a) => a.filter((s) => s !== slug));
    }, 2400);
  }

  protected orderOnWhatsApp(f: Fragrance): void {
    const vol = this.getVolume(f);
    this.wa.open(this.wa.order(f, vol, 1));
  }
}
