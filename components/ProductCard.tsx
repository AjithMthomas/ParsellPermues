import Link from "next/link";
import { AUDIENCE_LABEL, fromPrice, inr, packSrc, type Product } from "@/data/products";

export function ProductCard({ p }: { p: Product }) {
  return (
    <Link href={`/fragrance/${p.slug}/`} className="pcard">
      <div className="pic" style={{ background: `linear-gradient(160deg, ${p.tone[0]} 0%, ${p.tone[1]} 100%)` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${packSrc(p.slug)}-480.webp`}
          srcSet={`${packSrc(p.slug)}-480.webp 480w, ${packSrc(p.slug)}-900.webp 900w`}
          sizes="(min-width: 1200px) 200px, (min-width: 900px) 25vw, 40vw"
          alt={`${p.name} bottle`}
          width={480}
          height={939}
          loading="lazy"
        />
        {p.bestseller ? <span className="badge">Bestseller</span> : p.premium ? <span className="badge">Privé</span> : p.isNew ? <span className="badge">New</span> : null}
      </div>
      <div>
        <h3>{p.name}</h3>
        <div className="row mt-1">
          <span>{AUDIENCE_LABEL[p.audience]}</span>
          <span>from {inr(fromPrice(p))}</span>
        </div>
      </div>
    </Link>
  );
}
