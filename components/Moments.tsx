"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Mounts the page's dealt moments (photo-chapters, picture-develops) from the taste kit, once React has
 * hydrated, so the kit never touches markup React is still reading. Without script every moment
 * shows its finished state.
 */
export function Moments() {
  const path = usePathname();
  useEffect(() => {
    if (!document.querySelector("[data-moment]")) return;
    document.documentElement.classList.add("mo-js");
    const safe = setTimeout(() => document.documentElement.classList.add("mo-safe"), 2500);
    const url = "/assets/moments/moments.js";
    import(/* webpackIgnore: true */ /* turbopackIgnore: true */ url)
      .then((m: { mountAll?: (root: Document) => Promise<unknown> }) => m.mountAll?.(document))
      .catch(() => document.documentElement.classList.add("mo-safe"));
    return () => clearTimeout(safe);
  }, [path]);
  return null;
}
