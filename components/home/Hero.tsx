"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";

const rise = (d: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, delay: d, ease: [0.22, 1, 0.36, 1] as const },
});

export function Hero() {
  const still = useReducedMotion();
  const r = (d: number) => (still ? {} : rise(d));
  return (
    <section className="hero" aria-labelledby="hero-title" data-enter>
      <div className="wrap hero-grid">
        <div>
          <motion.p className="eyebrow rule" {...r(0.1)}>
            Eau de parfum · For her and for him
          </motion.p>
          <motion.h1 id="hero-title" className="display h1 mt-6 mb-0" {...r(0.2)}>
            A signature of <span className="script">elegance</span>
          </motion.h1>
          <motion.p className="lede mt-7 mb-0" {...r(0.35)}>
            Twelve Pura fragrances, from the golden florals she reaches for to the smoked woods he wears at night. Choose a size, add it to your bag and
            order in one WhatsApp message.
          </motion.p>
          <motion.div className="flex flex-wrap gap-3 mt-9" {...r(0.5)}>
            <Link className="btn" href="/#collection">
              Shop the collection <ArrowRight />
            </Link>
            <Link className="btn btn-ghost" href="/fragrance/pura-symphony/">
              Meet Symphony
            </Link>
          </motion.div>
          <motion.div className="hero-facts" {...r(0.65)}>
            <span>
              <b>100 ml</b> ₹1,599
            </span>
            <span>
              <b>50 ml</b> ₹1,199
            </span>
            <span>
              <b>30 ml</b> ₹999
            </span>
            <span>Delivered across India</span>
          </motion.div>
        </div>

        <div className="arches">
          {[
            { href: "/shop/her/", img: "symphony-arch", label: "For Her", alt: "Pura Symphony bottle with its ivory box and white flowers" },
            { href: "/shop/him/", img: "obsidian-arch", label: "For Him", alt: "Pura Obsidian bottle on black stone with its black and gold box" },
          ].map((a, i) => (
            <motion.div
              key={a.href}
              initial={still ? false : { opacity: 0, y: 60, clipPath: "inset(30% 0 0 0 round 999px 999px 24px 24px)" }}
              animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0 0 0 round 999px 999px 24px 24px)" }}
              transition={{ duration: 1.3, delay: 0.25 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={a.href} className="arch block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/images/scenes/${a.img}-560.webp`} alt={a.alt} width={560} height={770} fetchPriority="high" />
                <span className="sheen" aria-hidden="true" />
                <span className="arch-tag">
                  {a.label} <ArrowRight size={14} />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
