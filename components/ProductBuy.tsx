"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { SIZES, inr, type Product, type SizeKey } from "@/data/products";
import { orderMessage, useCart, waLink } from "@/lib/cart";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

export function ProductBuy({ p }: { p: Product }) {
  const [size, setSize] = useState<SizeKey>("100");
  const [qty, setQty] = useState(1);
  const { add } = useCart();
  const price = p.prices[size] * qty;
  const buyNow = waLink(orderMessage([{ slug: p.slug, size, qty }]));

  return (
    <>
      <div className="grid gap-5">
        <div className="size-row justify-start!" role="group" aria-label="Size">
          {SIZES.map((s) => (
            <button key={s.key} className="size" aria-pressed={size === s.key} onClick={() => setSize(s.key)}>
              {s.label} · {inr(p.prices[s.key])}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="qty" aria-label="Quantity">
            <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="One less">
              <Minus size={16} />
            </button>
            <span aria-live="polite">{qty}</span>
            <button onClick={() => setQty(Math.min(20, qty + 1))} aria-label="One more">
              <Plus size={16} />
            </button>
          </div>
          <span className="display text-[34px]" aria-live="polite">
            {inr(price)}
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <button className="btn" onClick={() => add(p.slug, size, qty)}>
            <ShoppingBag /> Add to bag
          </button>
          <a className="btn btn-wa" href={buyNow} target="_blank" rel="noreferrer">
            <WhatsAppIcon /> Buy now on WhatsApp
          </a>
        </div>
        <p className="text-sm text-ink-2 m-0">
          {size === "8" ? "Three 8 ml bottles of this fragrance. " : ""}Delivered across India. We confirm your order in the chat.
        </p>
      </div>
      <div className="buybar">
        <div className="grow min-w-0">
          <div className="display text-[18px] leading-tight truncate">{p.short}</div>
          <div className="text-[13px] text-ink-2">
            {SIZES.find((s) => s.key === size)!.label} · {inr(price)}
          </div>
        </div>
        <button className="btn px-5!" onClick={() => add(p.slug, size, qty)}>
          <ShoppingBag /> Add
        </button>
      </div>
    </>
  );
}
