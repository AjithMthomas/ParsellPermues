"use client";

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  fbclid?: string;
  gclid?: string;
  [key: string]: string | undefined;
}

const STORAGE_KEY = "pura_utm_v1";

/**
 * Capture and store UTM parameters from current URL if present.
 * Persists in sessionStorage (and localStorage backup) across page navigation and checkout.
 */
export function captureUtmParams(): UtmParams {
  if (typeof window === "undefined") return {};

  try {
    const params = new URLSearchParams(window.location.search);
    const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "fbclid", "gclid"];
    const found: UtmParams = {};
    let hasAny = false;

    for (const key of utmKeys) {
      const val = params.get(key);
      if (val && val.trim() !== "") {
        found[key] = val.trim();
        hasAny = true;
      }
    }

    if (hasAny) {
      const serialized = JSON.stringify(found);
      sessionStorage.setItem(STORAGE_KEY, serialized);
      localStorage.setItem(STORAGE_KEY, serialized);
      return found;
    }

    return getStoredUtmParams();
  } catch {
    return {};
  }
}

/**
 * Retrieve saved UTM parameters from storage.
 */
export function getStoredUtmParams(): UtmParams {
  if (typeof window === "undefined") return {};

  try {
    const fromSession = sessionStorage.getItem(STORAGE_KEY);
    if (fromSession) return JSON.parse(fromSession) as UtmParams;

    const fromLocal = localStorage.getItem(STORAGE_KEY);
    if (fromLocal) return JSON.parse(fromLocal) as UtmParams;
  } catch {
    /* ignore storage read error */
  }

  return {};
}

/**
 * Format UTM params into a short human-readable summary string for order notes or WhatsApp.
 */
export function formatUtmSummary(params: UtmParams): string {
  const parts: string[] = [];
  if (params.utm_source) parts.push(`source: ${params.utm_source}`);
  if (params.utm_medium) parts.push(`medium: ${params.utm_medium}`);
  if (params.utm_campaign) parts.push(`campaign: ${params.utm_campaign}`);
  if (params.utm_content) parts.push(`content: ${params.utm_content}`);
  if (params.utm_term) parts.push(`term: ${params.utm_term}`);
  return parts.join(" | ");
}

