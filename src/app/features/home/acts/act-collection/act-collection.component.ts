import { Component, inject, signal } from "@angular/core";
import { FRAGRANCES, Fragrance } from "../../../../data/fragrances";
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
  aube: {
    vars:
      "--w-bg:#F7F4EE;--w-ink:#30241D;--w-mut:#4A3729;--w-line:rgb(48 36 29 / 0.14);",
    nav: "ink",
    side: "l",
  },
  velours: {
    vars:
      "--w-bg:#251B13;--w-ink:#F4EFE6;--w-mut:#C9B9A4;--w-line:rgb(244 239 230 / 0.16);",
    nav: "ivory",
    side: "r",
  },
  lune: {
    vars:
      "--w-bg:#E9EBDD;--w-ink:#33371F;--w-mut:#4c5236;--w-line:rgb(51 55 31 / 0.15);",
    nav: "ink",
    side: "l",
  },
};

@Component({
  selector: "bdp-act-collection",
  imports: [WorldStageComponent, RevealDirective],
  templateUrl: "./act-collection.component.html",
  styleUrl: "./act-collection.component.css",
})
export class ActCollectionComponent {
  protected fragrances = FRAGRANCES;
  protected styleOf = (f: Fragrance): string => STYLE[f.world].vars;
  protected navOf = (f: Fragrance): string => STYLE[f.world].nav;
  protected sideOf = (f: Fragrance): "l" | "r" => STYLE[f.world].side;
  protected added = signal<string[]>([]);

  private readonly cart = inject(CartService);
  private readonly products = inject(ProductsService);
  private readonly wa = inject(WhatsAppService);

  protected price(f: Fragrance): string {
    return this.products.format(f.price);
  }

  protected join(notes: string[]): string {
    return notes.join(" · ");
  }

  protected pad(n: number): string {
    return String(n).padStart(2, "0");
  }

  protected material(f: Fragrance): string {
    switch (f.world) {
      case "velours":
        return "basalt";
      case "lune":
        return "moonstone";
      default:
        return "natural stone";
    }
  }

  protected addToBag(f: Fragrance): void {
    this.cart.add(f, 100, 1);
    const slug = f.slug;
    this.added.update((a) => [...a, slug]);
    setTimeout(() => {
      this.added.update((a) => a.filter((s) => s !== slug));
    }, 2400);
  }

  protected orderOnWhatsApp(f: Fragrance): void {
    this.wa.open(this.wa.order(f, 100, 1));
  }
}
