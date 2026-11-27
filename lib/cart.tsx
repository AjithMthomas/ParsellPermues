"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { GIFT, inr, productBySlug, sizeLabel, type SizeKey } from "@/data/products";
import { site } from "@/lib/site";

export interface Line {
  slug: string;
  size: SizeKey | "set";
  qty: number;
}

export interface FlyingItem {
  id: string;
  thumb: string;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
}

export interface CustomerData {
  name?: string;
  phone?: string;
  city?: string;
  address?: string;
  note?: string;
  orderId?: string;
}

interface CartApi {
  lines: Line[];
  count: number;
  subtotal: number;
  open: boolean;
  checkoutOpen: boolean;
  bump: number;
  flying: FlyingItem[];
  setOpen: (v: boolean) => void;
  setCheckoutOpen: (v: boolean) => void;
  startCheckout: () => void;
  add: (
    slug: string,
    size: SizeKey | "set",
    qty?: number,
    source?: React.MouseEvent | HTMLElement | { x: number; y: number } | null
  ) => void;
  setQty: (slug: string, size: SizeKey | "set", qty: number) => void;
  clear: () => void;
  removeFlying: (id: string) => void;
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
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [bump, setBump] = useState(0);
  const [flying, setFlying] = useState<FlyingItem[]>([]);
  const loaded = useRef(false);

  const startCheckout = useCallback(() => {
    setOpen(true);
    setCheckoutOpen(true);
  }, []);

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

  const removeFlying = useCallback((id: string) => {
    setFlying((items) => items.filter((it) => it.id !== id));
  }, []);

  const add = useCallback(
    (
      slug: string,
      size: SizeKey | "set",
      qty = 1,
      source?: React.MouseEvent | HTMLElement | { x: number; y: number } | null
    ) => {
      setLines((ls) => {
        const hit = ls.find((l) => l.slug === slug && l.size === size);
        if (hit) return ls.map((l) => (l === hit ? { ...l, qty: Math.min(20, l.qty + qty) } : l));
        return [...ls, { slug, size, qty }];
      });

      try {
        let startX = typeof window !== "undefined" ? window.innerWidth / 2 : 200;
        let startY = typeof window !== "undefined" ? window.innerHeight / 2 : 200;

        if (source) {
          if ("clientX" in source && typeof source.clientX === "number") {
            startX = source.clientX;
            startY = source.clientY;
          } else if ("getBoundingClientRect" in source && typeof source.getBoundingClientRect === "function") {
            const r = source.getBoundingClientRect();
            startX = r.left + r.width / 2;
            startY = r.top + r.height / 2;
          } else if ("x" in source && "y" in source && typeof source.x === "number" && typeof source.y === "number") {
            startX = source.x;
            startY = source.y;
          }
        } else if (typeof document !== "undefined" && document.activeElement) {
          const r = document.activeElement.getBoundingClientRect();
          if (r.width > 0 && r.height > 0) {
            startX = r.left + r.width / 2;
            startY = r.top + r.height / 2;
          }
        }

        const bagEl = typeof document !== "undefined" ? document.querySelector(".bag-btn") : null;
        let targetX = typeof window !== "undefined" ? window.innerWidth - 60 : 300;
        let targetY = 36;
        if (bagEl) {
          const br = bagEl.getBoundingClientRect();
          targetX = br.left + br.width / 2;
          targetY = br.top + br.height / 2;
        }

        const thumb =
          slug === GIFT.slug
            ? "/images/thumb/pura-symphony-200.webp"
            : `/images/thumb/${slug}-200.webp`;

        const id = `${Date.now()}-${Math.random()}`;
        setFlying((items) => [...items, { id, thumb, startX, startY, targetX, targetY }]);

        setTimeout(() => {
          setBump((b) => b + 1);
          removeFlying(id);
        }, 680);
      } catch {
        setBump((b) => b + 1);
      }
    },
    [removeFlying]
  );

  const setQty = useCallback((slug: string, size: SizeKey | "set", qty: number) => {
    setLines((ls) =>
      qty <= 0 ? ls.filter((l) => !(l.slug === slug && l.size === size)) : ls.map((l) => (l.slug === slug && l.size === size ? { ...l, qty: Math.min(20, qty) } : l)),
    );
  }, []);

  const value = useMemo<CartApi>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((s, l) => s + (lineInfo(l)?.unit ?? 0) * l.qty, 0);
    return {
      lines,
      count,
      subtotal,
      open,
      checkoutOpen,
      bump,
      flying,
      setOpen,
      setCheckoutOpen,
      startCheckout,
      add,
      setQty,
      clear: () => setLines([]),
      removeFlying,
    };
  }, [lines, open, checkoutOpen, bump, flying, add, setQty, removeFlying, startCheckout]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
}

/** The order message: customer details, every line, the total, ready to send in WhatsApp. */
export function orderMessage(lines: Line[], customer?: CustomerData) {
  const rows: string[] = ["Hello Pura, I would like to place an order:"];

  if (customer) {
    if (customer.orderId) rows.push(`Order ID: #${customer.orderId}`);
    if (customer.name) rows.push(`Name: ${customer.name}`);
    if (customer.phone) rows.push(`Phone: ${customer.phone}`);
    if (customer.city) rows.push(`City: ${customer.city}${customer.address ? `, ${customer.address}` : ""}`);
    if (customer.note) rows.push(`Note: ${customer.note}`);
  }

  rows.push("", "Items:");
  let total = 0;
  lines.forEach((l, i) => {
    const info = lineInfo(l);
    if (!info) return;
    total += info.unit * l.qty;
    rows.push(`${i + 1}. ${info.name} (${info.size}) × ${l.qty}: ${inr(info.unit * l.qty)}`);
  });

  rows.push("", `Total: ${inr(total)}`, "", "Please confirm availability and delivery. Thank you!");
  return rows.join("\n");
}

export function waLink(text: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}
