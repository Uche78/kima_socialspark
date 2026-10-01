export function mediaUrl(path: string | null | undefined) {
  if (!path) return null;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${path}`;
}

type Lang = "en" | "fr" | "bilingual";

const LABELS = {
  beds: { en: "Beds", fr: "Chambres" },
  baths: { en: "Baths", fr: "Salles de bain" },
  sqft: { en: "Sq Ft", fr: "Pi²" },
  price: { en: "Price", fr: "Prix" },
  perMonth: { en: "/month", fr: "/mois" },
  estPayment: { en: "Estimated payment", fr: "Paiement estimé" },
  down: { en: "down", fr: "de mise de fonds" },
  amort: { en: "yr amortization", fr: "ans d'amortissement" },
  rate: { en: "rate", fr: "taux" },
  disclaimer: {
    en: "Estimate only, for illustration. Rates and terms subject to change. OAC.",
    fr: "Estimation à titre indicatif seulement. Taux et modalités sujets à changement. Sous réserve d'approbation de crédit.",
  },
  licence: { en: "Lic.", fr: "Permis" },
  courtesy: { en: "Listing courtesy of", fr: "Inscription de" },
} as const;

export function t(key: keyof typeof LABELS, lang: Lang) {
  const l = LABELS[key];
  return lang === "bilingual" ? `${l.en} | ${l.fr}` : l[lang];
}

const POST_TYPE_LABELS: Record<string, { en: string; fr: string }> = {
  just_listed: { en: "Just Listed", fr: "Nouvelle inscription" },
  open_house: { en: "Open House", fr: "Visite libre" },
  price_reduced: { en: "Price Reduced", fr: "Prix réduit" },
  coming_soon: { en: "Coming Soon", fr: "Bientôt disponible" },
  sold: { en: "Sold", fr: "Vendu" },
  featured: { en: "Featured Property", fr: "Propriété en vedette" },
};

export function postTypeLabel(type: string, lang: Lang) {
  const l = POST_TYPE_LABELS[type] ?? { en: type, fr: type };
  return lang === "bilingual" ? `${l.en} | ${l.fr}` : l[lang];
}

/** Unique, sortable suffix for uploaded file names. */
export function uniqueSuffix() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * How much a photo must be enlarged to fill a 1080×1350 portrait slide
 * (the most demanding layout). Above ~1.5× it starts to look soft.
 */
export function isLowRes(p: { width?: number; height?: number }) {
  if (!p.width || !p.height) return false;
  return Math.max(1080 / p.width, 1350 / p.height) > 1.5;
}
