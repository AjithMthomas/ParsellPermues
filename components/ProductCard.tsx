import { AUDIENCE_LABEL, fromPrice, inr, type Product } from "@/data/products";

export function ProductCard({ p }: { p: Product }) {
  const flag = p.bestseller ? "Bestseller" : p.premium ? "Privé" : p.isNew ? "New" : null;
  return (
    <a href={`/fragrance/${p.slug}/`} className="ptile">
      <div className="pic" style={{ background: `linear-gradient(165deg, ${p.tone[0]}, ${p.tone[1]})` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/images/bottle/${p.slug}-360.webp`} srcSet={`/images/bottle/${p.slug}-360.webp 360w, /images/bottle/${p.slug}-640.webp 640w`} sizes="(min-width: 1200px) 170px, 30vw" alt={`${p.name} bottle`} loading="lazy" />
        {flag && <span className="flag">{flag}</span>}
      </div>
      <h3>{p.name}</h3>
      <div className="meta">
        <span>{AUDIENCE_LABEL[p.audience]}</span>
        <span>from {inr(fromPrice(p))}</span>
      </div>
    </a>
  );
}
