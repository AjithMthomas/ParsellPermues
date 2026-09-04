import { Component, inject, signal } from "@angular/core";
import { WorldStageComponent } from "../../../../art/world-stage/world-stage.component";
import { DustComponent } from "../../../../art/dust/dust.component";
import { FRAGRANCES } from "../../../../data/fragrances";
import { CartService } from "../../../../services/cart.service";
import { ProductsService } from "../../../../services/products.service";
import { WhatsAppService } from "../../../../services/whatsapp.service";
import { RevealDirective } from "../../../../core/reveal.directive";
import { ScrollService } from "../../../../core/scroll.service";

const NO1 = FRAGRANCES[0];

/**
 * SCENE XIV — THE FINAL SCENE.
 * The single dark frame of the film: deep espresso, one luminous bottle,
 * the invitation to wear it.
 */
@Component({
  selector: "bdp-act-final",
  imports: [WorldStageComponent, DustComponent, RevealDirective],
  templateUrl: "./act-final.component.html",
  styleUrl: "./act-final.component.css",
})
export class ActFinalComponent {
  protected no1 = NO1;
  protected added = signal(false);

  private readonly cart = inject(CartService);
  private readonly products = inject(ProductsService);
  private readonly scroll = inject(ScrollService);
  private readonly wa = inject(WhatsAppService);

  protected price(): string {
    return this.products.format(this.no1.price);
  }

  protected addToBag(): void {
    this.cart.add(this.no1, 100, 1);
    this.added.set(true);
    setTimeout(() => this.added.set(false), 2400);
  }

  protected orderOnWhatsApp(): void {
    this.wa.open(this.wa.order(this.no1, 100, 1));
  }

  protected goContact(e: Event): void {
    e.preventDefault();
    this.scroll.scrollToId("contact");
  }
}
