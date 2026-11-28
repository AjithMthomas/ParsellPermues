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
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span className="price-now" aria-live="polite" style={{ lineHeight: 1 }}>
            {inr(price)}
          </span>
          <span className="t-small muted" style={{ fontSize: 12, marginTop: 4 }}>
            Inclusive of all taxes · Free Shipping
          </span>
        </div>
      </div>
      <div className="btn-row">
        <button type="button" className="btn btn--primary" onClick={(e) => add(p.slug, size, qty, e)}>
          Add to bag
        </button>
        <button type="button" className="btn btn--secondary btn-wa" onClick={handleBuyNow}>
          Buy now on WhatsApp →
        </button>
      </div>

      {/* Value, delivery time, and shipping & COD note */}
      <div
        className="pdp-delivery-card"
        style={{
          display: "grid",
          gap: 10,
          padding: "14px 16px",
          background: "rgba(34, 24, 15, 0.03)",
          border: "1px solid var(--line)",
          borderRadius: "var(--r-md)",
          margin: "var(--s-3) 0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, color: "var(--ink)" }}>
          <span style={{ fontSize: 16 }}>🚚</span>
          <span>
            <b>Free Express Shipping</b> across India · Delivery in 2–4 business days
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, color: "var(--ink)" }}>
          <span style={{ fontSize: 16 }}>💵</span>
          <span>
            <b>Cash on Delivery (COD) & UPI</b> available on WhatsApp
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, color: "var(--muted)" }}>
          <span style={{ fontSize: 16 }}>⚡</span>
          <span>
            {size === "8" ? "Three 8 ml bottles · " : ""}Dispatches within 24 hours · 100% Authentic Eau de Parfum
          </span>
        </div>
      </div>

      {/* Mobile Sticky Action Bar: Both Add to Bag & Buy Now visible without scrolling */}
      <div className="buybar">
        <div style={{ flex: "0 1 auto", minWidth: 0, paddingRight: 6 }}>
          <div className="name" style={{ fontFamily: "var(--font-display)", fontSize: 17, lineHeight: 1.1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {p.short}
          </div>
          <div className="t-small muted" style={{ fontSize: 12 }}>
            {SIZES.find((s) => s.key === size)!.label} · <b>{inr(price)}</b>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flex: 1, justifyContent: "flex-end" }}>
          <button
            type="button"
            className="btn btn--secondary"
            style={{ height: 42, padding: "0 12px", fontSize: 13, whiteSpace: "nowrap" }}
            onClick={(e) => add(p.slug, size, qty, e)}
          >
            Add to bag
          </button>
          <button
            type="button"
            className="btn btn--primary btn-wa"
            style={{ height: 42, padding: "0 12px", fontSize: 13, whiteSpace: "nowrap" }}
            onClick={handleBuyNow}
          >
            Buy now →
          </button>
        </div>
      </div>
    </>
  );
}
