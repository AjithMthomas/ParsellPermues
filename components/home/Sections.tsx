import { GIFT, PRODUCTS, SIZES, STANDARD, inr, productBySlug } from "@/data/products";
import { site } from "@/lib/site";
import { AddButton } from "@/components/home/AddButton";

/* ---------- her and him: the dark band, a pair of pictures */
export function HerHim() {
  const her = PRODUCTS.filter((p) => p.audience === "her").map((p) => p.short);
  const him = PRODUCTS.filter((p) => p.audience === "him").map((p) => p.short);
  const items = [
    { href: "/shop/her/", img: "her-trio", title: "For her", list: her, alt: "Pura Rosa, Symphony and Iris standing on bronze satin" },
    { href: "/shop/him/", img: "him-trio", title: "For him", list: him, alt: "Pura Azure, Obsidian and Ember standing on black satin" },
  ];
  return (
    <section className="section ground-inverse" id="her-him" aria-labelledby="hh-h">
      <div className="wrap">
        <div className="section-head">
          <h2 id="hh-h">
            Let your scent tell your story. <span className="muted">Five fragrances for her, five for him, two to share.</span>
          </h2>
        </div>
        <div className="pair">
          {items.map((it) => (
            <a key={it.href} href={it.href} className="pair-item">
              <div className="pic">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/images/scenes/${it.img}-1200.webp`} srcSet={`/images/scenes/${it.img}-720.webp 720w, /images/scenes/${it.img}-1200.webp 1200w`} sizes="(min-width: 768px) 50vw, 100vw" alt={it.alt} loading="lazy" />
              </div>
              <h3>{it.title}</h3>
              <p>
                {it.list.join(", ")}. <span className="link">Shop {it.title.toLowerCase()}</span>
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- four originals: four tall campaign photos side by side, each with its name, family and price */
export function Worlds() {
  const originals = [
    { slug: "pura-symphony", img: "symphony-wide", alt: "Pura Symphony beside its ivory box among white flowers on marble" },
    { slug: "pura-obsidian", img: "obsidian-wide", alt: "Pura Obsidian on black stone beside its black and gold box" },
    { slug: "pura-elin-lush", img: "elin-lush-wide", alt: "Pura Elin Lush on wet rock among green leaves and white blossom" },
    { slug: "pura-iris", img: "iris-wide", alt: "Pura Iris beside its box among purple irises" },
  ];
  return (
    <section className="section" id="worlds" aria-labelledby="worlds-h">
      <div className="wrap">
        <div className="section-head">
          <h2 id="worlds-h">
            The Four Originals. <span className="muted">Symphony, Obsidian, Elin Lush and Iris.</span>
          </h2>
          <p className="orig-lead">The first four Pura fragrances, each in the campaign photographs captured in their original light.</p>
        </div>
        <div className="orig-grid">
          {originals.map((c, i) => {
            const p = productBySlug(c.slug)!;
            return (
              <a key={c.slug} href={`/fragrance/${p.slug}/`} className="orig-card">
                <div className="orig-pic">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/images/scenes/${c.img}-1024.webp`}
                    srcSet={`/images/scenes/${c.img}-640.webp 640w, /images/scenes/${c.img}-1024.webp 1024w`}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 50vw"
                    alt={c.alt}
                    loading={i < 2 ? "eager" : "lazy"}
                    width={1024}
                    height={768}
                  />
                </div>
                <div className="orig-meta">
                  <h3 className="orig-title">{p.name}</h3>
                  <p className="orig-fam">{p.family}</p>
                  <span className="orig-price">From {inr(p.prices["30"])}</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- the bestseller: three ingredient photographs, each named above it */
export function Bestseller() {
  const p = productBySlug("pura-symphony")!;
  const tiers = [
    { k: "top" as const, label: "Bergamot on top", img: "top", alt: "A bergamot with its leaf on linen" },
    { k: "heart" as const, label: "Magnolia at the heart", img: "heart", alt: "White magnolia and neroli blossom on linen" },
    { k: "base" as const, label: "Amber at the base", img: "base", alt: "A piece of amber resin on pale wood" },
  ];
  return (
    <section className="section" id="symphony" aria-labelledby="sym-h">
      <div className="wrap">
        <div className="section-head">
          <h2 id="sym-h">
            Pura Symphony, our bestseller. <span className="muted">Bergamot, magnolia and golden amber.</span>
          </h2>
          <div className="head-buy">
            <AddButton slug={p.slug} size="100" label={`Add 100 ml, ${inr(p.prices["100"])}`} />
            <a className="link" href={`/fragrance/${p.slug}/`}>
              Every size and note
            </a>
          </div>
        </div>
        <div className="trio">
          {tiers.map((t) => (
            <div className="trio-item" key={t.k}>
              <h3>{t.label}</h3>
              <p>{p.notes[t.k].join(", ")}</p>
              <div className="pic">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/images/notes/${t.img}-896.webp`} srcSet={`/images/notes/${t.img}-520.webp 520w, /images/notes/${t.img}-896.webp 896w`} sizes="(min-width: 768px) 33vw, 100vw" alt={t.alt} loading="lazy" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- sizes and the gift duo, beside a photograph that develops */
export function Sizes() {
  return (
    <section className="section" id="sizes" aria-labelledby="sizes-h">
      <div className="wrap">
        <div className="grid">
          <div className="span-6">
            <div className="section-head">
              <h2 id="sizes-h">
                Four sizes of every fragrance. <span className="muted">Start with three 8 ml bottles for {inr(STANDARD["8"])}.</span>
              </h2>
            </div>
            <ul className="rows rows--spec">
              {SIZES.map((s) => (
                <li key={s.key}>
                  <span className="rows__name">{s.label}</span>
                  <p>{s.key === "8" ? "Three bottles of one fragrance, for a bag or a trip" : s.key === "30" ? "An everyday size" : s.key === "50" ? "A signature size for the dresser" : "The best value per ml"}</p>
                  <span className="rows__value">{inr(STANDARD[s.key])}</span>
                </li>
              ))}
              <li>
                <span className="rows__name">{GIFT.name}</span>
                <p>
                  {GIFT.contents.join(" and ")}, {inr(GIFT.saves)} less than apart. <AddButton slug={GIFT.slug} size="set" label="Add the duo" link />
                </p>
                <span className="rows__value">{inr(GIFT.price)}</span>
              </li>
            </ul>
            <p className="t-small muted" style={{ marginTop: "var(--s-4)" }}>
              Pura Oud Royale, our richest blend, runs from {inr(999)} for the trio to {inr(1899)} for 100 ml.
            </p>
          </div>
          <figure className="span-6 sizes-photo" data-moment="picture-develops">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/scenes/duo-1000.webp" srcSet="/images/scenes/duo-640.webp 640w, /images/scenes/duo-1000.webp 1000w" sizes="(min-width: 1024px) 50vw, 100vw" alt="The His and Hers Duo: Pura Symphony and Pura Obsidian on cream satin" width={1000} height={1000} loading="lazy" />
          </figure>
        </div>
      </div>
    </section>
  );
}

/* ---------- ordering: two screens, the steps beside the real message, then every answer open */
export function Ordering() {
  const steps = [
    { t: "Fill your bag", d: "Choose a fragrance and a size. Add as many as you like, or the His & Hers Duo." },
    { t: "Send it on WhatsApp", d: "One tap opens a chat with every item and the total already written. Send it as it is." },
    { t: "We confirm and deliver", d: "We reply in the same chat with availability and delivery for your city, then ship." },
  ];
  const faq = [
    { q: "How do I place an order?", a: "Add fragrances to your bag and press Place order on WhatsApp. The message is written for you; you only send it. We confirm the order and delivery in that chat." },
    { q: "Do you deliver across India?", a: "Yes. Tell us your city in the chat and we confirm the delivery details with your order." },
    { q: "Which size should I choose?", a: "The 8 ml set (₹899) is three small bottles of one fragrance, good for trying or travelling. 30 ml (₹999) is an everyday size, 50 ml (₹1,199) a signature size, and 100 ml (₹1,599) the best value per ml." },
    { q: "Are these for men or for women?", a: "Each fragrance is marked for her, for him or for everyone to help you choose, but wear what you love. Elin Lush and Santal are made to be shared." },
    { q: "Can I ask before I buy?", a: `Yes. Message us on WhatsApp or write to ${site.email} and we help you choose.` },
  ];
  return (
    <section className="section g2" id="order" aria-labelledby="order-h">
      <div className="wrap">
        <div className="group">
          <div className="section-head">
            <h2 id="order-h">
              Ordering takes one WhatsApp message. <span className="muted">No account and no forms.</span>
            </h2>
          </div>
          <div className="grid">
            <ol className="steps span-6">
              {steps.map((s, i) => (
                <li key={s.t}>
                  <span className="num">{i + 1}</span>
                  <div>
                    <h3>{s.t}</h3>
                    <p>{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="span-6 chat" role="img" aria-label="The WhatsApp message your bag writes: two items, sizes, quantities and the total">
              <div className="chat__bar">
                <span className="chat__avatar" aria-hidden="true">
                  <span className="logo-mark" />
                </span>
                <span>
                  <b>Pura Perfumes</b>
                  <small>WhatsApp</small>
                </span>
              </div>
              <div className="chat__body">
                <div className="chat__msg">
                  <p>Hello Pura, I would like to order:</p>
                  <p>
                    1. Pura Symphony, 100 ml, qty 1: ₹1,599
                    <br />
                    2. Pura Obsidian, 8 ml × 3, qty 1: ₹899
                  </p>
                  <p>Total: ₹2,498</p>
                  <p>Please confirm availability and delivery. Thank you.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="group" id="faq">
          <div className="faq">
            {faq.map((f) => (
              <div className="faq__item" key={f.q}>
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
