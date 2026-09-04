import { Injectable, signal, computed, effect } from "@angular/core";
import { FRAGRANCES, Fragrance, fragranceBySlug } from "../data/fragrances";

export interface CartLine {
  fragranceId: string;
  volume: number;
  qty: number;
}

const KEY = "bdp-cart-v1";

function load(): CartLine[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (l) => l && fragranceBySlug(l.fragranceId) && l.qty > 0 && l.volume > 0,
    );
  } catch {
    return [];
  }
}

@Injectable({ providedIn: "root" })
export class CartService {
  readonly lines = signal<CartLine[]>([]);
  readonly count = computed(() =>
    this.lines().reduce((n, l) => n + l.qty, 0),
  );
  readonly subtotal = computed(() =>
    this.lines().reduce((sum, l) => {
      const f = fragranceBySlug(l.fragranceId);
      return sum + (f ? f.price : 0) * l.qty;
    }, 0),
  );

  constructor() {
    if (typeof window !== "undefined") {
      this.lines.set(load());
      effect(() => {
        try {
          localStorage.setItem(KEY, JSON.stringify(this.lines()));
        } catch {
          /* storage unavailable */
        }
      });
    }
  }

  add(fragrance: Fragrance, volume = 100, qty = 1): void {
    this.lines.update((lines) => {
      const existing = lines.find(
        (l) => l.fragranceId === fragrance.slug && l.volume === volume,
      );
      if (existing) {
        return lines.map((l) =>
          l === existing ? { ...l, qty: l.qty + qty } : l,
        );
      }
      return [...lines, { fragranceId: fragrance.slug, volume, qty }];
    });
  }

  setQty(fragranceId: string, volume: number, qty: number): void {
    this.lines.update((lines) =>
      qty <= 0
        ? lines.filter(
            (l) => !(l.fragranceId === fragranceId && l.volume === volume),
          )
        : lines.map((l) =>
            l.fragranceId === fragranceId && l.volume === volume
              ? { ...l, qty }
              : l,
          ),
    );
  }

  remove(fragranceId: string, volume: number): void {
    this.lines.update((lines) =>
      lines.filter((l) => !(l.fragranceId === fragranceId && l.volume === volume)),
    );
  }

  clear(): void {
    this.lines.set([]);
  }

  fragranceOf(line: CartLine): Fragrance | undefined {
    return fragranceBySlug(line.fragranceId);
  }

  all(): Fragrance[] {
    return FRAGRANCES;
  }
}
