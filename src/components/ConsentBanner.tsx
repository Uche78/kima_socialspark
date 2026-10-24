"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { OPEN_CONSENT_EVENT, setConsent } from "@/lib/consent";
import { localeOfPath } from "@/lib/landing-i18n";
import { COMPANY } from "@/lib/site";
import { useConsent } from "@/lib/use-consent";

const TEXT = {
  en: {
    body: "May we use cookies to see which of our ads bring people to SocialSpark? This loads the Meta Pixel. Nothing is loaded unless you allow it.",
    allow: "Allow",
    decline: "No thanks",
    privacy: "Privacy policy",
  },
  fr: {
    body: "Pouvons-nous utiliser des témoins (cookies) pour savoir quelles publicités amènent les gens à SocialSpark? Cela charge le pixel Meta. Rien n'est chargé sans votre accord.",
    allow: "Accepter",
    decline: "Non merci",
    privacy: "Politique de confidentialité",
  },
};

/** Asks once for ad-tracking consent (Law 25: off by default; refusing is as easy as accepting). "Cookie settings" in the footer reopens it. */
export function ConsentBanner() {
  const consent = useConsent();
  const pathname = usePathname();
  const [reopened, setReopened] = useState(false);

  useEffect(() => {
    const open = () => setReopened(true);
    window.addEventListener(OPEN_CONSENT_EVENT, open);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, open);
  }, []);

  if (consent === undefined || (consent !== null && !reopened)) return null;
  const t = TEXT[localeOfPath(pathname)];
  const choose = (value: "granted" | "denied") => {
    setConsent(value);
    setReopened(false);
    // The pixel can't be unloaded from a running page; reload so a withdrawal takes effect now.
    if (value === "denied" && consent === "granted") window.location.reload();
  };

  return (
    <div role="dialog" aria-label="Cookies" className="fixed inset-x-0 bottom-0 z-50 p-4 sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-md sm:p-0">
      <div className="rounded-2xl bg-white p-5 text-sm leading-relaxed text-[#141414] shadow-lg ring-1 ring-black/10">
        <p>{t.body}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => choose("granted")} className="h-10 rounded-full bg-[#141414] px-5 font-medium text-white hover:bg-black">
            {t.allow}
          </button>
          <button type="button" onClick={() => choose("denied")} className="h-10 rounded-full px-5 font-medium ring-1 ring-black/20 hover:ring-black/40">
            {t.decline}
          </button>
          <a href={`${COMPANY.url}/privacy/`} target="_blank" rel="noreferrer" className="ml-auto text-xs text-[#141414]/60 underline">
            {t.privacy}
          </a>
        </div>
      </div>
    </div>
  );
}

/** Footer link that reopens the banner so people can change or withdraw their choice. */
export function CookieSettingsButton() {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))} className="text-[#141414]/80 hover:text-[#141414] hover:underline">
      Cookie settings
    </button>
  );
}
