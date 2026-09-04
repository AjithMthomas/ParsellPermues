import { Injectable } from "@angular/core";

/**
 * Probes asset availability at runtime so scenes can prefer real campaign
 * files (dropped into src/assets/products/<slug>/…) and gracefully fall back
 * to the procedural flacon artwork until they arrive.
 *
 * Probing is deliberately tiny: one canonical filename per fragrance, fetched
 * with GET + cache so missing files do not spam the console and the result is
 * remembered for the session. The expected filename is documented in
 * src/assets/products/README.md.
 */
@Injectable({ providedIn: "root" })
export class AssetArtService {
  private cache = new Map<string, boolean>();

  /** Canonical location the site looks for a product cutout. */
  candidates(slug: string): string[] {
    return [`/assets/products/${slug}/cutout.png`];
  }

  async find(slug: string): Promise<string | null> {
    for (const path of this.candidates(slug)) {
      if (await this.available(path)) return path;
    }
    return null;
  }

  /** True when an arbitrary asset path exists (used for scenes, note macros…). */
  async available(path: string): Promise<boolean> {
    let known = this.cache.get(path);
    if (known === undefined) {
      try {
        // GET (not HEAD): a missing HEAD still logs as a 404 console error,
        // while a missing GET is silent. `no-store` never trusts a stale 404
        // cached while a file was still being added during development.
        known = (await fetch(path, { cache: "no-store" })).ok;
      } catch {
        known = false;
      }
      this.cache.set(path, known);
    }
    return known;
  }
}
