"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AUDIENCE_LABEL, PRODUCTS, SIZES, inr, type SizeKey } from "@/data/products";
import { useCart } from "@/lib/cart";

type Filter = "all" | "her" | "him";
const TABS: { key: Filter; label: string }[] = [
  { key: "all", label: "All twelve" },
  { key: "her", label: "For her" },
  { key: "him", label: "For him" },
];

/** The lead fragrance (Symphony, or Obsidian for him) in the middle, the rest either side. */
function arrange(f: Filter) {
  const all = PRODUCTS.filter((p) => f === "all" || p.audience === f || p.audience === "unisex");
  const lead = all.find((p) => p.slug === (f === "him" ? "pura-obsidian" : "pura-symphony"))!;
  const rest = all.filter((p) => p !== lead);
  const mid = Math.floor(all.length / 2);
  return [...rest.slice(0, mid), lead, ...rest.slice(mid)];
}

export function Coverflow() {
  const [filter, setFilter] = useState<Filter>("all");
  const [index, setIndex] = useState(() => Math.floor(arrange("all").length / 2));
  const [size, setSize] = useState<SizeKey>("100");
  const [cardW, setCardW] = useState(240);
  const { add } = useCart();
  const still = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const wheelLock = useRef(0);
  const panned = useRef(false);

  const list = useMemo(() => arrange(filter), [filter]);
  const p = list[Math.min(index, list.length - 1)];
  const go = useCallback((n: number) => setIndex(Math.max(0, Math.min(list.length - 1, n))), [list.length]);

  useEffect(() => {
    const measure = () => {
      const el = stageRef.current?.querySelector<HTMLElement>(".slot");
      if (el) setCardW(el.offsetWidth);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const choose = (f: Filter) => {
    setFilter(f);
    setIndex(Math.floor(arrange(f).length / 2));
  };
  const guard = (e: React.MouseEvent) => {
    if (panned.current) e.preventDefault();
    return panned.current;
  };
  const onPanEnd = (_: unknown, info: PanInfo) => {
    setTimeout(() => (panned.current = false), 60);
    const steps = Math.round(-(info.offset.x + info.velocity.x * 0.2) / (cardW * 0.6));
    if (steps) go(index + Math.max(-3, Math.min(3, steps)));
  };
  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 12) return;
    const now = Date.now();
    if (now - wheelLock.current < 380) return;
    wheelLock.current = now;
    go(index + (e.deltaX > 0 ? 1 : -1));
  };
  // cards never overlap: each one stands clear of its neighbour, smaller as it steps away
  const phone = cardW < 200;
  const step = phone ? 0.3 : 0.13;
  const spacing = cardW * (phone ? 0.857 : 1.0);
  const reach = phone ? 1 : 2;

  return (
    <section className="section" id="range" aria-labelledby="range-h">
      <div className="wrap">
        <div className="flow-head">
          <h2 id="range-h">
            Twelve fragrances. <span className="muted">Find the one that feels like you.</span>
          </h2>
          <div className="seg" role="group" aria-label="Show fragrances">
            {TABS.map((t) => (
              <button key={t.key} type="button" aria-pressed={filter === t.key} onClick={() => choose(t.key)}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={p.slug}
            className="flow-info"
            aria-live="polite"
            initial={still ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flow-name">
              <p className="flow-title">{p.name}</p>
              <span className="fam">
                {AUDIENCE_LABEL[p.audience]} · {p.family}
                {p.bestseller ? " · Our bestseller" : ""}
              </span>
            </div>
            <p className="flow-desc">{p.description}</p>
            <div className="flow-buy">
              <div className="sizes" role="group" aria-label="Size">
                {SIZES.map((s) => (
                  <button key={s.key} type="button" className="size" aria-pressed={size === s.key} onClick={() => setSize(s.key)}>
                    {s.label}
                  </button>
                ))}
              </div>
              <div className="btn-row">
                <span className="price-now">{inr(p.prices[size])}</span>
                <button type="button" className="btn btn--primary" onClick={() => add(p.slug, size)}>
                  Add to bag
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.div
          ref={stageRef}
          className="stage-flow"
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label={`${list.length} fragrances; the arrow keys move between them`}
          onPanStart={() => (panned.current = true)}
          onPanEnd={onPanEnd}
          onWheel={onWheel}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") go(index + 1);
            if (e.key === "ArrowLeft") go(index - 1);
          }}
        >
          {list.map((q, i) => {
            const off = i - index;
            const d = Math.abs(off);
            const hidden = d > reach;
            return (
              <motion.div
                key={q.slug}
                className={`slot${d ? " is-side" : ""}`}
                style={{ zIndex: 20 - d }}
                initial={false}
                animate={{
                  x: off * spacing - Math.sign(off) * Math.max(0, d - 1) * spacing * 0.12,
                  scale: 1 - Math.min(d, 3) * step,
                  opacity: hidden ? 0 : 1,
                  visibility: hidden ? "hidden" : "visible",
                }}
                transition={still ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 30 }}
                aria-hidden={hidden || undefined}
              >
                {d === 0 ? (
                  <a href={`/fragrance/${q.slug}/`} className={`fcard ${q.darkCard ? "dark" : ""}`} aria-label={`${q.name}: notes and sizes`} draggable={false} onClick={guard}>
                    <Card q={q} />
                  </a>
                ) : (
                  <button type="button" className={`fcard ${q.darkCard ? "dark" : ""}`} aria-label={`Show ${q.name}`} tabIndex={hidden ? -1 : 0} onClick={(e) => !guard(e) && go(i)}>
                    <Card q={q} />
                  </button>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        <div className="flow-ctrl">
          <span className="flow-arrows">
            <button type="button" className="round" onClick={() => go(index - 1)} aria-label="Previous fragrance" disabled={index === 0}>
              <ChevronLeft />
            </button>
            <button type="button" className="round" onClick={() => go(index + 1)} aria-label="Next fragrance" disabled={index === list.length - 1}>
              <ChevronRight />
            </button>
          </span>
        </div>
      </div>
    </section>
  );
}

function Card({ q }: { q: (typeof PRODUCTS)[number] }) {
  return (
    <>
      <span className="ground" style={{ background: `linear-gradient(165deg, ${q.tone[0]}, ${q.tone[1]})` }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="bottle" src={`/images/bottle/${q.slug}-360.webp`} srcSet={`/images/bottle/${q.slug}-360.webp 360w, /images/bottle/${q.slug}-640.webp 640w`} sizes="(min-width: 1024px) 280px, 180px" alt="" draggable={false} />
      <div className="fcard-shade">
        <span className="fcard-name">{q.name}</span>
      </div>
    </>
  );
}
