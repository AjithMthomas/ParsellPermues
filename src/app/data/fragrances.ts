/**
 * PURA PERFUMES — product data model.
 * Nature Meets Luxury.
 *
 * Four master creations:
 *  1. Pura Symphony (Nº1)
 *  2. Pura Obsidian (Nº2)
 *  3. Pura Elin Lush (Nº3)
 *  4. Pura Iris (Nº4)
 *
 * Standard volumes & pricing:
 *   8 ml  — ₹150
 *  30 ml  — ₹600
 *  50 ml  — ₹780
 * 100 ml  — ₹1,100
 */

export type WorldKey = "symphony" | "obsidian" | "elin-lush" | "iris" | "aube" | "velours" | "lune";

export interface VolumeOption {
  volume: number;
  price: number;
  label: string;
}

export const VOLUME_PRICES: Record<number, number> = {
  8: 150,
  30: 600,
  50: 780,
  100: 1100,
};

export const VOLUME_OPTIONS: VolumeOption[] = [
  { volume: 8, price: 150, label: "8 ml" },
  { volume: 30, price: 600, label: "30 ml" },
  { volume: 50, price: 780, label: "50 ml" },
  { volume: 100, price: 1100, label: "100 ml" },
];

export function priceForVolume(volume: number): number {
  return VOLUME_PRICES[volume] ?? 1100;
}

export interface FragranceImageSet {
  cover?: string;
  scene?: string;
  ad?: string;
  poster?: string;
  display?: string;
  bottle8ml?: string;
  cutout?: string;
}

export interface Fragrance {
  id: string;
  code: string; // "Nº1"
  name: string; // "Pura Symphony"
  shortName: string; // "Symphony"
  slug: string;
  price: number; // 100 ml default display price = 1100
  prices: Record<number, number>;
  volumes: number[];
  category: string[]; // "new" | "bestseller" | ...
  audience: string;
  descriptor: string; // "Floral — Daylight"
  tagline: string; // "Nature Meets Luxury"
  line: string; // one poetic line
  intro: string;
  story: string;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  ingredients: string[];
  liquid: string[]; // gradient stops for the liquid glass
  world: WorldKey;
  images: FragranceImageSet;
}

