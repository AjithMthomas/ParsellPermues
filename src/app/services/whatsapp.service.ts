import { Injectable } from "@angular/core";
import { ProductsService } from "./products.service";
import { CartLine } from "./cart.service";
import { Fragrance, priceForVolume } from "../data/fragrances";

/**
 * WhatsApp commerce — every enquiry and every order opens a chat with
 * Pura Perfumes, carrying the product name, volume, quantity and
 * totals so the atelier can confirm the order in one reply.
 */
@Injectable({ providedIn: "root" })
export class WhatsAppService {
  /** +91 8075 265 863 → international format for wa.me */
  readonly number = "918075265863";
  readonly display = "+91 8075 265 863";

  constructor(private readonly products: ProductsService) {}

  url(text: string): string {
    return `https://wa.me/${this.number}?text=${encodeURIComponent(text)}`;
  }

  open(text: string): void {
    window.open(this.url(text), "_blank", "noopener,noreferrer");
  }

  /** A single fragrance order — product name, volume, quantity, price. */
  order(f: Fragrance, volume = 100, qty = 1): string {
    const unitPrice = priceForVolume(volume);
    const price = unitPrice * qty;
    return [
      "Hello Pura Perfumes — I would like to order:",
      "",
      `• ${f.code} — ${f.name}`,
      `  Volume: ${volume} ml · Quantity: ${qty}`,
      `  Price: ${this.products.format(price)}`,
      "",
      "Please confirm availability and dispatch details. Thank you.",
    ].join("\n");
  }

  /** Full bag order — every line with name, volume, quantity, and subtotal. */
  bag(lines: CartLine[], subtotal: number): string {
    const parts: string[] = [
      "Hello Pura Perfumes — I would like to place an order:",
      "",
    ];
    lines.forEach((line, i) => {
      const f = this.products.bySlug(line.fragranceId);
      if (!f) return;
      const unitPrice = priceForVolume(line.volume);
      parts.push(
        `${i + 1}. ${f.code} — ${f.name} · ${line.volume} ml · Qty ${line.qty}`,
        `   ${this.products.format(unitPrice * line.qty)}`,
      );
    });
    parts.push("", `Total Amount: ${this.products.format(subtotal)}`, "");
    parts.push("Please confirm availability and dispatch details. Thank you.");
    return parts.join("\n");
  }

  /** Boutique / atelier enquiry from the contact page. */
  enquiry(name: string, subject: string, message: string): string {
    const lines = [
      `Hello Pura Perfumes — ${subject || "Fragrance Enquiry"} — ${name}`,
      "",
      message,
      "",
      `— ${name}${subject ? ` · ${subject}` : ""}`,
    ];
    return lines.join("\n");
  }
}
