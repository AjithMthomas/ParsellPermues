import { Injectable } from "@angular/core";
import { ProductsService } from "./products.service";
import { CartLine } from "./cart.service";
import { Fragrance } from "../data/fragrances";

/**
 * WhatsApp commerce — every enquiry and every order opens a chat with the
 * maison's boutique line, carrying the product name, volume, quantity and
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
    const price = f.price * qty;
    return [
      "Hello PARADISA — I would like to order:",
      "",
      `• ${f.code} — ${f.name}`,
      `  ${volume} ml · Quantity ${qty}`,
      `  ${this.products.format(price)}`,
      "",
      "Please confirm availability and payment details. Merci.",
    ].join("\n");
  }

  /** Full bag order — every line with name, volume, quantity, and subtotal. */
  bag(lines: CartLine[], subtotal: number): string {
    const parts: string[] = [
      "Hello PARADISA — I would like to place an order:",
      "",
    ];
    lines.forEach((line, i) => {
      const f = this.products.bySlug(line.fragranceId);
      if (!f) return;
      parts.push(
        `${i + 1}. ${f.code} — ${f.name} · ${line.volume} ml · Qty ${line.qty}`,
        `   ${this.products.format(f.price * line.qty)}`,
      );
    });
    parts.push("", `Subtotal: ${this.products.format(subtotal)}`, "");
    parts.push("Please confirm availability and payment details. Merci.");
    return parts.join("\n");
  }

  /** Boutique / atelier enquiry from the contact page. */
  enquiry(name: string, subject: string, message: string): string {
    const lines = [
      `Hello PARADISA — ${subject || "an enquiry"} — ${name}`,
      "",
      message,
      "",
      `— ${name}${subject ? ` · ${subject}` : ""}`,
    ];
    return lines.join("\n");
  }
}
