"use client";

import { useCart } from "@/lib/cart";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export function FlyToBag() {
  const { flying } = useCart();
  const still = useReducedMotion();

  if (still || !flying || flying.length === 0) return null;

  return (
    <div className="fly-portal" aria-hidden="true">
      <AnimatePresence>
        {flying.map((f) => {
          const midX = (f.startX + f.targetX) / 2;
          const arcPeak = Math.min(f.startY, f.targetY) - 75;
          return (
            <motion.div
              key={f.id}
              className="flying-ghost"
              initial={{
                x: f.startX - 22,
                y: f.startY - 30,
                scale: 1,
                opacity: 1,
                rotate: 0,
              }}
              animate={{
                x: [f.startX - 22, midX - 16, f.targetX - 16],
                y: [f.startY - 30, arcPeak, f.targetY - 18],
                scale: [1, 0.75, 0.22],
                opacity: [1, 1, 0.9, 0],
                rotate: [0, -12, 18],
              }}
              transition={{
                duration: 0.68,
                ease: [0.22, 1, 0.36, 1],
                times: [0, 0.55, 1],
              }}
            >
              <div className="flying-bottle-frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.thumb} alt="" width={44} height={60} />
              </div>
              <span className="flying-trail" />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
