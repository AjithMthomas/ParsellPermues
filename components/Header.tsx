"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { PRODUCTS, fromPrice, inr } from "@/data/products";
import { useCart } from "@/lib/cart";

const chev = (
  <svg className="chev" viewBox="0 0 12 12" aria-hidden="true">
    <path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const GROUPS = [
  { label: "For her", key: "her" as const },
  { label: "For him", key: "him" as const },
];

/** The kit's nav (nav-mega): opaque bar, one hairline, plain words, the bag as the one button. */
export function Header() {
  const { count, setOpen } = useCart();
  const [open, setMenu] = useState(false);
  const path = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  useEffect(() => setMenu(false), [path]);
  // clear over the hero; frosted once the page moves; light text over a dark section
  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      setScrolled(window.scrollY > 8);
      const el = document.elementFromPoint(window.innerWidth / 2, 80);
      setDark(!!el?.closest(".ground-inverse, footer.footer--dark"));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [path]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  const close = () => setMenu(false);

  return (
    <header className={`nav nav--clear${open ? " is-open" : ""}${scrolled ? " is-scrolled" : ""}${dark && !open ? " is-dark" : ""}`}>
      <div className="wrap nav__bar">
        <a className="skip-link" href="#top">
          Skip to content
        </a>
        <a className="nav__logo" href="/" aria-label="Pura, home">
          <span className="logo-mark" aria-hidden="true" />
        </a>
        <nav className="nav__links" aria-label="Main">
          <div className="nav__item">
            <a className="nav__link" href="/shop/" onClick={close}>
              Fragrances {chev}
            </a>
            <div className="nav__menu">
              <div className="wrap grid">
                {GROUPS.map((g) => (
                  <div className="menu-col span-3" key={g.key}>
                    <p className="t-label">{g.label}</p>
                    {PRODUCTS.filter((p) => p.audience === g.key).map((p) => (
                      <a key={p.slug} href={`/fragrance/${p.slug}/`} onClick={close}>
                        {p.short}
                        <span>{p.family}</span>
                      </a>
                    ))}
                  </div>
                ))}
                <div className="menu-col span-3">
                  <p className="t-label">For everyone</p>
                  {PRODUCTS.filter((p) => p.audience === "unisex").map((p) => (
                    <a key={p.slug} href={`/fragrance/${p.slug}/`} onClick={close}>
                      {p.short}
                      <span>{p.family}</span>
                    </a>
                  ))}
                  <a href="/shop/" onClick={close}>
                    All twelve
                    <span>From {inr(fromPrice(PRODUCTS[0]))}</span>
                  </a>
                </div>
                <a className="menu-card span-3" href="/fragrance/pura-symphony/" onClick={close}>
                  <div className="panel">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="frame__img" src="/images/scenes/symphony-arch-560.webp" alt="Pura Symphony with its ivory box and white flowers" />
                  </div>
                  <span className="t-card">Symphony, our bestseller</span>
                  <span className="t-small muted">Bergamot, magnolia and golden amber</span>
                </a>
              </div>
            </div>
          </div>
          <div className="nav__item">
            <a className="nav__link" href="/shop/her/" aria-current={path === "/shop/her/" ? "page" : undefined} onClick={close}>
              Her
            </a>
          </div>
          <div className="nav__item">
            <a className="nav__link" href="/shop/him/" aria-current={path === "/shop/him/" ? "page" : undefined} onClick={close}>
              Him
            </a>
          </div>
          <div className="nav__item">
            <a className="nav__link" href="/#sizes" onClick={close}>
              Sizes
            </a>
          </div>
          <div className="nav__item">
            <a className="nav__link" href="/#order" onClick={close}>
              Ordering
            </a>
          </div>
        </nav>
        <div className="nav__actions">
          <button className="btn btn--primary bag-btn" type="button" onClick={() => setOpen(true)} aria-label={`Bag, ${count} ${count === 1 ? "item" : "items"}`}>
            <ShoppingBag aria-hidden="true" /> <span className="bag-word">Bag</span> {count > 0 && <span className="bag-n">{count}</span>}
          </button>
        </div>
        <button className="nav__toggle" type="button" aria-expanded={open} aria-label="Menu" onClick={() => setMenu(!open)}>
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path d={open ? "M4 4l10 10M14 4L4 14" : "M2 5h14M2 13h14"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </header>
  );
}