export const FRAGRANCES: Fragrance[] = [
  {
    id: "no1-pura-symphony",
    code: "Nº1",
    name: "Pura Symphony",
    shortName: "Symphony",
    slug: "pura-symphony",
    price: 1100,
    prices: VOLUME_PRICES,
    volumes: [8, 30, 50, 100],
    category: ["bestseller", "signature"],
    audience: "Unisexe",
    descriptor: "Floral & Golden Woods — Daylight",
    tagline: "Nature Meets Luxury",
    line: "Morning light, harmonised in gold.",
    intro:
      "A luminous eau de parfum born of the first hour of day — where golden blossoms, crystalline citrus, and warm woods unite in pure harmony.",
    story:
      "Pura Symphony opens like a sunlit garden at dawn. Bergamot cuts the stillness; white magnolia and neroli warm it into luminous bloom; blond cedar and golden musk carry the sillage forward. Nature meets luxury.",
    topNotes: ["Calabrian Bergamot", "Petitgrain", "Pear Blossom"],
    heartNotes: ["Tunisian Neroli", "White Magnolia", "Florentine Iris"],
    baseNotes: ["Blond Cedar", "Golden Amber", "White Musk"],
    ingredients: [
      "Bergamot of Calabria",
      "Neroli of Tunisia",
      "White magnolia",
      "Florentine iris",
      "Blond cedar",
      "White musk",
    ],
    liquid: ["#efd9a8", "#c7a263", "#8f6a33"],
    world: "symphony",
    images: {
      cover: "/assets/products/pura-symphony/cover.png",
      scene: "/assets/products/pura-symphony/scene.png",
      bottle8ml: "/assets/products/pura-symphony/bottle-8ml.png",
      display: "/assets/products/pura-symphony/display-square.png",
      cutout: "/assets/products/pura-symphony/cutout.png",
    },
  },
  {
    id: "no2-pura-obsidian",
    code: "Nº2",
    name: "Pura Obsidian",
    shortName: "Obsidian",
    slug: "pura-obsidian",
    price: 1100,
    prices: VOLUME_PRICES,
    volumes: [8, 30, 50, 100],
    category: ["bestseller"],
    audience: "Unisexe",
    descriptor: "Oriental Woody & Smoked Amber — Night",
    tagline: "Nature Meets Luxury",
    line: "The magnetic depth of obsidian night.",
    intro:
      "An intense oriental eau de parfum spun from smoked woods, dark fruit, and amber resin — crafted for the hours that belong to no one.",
    story:
      "Pura Obsidian commands the room with quiet authority. Pink pepper and saffron arrive first, sharp as candlelight; rose absolue and smoky peony unroll across them like dark velvet; amber, sandalwood, and vanilla stay until morning.",
    topNotes: ["Pink Pepper", "Dark Plum", "Black Saffron"],
    heartNotes: ["Rose de Mai", "Black Peony", "Midnight Jasmine"],
    baseNotes: ["Obsidian Amber", "Mysore Sandalwood", "Madagascar Vanilla", "Grey Musk"],
    ingredients: [
      "Pink pepper of Madagascar",
      "Rose of Grasse",
      "Smoked peony",
      "Sandalwood of Mysore",
      "Amber resin",
      "Vanilla of Madagascar",
    ],
    liquid: ["#c98549", "#8a4a22", "#55260d"],
    world: "obsidian",
    images: {
      scene: "/assets/products/pura-obsidian/scene.png",
      ad: "/assets/products/pura-obsidian/ad.png",
      poster: "/assets/products/pura-obsidian/poster.png",
      cutout: "/assets/products/pura-obsidian/cutout.png",
    },
  },
  {
    id: "no3-pura-elin-lush",
    code: "Nº3",
    name: "Pura Elin Lush",
    shortName: "Elin Lush",
    slug: "pura-elin-lush",
    price: 1100,
    prices: VOLUME_PRICES,
    volumes: [8, 30, 50, 100],
    category: ["new", "botanical"],
    audience: "Unisexe",
    descriptor: "Fresh Botanical & Green Petals — Dawn",
    tagline: "Nature Meets Luxury",
    line: "The untamed serenity of lush rain-washed gardens.",
    intro:
      "A lush, green eau de parfum capturing morning dew on wild foliage — crushed leaves, sparkling citrus, and blossoms that unfurl in the shade.",
    story:
      "Pura Elin Lush was born in a secluded botanical sanctuary. Fig leaf and green mandarin keep it vibrant and cool; white water lily and orange blossom awaken at its heart; vetiver and white cedar root it deep in rain-washed earth.",
    topNotes: ["Wild Fig Leaf", "Green Mandarin", "Galbanum"],
    heartNotes: ["Orange Blossom", "White Lotus", "Water Lily"],
    baseNotes: ["Haitian Vetiver", "Atlas Cedar", "Grey Amber"],
    ingredients: [
      "Fig leaf of Provence",
      "Orange blossom of Seville",
      "White lotus",
      "Vetiver of Haiti",
      "Atlas cedar",
      "Grey amber",
    ],
    liquid: ["#eee8cf", "#ccd0a6", "#9aa377"],
    world: "elin-lush",
    images: {
      scene: "/assets/products/pura-elin-lush/scene.png",
      ad: "/assets/products/pura-elin-lush/nature.png",
      poster: "/assets/products/pura-elin-lush/ad-alt.png",
      cutout: "/assets/products/pura-elin-lush/cutout.png",
    },
  },
  {
    id: "no4-pura-iris",
    code: "Nº4",
    name: "Pura Iris",
    shortName: "Iris",
    slug: "pura-iris",
    price: 1100,
    prices: VOLUME_PRICES,
    volumes: [8, 30, 50, 100],
    category: ["new", "haute"],
    audience: "Unisexe",
    descriptor: "Powdery Floral & Velvet Cashmere — Twilight",
    tagline: "Nature Meets Luxury",
    line: "Powdery petals veiled in softest cashmere.",
    intro:
      "A sublime powdery eau de parfum centered around Florentine iris — delicate, aristocratic, settling upon the skin like cashmere silk.",
    story:
      "Pura Iris unfolds with effortless grace. White peach and crisp violet leaf introduce the precious butter of Florentine iris; heliotrope and soft orris powder wrap the heart; cashmere wood and ambrette seed linger with intimate warmth.",
    topNotes: ["White Peach", "Violet Leaf", "Cardamom Spark"],
    heartNotes: ["Florentine Iris", "Heliotrope", "Orris Accord"],
    baseNotes: ["Cashmere Wood", "Clean White Musk", "Ambrette Seed"],
    ingredients: [
      "Florentine iris pallida",
      "Violet leaf of Grasse",
      "White peach nectar",
      "Cashmere wood",
      "Ambrette seed",
      "White silk musk",
    ],
    liquid: ["#e9d5f0", "#b89ac9", "#88639e"],
    world: "iris",
    images: {
      scene: "/assets/products/pura-iris/scene.png",
      ad: "/assets/products/pura-iris/ad-50ml.png",
      poster: "/assets/products/pura-iris/ad-alt.png",
      cutout: "/assets/products/pura-iris/cutout.png",
    },
  },
];

/**
 * Robust slug lookup supporting new and legacy aliases
 */
export function fragranceBySlug(slug: string): Fragrance | undefined {
  if (!slug) return undefined;
  const s = slug.toLowerCase().trim();

  // Direct matches
  const match = FRAGRANCES.find((f) => f.slug === s || f.id === s || f.shortName.toLowerCase() === s);
  if (match) return match;

  // Aliases for compatibility
  if (s === "laube" || s === "symphony" || s === "no1-laube") return FRAGRANCES[0];
  if (s === "le-velours" || s === "velours" || s === "obsidian" || s === "no2-le-velours") return FRAGRANCES[1];
  if (s === "jardin-de-lune" || s === "lune" || s === "elin-lush" || s === "no3-jardin-de-lune") return FRAGRANCES[2];
  if (s === "iris" || s === "no4-iris") return FRAGRANCES[3];

  return undefined;
}
