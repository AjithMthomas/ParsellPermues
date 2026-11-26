import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { AUDIENCE_LABEL, PRODUCTS, inr, packSrc, productBySlug } from "@/data/products";
import { site } from "@/lib/site";
import { ProductBuy } from "@/components/ProductBuy";
import { ProductCard } from "@/components/ProductCard";

export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = productBySlug(slug);
  if (!p) return {};
  const description = `${p.name}, ${p.family.toLowerCase()} eau de parfum ${AUDIENCE_LABEL[p.audience].toLowerCase()}. ${p.line} 30 ml ${inr(p.prices["30"])}, 100 ml ${inr(p.prices["100"])}.`;
  return {
    title: p.name,
    description,
    alternates: { canonical: `/fragrance/${p.slug}/` },
    openGraph: { title: `${p.name} | Pura`, description, images: [{ url: `${packSrc(p.slug)}-900.webp`, width: 900, height: 1760, alt: `${p.name} bottle` }] },
  };
}

export default async function FragrancePage({ params }: Params) {
  const { slug } = await params;
  const p = productBySlug(slug);
  if (!p) notFound();
  const related = PRODUCTS.filter((x) => x.slug !== p.slug && (x.audience === p.audience || x.audience === "unisex")).slice(0, 4);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    brand: { "@type": "Brand", name: "Pura" },
    image: `${site.url}${packSrc(p.slug)}-900.webp`,
    sku: p.slug,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: p.prices["30"],
      highPrice: p.prices["100"],
      offerCount: 4,
      availability: "https://schema.org/InStock",
      url: `${site.url}/fragrance/${p.slug}/`,
    },
  };

  return (
    <>
      <section className="pdp pb-16">
        <div className="wrap">
          <Link className="link mb-4" href={p.audience === "unisex" ? "/shop/unisex/" : `/shop/${p.audience}/`}>
            <ChevronLeft size={16} /> {AUDIENCE_LABEL[p.audience]}
          </Link>
          <div className="pdp-grid">
            <div>
              <div className="pdp-hero" style={{ background: `radial-gradient(90% 70% at 50% 35%, ${p.tone[0]} 0%, ${p.tone[1]} 100%)` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${packSrc(p.slug)}-900.webp`}
                  srcSet={`${packSrc(p.slug)}-480.webp 480w, ${packSrc(p.slug)}-900.webp 900w`}
                  sizes="(min-width: 1024px) 360px, 62vw"
                  alt={`${p.name} eau de parfum bottle`}
                  width={900}
                  height={1760}
                  fetchPriority="high"
                />
              </div>
              {p.scenes && (
                <div className="pdp-scenes">
                  {p.scenes.map((s) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={s} src={`/images/scenes/${s}-640.webp`} srcSet={`/images/scenes/${s}-640.webp 640w, /images/scenes/${s}-1024.webp 1024w`} sizes="(min-width: 1024px) 30vw, 50vw" alt={`${p.name} with its box`} loading="lazy" />
                  ))}
                </div>
              )}
            </div>
            <div className="pdp-buy grid gap-6 content-start">
              <div className="flex flex-wrap items-center gap-2">
                {p.bestseller && <span className="badge">Bestseller</span>}
                {p.premium && <span className="badge">Privé</span>}
                {p.isNew && !p.premium && <span className="badge">New</span>}
                <span className="eyebrow">
                  {p.code} · {AUDIENCE_LABEL[p.audience]}
                </span>
              </div>
              <div>
                <h1 className="display h2 m-0">{p.name}</h1>
                <p className="eyebrow mt-3 mb-0 text-ink-2!">{p.family}</p>
              </div>
              <p className="lede m-0">
                {p.line} {p.description}
              </p>
              <ProductBuy p={p} />
              <div className="pyramid mt-2">
                {(["top", "heart", "base"] as const).map((k) => (
                  <div key={k} className="tier">
                    <span className="k">{k}</span>
                    <span className="v">{p.notes[k].join(", ")}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section bg-sand" aria-labelledby="related-title">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow rule">You may also like</p>
            <h2 id="related-title" className="display h2 m-0">
              More <span className="script">{p.audience === "unisex" ? "to share" : AUDIENCE_LABEL[p.audience].toLowerCase()}</span>
            </h2>
          </div>
          <div className="grid-products">
            {related.map((r) => (
              <ProductCard key={r.slug} p={r} />
            ))}
          </div>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
