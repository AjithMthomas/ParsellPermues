"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, Check, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { inr } from "@/data/products";
import { lineInfo, orderMessage, useCart, waLink, type CustomerData } from "@/lib/cart";
import { site } from "@/lib/site";
import { trackInitiateCheckout, trackPurchase } from "@/lib/pixel";
import { getStoredUtmParams, formatUtmSummary } from "@/lib/utm";

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413z"/>
  </svg>
);

export function CartDrawer() {
  const { lines, open, checkoutOpen, setOpen, setCheckoutOpen, setQty, subtotal, bump, clear } = useCart();
  const [toast, setToast] = useState(false);
  const [step, setStep] = useState<"bag" | "details" | "success">("bag");

  // Customer delivery details state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [lastWaUrl, setLastWaUrl] = useState("");

  const first = useRef(true);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Sync checkoutOpen from cart context
  useEffect(() => {
    if (checkoutOpen) {
      setStep("details");
    }
  }, [checkoutOpen]);

  // Track Meta Pixel InitiateCheckout when entering details step
  useEffect(() => {
    if (step === "details" && lines.length > 0) {
      trackInitiateCheckout({
        value: subtotal,
        numItems: lines.reduce((n, l) => n + l.qty, 0),
        contentIds: lines.map((l) => l.slug),
        currency: "INR",
      });
    }
  }, [step, lines, subtotal]);

  // Load saved customer details from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pura_customer_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name) setName(parsed.name);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.city) setCity(parsed.city);
        if (parsed.address) setAddress(parsed.address);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Toast indicator on item add
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!bump) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToast(true);
    const t = setTimeout(() => setToast(false), 2600);
    return () => clearTimeout(t);
  }, [bump]);

  // Drawer accessibility & body scroll lock
  useEffect(() => {
    if (!open) {
      document.body.classList.remove("drawer-open");
      // Reset checkout step when drawer completely closes
      const t = setTimeout(() => {
        setCheckoutOpen(false);
        setStep("bag");
      }, 300);
      return () => clearTimeout(t);
    }
    document.body.classList.add("drawer-open");
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.classList.remove("drawer-open");
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, setOpen, setCheckoutOpen]);

  // Handle Order Submit: save to Google Sheet & API, then open WhatsApp
  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !city.trim()) return;

    setSubmitting(true);
    const newOrderId = `PUR-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderId(newOrderId);

    // Save customer info locally for subsequent orders
    try {
      localStorage.setItem("pura_customer_v1", JSON.stringify({ name, phone, city, address }));
    } catch {
      /* ignore */
    }

    // Retrieve stored UTM tracking parameters
    const utms = getStoredUtmParams();
    const utmSummary = formatUtmSummary(utms);

    const customerData: CustomerData = {
      name: name.trim(),
      phone: phone.trim(),
      city: city.trim(),
      address: address.trim(),
      note: note.trim()
        ? `${note.trim()}${utmSummary ? ` | [Campaign: ${utmSummary}]` : ""}`
        : utmSummary
        ? `[Campaign: ${utmSummary}]`
        : "",
      orderId: newOrderId,
    };

    const itemsList = lines.map((l) => {
      const info = lineInfo(l);
      return {
        name: info?.name || l.slug,
        size: info?.size || l.size,
        qty: l.qty,
        unitPrice: info?.unit || 0,
        totalPrice: (info?.unit || 0) * l.qty,
      };
    });

    const summary = lines
      .map((l) => {
        const info = lineInfo(l);
        return `${info?.name} (${info?.size}) × ${l.qty}`;
      })
      .join(" · ");

    // 1. Post to API to log into Google Sheet & local data/orders.json (non-blocking fallback for dev/SSR)
    fetch("/api/order/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: newOrderId,
        createdAt: new Date().toISOString(),
        customer: customerData,
        items: itemsList,
        itemsSummary: summary,
        totalAmount: subtotal,
        totalFormatted: inr(subtotal),
        utm: utms,
      }),
    }).catch(() => {});

    // 2. Direct client-side sync to Google Apps Script Webhook
    // Note: uses "text/plain;charset=utf-8" with mode: "no-cors" and keepalive: true so browser never throws
    // CORS TypeError, and Google Apps Script JSON.parse(e.postData.contents) parses payload cleanly.
    const orderPayload = JSON.stringify({
      orderId: newOrderId,
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      name: customerData.name,
      phone: customerData.phone,
      city: customerData.city,
      address: customerData.address || "",
      items: summary,
      total: inr(subtotal),
      status: "New (WhatsApp)",
      note: customerData.note || "",
    });

    const publicWebhook = process.env.NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL || site.googleSheetWebhookUrl;
    if (publicWebhook && publicWebhook.trim() !== "") {
      try {
        await fetch(publicWebhook, {
          method: "POST",
          mode: "no-cors",
          keepalive: true,
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: orderPayload,
        });
      } catch (clientErr) {
        console.warn("[Order] Fetch to Google Sheet failed, trying beacon fallback:", clientErr);
        try {
          if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
            navigator.sendBeacon(publicWebhook, new Blob([orderPayload], { type: "text/plain" }));
          }
        } catch (beaconErr) {
          console.error("[Order] Failed to sync directly to Google Sheet:", beaconErr);
        }
      }
    }

    // 2. Prepare WhatsApp URL with complete structured details
    const waUrl = waLink(orderMessage(lines, customerData));
    setLastWaUrl(waUrl);
    setSubmitting(false);

    // 3. Track Meta Pixel Purchase event (deduplicated: exactly once per order ID)
    try {
      trackPurchase({
        orderId: newOrderId,
        value: subtotal,
        numItems: lines.reduce((n, l) => n + l.qty, 0),
        contentIds: lines.map((l) => l.slug),
        currency: "INR",
      });
    } catch {
      /* ignore pixel errors */
    }

    clear(); // Clear bag since order is recorded and ready
    setStep("success");

    // 3. Open WhatsApp
    try {
      const w = window.open(waUrl, "_blank");
      if (!w || w.closed || typeof w.closed === "undefined") {
        window.location.href = waUrl;
      }
    } catch {
      window.location.href = waUrl;
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="drawer-back"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              className="drawer"
              role="dialog"
              aria-modal="true"
              aria-labelledby="bag-h"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 36 }}
            >
              {/* Drawer Header */}
              <div className="drawer-head">
                {step === "details" ? (
                  <button
                    type="button"
                    className="btn-back-bag"
                    onClick={() => {
                      setStep("bag");
                      setCheckoutOpen(false);
                    }}
                    aria-label="Back to bag"
                  >
                    <ArrowLeft size={16} /> Back to bag
                  </button>
                ) : (
                  <h2 id="bag-h">{step === "success" ? "Order Confirmed" : "Your bag"}</h2>
                )}
                <button
                  ref={closeRef}
                  type="button"
                  className="icon-x"
                  onClick={() => {
                    if (step === "success") {
                      clear();
                      setStep("bag");
                    }
                    setOpen(false);
                  }}
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Body: Step 1 - Bag Items */}
              {step === "bag" && (
                <>
                  <div className="drawer-body">
                    {lines.length === 0 ? (
                      <div style={{ padding: "64px 0", display: "grid", gap: 24, justifyItems: "start" }}>
                        <p style={{ margin: 0 }}>Your bag is empty. Twelve fragrances are a tap away.</p>
                        <a className="btn btn--primary" href="/shop/" onClick={() => setOpen(false)}>
                          Browse the fragrances
                        </a>
                      </div>
                    ) : (
                      lines.map((l) => {
                        const info = lineInfo(l);
                        if (!info) return null;
                        return (
                          <div key={l.slug + l.size} className="bag-line">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={info.thumb} alt="" width={60} height={84} />
                            <div>
                              <div className="name">{info.name}</div>
                              <div className="muted t-small">{info.size}</div>
                              <div className="qty" style={{ height: 40, marginTop: 8 }} aria-label={`Quantity of ${info.name}`}>
                                <button
                                  type="button"
                                  style={{ height: 38 }}
                                  onClick={() => setQty(l.slug, l.size, l.qty - 1)}
                                  aria-label="One less"
                                >
                                  <Minus size={15} />
                                </button>
                                <span aria-live="polite">{l.qty}</span>
                                <button
                                  type="button"
                                  style={{ height: 38 }}
                                  onClick={() => setQty(l.slug, l.size, l.qty + 1)}
                                  aria-label="One more"
                                >
                                  <Plus size={15} />
                                </button>
                              </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <div className="name">{inr(info.unit * l.qty)}</div>
                              <button
                                type="button"
                                className="link"
                                style={{ minHeight: 44 }}
                                onClick={() => setQty(l.slug, l.size, 0)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  {lines.length > 0 && (
                    <div className="drawer-foot">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <span className="muted">Total</span>
                        <span className="price-now" style={{ fontSize: 32 }}>
                          {inr(subtotal)}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="btn btn--primary btn-wa"
                        onClick={() => setStep("details")}
                        style={{ height: 46 }}
                      >
                        Place order on WhatsApp →
                      </button>
                      <p className="t-small muted" style={{ margin: 0, textAlign: "center" }}>
                        We confirm delivery details and stock in chat.
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Drawer Body: Step 2 - Delivery Details Form */}
              {step === "details" && (
                <>
                  <div className="drawer-body">
                    <form id="checkout-form" className="checkout-form" onSubmit={handleOrderSubmit}>
                      <div>
                        <h3 style={{ margin: "0 0 6px", fontSize: 22, fontFamily: "var(--font-display)" }}>
                          Delivery details
                        </h3>
                        <p className="t-small muted" style={{ margin: 0 }}>
                          Enter your contact information so we can record your order before opening WhatsApp.
                        </p>
                      </div>

                      <div className="field">
                        <label htmlFor="c-name">Full name *</label>
                        <input
                          id="c-name"
                          type="text"
                          required
                          placeholder="e.g. Ananya Sharma"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>

                      <div className="field">
                        <label htmlFor="c-phone">WhatsApp / Phone number *</label>
                        <input
                          id="c-phone"
                          type="tel"
                          required
                          placeholder="e.g. 98765 43210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>

                      <div className="field">
                        <label htmlFor="c-city">City & State *</label>
                        <input
                          id="c-city"
                          type="text"
                          required
                          placeholder="e.g. Mumbai, Maharashtra"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </div>

                      <div className="field">
                        <label htmlFor="c-address">Delivery address (Optional)</label>
                        <input
                          id="c-address"
                          type="text"
                          placeholder="Street, apartment, or landmark"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </div>

                      <div className="field">
                        <label htmlFor="c-note">Special note (Optional)</label>
                        <input
                          id="c-note"
                          type="text"
                          placeholder="e.g. Gift wrap please"
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                        />
                      </div>

                      {/* Order Summary box */}
                      <div className="checkout-summary-card">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                          <span className="muted t-small">Order Summary ({lines.reduce((n, l) => n + l.qty, 0)} items)</span>
                          <span style={{ fontWeight: 600, fontSize: 16 }}>{inr(subtotal)}</span>
                        </div>
                        <div className="muted t-small" style={{ marginTop: 4, lineHeight: 1.4 }}>
                          {lines
                            .map((l) => `${lineInfo(l)?.name} (${lineInfo(l)?.size}) × ${l.qty}`)
                            .join(" · ")}
                        </div>
                      </div>
                    </form>
                  </div>

                  <div className="drawer-foot">
                    <button
                      form="checkout-form"
                      type="submit"
                      className="btn btn--primary btn-wa"
                      disabled={submitting}
                      style={{ height: 46 }}
                    >
                      {submitting ? "Saving order details..." : "Continue to WhatsApp →"}
                    </button>
                    <p className="t-small muted" style={{ margin: 0, textAlign: "center" }}>
                      Your order is logged and WhatsApp will open with your details pre-filled.
                    </p>
                  </div>
                </>
              )}

              {/* Drawer Body: Step 3 - Order Success Confirmation */}
              {step === "success" && (
                <div
                  className="drawer-body drawer-body--success"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "32px var(--s-5) calc(32px + env(safe-area-inset-bottom, 0px))",
                    textAlign: "center",
                    gap: 18,
                    minHeight: "100%",
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      background: "#e8f5e9",
                      color: "#2e7d32",
                      margin: "0 auto",
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Check size={28} />
                  </div>
                  <div>
                    <h3 style={{ margin: "0 0 8px", fontSize: 24, fontFamily: "var(--font-display)" }}>
                      Order Logged!
                    </h3>
                    <p style={{ margin: 0, color: "var(--ink)" }}>
                      Order reference <b>#{orderId}</b> has been recorded.
                    </p>
                    <p className="t-small muted" style={{ marginTop: 6, maxWidth: 320, marginInline: "auto" }}>
                      We opened WhatsApp so you can send your order message. If WhatsApp did not open automatically, click below:
                    </p>
                  </div>

                  {lastWaUrl && (
                    <a
                      href={lastWaUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-wa"
                      style={{ height: 44, width: "100%", maxWidth: 300 }}
                    >
                      <WhatsAppIcon /> Open WhatsApp Chat →
                    </a>
                  )}

                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => {
                      clear();
                      setStep("bag");
                      setOpen(false);
                    }}
                    style={{ minHeight: 44 }}
                  >
                    Done & Continue Shopping
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && !open && (
          <motion.button
            type="button"
            className="toast"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, y: 16, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 16, x: "-50%" }}
            role="status"
          >
            <Check size={16} /> Added to your bag. View the bag
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
