"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Minus, Plus, X } from "lucide-react";
import { inr } from "@/data/products";
import { lineInfo, orderMessage, useCart, waLink } from "@/lib/cart";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

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
            <motion.div className="drawer-backdrop" onClick={() => setOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.aside
              className="drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Your bag"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 36 }}
            >
              <div className="drawer-head">
                <h2 className="display h3 m-0">Your bag</h2>
                <button ref={closeRef} className="icon-btn" onClick={() => setOpen(false)} aria-label="Close bag">
                  <X />
                </button>
              </div>
              <div className="drawer-body">
                {lines.length === 0 ? (
                  <div className="py-16 text-center grid gap-5 justify-items-center">
                    <p className="lede m-0">Your bag is empty. Twelve fragrances are waiting.</p>
                    <Link className="btn" href="/shop/" onClick={() => setOpen(false)}>
                      Browse fragrances
                    </Link>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {lines.map((l) => {
                      const info = lineInfo(l);
                      if (!info) return null;
                      return (
                        <motion.div key={l.slug + l.size} className="bag-line" layout exit={{ opacity: 0, x: 40 }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={info.thumb} alt="" width={64} height={88} />
                          <div className="min-w-0">
                            <div className="display text-[20px] leading-tight">{info.name}</div>
                            <div className="text-sm text-ink-2">{info.size}</div>
                            <div className="qty mt-2 h-10!" aria-label={`Quantity of ${info.name}`}>
                              <button onClick={() => setQty(l.slug, l.size, l.qty - 1)} aria-label="One less" className="h-10! w-10!">
                                <Minus size={15} />
                              </button>
                              <span aria-live="polite">{l.qty}</span>
                              <button onClick={() => setQty(l.slug, l.size, l.qty + 1)} aria-label="One more" className="h-10! w-10!">
                                <Plus size={15} />
                              </button>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="display text-[19px]">{inr(info.unit * l.qty)}</div>
                            <button className="text-sm underline underline-offset-4 text-ink-2 min-h-11" onClick={() => setQty(l.slug, l.size, 0)}>
                              Remove
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>
              {lines.length > 0 && (
                <div className="drawer-foot">
                  <div className="flex justify-between items-baseline">
                    <span className="eyebrow">Total</span>
                    <span className="display text-[30px]">{inr(subtotal)}</span>
                  </div>
                  <a className="btn btn-wa btn-block" href={waLink(orderMessage(lines))} target="_blank" rel="noreferrer">
                    <WhatsAppIcon /> Place order on WhatsApp
                  </a>
                  <p className="text-[13px] text-ink-2 m-0 text-center leading-snug">
                    The chat opens with every item and the total filled in. We confirm stock and delivery there.
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
            className="toast"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            role="status"
          >
            <Check size={16} /> Added to bag. View bag
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
