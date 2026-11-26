import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Jost, Pinyon_Script } from "next/font/google";
import { CartProvider } from "@/lib/cart";
import { site } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

const bodoni = Bodoni_Moda({ subsets: ["latin"], variable: "--font-bodoni", display: "swap" });
const jost = Jost({ subsets: ["latin"], variable: "--font-jost", display: "swap" });
const pinyon = Pinyon_Script({ subsets: ["latin"], weight: "400", variable: "--font-pinyon", display: "swap" });

const title = "Pura | Eau de Parfum for Her and for Him";

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
};

export const viewport: Viewport = { themeColor: "#f6efe6", colorScheme: "light" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${bodoni.variable} ${jost.variable} ${pinyon.variable}`}>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <CartProvider>
          <SmoothScroll />
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
