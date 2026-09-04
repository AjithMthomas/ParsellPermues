import { Component, inject, signal, ElementRef, viewChild, afterNextRender } from "@angular/core";
import { gsap } from "gsap";
import { ProductArtComponent } from "../../../../art/product-art/product-art.component";
import { PedestalComponent } from "../../../../art/pedestal/pedestal.component";
import { BotanicalComponent } from "../../../../art/botanical/botanical.component";
import { DustComponent } from "../../../../art/dust/dust.component";
import { FRAGRANCES } from "../../../../data/fragrances";
import { CartService } from "../../../../services/cart.service";
import { ProductsService } from "../../../../services/products.service";
import { WhatsAppService } from "../../../../services/whatsapp.service";
import { CapabilitiesService } from "../../../../core/capabilities.service";

const NO1 = FRAGRANCES[0];

/**
 * SCENE VIII — THE SIGNATURE.
 * The hero edition returns and settles on its marble pedestal. On fine-pointer
 * devices the visitor's cursor becomes the studio light.
 */
@Component({
  selector: "bdp-act-signature",
  imports: [ProductArtComponent, PedestalComponent, BotanicalComponent, DustComponent],
  templateUrl: "./act-signature.component.html",
  styleUrl: "./act-signature.component.css",
})
export class ActSignatureComponent {
  protected no1 = NO1;
  protected added = signal(false);

  protected readonly wa = inject(WhatsAppService);
  private readonly cart = inject(CartService);
  private readonly products = inject(ProductsService);
  private readonly caps = inject(CapabilitiesService);
  private readonly el = inject(ElementRef);
  private readonly secEl = viewChild<ElementRef<HTMLElement>>("sec");
  private kill?: () => void;

  protected price(): string {
    return this.products.format(this.no1.price);
  }

  protected join(notes: string[]): string {
    return notes.join(" · ");
  }

  protected addToBag(): void {
    this.cart.add(this.no1, 100, 1);
    this.added.set(true);
    setTimeout(() => this.added.set(false), 2400);
  }

  protected orderOnWhatsApp(): void {
    this.wa.open(this.wa.order(this.no1, 100, 1));
  }

  constructor() {
    afterNextRender(() => this.setup());
  }

  private setup(): void {
    const sec = this.secEl()?.nativeElement;
    if (!sec || this.caps.rm || !this.caps.fine) return;
    const host = this.el.nativeElement as HTMLElement;
    const light = host.querySelector<HTMLElement>(".sig-light");
    const bottle = host.querySelector<HTMLElement>(".sig-bottle");
    const ped = host.querySelector<HTMLElement>(".sig-ped");
    if (!light) return;

    const move = (e: PointerEvent) => {
      const r = sec.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      light.style.setProperty("--lx", `${x}px`);
      light.style.setProperty("--ly", `${y}px`);
      gsap.to([bottle, ped], {
        x: (x / r.width - 0.5) * 14,
        y: (y / r.height - 0.5) * 10,
        duration: 1.2,
        ease: "power2.out",
        overwrite: "auto",
      });
      if (bottle) bottle.style.setProperty("--bdx", `${(x / r.width - 0.5) * 22}px`);
      if (bottle) bottle.style.setProperty("--bdy", `${(y / r.height - 0.5) * 16}px`);
    };
    const leave = () => {
      gsap.to([bottle, ped], { x: 0, y: 0, duration: 1.4, ease: "power3.out" });
      light.style.opacity = "0";
    };
    const enter = () => {
      light.style.opacity = "1";
    };

    sec.addEventListener("pointermove", move);
    sec.addEventListener("pointerenter", enter);
    sec.addEventListener("pointerleave", leave);
    this.kill = () => {
      sec.removeEventListener("pointermove", move);
      sec.removeEventListener("pointerenter", enter);
      sec.removeEventListener("pointerleave", leave);
    };
  }
}
