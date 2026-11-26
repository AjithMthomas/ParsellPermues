"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, RotateCcw, ShoppingBag } from "lucide-react";
import { AUDIENCE_LABEL, PRODUCTS, inr, packSrc, type Product } from "@/data/products";
import { useCart } from "@/lib/cart";

const QUESTIONS = [
  {
    q: "Who is it for?",
    opts: [
      { v: "her", t: "For her", s: "Florals, rose, iris" },
      { v: "him", t: "For him", s: "Woods, amber, citrus" },
      { v: "any", t: "Either", s: "Show me everything" },
    ],
  },
  {
    q: "When will it be worn?",
    opts: [
      { v: "day", t: "By day", s: "Office, college, brunch" },
      { v: "night", t: "After dark", s: "Dinners, weddings, events" },
      { v: "any", t: "Every day", s: "One bottle for all of it" },
    ],
  },
  {
    q: "Which sounds most like you?",
    opts: [
      { v: "fresh", t: "Fresh and green", s: "Citrus, leaves, sea air" },
      { v: "floral", t: "Soft and floral", s: "Petals, powder, light" },
      { v: "warm", t: "Warm and deep", s: "Amber, vanilla, smoke" },
    ],
  },
];

function pick(a: string[]): Product {
  const [who, when, mood] = a;
  const scored = PRODUCTS.map((p) => {
    let s = 0;
    if (who === "any" || p.audience === who) s += 4;
    else if (p.audience === "unisex") s += 2;
    if (when === "any" || p.time === when || p.time === "any") s += 2;
    if (p.mood === mood) s += 3;
    if (p.bestseller) s += 0.5;
    return { p, s };
  });
  return scored.sort((x, y) => y.s - x.s)[0].p;
}

export function Finder() {
  const [answers, setAnswers] = useState<string[]>([]);
  const { add } = useCart();
  const done = answers.length === QUESTIONS.length;
  const result = done ? pick(answers) : null;
  const q = QUESTIONS[answers.length];

  return (
    <section className="section finder" id="finder" aria-labelledby="finder-title">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow rule">Three questions</p>
          <h2 id="finder-title" className="display h2 m-0">
            Not sure? <span className="script">Ask us</span>
          </h2>
        </div>
        <div className="finder-card" aria-live="polite">
          <AnimatePresence mode="wait">
            {!done && q ? (
              <motion.div key={answers.length} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }}>
                <div className="flex justify-between items-center gap-4">
                  <span className="eyebrow">
                    Question {answers.length + 1} of {QUESTIONS.length}
                  </span>
                  {answers.length > 0 && (
                    <button className="link" onClick={() => setAnswers(answers.slice(0, -1))}>
                      Back
                    </button>
                  )}
                </div>
                <h3 className="display h3 mt-3 mb-0">{q.q}</h3>
                <div className="opts">
                  {q.opts.map((o) => (
                    <button key={o.v} className="opt" onClick={() => setAnswers([...answers, o.v])}>
                      <b>{o.t}</b>
                      <span>{o.s}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : result ? (
              <motion.div key="result" className="grid gap-6 sm:grid-cols-[180px_1fr] items-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="rounded-[22px] overflow-hidden relative aspect-[3/3.6] max-w-[200px] w-full mx-auto" style={{ background: `linear-gradient(160deg, ${result.tone[0]}, ${result.tone[1]})` }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`${packSrc(result.slug)}-480.webp`} alt={`${result.name} bottle`} className="absolute left-1/2 -translate-x-1/2 bottom-[-16%] w-[70%]" />
                </div>
                <div>
                  <span className="eyebrow">Your match · {AUDIENCE_LABEL[result.audience]}</span>
                  <h3 className="display h3 mt-2 mb-2">{result.name}</h3>
                  <p className="m-0 text-ink-2">{result.description}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-5">
                    <button className="btn" onClick={() => add(result.slug, "50")}>
                      <ShoppingBag /> Add 50 ml · {inr(result.prices["50"])}
                    </button>
                    <Link className="link" href={`/fragrance/${result.slug}/`}>
                      See notes <ArrowRight size={16} />
                    </Link>
                    <button className="link" onClick={() => setAnswers([])}>
                      <RotateCcw size={15} /> Start again
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
