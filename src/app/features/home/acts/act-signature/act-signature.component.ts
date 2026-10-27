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

export interface EditionCard {
  volume: number;
  label: string;
  qtyLabel: string;
  badge?: string;
  name: string;
  desc: string;
  price: number;
  unitPriceNote?: string;
  viewKey: "cover" | "scene" | "bottle8ml" | "display";
}

export const SYMPHONY_EDITIONS: EditionCard[] = [
  {
    volume: 8,
    label: "8 ml",
    qtyLabel: "3 Nos Pack",
    badge: "Discovery Trio",
    name: "Discovery Trio",
    desc: "Three 8ml portable flacons — perfect for discovery & travel.",
    price: 299,
    unitPriceNote: "Only ₹99 / bottle",
    viewKey: "bottle8ml",
  },
  {
    volume: 30,
    label: "30 ml",
    qtyLabel: "1 No",
    name: "Travel Flacon",
    desc: "Compact personal edition for everyday refinement.",
    price: 999,
    viewKey: "scene",
  },
  {
    volume: 50,
    label: "50 ml",
    qtyLabel: "1 No",
    name: "Classic Edition",
    desc: "The quintessential atelier flacon for home and vanity.",
    price: 1199,
    viewKey: "display",
  },
  {
    volume: 100,
    label: "100 ml",
    qtyLabel: "1 No",
    badge: "Flagship Choice",
    name: "Grand Master Flacon",
    desc: "The complete haute parfumerie statement in full presentation.",
    price: 1599,
    unitPriceNote: "Best value per ml",
    viewKey: "cover",
  },
];

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
  protected activeView = signal<"cover" | "scene" | "bottle8ml" | "display">("cover");
  protected readonly editions = SYMPHONY_EDITIONS;
  protected readonly volumeOptions = VOLUME_OPTIONS;

  protected readonly wa = inject(WhatsAppService);
  private readonly cart = inject(CartService);
  private readonly products = inject(ProductsService);
  private readonly caps = inject(CapabilitiesService);
  private readonly el = inject(ElementRef);
  private readonly secEl = viewChild<ElementRef<HTMLElement>>("sec");

  protected currentEdition(): EditionCard {
    return this.editions.find((e) => e.volume === this.selectedVolume()) ?? this.editions[3];
  }

  protected currentPrice(): string {
    return this.products.format(priceForVolume(this.selectedVolume()));
  }

  protected selectVolume(vol: number): void {
    this.selectedVolume.set(vol);
    const ed = this.editions.find((e) => e.volume === vol);
    if (ed) {
      this.activeView.set(ed.viewKey);
    }
  }

  protected setView(view: "cover" | "scene" | "bottle8ml" | "display"): void {
    this.activeView.set(view);
  }

  protected activeImageUrl(): string {
    const v = this.activeView();
    if (v === "bottle8ml") return "/assets/products/pura-symphony/bottle-8ml.png";
    if (v === "scene") return "/assets/products/pura-symphony/scene.png";
    if (v === "display") return "/assets/products/pura-symphony/display-square.png";
    return "/assets/products/pura-symphony/cover.png";
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
