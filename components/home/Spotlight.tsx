"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ShoppingBag } from "lucide-react";
import { inr, productBySlug } from "@/data/products";
import { useCart } from "@/lib/cart";

const TIERS = [
  { key: "top", label: "Top", img: "top", alt: "A bergamot fruit with its leaf on linen" },
  { key: "heart", label: "Heart", img: "heart", alt: "White magnolia and neroli blossom on linen" },
  { key: "base", label: "Base", img: "base", alt: "A piece of amber resin on pale wood" },
] as const;

/** Symphony, the bestseller: as the page scrolls, its notes open top, heart, base. */
export function Spotlight() {
  const p = productBySlug("pura-symphony")!;
  const ref = useRef<HTMLElement>(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [step, setStep] = useState(0);
  const { add } = useCart();
  useMotionValueEvent(scrollYProgress, "change", (v) => setStep(v < 0.36 ? 0 : v < 0.7 ? 1 : 2));
  const rotate = useTransform(scrollYProgress, [0, 1], still ? [0, 0] : [-4, 4]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], still ? [1, 1, 1] : [0.94, 1.03, 0.98]);
  const bar = useTransform(scrollYProgress, [0.05, 0.95], [0, 1]);

  return (
    <section className="spot" ref={ref} aria-labelledby="spot-title" id="symphony">
      <div className="spot-sticky">
        <div className="wrap spot-grid">
          <div className="spot-photos">
            {TIERS.map((t, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <motion.img
                key={t.key}
                src={`/images/notes/${t.img}-896.webp`}
                srcSet={`/images/notes/${t.img}-520.webp 520w, /images/notes/${t.img}-896.webp 896w`}
                sizes="(min-width: 1024px) 30vw, 90vw"
                alt={t.alt}
                loading="lazy"
                animate={{ opacity: step === i ? 1 : 0, scale: step === i ? 1 : 1.06 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              />
            ))}
          </div>

          <motion.div className="spot-bottle" style={{ rotate, scale }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/pack/pura-symphony-900.webp" alt="Pura Symphony eau de parfum bottle" width={900} height={1760} loading="lazy" />
          </motion.div>

          <div>
            <span className="badge">Our bestseller</span>
            <h2 id="spot-title" className="display h2 mt-5 mb-0">
              Pura <span className="script">Symphony</span>
            </h2>
            <p className="lede mt-5 mb-6">{p.line} Our best-selling fragrance, in three movements.</p>
            <div className="progress mb-2" aria-hidden="true">
              <motion.i style={{ scaleX: bar }} />
            </div>
            {TIERS.map((t, i) => (
              <div key={t.key} className="tier" data-on={step === i}>
                <span className="k">{t.label}</span>
                <span className="v">{p.notes[t.key].join(", ")}</span>
              </div>
            ))}
            <div className="spot-mobile-notes mt-4">
              {TIERS.map((t) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={t.key} src={`/images/notes/${t.img}-520.webp`} alt={t.alt} loading="lazy" width={520} height={696} />
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-7">
              <button className="btn" onClick={() => add(p.slug, "100")}>
                <ShoppingBag /> Add 100 ml · {inr(p.prices["100"])}
              </button>
              <Link className="link" href={`/fragrance/${p.slug}/`}>
                All sizes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
