"use client";

import Link from "next/link";
import { ArrowRight, Gift, ShoppingBag } from "lucide-react";
import { GIFT, SIZES, STANDARD, inr } from "@/data/products";
import { useCart } from "@/lib/cart";

export function Offers() {
  const { add } = useCart();
  return (
    <section className="section" id="sizes" aria-labelledby="sizes-title">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow rule">Sizes and gifts</p>
          <h2 id="sizes-title" className="display h2 m-0">
            Start small, <span className="script">or go all in</span>
          </h2>
        </div>
        <div className="offers">
          <article className="offer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="bg" src="/images/grounds/satin-her-960.webp" alt="" loading="lazy" />
            <div className="duo slim" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src="/images/pack/pura-8ml-300.webp" alt="" loading="lazy" />
              ))}
            </div>
            <span className="eyebrow light">Travel trio</span>
            <h3 className="display h3 mt-2 mb-2">Three 8 ml bottles for {inr(STANDARD["8"])}</h3>
            <p className="m-0 max-w-[34em] text-[rgba(243,235,224,0.82)]">Slim enough for a handbag or a gym kit. Pick the 8 ml size on any fragrance and three bottles of it arrive together.</p>
            <Link className="btn btn-gold mt-6 self-start" href="/shop/">
              Choose a fragrance <ArrowRight />
            </Link>
          </article>
          <article className="offer cream">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="bg" src="/images/grounds/satin-cream-960.webp" alt="" loading="lazy" />
            <div className="duo" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/pack/pura-symphony-480.webp" alt="" loading="lazy" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/pack/pura-obsidian-480.webp" alt="" loading="lazy" />
            </div>
            <span className="eyebrow inline-flex items-center gap-2">
              <Gift size={15} /> Gift set
            </span>
            <h3 className="display h3 mt-2 mb-2">
              {GIFT.name}, {inr(GIFT.price)}
            </h3>
            <p className="m-0 max-w-[34em] text-ink-2">
              {GIFT.contents.join(" and ")}. Our bestseller for her and our deepest scent for him, together for {inr(GIFT.saves)} less than buying them apart.
            </p>
            <button className="btn mt-6 self-start" onClick={() => add(GIFT.slug, "set")}>
              <ShoppingBag /> Add the duo
            </button>
          </article>
        </div>
        <div className="ladder" aria-label="Prices by size">
          {SIZES.map((s) => (
            <div key={s.key}>
              <span className="eyebrow">{s.hint}</span>
              <b>{inr(STANDARD[s.key])}</b>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-ink-2 mt-4 mb-0 text-center">Pura Oud Royale, our richest blend, is priced from {inr(999)} for the trio to {inr(1899)} for 100 ml.</p>
      </div>
    </section>
  );
}
