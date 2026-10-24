"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { persistAttribution, rememberLanding } from "@/lib/consent";
import { useConsent } from "@/lib/use-consent";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

type Fbq = (...args: unknown[]) => void;

/** Sends a browser event to the Meta Pixel when it's loaded (it only loads with consent). */
export function trackMeta(event: string, data?: Record<string, unknown>, eventId?: string) {
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  if (fbq) fbq("track", event, data ?? {}, eventId ? { eventID: eventId } : undefined);
}

/** Meta Pixel, loaded only after the visitor allows ad tracking. Tracks a PageView on every route change. */
export function MetaPixel() {
  const consent = useConsent();
  const pathname = usePathname();
  const first = useRef(true);

  // Hold the ad landing details in this tab until the visitor chooses; keep them once they allow.
  useEffect(() => {
    rememberLanding();
    if (consent === "granted") persistAttribution();
  }, [consent]);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return; // The base code below tracks the first PageView.
    }
    trackMeta("PageView");
  }, [pathname]);

  if (!PIXEL_ID || consent !== "granted") return null;
  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${PIXEL_ID}');fbq('track','PageView');`}
    </Script>
  );
}
