import Link from "next/link";
import { PRODUCTS, type Audience } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

export type ShopFilter = "all" | Audience;

const TABS: { key: ShopFilter; label: string; href: string }[] = [
  { key: "all", label: "All", href: "/shop/" },
  { key: "her", label: "For Her", href: "/shop/her/" },
  { key: "him", label: "For Him", href: "/shop/him/" },
  { key: "unisex", label: "For Everyone", href: "/shop/unisex/" },
];

const HEAD: Record<ShopFilter, { a: string; b: string; lede: string }> = {
  all: { a: "Every", b: "fragrance", lede: "Twelve eau de parfums in 8, 30, 50 and 100 ml. Every one from ₹999." },
  her: { a: "For", b: "her", lede: "Golden florals, a fresh rose, powdered iris and warm vanilla. From ₹999." },
  him: { a: "For", b: "him", lede: "Smoked amber, sea salt, leather, vetiver and oud. From ₹999." },
  unisex: { a: "For", b: "everyone", lede: "Green petals and creamy sandalwood, made to be shared. From ₹999." },
};

export function ShopView({ filter }: { filter: ShopFilter }) {
  const list = PRODUCTS.filter((p) => filter === "all" || p.audience === filter);
  const h = HEAD[filter];
  return (
    <section className="section pdp" aria-labelledby="shop-title">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow rule">Shop Pura</p>
          <h1 id="shop-title" className="display h2 m-0">
            {h.a} <span className="script">{h.b}</span>
          </h1>
          <p className="lede m-0 text-center">{h.lede}</p>
          <nav className="flow-tabs mt-2 flex-wrap justify-center" aria-label="Filter fragrances">
            {TABS.map((t) => (
              <Link
                key={t.key}
                href={t.href}
                aria-current={t.key === filter ? "page" : undefined}
                className={`relative z-[1] inline-flex items-center min-h-[42px] px-5 rounded-full text-[13px] tracking-[0.14em] uppercase font-medium transition-colors ${t.key === filter ? "bg-ink text-ivory" : "text-ink-2 hover:text-ink"}`}
              >
                {t.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="grid-products">
          {list.map((p) => (
            <ProductCard key={p.slug} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
