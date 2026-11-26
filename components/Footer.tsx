import { site } from "@/lib/site";

const arrow = (
  <svg className="m-arrow" viewBox="0 0 12 12" aria-hidden="true">
    <path className="m-arrow__stem" d="M1 6h8" />
    <path className="m-arrow__head" d="M4.5 2.5 8 6l-3.5 3.5" />
  </svg>
);

/** footer.closing: the dealt close (close-type) and the directory (footer-columns) in one section. */
export function Footer() {
  return (
    <footer className="footer closing" id="contact" aria-labelledby="close-h">
      <div className="wrap">
        <div className="closing__cta close--type">
          <div className="section-head">
            <h2 id="close-h">Questions before you choose? Ask us.</h2>
            <p>Write on WhatsApp and a person replies with notes, sizes and delivery for your city.</p>
          </div>
          <a className="btn btn--primary btn--xl btn--wide" href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer">
            Chat with Pura on WhatsApp{arrow}
          </a>
        </div>
        <div className="closing__links">
          <div className="grid">
            <div className="span-4 stack-4">
              <a className="nav__logo" href="/" aria-label="Pura, home">
                <span className="logo-mark" aria-hidden="true" />
              </a>
              <p className="footer__lede">Eau de parfum for her and for him, delivered across India.</p>
            </div>
            <div className="span-2 footer__col">
              <h3>Shop</h3>
              <ul>
                <li><a href="/shop/">All fragrances</a></li>
                <li><a href="/shop/her/">For her</a></li>
                <li><a href="/shop/him/">For him</a></li>
                <li><a href="/shop/unisex/">For everyone</a></li>
              </ul>
            </div>
            <div className="span-2 footer__col">
              <h3>Help</h3>
              <ul>
                <li><a href="/#sizes">Sizes and gifts</a></li>
                <li><a href="/#order">Ordering</a></li>
                <li><a href="/#faq">Questions</a></li>
              </ul>
            </div>
            <div className="span-4 footer__col">
              <h3>Contact</h3>
              <ul>
                <li><a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp {site.whatsappDisplay}</a></li>
                <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
                <li><a href={site.instagram} target="_blank" rel="noreferrer">Instagram {site.instagramHandle}</a></li>
              </ul>
            </div>
          </div>
          <div className="footer__legal">
            <span>© {new Date().getFullYear()} {site.legal}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
