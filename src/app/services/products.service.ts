import { Injectable } from "@angular/core";
import { FRAGRANCES, Fragrance, fragranceBySlug } from "../data/fragrances";

export interface FinderAnswers {
  mood: string;
  atmosphere: string;
  impression: string;
}

/** Option → preferred fragrance slug. A simple, predictable recommendation. */
const MOOD: Record<string, string[]> = {
  FRESH: ["laube", "jardin-de-lune", "le-velours"],
  ELEGANT: ["laube", "jardin-de-lune", "le-velours"],
  SENSUAL: ["le-velours", "laube", "jardin-de-lune"],
  WARM: ["le-velours", "jardin-de-lune", "laube"],
  MYSTERIOUS: ["jardin-de-lune", "le-velours", "laube"],
};

const ATMOSPHERE: Record<string, string[]> = {
  DAYLIGHT: ["laube", "jardin-de-lune", "le-velours"],
  NIGHT: ["le-velours", "jardin-de-lune", "laube"],
  NATURE: ["jardin-de-lune", "laube", "le-velours"],
  CITY: ["laube", "le-velours", "jardin-de-lune"],
  VELVET: ["le-velours", "jardin-de-lune", "laube"],
};

const IMPRESSION: Record<string, string[]> = {
  SUBTLE: ["laube", "jardin-de-lune", "le-velours"],
  MEMORABLE: ["jardin-de-lune", "le-velours", "laube"],
  BOLD: ["le-velours", "jardin-de-lune", "laube"],
  ROMANTIC: ["laube", "le-velours", "jardin-de-lune"],
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

  recommend(a: FinderAnswers): Fragrance {
    const votes = new Map<string, number>();
    const cast = (list: string[]) => {
      list.forEach((slug, i) => {
        votes.set(slug, (votes.get(slug) ?? 0) + (3 - i));
      });
    };
    cast(MOOD[a.mood] ?? MOOD["ELEGANT"]);
    cast(ATMOSPHERE[a.atmosphere] ?? ATMOSPHERE["DAYLIGHT"]);
    cast(IMPRESSION[a.impression] ?? IMPRESSION["MEMORABLE"]);
    const winner = [...votes.entries()].sort((x, y) => y[1] - x[1])[0][0];
    return this.bySlug(winner) ?? FRAGRANCES[0];
  }
}
