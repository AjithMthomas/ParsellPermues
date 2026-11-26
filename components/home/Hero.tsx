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
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-curtain">
          <div className="curtain-cloth">
            <div className="curtain-pleat p1" />
            <div className="curtain-pleat p2" />
            <div className="curtain-pleat p3" />
            <div className="curtain-pleat p4" />
            <div className="curtain-pleat p5" />
            <div className="curtain-pleat p6" />
            <div className="curtain-pleat p7" />
            <div className="curtain-pleat p8" />
          </div>
          <svg className="curtain-waves-svg" viewBox="0 0 1440 800" preserveAspectRatio="none">
            <defs>
              <linearGradient id="silk-wave-grad-1" x1="0%" y1="0%" x2="100%" y2="70%">
                <stop offset="0%" stopColor="#f5ebe0" stopOpacity="0.75" />
                <stop offset="25%" stopColor="#eed8bf" stopOpacity="0.55" />
                <stop offset="50%" stopColor="#fffcf8" stopOpacity="0.9" />
                <stop offset="75%" stopColor="#debfa0" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#f7eee5" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="silk-wave-grad-2" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#eedbc7" stopOpacity="0.5" />
                <stop offset="40%" stopColor="#fffaf4" stopOpacity="0.85" />
                <stop offset="65%" stopColor="#d8b995" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#f4ece3" stopOpacity="0.7" />
              </linearGradient>
            </defs>
            <path className="curtain-wave wave-back" fill="url(#silk-wave-grad-1)" d="M0,160 C320,310 520,70 880,220 C1160,340 1320,110 1440,210 L1440,800 L0,800 Z" />
            <path className="curtain-wave wave-front" fill="url(#silk-wave-grad-2)" d="M0,250 C300,110 580,360 940,170 C1220,50 1340,290 1440,220 L1440,800 L0,800 Z" />
          </svg>
          <div className="curtain-wind-ripple" />
        </div>
        <div className="hero-orbs">
          <span className="hero-orb hero-orb--1" />
          <span className="hero-orb hero-orb--2" />
          <span className="hero-orb hero-orb--3" />
        </div>
        <div className="hero-flecks">
          <span className="fleck f1" />
          <span className="fleck f2" />
          <span className="fleck f3" />
          <span className="fleck f4" />
          <span className="fleck f5" />
          <span className="fleck f6" />
          <span className="fleck f7" />
          <span className="fleck f8" />
          <span className="fleck f9" />
          <span className="fleck f10" />
        </div>
        <div className="hero-sweep" />
      </div>
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
