import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/data/products";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/shop/", "/shop/her/", "/shop/him/", "/shop/unisex/"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, changeFrequency: "weekly" as const, priority: p === "/" ? 1 : 0.8 })),
    ...PRODUCTS.map((p) => ({ url: `${site.url}/fragrance/${p.slug}/`, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
