"use client";
import Script from "next/script";
import { useEffect } from "react";

const GA_MEASUREMENT_ID = "G-28440BWWYK";

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
    gtag: (...args: [string, string, ...unknown[]]) => void;
  }
}

export default function GoogleAnalytics() {
  useEffect(() => {
    const handleScroll = () => {
      // 防抖处理滚动事件
      let timeout: NodeJS.Timeout;
      return () => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
          const scrollPercentage = Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
          );
          window.gtag("event", "scroll", {
            transport_url: "https://ssl.google-analytics.com",
            first_party_collection: true,
            value: scrollPercentage,
            page_location: window.location.href,
          });
        }, 500);
      };
    };

    const debouncedHandleScroll = handleScroll();
    window.addEventListener("scroll", debouncedHandleScroll);

    return () => {
      window.removeEventListener("scroll", debouncedHandleScroll);
    };
  }, []);

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
            transport_url: 'https://ssl.google-analytics.com',
            first_party_collection: true,
            send_page_view: true
          });
        `}
      </Script>
    </>
  );
}
