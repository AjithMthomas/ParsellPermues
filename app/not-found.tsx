import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section pdp min-h-[80svh] flex items-center">
      <div className="wrap text-center grid gap-6 justify-items-center">
        <p className="eyebrow rule">Page not found</p>
        <h1 className="display h2 m-0">
          This page has <span className="script">evaporated</span>
        </h1>
        <p className="lede m-0">The fragrances are still here.</p>
        <Link className="btn" href="/shop/">
          Browse fragrances
        </Link>
      </div>
    </section>
  );
}
