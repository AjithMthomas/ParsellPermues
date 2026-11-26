/**
 * Pura catalogue. One file to edit for names, prices and copy.
 *
 * Nº1 to Nº4 are the client's original four with their original prices.
 * Nº5 to Nº12 are new additions (copy and notes to confirm with the perfumer).
 */

export type SizeKey = "8" | "30" | "50" | "100";
export type Audience = "her" | "him" | "unisex";

export interface Product {
  slug: string;
  code: string;
  name: string;
  short: string;
  audience: Audience;
  family: string;
  line: string;
  description: string;
  notes: { top: string[]; heart: string[]; base: string[] };
  prices: Record<SizeKey, number>;
  /** card ground: two colours for the gradient, and whether text on it is light */
  tone: [string, string];
  darkCard: boolean;
  mood: "fresh" | "floral" | "warm";
  time: "day" | "night" | "any";
  bestseller?: boolean;
  isNew?: boolean;
  premium?: boolean;
  /** campaign photographs in /images/scenes, first is the lead */
  scenes?: string[];
}

export const STANDARD: Record<SizeKey, number> = { "8": 899, "30": 999, "50": 1199, "100": 1599 };
export const PRIVE: Record<SizeKey, number> = { "8": 999, "30": 1199, "50": 1499, "100": 1899 };

export const SIZES: { key: SizeKey; label: string; hint: string }[] = [
  { key: "8", label: "8 ml × 3", hint: "Travel trio" },
  { key: "30", label: "30 ml", hint: "Everyday" },
  { key: "50", label: "50 ml", hint: "Signature" },
  { key: "100", label: "100 ml", hint: "Best value" },
];

export const AUDIENCE_LABEL: Record<Audience, string> = {
  her: "For Her",
  him: "For Him",
  unisex: "For Everyone",
};

