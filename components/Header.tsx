"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { site } from "@/lib/site";

const LINKS = [
  { href: "/shop/", label: "Shop all" },
  { href: "/shop/her/", label: "For Her" },
  { href: "/shop/him/", label: "For Him" },
  { href: "/fragrance/pura-symphony/", label: "Symphony" },
  { href: "/#order", label: "How to order" },
];

export function Logo({ width = 92 }: { width?: number }) {
  return <span className="logo" style={{ width }} role="img" aria-label="Pura" />;
}

export function Header() {
  const { count, setOpen, bump } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const path = usePathname();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = menu ? "hidden" : "";
  }, [menu]);

  return (
    <>
      <header className={`header ${scrolled || path !== "/" ? "scrolled" : ""}`}>
        <div className="wrap">
          <Link href="/" aria-label="Pura, home" className="flex items-center min-h-11">
            <Logo />
          </Link>
          <nav className="nav" aria-label="Main">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} aria-current={path === l.href ? "page" : undefined}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <motion.button
              key={bump}
              className="icon-btn relative"
              onClick={() => setOpen(true)}
              aria-label={`Open bag, ${count} ${count === 1 ? "item" : "items"}`}
              initial={bump ? { scale: 0.8 } : false}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 14 }}
            >
              <ShoppingBag />
              {count > 0 && <span className="bag-count">{count}</span>}
            </motion.button>
            <button className="icon-btn menu-btn" onClick={() => setMenu(true)} aria-label="Open menu" aria-expanded={menu}>
              <Menu />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menu && (
          <motion.div
            className="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <span className="logo" style={{ width: 92, background: "#d8bd8a" }} role="img" aria-label="Pura" />
              <button className="icon-btn" onClick={() => setMenu(false)} aria-label="Close menu" aria-expanded={menu}>
                <X />
              </button>
            </div>
            <nav aria-label="Mobile" className="mt-10">
              {LINKS.map((l, i) => (
                <motion.div key={l.href} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.05, duration: 0.5 }}>
                  <Link href={l.href} onClick={() => setMenu(false)}>
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="mt-auto grid gap-3">
              <a className="btn btn-gold btn-block" href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer">
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
