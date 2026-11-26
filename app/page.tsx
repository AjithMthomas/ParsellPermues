import { Hero } from "@/components/home/Hero";
import { Trust } from "@/components/home/Trust";
import { Coverflow } from "@/components/home/Coverflow";
import { StoryBand } from "@/components/home/StoryBand";
import { Spotlight } from "@/components/home/Spotlight";
import { Finder } from "@/components/home/Finder";
import { Offers } from "@/components/home/Offers";
import { OrderFaq } from "@/components/home/OrderFaq";
import { PRODUCTS, STANDARD } from "@/data/products";
import { site } from "@/lib/site";

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
      price: p.prices["100"] ?? STANDARD["100"],
      itemOffered: { "@type": "Product", name: p.name, url: `${site.url}/fragrance/${p.slug}/` },
    })),
  };
  return (
    <>
      <Hero />
      <Trust />
      <Coverflow />
      <StoryBand variant="her" />
      <Spotlight />
      <StoryBand variant="him" />
      <Finder />
      <Offers />
      <OrderFaq />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