export const PRODUCTS: Product[] = [
  {
    slug: "pura-symphony",
    code: "Nº1",
    name: "Pura Symphony",
    short: "Symphony",
    audience: "her",
    family: "Floral, golden woods",
    line: "Morning light, harmonised in gold.",
    description:
      "Bergamot opens it, white magnolia and neroli warm it into bloom, and blond cedar with golden musk carries it through the day.",
    notes: {
      top: ["Calabrian bergamot", "Petitgrain", "Pear blossom"],
      heart: ["Tunisian neroli", "White magnolia", "Florentine iris"],
      base: ["Blond cedar", "Golden amber", "White musk"],
    },
    prices: STANDARD,
    tone: ["#f3e6cf", "#d9bf94"],
    darkCard: false,
    mood: "floral",
    time: "day",
    bestseller: true,
    scenes: ["symphony-wide", "her-trio"],
  },
  {
    slug: "pura-obsidian",
    code: "Nº2",
    name: "Pura Obsidian",
    short: "Obsidian",
    audience: "him",
    family: "Oriental woody, smoked amber",
    line: "The magnetic depth of obsidian night.",
    description:
      "Pink pepper and saffron arrive first, rose and smoky peony unroll beneath them, and amber, sandalwood and vanilla stay until morning.",
    notes: {
      top: ["Pink pepper", "Dark plum", "Black saffron"],
      heart: ["Rose de Mai", "Black peony", "Midnight jasmine"],
      base: ["Amber resin", "Mysore sandalwood", "Madagascar vanilla"],
    },
    prices: STANDARD,
    tone: ["#3a332e", "#141110"],
    darkCard: true,
    mood: "warm",
    time: "night",
    scenes: ["obsidian-wide", "obsidian-alt"],
  },
  {
    slug: "pura-elin-lush",
    code: "Nº3",
    name: "Pura Elin Lush",
    short: "Elin Lush",
    audience: "unisex",
    family: "Fresh botanical, green petals",
    line: "Rain-washed gardens, bottled.",
    description:
      "Fig leaf and green mandarin keep it cool, orange blossom and water lily open at its heart, and vetiver with cedar roots it in wet earth.",
    notes: {
      top: ["Wild fig leaf", "Green mandarin", "Galbanum"],
      heart: ["Orange blossom", "White lotus", "Water lily"],
      base: ["Haitian vetiver", "Atlas cedar", "Grey amber"],
    },
    prices: STANDARD,
    tone: ["#53604a", "#1d241b"],
    darkCard: true,
    mood: "fresh",
    time: "day",
    scenes: ["elin-lush-wide", "elin-lush-alt"],
  },
  {
    slug: "pura-iris",
    code: "Nº4",
    name: "Pura Iris",
    short: "Iris",
    audience: "her",
    family: "Powdery floral, cashmere",
    line: "Powdery petals in soft cashmere.",
    description:
      "White peach and violet leaf lead into Florentine iris and heliotrope, then cashmere wood and ambrette settle close to the skin.",
    notes: {
      top: ["White peach", "Violet leaf", "Cardamom"],
      heart: ["Florentine iris", "Heliotrope", "Orris"],
      base: ["Cashmere wood", "White musk", "Ambrette seed"],
    },
    prices: STANDARD,
    tone: ["#5b5160", "#211c24"],
    darkCard: true,
    mood: "floral",
    time: "night",
    scenes: ["iris-wide", "iris-alt"],
  },
  {
    slug: "pura-rosa",
    code: "Nº5",
    name: "Pura Rosa",
    short: "Rosa",
    audience: "her",
    family: "Fresh rose, lychee",
    line: "A rose picked at first light.",
    description:
      "Lychee and pink pepper lift a heart of Turkish rose and peony, softened by white musk and a trace of cashmere.",
    notes: {
      top: ["Lychee", "Pink pepper", "Bergamot"],
      heart: ["Turkish rose", "Peony", "Freesia"],
      base: ["White musk", "Cashmere wood", "Soft amber"],
    },
    prices: STANDARD,
    tone: ["#f2d6cf", "#d9a79c"],
    darkCard: false,
    mood: "floral",
    time: "day",
    isNew: true,
    scenes: ["her-trio"],
  },
  {
    slug: "pura-bloom",
    code: "Nº6",
    name: "Pura Bloom",
    short: "Bloom",
    audience: "her",
    family: "Fruity floral, peony",
    line: "Pear, peony and a light step.",
    description:
      "Juicy pear and mandarin over a bouquet of peony and freesia, finished with clean musk. Bright enough for every day.",
    notes: {
      top: ["Nashi pear", "Mandarin", "Blackcurrant bud"],
      heart: ["Peony", "Freesia", "Magnolia"],
      base: ["Clean musk", "Cedar", "Ambrette"],
    },
    prices: STANDARD,
    tone: ["#f5e2cf", "#e2b98f"],
    darkCard: false,
    mood: "fresh",
    time: "day",
    isNew: true,
  },
  {
    slug: "pura-lumiere",
    code: "Nº7",
    name: "Pura Lumière",
    short: "Lumière",
    audience: "her",
    family: "Amber floral, vanilla",
    line: "Warm skin, white flowers, candlelight.",
    description:
      "Jasmine sambac and tuberose glow over Madagascar vanilla and tonka. Soft at first, deeper as the evening goes on.",
    notes: {
      top: ["Mandarin", "Pink pepper", "Pear"],
      heart: ["Jasmine sambac", "Tuberose", "Orange blossom"],
      base: ["Madagascar vanilla", "Tonka bean", "Sandalwood"],
    },
    prices: STANDARD,
    tone: ["#6b4a33", "#2a1b12"],
    darkCard: true,
    mood: "warm",
    time: "night",
    isNew: true,
  },
  {
    slug: "pura-azure",
    code: "Nº8",
    name: "Pura Azure",
    short: "Azure",
    audience: "him",
    family: "Aromatic aquatic, citrus",
    line: "Sea air and cold citrus.",
    description:
      "Bergamot and grapefruit over sea salt, a clean heart of geranium and rosemary, and a dry base of vetiver and cedar.",
    notes: {
      top: ["Bergamot", "Grapefruit", "Sea salt"],
      heart: ["Geranium", "Rosemary", "Lavender"],
      base: ["Vetiver", "Cedar", "Ambergris accord"],
    },
    prices: STANDARD,
    tone: ["#2d4a66", "#0f1b29"],
    darkCard: true,
    mood: "fresh",
    time: "day",
    isNew: true,
    scenes: ["him-trio"],
  },
  {
    slug: "pura-ember",
    code: "Nº9",
    name: "Pura Ember",
    short: "Ember",
    audience: "him",
    family: "Spiced leather, tobacco",
    line: "Leather, tobacco and a fire burning low.",
    description:
      "Cardamom and black pepper warm a heart of tobacco leaf and soft leather, resting on tonka, benzoin and smoked woods.",
    notes: {
      top: ["Cardamom", "Black pepper", "Cinnamon"],
      heart: ["Tobacco leaf", "Leather", "Clove"],
      base: ["Tonka bean", "Benzoin", "Smoked woods"],
    },
    prices: STANDARD,
    tone: ["#6e2a1e", "#2a0f0b"],
    darkCard: true,
    mood: "warm",
    time: "night",
    isNew: true,
    scenes: ["him-trio"],
  },
  {
    slug: "pura-oud-royale",
    code: "Nº10",
    name: "Pura Oud Royale",
    short: "Oud Royale",
    audience: "him",
    family: "Oud, rose, saffron",
    line: "Our richest blend, worn by the drop.",
    description:
      "Saffron and bergamot open on an oud accord and dark rose, settling into patchouli, amber and leather. One spray is enough.",
    notes: {
      top: ["Saffron", "Bergamot", "Elemi"],
      heart: ["Oud accord", "Damask rose", "Cypriol"],
      base: ["Patchouli", "Amber", "Leather"],
    },
    prices: PRIVE,
    tone: ["#22453a", "#0b1a15"],
    darkCard: true,
    mood: "warm",
    time: "night",
    isNew: true,
    premium: true,
  },
  {
    slug: "pura-monarch",
    code: "Nº11",
    name: "Pura Monarch",
    short: "Monarch",
    audience: "him",
    family: "Woody aromatic, vetiver",
    line: "Pressed shirt, cedar, first meeting.",
    description:
      "Juniper and bergamot over a heart of cedar and clary sage, with vetiver and musk for a clean, confident dry-down.",
    notes: {
      top: ["Juniper", "Bergamot", "Green apple"],
      heart: ["Virginia cedar", "Clary sage", "Iris root"],
      base: ["Vetiver", "Musk", "Oakmoss"],
    },
    prices: STANDARD,
    tone: ["#4c5560", "#1a1e23"],
    darkCard: true,
    mood: "fresh",
    time: "any",
    isNew: true,
  },
  {
    slug: "pura-santal",
    code: "Nº12",
    name: "Pura Santal",
    short: "Santal",
    audience: "unisex",
    family: "Creamy woods, fig",
    line: "Sandalwood, fig and quiet afternoons.",
    description:
      "Milky fig and cardamom over creamy sandalwood and iris, grounded by cedar and papyrus. Close, soft and easy to share.",
    notes: {
      top: ["Fig", "Cardamom", "Bergamot"],
      heart: ["Sandalwood", "Iris", "Violet leaf"],
      base: ["Cedar", "Papyrus", "Skin musk"],
    },
    prices: STANDARD,
    tone: ["#eadcc4", "#c9ab80"],
    darkCard: false,
    mood: "warm",
    time: "any",
    isNew: true,
  },
];

export const GIFT = {
  slug: "his-and-hers-duo",
  name: "His & Hers Duo",
  price: 2199,
  saves: STANDARD["50"] * 2 - 2199,
  contents: ["Pura Symphony 50 ml", "Pura Obsidian 50 ml"],
};

export function productBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function fromPrice(p: Product): number {
  return p.prices["30"];
}

export const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export const sizeLabel = (k: SizeKey | "set") => (k === "set" ? "Gift set" : SIZES.find((s) => s.key === k)!.label);

export const packSrc = (slug: string) => `/images/pack/${slug}`;
export const thumbSrc = (slug: string) => `/images/thumb/${slug}-200.webp`;
