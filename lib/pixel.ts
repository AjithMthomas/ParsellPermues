"use client";

import { getStoredUtmParams } from "./utm";

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

/**
 * Safe wrapper around window.fbq to prevent crashes if Pixel is not configured or blocked.
 */
function fbqTrack(trackType: "track" | "trackCustom", eventName: string, params: Record<string, any> = {}) {
  if (typeof window === "undefined" || !window.fbq) return;

  try {
    // Enrich with stored UTM campaign data if available
    const utms = getStoredUtmParams();
    const enriched = { ...params };
    if (utms.utm_source) enriched.utm_source = utms.utm_source;
    if (utms.utm_campaign) enriched.utm_campaign = utms.utm_campaign;
    if (utms.utm_medium) enriched.utm_medium = utms.utm_medium;

    window.fbq(trackType, eventName, enriched);
  } catch (err) {
    console.warn("[MetaPixel] Failed to track event:", eventName, err);
  }
}

/**
 * Fire PageView event on initial load and route changes.
 */
export function pageview() {
  if (typeof window !== "undefined" && window.fbq) {
    try {
      window.fbq("track", "PageView");
    } catch {
      /* ignore */
    }
  }
}

/**
 * Fire ViewContent on product page view.
 */
export function trackViewContent(item: {
  name: string;
  slug: string;
  price: number;
  category?: string;
  currency?: string;
}) {
  fbqTrack("track", "ViewContent", {
    content_name: item.name,
    content_ids: [item.slug],
    content_type: "product",
    content_category: item.category || "Perfume",
    value: item.price,
    currency: item.currency || "INR",
  });
}

/**
 * Fire AddToCart when an item is added to the cart.
 */
export function trackAddToCart(item: {
  name: string;
  slug: string;
  price: number;
  size?: string;
  qty?: number;
  currency?: string;
}) {
  fbqTrack("track", "AddToCart", {
    content_name: item.name,
    content_ids: [item.slug],
    content_type: "product",
    value: item.price * (item.qty || 1),
    currency: item.currency || "INR",
    quantity: item.qty || 1,
    size: item.size || "",
  });
}

/**
 * Fire InitiateCheckout when the user begins the checkout / delivery details step.
 */
export function trackInitiateCheckout(data: {
  value: number;
  numItems: number;
  contentIds?: string[];
  currency?: string;
}) {
  fbqTrack("track", "InitiateCheckout", {
    value: data.value,
    currency: data.currency || "INR",
    num_items: data.numItems,
    content_ids: data.contentIds || [],
    content_type: "product",
  });
}

// Track purchases fired in the current browser session to prevent duplicates
const firedPurchases = new Set<string>();

/**
 * Fire Purchase event on order confirmation.
 * Strict deduplication: fires ONCE ONLY per order ID.
 */
export function trackPurchase(data: {
  orderId: string;
  value: number;
  numItems: number;
  contentIds?: string[];
  currency?: string;
}) {
  if (!data.orderId || firedPurchases.has(data.orderId)) {
    return;
  }

  // Check persistent session storage for deduplication across refreshes
  try {
    const storageKey = `pura_purchased_${data.orderId}`;
    if (sessionStorage.getItem(storageKey)) {
      return;
    }
    sessionStorage.setItem(storageKey, "1");
  } catch {
    /* ignore storage errors */
  }

  firedPurchases.add(data.orderId);

  fbqTrack("track", "Purchase", {
    value: data.value,
    currency: data.currency || "INR",
    content_type: "product",
    content_ids: data.contentIds || [],
    num_items: data.numItems,
    order_id: data.orderId,
  });
}

