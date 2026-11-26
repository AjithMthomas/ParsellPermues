import Link from "next/link";
import { Mail } from "lucide-react";
import { site } from "@/lib/site";
import { InstagramIcon, WhatsAppIcon } from "@/components/WhatsAppIcon";

export function Footer() {
  return (
    <footer className="footer on-dark">
      <div className="wrap">
        <div className="footer-grid">
          <div className="grid gap-5 content-start">
            <span className="logo" style={{ width: 128, background: "#d8bd8a" }} role="img" aria-label="Pura" />
            <p className="m-0 max-w-[30ch] text-[15px] text-[rgba(233,223,210,0.75)]">
              Eau de parfum for her and for him. {site.tagline}.
            </p>
          </div>
          <div>
            <h3>Shop</h3>
            <ul>
              <li><Link href="/shop/">All fragrances</Link></li>
              <li><Link href="/shop/her/">For Her</Link></li>
              <li><Link href="/shop/him/">For Him</Link></li>
              <li><Link href="/fragrance/pura-symphony/">Pura Symphony</Link></li>
            </ul>
          </div>
          <div>
            <h3>Help</h3>
            <ul>
              <li><Link href="/#order">How to order</Link></li>
              <li><Link href="/#sizes">Sizes and gifts</Link></li>
              <li><Link href="/#finder">Find your scent</Link></li>
              <li><Link href="/#faq">Questions</Link></li>
            </ul>
          </div>
          <div>
            <h3>Talk to us</h3>
            <ul>
              <li>
                <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer">
                  <WhatsAppIcon /> WhatsApp {site.whatsappDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`}>
                  <Mail size={18} strokeWidth={1.4} /> {site.email}
                </a>
              </li>
              <li>
                <a href={site.instagram} target="_blank" rel="noreferrer">
                  <InstagramIcon /> Instagram {site.instagramHandle}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-base">
          <span>© {new Date().getFullYear()} {site.legal}. All rights reserved.</span>
          <span>Delivered across India</span>
        </div>
      </div>
    </footer>
  );
}
