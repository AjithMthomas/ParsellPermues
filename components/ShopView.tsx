import { PRODUCTS, type Audience } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

export type ShopFilter = "all" | Audience;

const TABS: { key: ShopFilter; label: string; href: string }[] = [
  { key: "all", label: "All twelve", href: "/shop/" },
  { key: "her", label: "For her", href: "/shop/her/" },
  { key: "him", label: "For him", href: "/shop/him/" },
  { key: "unisex", label: "For everyone", href: "/shop/unisex/" },
];

const HEAD: Record<ShopFilter, [string, string]> = {
  all: ["Every Pura fragrance.", "Eau de parfum in 8, 30, 50 and 100 ml, from ₹999."],
  her: ["Fragrances for her.", "Golden florals, a fresh rose, powdered iris and warm vanilla."],
  him: ["Fragrances for him.", "Smoked amber, sea salt, leather, vetiver and oud."],
  unisex: ["Fragrances to share.", "Green petals and creamy sandalwood, for anyone."],
};

export function ShopView({ filter }: { filter: ShopFilter }) {
  const list = PRODUCTS.filter((p) => filter === "all" || p.audience === filter);
  const [a, b] = HEAD[filter];
  return (
    <div className="pdp">
      <div className="wrap">
        <div className="section-head">
          <h1 style={{ fontSize: "var(--t-h2)" }}>
            {a} <span className="muted">{b}</span>
          </h1>
        </div>
        <nav className="filters" aria-label="Filter fragrances">
          {TABS.map((t) => (
            <a key={t.key} href={t.href} aria-current={t.key === filter ? "page" : undefined}>
              {t.label}
            </a>
          ))}
        </nav>
        <div className="tiles">
          {list.map((p) => (
            <ProductCard key={p.slug} p={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
