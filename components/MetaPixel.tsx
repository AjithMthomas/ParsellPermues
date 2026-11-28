"use client";

import { useEffect, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { FB_PIXEL_ID, pageview } from "@/lib/pixel";
import { captureUtmParams } from "@/lib/utm";

function PixelTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialMount = useRef(true);

  // Capture UTM parameters and trigger PageView on every route change
  useEffect(() => {
    captureUtmParams();

    if (initialMount.current) {
      initialMount.current = false;
      return;
    }

    pageview();
  }, [pathname, searchParams]);

  return null;
}

export function MetaPixel() {
  const pixelId = FB_PIXEL_ID;

  if (!pixelId || pixelId.trim() === "") {
    return (
      <Suspense fallback={null}>
        <PixelTrackerInner />
      </Suspense>
    );
  }

  return (
    <>
      <Script
        id="meta-pixel-base"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
      <Suspense fallback={null}>
        <PixelTrackerInner />
      </Suspense>
    </>
  );
}

