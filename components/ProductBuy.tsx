"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { SIZES, inr, type Product, type SizeKey } from "@/data/products";
import { orderMessage, useCart, waLink } from "@/lib/cart";

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413z"/>
  </svg>
);

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
        <button type="button" className="btn btn-wa" onClick={handleBuyNow} style={{ height: 48 }}>
          <WhatsAppIcon /> Buy now on WhatsApp
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
        <div style={{ fontSize: 13.5, color: "var(--ink)", lineHeight: 1.45 }}>
          <b>Free Express Shipping</b> across India · Delivery in 2–4 business days
        </div>
        <div style={{ fontSize: 13.5, color: "var(--ink)", lineHeight: 1.45 }}>
          <b>Cash on Delivery (COD) & UPI</b> available on WhatsApp
        </div>
        <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.45 }}>
          {size === "8" ? "Three 8 ml bottles · " : ""}Dispatches within 24 hours · 100% Authentic Eau de Parfum
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
            className="btn btn-wa"
            style={{ height: 42, padding: "0 12px", fontSize: 13, whiteSpace: "nowrap" }}
            onClick={handleBuyNow}
          >
            <WhatsAppIcon /> Buy now →
          </button>
        </div>
      </div>
    </>
  );
}
