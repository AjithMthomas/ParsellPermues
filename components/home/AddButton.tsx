"use client";

import type { SizeKey } from "@/data/products";
import { useCart } from "@/lib/cart";

export function AddButton({ slug, size, label, link }: { slug: string; size: SizeKey | "set"; label: string; link?: boolean }) {
  const { add } = useCart();
  return (
    <button type="button" className={link ? "link" : "btn btn--primary"} onClick={() => add(slug, size)}>
      {label}
    </button>
  );
}
