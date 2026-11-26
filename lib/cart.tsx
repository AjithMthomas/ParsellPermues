"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { GIFT, inr, productBySlug, sizeLabel, type SizeKey } from "@/data/products";
import { site } from "@/lib/site";

export interface Line {
  slug: string;
  size: SizeKey | "set";
  qty: number;
}

interface CartApi {
  lines: Line[];
  count: number;
  subtotal: number;
  open: boolean;
  bump: number;
  setOpen: (v: boolean) => void;
  add: (slug: string, size: SizeKey | "set", qty?: number) => void;
  setQty: (slug: string, size: SizeKey | "set", qty: number) => void;
  clear: () => void;
}

const KEY = "pura-bag-v2";
const Ctx = createContext<CartApi | null>(null);

export function lineInfo(l: Line) {
  if (l.slug === GIFT.slug) return { name: GIFT.name, unit: GIFT.price, size: "Gift set", thumb: "/images/thumb/pura-symphony-200.webp" };
  const p = productBySlug(l.slug);
  if (!p || l.size === "set") return null;
  return { name: p.name, unit: p.prices[l.size], size: sizeLabel(l.size), thumb: `/images/thumb/${p.slug}-200.webp` };
}

function valid(l: Line) {
  return l && typeof l.qty === "number" && l.qty > 0 && lineInfo(l) !== null;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [open, setOpen] = useState(false);
  const [bump, setBump] = useState(0);
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const parsed = raw ? (JSON.parse(raw) as Line[]) : [];
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (Array.isArray(parsed)) setLines(parsed.filter(valid));
    } catch {
      /* storage blocked: start empty */
    }
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* storage blocked */
    }
  }, [lines]);

  const add = useCallback((slug: string, size: SizeKey | "set", qty = 1) => {
    setLines((ls) => {
      const hit = ls.find((l) => l.slug === slug && l.size === size);
      if (hit) return ls.map((l) => (l === hit ? { ...l, qty: Math.min(20, l.qty + qty) } : l));
      return [...ls, { slug, size, qty }];
    });
    setBump((b) => b + 1);
  }, []);

  const setQty = useCallback((slug: string, size: SizeKey | "set", qty: number) => {
    setLines((ls) =>
      qty <= 0 ? ls.filter((l) => !(l.slug === slug && l.size === size)) : ls.map((l) => (l.slug === slug && l.size === size ? { ...l, qty: Math.min(20, qty) } : l)),
    );
  }, []);

  const value = useMemo<CartApi>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((s, l) => s + (lineInfo(l)?.unit ?? 0) * l.qty, 0);
    return { lines, count, subtotal, open, bump, setOpen, add, setQty, clear: () => setLines([]) };
  }, [lines, open, bump, add, setQty]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
}

/** The order message: every line, the total, ready to send in WhatsApp. */
export function orderMessage(lines: Line[]) {
  const rows: string[] = ["Hello Pura, I would like to order:", ""];
  let total = 0;
  lines.forEach((l, i) => {
    const info = lineInfo(l);
    if (!info) return;
    total += info.unit * l.qty;
    rows.push(`${i + 1}. ${info.name}, ${info.size}, qty ${l.qty}: ${inr(info.unit * l.qty)}`);
  });
  rows.push("", `Total: ${inr(total)}`, "", "Please confirm availability and delivery. Thank you.");
  return rows.join("\n");
}

export function waLink(text: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}
