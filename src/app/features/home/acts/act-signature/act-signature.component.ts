import {
  Component,
  inject,
  signal,
  ElementRef,
  viewChild,
  afterNextRender,
} from "@angular/core";
import { gsap } from "gsap";
import { ProductArtComponent } from "../../../../art/product-art/product-art.component";
import { PedestalComponent } from "../../../../art/pedestal/pedestal.component";
import { BotanicalComponent } from "../../../../art/botanical/botanical.component";
import { DustComponent } from "../../../../art/dust/dust.component";
import { FRAGRANCES, VOLUME_OPTIONS, priceForVolume } from "../../../../data/fragrances";
import { CartService } from "../../../../services/cart.service";
import { ProductsService } from "../../../../services/products.service";
import { WhatsAppService } from "../../../../services/whatsapp.service";
import { CapabilitiesService } from "../../../../core/capabilities.service";

const NO1 = FRAGRANCES[0];

/**
 * SCENE VIII — THE SIGNATURE — PURA SYMPHONY.
 * Nature Meets Luxury.
 * Showcases the master cover image with gold frame botanical theme,
 * full volume selections (8ml, 30ml, 50ml, 100ml), and marble pedestal.
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
  protected selectedVolume = signal<number>(100);
  protected readonly volumeOptions = VOLUME_OPTIONS;

  protected readonly wa = inject(WhatsAppService);
  private readonly cart = inject(CartService);
  private readonly products = inject(ProductsService);
  private readonly caps = inject(CapabilitiesService);
  private readonly el = inject(ElementRef);
  private readonly secEl = viewChild<ElementRef<HTMLElement>>("sec");

  protected currentPrice(): string {
    return this.products.format(priceForVolume(this.selectedVolume()));
  }

  protected selectVolume(vol: number): void {
    this.selectedVolume.set(vol);
  }

  protected join(notes: string[]): string {
    return notes.join(" · ");
  }

  protected addToBag(): void {
    this.cart.add(this.no1, this.selectedVolume(), 1);
    this.added.set(true);
    setTimeout(() => this.added.set(false), 2400);
  }

  protected orderOnWhatsApp(): void {
    this.wa.open(this.wa.order(this.no1, this.selectedVolume(), 1));
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
        rotateY: ((x / r.width) - 0.5) * 8,
        rotateX: -((y / r.height) - 0.5) * 6,
        duration: 0.8,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const enter = () => {
      light.style.opacity = "1";
    };

    const leave = () => {
      light.style.opacity = "0";
      gsap.to([bottle, ped], {
        rotateY: 0,
        rotateX: 0,
        duration: 1.2,
        ease: "power3.out",
      });
    };

    sec.addEventListener("pointermove", move as EventListener);
    sec.addEventListener("pointerenter", enter);
    sec.addEventListener("pointerleave", leave);
  }
}
