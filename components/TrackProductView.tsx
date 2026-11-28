"use client";

import { useEffect, useRef } from "react";
import { type Product, AUDIENCE_LABEL } from "@/data/products";
import { trackViewContent } from "@/lib/pixel";

export function TrackProductView({ product }: { product: Product }) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    // Default to the featured 100 ml price, or fallback to 50 / 30 ml
    const price = product.prices["100"] || product.prices["50"] || product.prices["30"] || product.prices["8"];

    trackViewContent({
      name: product.name,
      slug: product.slug,
      price,
      category: AUDIENCE_LABEL[product.audience],
      currency: "INR",
    });
  }, [product]);

  return null;
}

