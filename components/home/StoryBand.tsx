"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { PRODUCTS, packSrc } from "@/data/products";

interface Props {
  variant: "her" | "him";
}

const COPY = {
  her: {
    eyebrow: "Feel the luxury",
    a: "Let your scent",
    b: "tell your story",
    body: "Golden florals for the day, powdered iris for the evening, a fresh rose for everything between. Five fragrances made for her.",
    cta: "Shop for her",
    href: "/shop/her/",
    trio: ["pura-rosa", "pura-symphony", "pura-iris"],
    ground: "satin-her",
  },
  him: {
    eyebrow: "Made for him",
    a: "Let your scent",
    b: "speak first",
    body: "Smoked amber after dark, cold citrus and sea salt by day, and an oud for the nights that matter. Five fragrances made for him.",
    cta: "Shop for him",
    href: "/shop/him/",
    trio: ["pura-azure", "pura-obsidian", "pura-ember"],
    ground: "satin-him",
  },
};

export function StoryBand({ variant }: Props) {
  const c = COPY[variant];
  const still = useReducedMotion();
  const names = PRODUCTS.filter((p) => p.audience === variant);
  return (
    <section className={`story ${variant} on-dark`} aria-labelledby={`story-${variant}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="story-ground"
        src={`/images/grounds/${c.ground}-1800.webp`}
        srcSet={`/images/grounds/${c.ground}-960.webp 960w, /images/grounds/${c.ground}-1800.webp 1800w`}
        sizes="100vw"
        alt=""
        loading="lazy"
      />
      <div className="wrap">
        <div className="story-copy">
          <p className="eyebrow rule light">{c.eyebrow}</p>
          <h2 id={`story-${variant}`} className="display h2 mt-6 mb-0">
            {c.a} <span className="script">{c.b}</span>
          </h2>
          <p className="lede mt-6 mb-0">{c.body}</p>
          <div className="story-list">
            {names.map((p) => (
              <Link key={p.slug} className="chip hover:border-[#d8bd8a]! transition-colors" href={`/fragrance/${p.slug}/`}>
                {p.short}
              </Link>
            ))}
          </div>
          <Link className="btn btn-gold" href={c.href}>
            {c.cta} <ArrowRight />
          </Link>
        </div>
        <div className="trio">
          {c.trio.map((slug, i) => {
            const p = PRODUCTS.find((x) => x.slug === slug)!;
            return (
              <motion.a
                key={slug}
                href={`/fragrance/${slug}/`}
                aria-label={p.name}
                initial={still ? false : { opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 1.1, delay: [0.15, 0, 0.3][i], ease: [0.22, 1, 0.36, 1] }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${packSrc(slug)}-480.webp`} srcSet={`${packSrc(slug)}-480.webp 480w, ${packSrc(slug)}-900.webp 900w`} sizes="(min-width: 1024px) 240px, 34vw" alt="" width={480} height={939} loading="lazy" />
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
