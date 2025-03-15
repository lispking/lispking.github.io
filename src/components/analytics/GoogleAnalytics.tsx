"use client";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const GA_MEASUREMENT_ID = "G-28440BWWYK";

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
    gtag: (...args: [string, string, ...unknown[]]) => void;
  }
}

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      window.gtag("config", GA_MEASUREMENT_ID, {
        transport_url: "https://ssl.google-analytics.com",
        first_party_collection: true,
        page_path: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ""),
      });
    }
  }, [pathname, searchParams]);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="lazyOnload"
      />
      <Script id="google-analytics" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_location: window.location.href,
            page_path: '${pathname}',
            transport_url: 'https://ssl.google-analytics.com',
            first_party_collection: true,
            debug_mode: true
          });
        `}
      </Script>
    </>
  );
}
