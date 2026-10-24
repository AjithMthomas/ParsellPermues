import { Injectable } from "@angular/core";
import { FRAGRANCES, Fragrance, fragranceBySlug, priceForVolume } from "../data/fragrances";

export interface FinderAnswers {
  mood: string;
  atmosphere: string;
  impression: string;
}

/** Option → preferred fragrance slug across the 4 master creations. */
const MOOD: Record<string, string[]> = {
  FRESH: ["pura-elin-lush", "pura-symphony", "pura-iris", "pura-obsidian"],
  ELEGANT: ["pura-symphony", "pura-iris", "pura-obsidian", "pura-elin-lush"],
  SENSUAL: ["pura-obsidian", "pura-symphony", "pura-iris", "pura-elin-lush"],
  WARM: ["pura-obsidian", "pura-symphony", "pura-iris", "pura-elin-lush"],
  MYSTERIOUS: ["pura-obsidian", "pura-elin-lush", "pura-iris", "pura-symphony"],
};

const ATMOSPHERE: Record<string, string[]> = {
  DAYLIGHT: ["pura-symphony", "pura-elin-lush", "pura-iris", "pura-obsidian"],
  NIGHT: ["pura-obsidian", "pura-iris", "pura-symphony", "pura-elin-lush"],
  NATURE: ["pura-elin-lush", "pura-symphony", "pura-iris", "pura-obsidian"],
  CITY: ["pura-symphony", "pura-obsidian", "pura-iris", "pura-elin-lush"],
  VELVET: ["pura-obsidian", "pura-iris", "pura-symphony", "pura-elin-lush"],
};

const IMPRESSION: Record<string, string[]> = {
  SUBTLE: ["pura-iris", "pura-elin-lush", "pura-symphony", "pura-obsidian"],
  MEMORABLE: ["pura-symphony", "pura-obsidian", "pura-iris", "pura-elin-lush"],
  BOLD: ["pura-obsidian", "pura-symphony", "pura-elin-lush", "pura-iris"],
  ROMANTIC: ["pura-iris", "pura-symphony", "pura-obsidian", "pura-elin-lush"],
};

@Injectable({ providedIn: "root" })
export class ProductsService {
  readonly all: Fragrance[] = FRAGRANCES;

  bySlug(slug: string): Fragrance | undefined {
    return fragranceBySlug(slug);
  }

  format(price: number): string {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  }

  priceFor(volume: number): number {
    return priceForVolume(volume);
  }

  recommend(a: FinderAnswers): Fragrance {
    const votes = new Map<string, number>();
    const cast = (list: string[]) => {
      list.forEach((slug, i) => {
        votes.set(slug, (votes.get(slug) ?? 0) + (4 - i));
      });
    };
    cast(MOOD[a.mood] ?? MOOD["ELEGANT"]);
    cast(ATMOSPHERE[a.atmosphere] ?? ATMOSPHERE["DAYLIGHT"]);
    cast(IMPRESSION[a.impression] ?? IMPRESSION["MEMORABLE"]);
    const winner = [...votes.entries()].sort((x, y) => y[1] - x[1])[0][0];
    return this.bySlug(winner) ?? FRAGRANCES[0];
  }
}
