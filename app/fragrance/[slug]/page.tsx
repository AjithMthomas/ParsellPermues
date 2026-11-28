import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AUDIENCE_LABEL, PRODUCTS, inr, packSrc, productBySlug } from "@/data/products";
import { site } from "@/lib/site";
import { ProductBuy } from "@/components/ProductBuy";
import { ProductCard } from "@/components/ProductCard";
import { TrackProductView } from "@/components/TrackProductView";

export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = productBySlug(slug);
  if (!p) return {};
  const description = `${p.name}: ${p.family.toLowerCase()} eau de parfum ${AUDIENCE_LABEL[p.audience].toLowerCase()}. ${p.line} Available in 8, 30, 50, and 100 ml with Free Express Delivery across India.`;
  const ogImageUrl = `${site.url}${packSrc(p.slug)}-900.webp`;
  const pageUrl = `${site.url}/fragrance/${p.slug}/`;

  return {
    title: `${p.name} — Luxury Eau de Parfum | Pura`,
    description,
    alternates: { canonical: `/fragrance/${p.slug}/` },
    openGraph: {
      title: `${p.name} — Luxury Eau de Parfum | Pura`,
      description,
      url: pageUrl,
      siteName: site.name,
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 900,
          height: 1760,
          alt: `${p.name} luxury bottle and packaging`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${p.name} — Luxury Eau de Parfum | Pura`,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function FragrancePage({ params }: Params) {
  const { slug } = await params;
  const p = productBySlug(slug);
  if (!p) notFound();
  const related = PRODUCTS.filter((x) => x.slug !== p.slug && (x.audience === p.audience || x.audience === "unisex")).slice(0, 4);
  const back = p.audience === "unisex" ? "/shop/unisex/" : `/shop/${p.audience}/`;
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
      lowPrice: p.prices["8"],
      highPrice: p.prices["100"],
      offerCount: 4,
      availability: "https://schema.org/InStock",
      url: `${site.url}/fragrance/${p.slug}/`,
    },
  };

  return (
    <>
      <TrackProductView product={p} />
      <div className="pdp">
        <div className="wrap">
          <p style={{ margin: "0 0 var(--s-5)" }}>
            <a className="link" href={back}>
              {AUDIENCE_LABEL[p.audience]}
            </a>
          </p>
          <div className="pdp-grid">
            <div>
              <div className="pdp-hero" style={{ background: `radial-gradient(90% 75% at 50% 35%, ${p.tone[0]}, ${p.tone[1]})` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/images/bottle/${p.slug}-640.webp`}
                  srcSet={`/images/bottle/${p.slug}-360.webp 360w, /images/bottle/${p.slug}-640.webp 640w`}
                  sizes="(min-width: 1024px) 300px, 42vw"
                  width={640}
                  height={800}
                  alt={`${p.name} eau de parfum bottle`}
                  fetchPriority="high"
                />
              </div>
              {p.scenes && (
                <div className="pdp-scenes">
                  {p.scenes.map((s) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={s} src={`/images/scenes/${s}-${s.endsWith("trio") ? 720 : 640}.webp`} srcSet={s.endsWith("trio") ? `/images/scenes/${s}-720.webp 720w, /images/scenes/${s}-1200.webp 1200w` : `/images/scenes/${s}-640.webp 640w, /images/scenes/${s}-1024.webp 1024w`} sizes="(min-width: 1024px) 30vw, 50vw" alt={s.endsWith("trio") ? `${p.name} with two other Pura fragrances on satin` : `${p.name} with its box`} loading="lazy" />
                  ))}
                </div>
              )}
            </div>
            <div className="pdp-buy">
              <div>
                <p className="muted" style={{ margin: "0 0 var(--s-2)" }}>
                  {p.code} · {AUDIENCE_LABEL[p.audience]}
                  {p.bestseller ? " · Our bestseller" : p.premium ? " · Privé" : p.isNew ? " · New" : ""}
                </p>
                <h1>{p.name}</h1>
                <p className="muted" style={{ margin: "var(--s-2) 0 0" }}>
                  {p.family}
                </p>
              </div>
              <p className="t-lead" style={{ margin: 0 }}>
                {p.line} {p.description}
              </p>
              <ProductBuy p={p} />
              <dl className="notes">
                {(["top", "heart", "base"] as const).map((k) => (
                  <div key={k}>
                    <dt>{k[0].toUpperCase() + k.slice(1)}</dt>
                    <dd>{p.notes[k].join(", ")}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div style={{ marginTop: "var(--s-9)" }}>
            <div className="section-head">
              <h2>
                More {p.audience === "unisex" ? "to share" : AUDIENCE_LABEL[p.audience].toLowerCase()}.
              </h2>
            </div>
            <div className="tiles">
              {related.map((r) => (
                <ProductCard key={r.slug} p={r} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
