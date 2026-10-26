"use client";

import Script from "next/script";
import { useConsent } from "@/lib/use-consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

type Gtag = (...args: unknown[]) => void;

/** Sends a Google Analytics event when it's loaded (it only loads with consent). */
export function trackGa(event: string, params?: Record<string, unknown>) {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (gtag) gtag("event", event, params ?? {});
}

/**
 * Google Analytics 4, loaded only after the visitor allows cookies (same choice as the Meta Pixel).
 * Page views on client-side navigation come from GA4's enhanced measurement ("page changes based on
 * browser history events", on by default), so none are sent here, to avoid counting them twice.
 * Google signals and ad personalisation are off: we measure the site, we don't build ad profiles.
 */
export function GoogleAnalytics() {
  const consent = useConsent();
  if (!GA_ID || consent !== "granted") return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());
gtag('config','${GA_ID}',{allow_google_signals:false,allow_ad_personalization_signals:false});`}
      </Script>
    </>
  );
}
