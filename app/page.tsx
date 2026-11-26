import { Hero } from "@/components/home/Hero";
import { Coverflow } from "@/components/home/Coverflow";
import { Bestseller, HerHim, Ordering, Sizes, Worlds } from "@/components/home/Sections";
import { PRODUCTS } from "@/data/products";
import { site } from "@/lib/site";

/*
  kind: product (a perfume house selling online) · page type product · site-kind other
  deal: palette from the client's reference (start.mjs brand: ivory #f6efe6, espresso #22180f, gold #8a6532),
        type instrument-serif (Instrument Serif / Instrument Sans), radius soft, buttons block,
        hero product (the range standing on the ground), nav-mega, footer-columns, close-type, rhythm dark-band,
        moments photo-chapters (#worlds) and picture-develops (#sizes)
  screens: hero 1 · range 1 · her-him 1 (dark band) · worlds 4 (moment) · symphony 1 · sizes 1 · order 2 · closing 1
*/
export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.legal,
    url: site.url,
    logo: `${site.url}/icon.png`,
    sameAs: [site.instagram],
    makesOffer: PRODUCTS.map((p) => ({
      "@type": "Offer",
      priceCurrency: "INR",
      price: p.prices["100"],
      itemOffered: { "@type": "Product", name: p.name, url: `${site.url}/fragrance/${p.slug}/` },
    })),
  };
  return (
    <>
      <Hero />
      <Coverflow />
      <HerHim />
      <Worlds />
      <Bestseller />
      <Sizes />
      <Ordering />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
