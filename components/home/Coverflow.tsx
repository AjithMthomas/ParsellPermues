"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { AUDIENCE_LABEL, PRODUCTS, SIZES, inr, packSrc, type SizeKey } from "@/data/products";
import { useCart } from "@/lib/cart";

type Filter = "all" | "her" | "him";
const TABS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "her", label: "For Her" },
  { key: "him", label: "For Him" },
];

/** The lead fragrance (Symphony, or Obsidian for him) in the middle, the rest either side. */
function arrange(f: Filter) {
  const all = PRODUCTS.filter((p) => f === "all" || p.audience === f || p.audience === "unisex");
  const leadSlug = f === "him" ? "pura-obsidian" : "pura-symphony";
  const lead = all.find((p) => p.slug === leadSlug)!;
  const rest = all.filter((p) => p !== lead);
  const mid = Math.floor(all.length / 2);
  return [...rest.slice(0, mid), lead, ...rest.slice(mid)];
}

export function Coverflow() {
  const [filter, setFilter] = useState<Filter>("all");
  const [index, setIndex] = useState(() => Math.floor(arrange("all").length / 2));
  const [size, setSize] = useState<SizeKey>("100");
  const { add } = useCart();
  const still = useReducedMotion();
  const wheelLock = useRef(0);
  const [cardW, setCardW] = useState(280);
  const stageRef = useRef<HTMLDivElement>(null);

  const list = useMemo(() => arrange(filter), [filter]);
  const active = list[Math.min(index, list.length - 1)];

  useEffect(() => {
    const measure = () => {
      const el = stageRef.current?.querySelector<HTMLElement>(".card-slot");
      if (el) setCardW(el.offsetWidth);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const go = useCallback((n: number) => setIndex(Math.max(0, Math.min(list.length - 1, n))), [list.length]);

  const choose = (f: Filter) => {
    setFilter(f);
    // land in the middle, where the lead fragrance sits
    setIndex(Math.floor(arrange(f).length / 2));
  };

  const panned = useRef(false);
  const guard = (e: React.MouseEvent) => {
    if (panned.current) e.preventDefault();
    return panned.current;
  };

  const onPanEnd = (_: unknown, info: PanInfo) => {
    setTimeout(() => (panned.current = false), 60);
    const dist = info.offset.x + info.velocity.x * 0.2;
    const steps = Math.round(-dist / (cardW * 0.55));
    if (steps) go(index + Math.max(-3, Math.min(3, steps)));
  };

  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 12) return;
    const now = Date.now();
    if (now - wheelLock.current < 380) return;
    wheelLock.current = now;
    go(index + (e.deltaX > 0 ? 1 : -1));
  };

  const spacing = cardW * 0.66;

  return (
    <section className="section" id="collection" aria-labelledby="flow-title">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow rule">The collection</p>
          <h2 id="flow-title" className="display h2 m-0">
            Find your <span className="script">signature</span>
          </h2>
          <div className="flow-tabs mt-2" role="group" aria-label="Filter fragrances">
            {TABS.map((t) => (
              <button key={t.key} aria-pressed={filter === t.key} onClick={() => choose(t.key)}>
                {filter === t.key && <motion.span layoutId="tab-pill" className="pill" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flow-info" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.slug}
              className="grid gap-4 justify-items-center"
              initial={still ? false : { opacity: 0, y: 14, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex flex-wrap justify-center items-center gap-2">
                {active.bestseller && <span className="badge">Bestseller</span>}
                {active.premium && <span className="badge">Privé</span>}
                <span className="eyebrow">
                  {AUDIENCE_LABEL[active.audience]} · {active.family}
                </span>
              </div>
              <h3 className="display h3 m-0 text-[clamp(34px,4vw,52px)]!">{active.name}</h3>
              <p className="lede m-0 text-center max-w-[40em]">{active.description}</p>
              <div className="size-row" role="group" aria-label="Size">
                {SIZES.map((s) => (
                  <button key={s.key} className="size" aria-pressed={size === s.key} onClick={() => setSize(s.key)}>
                    {s.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                <span className="price">{inr(active.prices[size])}</span>
                <button className="btn" onClick={() => add(active.slug, size)}>
                  <ShoppingBag /> Add to bag
                </button>
                <Link className="link" href={`/fragrance/${active.slug}/`}>
                  Notes and details <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.div
          ref={stageRef}
          className="stage"
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label={`${list.length} fragrances. Use the arrow keys to move.`}
          onPanStart={() => (panned.current = true)}
          onPanEnd={onPanEnd}
          onWheel={onWheel}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") go(index + 1);
            if (e.key === "ArrowLeft") go(index - 1);
          }}
        >
          {list.map((p, i) => {
            const off = i - index;
            const d = Math.abs(off);
            const hidden = d > 3;
            return (
              <motion.div
                key={p.slug}
                className="card-slot"
                style={{ zIndex: 20 - d }}
                initial={false}
                animate={{
                  x: off * spacing - Math.sign(off) * Math.max(0, d - 1) * spacing * 0.18,
                  scale: 1 - Math.min(d, 3) * 0.14,
                  opacity: hidden ? 0 : 1 - Math.max(0, d - 1) * 0.18,
                  y: d * 10,
                  filter: d === 0 ? "brightness(1)" : `brightness(${1 - Math.min(d, 3) * 0.1})`,
                }}
                transition={still ? { duration: 0 } : { type: "spring", stiffness: 210, damping: 28, mass: 0.9 }}
                aria-hidden={hidden || undefined}
              >
                {d === 0 ? (
                  <Link href={`/fragrance/${p.slug}/`} className={`fcard ${p.darkCard ? "dark" : "light"}`} aria-label={`${p.name}, view details`} draggable={false} onClick={guard}>
                    <Card p={p} />
                  </Link>
                ) : (
                  <button
                    className={`fcard ${p.darkCard ? "dark" : "light"}`}
                    onClick={(e) => !guard(e) && go(i)}
                    aria-label={`Show ${p.name}`}
                    tabIndex={hidden ? -1 : 0}
                  >
                    <Card p={p} />
                  </button>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        <div className="flow-ctrl">
          <button className="round" onClick={() => go(index - 1)} aria-label="Previous fragrance" disabled={index === 0}>
            <ChevronLeft />
          </button>
          <span className="count" aria-hidden="true">
            {String(index + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}
          </span>
          <button className="round" onClick={() => go(index + 1)} aria-label="Next fragrance" disabled={index === list.length - 1}>
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}

function Card({ p }: { p: (typeof PRODUCTS)[number] }) {
  return (
    <>
      <span className="ground" style={{ background: `linear-gradient(160deg, ${p.tone[0]} 0%, ${p.tone[1]} 100%)` }} />
      <span className="meta">
        <span>{p.short}</span>
        <span>{p.code}</span>
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="bottle"
        src={`${packSrc(p.slug)}-480.webp`}
        srcSet={`${packSrc(p.slug)}-480.webp 480w, ${packSrc(p.slug)}-900.webp 900w`}
        sizes="(min-width: 1024px) 230px, 160px"
        alt={`${p.name} eau de parfum bottle`}
        width={480}
        height={939}
        draggable={false}
        loading="lazy"
      />
    </>
  );
}
