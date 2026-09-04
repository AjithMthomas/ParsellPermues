/**
 * BEAUX DE PARIS — product data model.
 * Structured so a real backend can replace this file later without touching views.
 * The flacon artwork stays identical across every "photograph"; only `liquid`
 * (liquid colour) and `world` (its artistic environment) change per fragrance.
 */

export type WorldKey = "aube" | "velours" | "lune";

export interface Fragrance {
  id: string;
  code: string; // "Nº1"
  name: string; // "L'Aube"
  slug: string;
  price: number; // EUR — 100 ml
  volumes: number[];
  category: string[]; // "new" | "bestseller" | ...
  audience: string;
  descriptor: string; // "Floral — Daylight"
  line: string; // one poetic line
  intro: string;
  story: string;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  ingredients: string[];
  liquid: string[]; // three gradient stops for the liquid glass
  world: WorldKey;
}

export const FRAGRANCES: Fragrance[] = [
  {
    id: "no1-laube",
    code: "Nº1",
    name: "L'Aube",
    slug: "laube",
    price: 21600,
    volumes: [50, 100],
    category: ["bestseller", "new"],
    audience: "Unisexe",
    descriptor: "Floral — Daylight",
    line: "Morning light, distilled.",
    intro:
      "A floral eau de parfum born of the first hour of day — when the light is still cool, and the air tastes of petals.",
    story:
      "L'Aube opens like a window at first light. Bergamot cuts the dark; neroli and white magnolia warm it into morning; blond woods and white musk carry the day forward. Composed in Grasse, bottled in Paris.",
    topNotes: ["Bergamot", "Petitgrain", "Pear blossom"],
    heartNotes: ["Neroli", "White magnolia", "Iris"],
    baseNotes: ["Blond woods", "White musk", "Ambrette seed"],
    ingredients: [
      "Bergamot of Calabria",
      "Neroli of Tunisia",
      "White magnolia",
      "Florentine iris",
      "Blond cedar",
      "White musk",
    ],
    // sampled from the real Nº1 flacon (champagne-gold, ~#C7B281 core)
    liquid: ["#efd9a8", "#c7a263", "#8f6a33"],
    world: "aube",
  },
  {
    id: "no2-le-velours",
    code: "Nº2",
    name: "Le Velours",
    slug: "le-velours",
    price: 23400,
    volumes: [50, 100],
    category: ["bestseller"],
    audience: "Unisexe",
    descriptor: "Oriental — Night",
    line: "The hour after midnight.",
    intro:
      "An oriental eau de parfum spun from dark fruit, damask rose and amber — made for the hours that belong to no one.",
    story:
      "Le Velours is the scent of a room after the last guest has gone. Pink pepper and plum arrive first, sharp as candlelight; rose absolue unrolls across them like cloth; amber, sandalwood and vanilla stay until morning.",
    topNotes: ["Pink pepper", "Dark plum", "Saffron"],
    heartNotes: ["Rose absolue", "Black peony", "Jasmine"],
    baseNotes: ["Amber", "Sandalwood", "Vanilla bean", "Grey musk"],
    ingredients: [
      "Pink pepper of Madagascar",
      "Rose of May",
      "Black peony",
      "Sandalwood of Mysore",
      "Amber resin",
      "Vanilla of Madagascar",
    ],
    liquid: ["#c98549", "#8a4a22", "#55260d"],
    world: "velours",
  },
  {
    id: "no3-jardin-de-lune",
    code: "Nº3",
    name: "Jardin de Lune",
    slug: "jardin-de-lune",
    price: 20700,
    volumes: [50, 100],
    category: ["new"],
    audience: "Unisexe",
    descriptor: "Green — Moonlight",
    line: "A garden beneath the moon.",
    intro:
      "A green eau de parfum of night gardens — fig leaves silvered by moonlight, blossoms that open only after dark.",
    story:
      "Jardin de Lune was imagined in a garden that never sees the sun. Fig leaf and mandarin keep it cool; orange blossom and moonflower unfurl at its heart; vetiver and white cedar root it in the earth beneath.",
    topNotes: ["Fig leaf", "Mandarin zest", "Galbanum"],
    heartNotes: ["Orange blossom", "Moonflower", "Water lily"],
    baseNotes: ["Vetiver", "White cedar", "Grey amber"],
    ingredients: [
      "Fig leaf",
      "Orange blossom of Seville",
      "Moonflower",
      "Vetiver of Haiti",
      "White cedar",
      "Grey amber",
    ],
    liquid: ["#eee8cf", "#ccd0a6", "#9aa377"],
    world: "lune",
  },
];

export function fragranceBySlug(slug: string): Fragrance | undefined {
  return FRAGRANCES.find((f) => f.slug === slug);
}
