import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";
import { CartProvider } from "@/lib/cart";
import { site } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { Moments } from "@/components/Moments";
// The taste kit's one system (tokens, grid, type, buttons, nav, cards, motion, heroes), then the page CSS.
import "@/styles/kit/system.css";
import "@/styles/kit/cards.css";
import "@/styles/kit/motion.css";
import "@/styles/kit/layout.css";
import "./globals.css";

// Dealt pairing "instrument-serif": Instrument Serif for titles, Instrument Sans for text.
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--f-serif", display: "swap" });
const sans = Instrument_Sans({ subsets: ["latin"], variable: "--f-sans", display: "swap" });

const title = "Pura: eau de parfum for her and for him";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: "%s | Pura" },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_IN",
    title,
    description: site.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Pura Symphony and Pura Obsidian eau de parfum" }],
  },
  twitter: { card: "summary_large_image", title, description: site.description, images: ["/og.jpg"] },
  formatDetection: { telephone: false, email: false, address: false },
  other: { "page-type": "product", "site-kind": "other" },
};

export const viewport: Viewport = { themeColor: "#f6efe6", colorScheme: "light", viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" data-type="product" data-radius="soft" data-buttons="block" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        {/* the kit's hero entrance (motion.css): words wait at most 700ms, then fade in; no script needed after this line */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('m-enter');setTimeout(function(){document.documentElement.classList.add('m-enter-done')},700)" }} />
      </head>
      <body>
        <CartProvider>
          <Header />
          <main id="top">{children}</main>
          <Footer />
          <CartDrawer />
          <Moments />
        </CartProvider>
      </body>
    </html>
  );
}
