import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShopView, type ShopFilter } from "@/components/ShopView";

const FILTERS = ["her", "him", "unisex"] as const;
const TITLES: Record<(typeof FILTERS)[number], string> = {
  her: "Perfume for her",
  him: "Perfume for him",
  unisex: "Unisex perfume",
};

export const dynamicParams = false;

export function generateStaticParams() {
  return FILTERS.map((filter) => ({ filter }));
}

export async function generateMetadata({ params }: { params: Promise<{ filter: string }> }): Promise<Metadata> {
  const { filter } = await params;
  const t = TITLES[filter as (typeof FILTERS)[number]];
  return { title: t, description: `${t} by Pura. Eau de parfum in 8, 30, 50 and 100 ml, from ₹999.`, alternates: { canonical: `/shop/${filter}/` } };
}

export default async function ShopFiltered({ params }: { params: Promise<{ filter: string }> }) {
  const { filter } = await params;
  if (!FILTERS.includes(filter as (typeof FILTERS)[number])) notFound();
  return <ShopView filter={filter as ShopFilter} />;
}
