"use client";

import type { SizeKey } from "@/data/products";
import { useCart } from "@/lib/cart";

export function AddButton({
  slug,
  size,
  label,
  link,
  className,
}: {
  slug: string;
  size: SizeKey | "set";
  label: string;
  link?: boolean;
  className?: string;
}) {
  const { add } = useCart();
  const cls = className || (link ? "link" : "btn btn--primary");
  return (
    <button type="button" className={cls} onClick={(e) => add(slug, size, 1, e)}>
      {label}
    </button>
  );
}
