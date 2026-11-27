"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { SIZES, inr, type Product, type SizeKey } from "@/data/products";
import { orderMessage, useCart, waLink } from "@/lib/cart";

export function ProductBuy({ p }: { p: Product }) {
  const [size, setSize] = useState<SizeKey>("100");
  const [qty, setQty] = useState(1);
  const { add, startCheckout } = useCart();
  const price = p.prices[size] * qty;

  const handleBuyNow = (e: React.MouseEvent) => {
    add(p.slug, size, qty, e);
    startCheckout();
  };

  return (
    <>
      <div className="sizes" role="group" aria-label="Size">
        {SIZES.map((s) => (
          <button key={s.key} type="button" className="size" aria-pressed={size === s.key} onClick={() => setSize(s.key)}>
            {s.label} · {inr(p.prices[s.key])}
          </button>
        ))}
      </div>
      <div className="btn-row" style={{ alignItems: "center" }}>
        <div className="qty" aria-label="Quantity">
          <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="One less">
            <Minus size={16} />
          </button>
          <span aria-live="polite">{qty}</span>
          <button type="button" onClick={() => setQty(Math.min(20, qty + 1))} aria-label="One more">
            <Plus size={16} />
          </button>
        </div>
        <span className="price-now" aria-live="polite">
          {inr(price)}
        </span>
      </div>
      <div className="btn-row">
        <button type="button" className="btn btn--primary" onClick={(e) => add(p.slug, size, qty, e)}>
          Add to bag
        </button>
        <button type="button" className="btn btn--secondary" onClick={handleBuyNow}>
          Buy now on WhatsApp
        </button>
      </div>
      <p className="t-small muted" style={{ margin: 0 }}>
        {size === "8" ? "Three 8 ml bottles of this fragrance. " : ""}Delivered across India; we confirm your order in the chat.
      </p>
      <div className="buybar">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="name" style={{ fontFamily: "var(--font-display)", fontSize: 20, lineHeight: 1.1 }}>
            {p.short}
          </div>
          <div className="t-small muted">
            {SIZES.find((s) => s.key === size)!.label} · {inr(price)}
          </div>
        </div>
        <button type="button" className="btn btn--primary" onClick={(e) => add(p.slug, size, qty, e)}>
          Add to bag
        </button>
      </div>
    </>
  );
}
