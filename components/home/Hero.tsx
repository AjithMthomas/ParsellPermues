const arrow = (
  <svg className="m-arrow" viewBox="0 0 12 12" aria-hidden="true">
    <path className="m-arrow__stem" d="M1 6h8" />
    <path className="m-arrow__head" d="M4.5 2.5 8 6l-3.5 3.5" />
  </svg>
);

/** Dealt hero: product. The range stands on the page's own ground across the wrap; the kit's entrance (data-enter). */
export function Hero() {
  return (
    <section className="hero hero--product" data-enter aria-labelledby="hero-h">
      <div className="wrap">
        <div className="hero-text hero__in">
          <div className="hero__head">
            <div>
              <h1 id="hero-h">
                Eau de parfum with a signature of <span className="it">elegance</span>
              </h1>
              <p className="hero__lead">
                Twelve fragrances for her and for him, in 8, 30, 50 and 100 ml from ₹999. Send your bag in one WhatsApp message; we deliver across India.
              </p>
            </div>
            <div className="btn-row">
              <a className="btn btn--primary" href="#range">
                Shop the collection{arrow}
              </a>
              <a className="btn btn--secondary" href="/fragrance/pura-symphony/">
                Meet Symphony
              </a>
            </div>
          </div>
          <div className="hero__stage">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="is-cutout lineup-wide"
              src="/images/hero/lineup-2400.webp"
              srcSet="/images/hero/lineup-1200.webp 1200w, /images/hero/lineup-2400.webp 2344w"
              sizes="(min-width: 1280px) 1280px, 100vw"
              alt="Seven Pura eau de parfum bottles in a row: Bloom, Rosa, Iris, Symphony in the middle, Obsidian, Azure and Ember"
              width={2344}
              height={984}
              fetchPriority="high"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="is-cutout lineup-phone"
              src="/images/hero/lineup-phone.webp"
              alt="Pura Iris, Symphony and Obsidian eau de parfum bottles side by side"
              width={1220}
              height={914}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
