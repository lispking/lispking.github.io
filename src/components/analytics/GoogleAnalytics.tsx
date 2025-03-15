"use client";
import Script from "next/script";

const GA_MEASUREMENT_ID = "G-28440BWWYK";

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export default function GoogleAnalytics() {
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
            send_page_view: true,
            page_path: window.location.pathname + window.location.search,
            linker: {
              domains: ['lispking.github.io']
            }
          });
        `}
      </Script>
    </>
  );
}
