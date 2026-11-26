import type { Metadata } from "next";
import { ShopView } from "@/components/ShopView";

export const metadata: Metadata = {
  title: "Shop all fragrances",
  description: "Twelve Pura eau de parfums for her and for him in 8, 30, 50 and 100 ml, from ₹999.",
  alternates: { canonical: "/shop/" },
};

export default function Shop() {
  return <ShopView filter="all" />;
}
