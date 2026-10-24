"use client";

import { useSyncExternalStore } from "react";
import { CONSENT_EVENT, readConsent, type Consent } from "./consent";

function subscribe(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onChange);
  return () => window.removeEventListener(CONSENT_EVENT, onChange);
}

/** The visitor's ad-tracking choice: "granted", "denied", null (not chosen yet) or undefined (server render). */
export function useConsent(): Consent | null | undefined {
  return useSyncExternalStore(subscribe, readConsent, () => undefined);
}
