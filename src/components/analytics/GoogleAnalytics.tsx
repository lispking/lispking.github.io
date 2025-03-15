"use client";
import Script from "next/script";

const GA_MEASUREMENT_ID = "G-28440BWWYK";

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
    gtag: (...args: [string, string, ...unknown[]]) => void;
  }
}

export default function GoogleAnalytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        async
      />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
