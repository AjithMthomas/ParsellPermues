"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Minus, Plus, X } from "lucide-react";
import { inr } from "@/data/products";
import { lineInfo, orderMessage, useCart, waLink } from "@/lib/cart";

export function CartDrawer() {
  const { lines, open, setOpen, setQty, subtotal, bump } = useCart();
  const [toast, setToast] = useState(false);
  const first = useRef(true);
  const closeRef = useRef<HTMLButtonElement>(null);

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

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, setOpen]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.div className="drawer-back" onClick={() => setOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
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
              <div className="drawer-head">
                <h2 id="bag-h">Your bag</h2>
                <button ref={closeRef} type="button" className="icon-x" onClick={() => setOpen(false)} aria-label="Close the bag">
                  <X size={20} />
                </button>
              </div>
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
                            <button type="button" style={{ height: 38 }} onClick={() => setQty(l.slug, l.size, l.qty - 1)} aria-label="One less">
                              <Minus size={15} />
                            </button>
                            <span aria-live="polite">{l.qty}</span>
                            <button type="button" style={{ height: 38 }} onClick={() => setQty(l.slug, l.size, l.qty + 1)} aria-label="One more">
                              <Plus size={15} />
                            </button>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div className="name">{inr(info.unit * l.qty)}</div>
                          <button type="button" className="link" style={{ minHeight: 44 }} onClick={() => setQty(l.slug, l.size, 0)}>
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
                  <a className="btn btn--primary btn-wa" href={waLink(orderMessage(lines))} target="_blank" rel="noreferrer">
                    Place order on WhatsApp
                  </a>
                  <p className="t-small muted" style={{ margin: 0 }}>
                    The chat opens with every item and the total written in. We confirm stock and delivery there.
                  </p>
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
