// Mortgage feature sheet: per-post settings, inputs for the calculator, labels and compliance text.

import { FEE_LABELS, readMortgageSettings, type MortgageSettings, type PartnerRealtor } from "./broker";
import { calculateSheet, parseDownPayment, type ScenarioResult, type SheetInputs } from "./mortgage-sheet";
import type { Design, Language, Listing, Profile, Slide } from "./types";

/** The realtor printed on a sheet, copied at creation so later edits to the saved list don't change old posts. */
export type RealtorSnapshot = Omit<PartnerRealtor, "id" | "kind">;

/** Everything a sheet needs beyond the listing and profile: the broker's defaults, edited per sheet. */
export type SheetConfig = MortgageSettings & { realtor: RealtorSnapshot | null };

const str = (v: unknown, max = 200) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null);

function readRealtor(raw: unknown): RealtorSnapshot | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const full_name = str(r.full_name, 120);
  if (!full_name) return null;
  return {
    full_name,
    title: str(r.title, 80),
    brokerage_name: str(r.brokerage_name, 120),
    phone: str(r.phone, 40),
    email: str(r.email, 120),
    website: str(r.website, 200),
    headshot_path: str(r.headshot_path, 300),
    license_number: str(r.license_number, 60),
  };
}

/** Reads a stored or submitted sheet config safely (unknown fields dropped, defaults filled in). */
export function readSheetConfig(raw: unknown): SheetConfig {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return { ...readMortgageSettings(r), realtor: readRealtor(r.realtor) };
}

export function sheetConfigFrom(settings: MortgageSettings, realtor: PartnerRealtor | null): SheetConfig {
  return { ...settings, realtor: realtor ? readRealtor(realtor) : null };
}

/** Calculator inputs for a listing and sheet. Scenarios with an unreadable down payment are skipped. */
export function sheetInputs(listing: Listing, c: SheetConfig): SheetInputs {
  return {
    price: listing.price ?? 0,
    monthlyFee: listing.monthly_fee,
    propertyTaxYearly: listing.property_tax_yearly,
    monthlyRent: listing.monthly_rent,
    rates: c.rates,
    frequency: c.frequency,
    firstTimeOrNewBuild: c.firstTimeOrNewBuild,
    scenarios: c.scenarios.flatMap((s) => {
      const down = parseDownPayment(s.down);
      return down ? [{ down, amortizationYears: s.amortizationYears, rateType: s.rateType }] : [];
    }),
  };
}

export function sheetResults(listing: Listing, c: SheetConfig): ScenarioResult[] {
  return listing.price ? calculateSheet(sheetInputs(listing, c)) : [];
}

/** What's missing before a sheet can show numbers (shown to the broker, never on the sheet). */
export function sheetProblems(listing: Listing, c: SheetConfig): string[] {
  const out: string[] = [];
  if (!listing.price) out.push("The listing has no price. Add it in the listing details.");
  const results = sheetResults(listing, c);
  if (listing.price && results.some((r) => !r.available)) out.push("Some scenarios need a rate you haven't entered.");
  if (c.showRate && !c.ratesAsOf) out.push("Add the date your rates are as of.");
  return out;
}

// ---------------------------------------------------------------------------
// Labels (English / Québec French / bilingual)
// ---------------------------------------------------------------------------

const L = {
  title: { en: "Mortgage Feature Sheet", fr: "Fiche hypothécaire" },
  down: { en: "down", fr: "de mise de fonds" },
  downPayment: { en: "Down payment", fr: "Mise de fonds" },
  insurance: { en: "Mortgage insurance", fr: "Assurance prêt hypothécaire" },
  mortgage: { en: "Total mortgage", fr: "Prêt total" },
  rate: { en: "Rate", fr: "Taux" },
  fixed: { en: "fixed", fr: "fixe" },
  variable: { en: "variable", fr: "variable" },
  years: { en: "yrs", fr: "ans" },
  rent_monthly: { en: "Rental income (monthly)", fr: "Revenu de location (mensuel)" },
  monthly: { en: "Monthly payment", fr: "Paiement mensuel" },
  biweekly: { en: "Biweekly payment", fr: "Paiement aux deux semaines" },
  accelerated_biweekly: { en: "Accelerated biweekly", fr: "Aux deux semaines accéléré" },
  tax: { en: "Property tax (monthly)", fr: "Impôt foncier (mensuel)" },
  total: { en: "Total monthly cost", fr: "Coût mensuel total" },
  rent: { en: "Rental income", fr: "Revenu de location" },
  net: { en: "Net monthly cost", fr: "Coût mensuel net" },
  income: { en: "Min. household income", fr: "Revenu familial min." },
  notAvailable: { en: "Rate not set", fr: "Taux non fourni" },
  price: { en: "Price", fr: "Prix" },
  beds: { en: "Beds", fr: "Chambres" },
  baths: { en: "Baths", fr: "Salles de bain" },
  sqft: { en: "Sq ft", fr: "Pi²" },
  perYear: { en: "/yr", fr: "/an" },
  perMonth: { en: "/mo", fr: "/mois" },
  licence: { en: "Lic.", fr: "Permis" },
  asOf: { en: "Rates as of", fr: "Taux en date du" },
  none: { en: "None", fr: "Aucune" },
  minimum: { en: "Minimum", fr: "Minimum" },
  minimumDown: { en: "Minimum down", fr: "Mise de fonds minimale" },
  insured: { en: "insured", fr: "assuré" },
  conventional: { en: "conventional", fr: "conventionnel" },
  purchasePrice: { en: "Purchase price", fr: "Prix d'achat" },
  type: { en: "Type", fr: "Type" },
  layout: { en: "Layout", fr: "Disposition" },
  size: { en: "Size", fr: "Superficie" },
  bed: { en: "Bed", fr: "Ch." },
  bath: { en: "Bath", fr: "SdB" },
  yourNumbers: { en: "Your numbers", fr: "Vos chiffres" },
  waysToBuy: { en: "ways to buy", fr: "façons d'acheter" },
  years_long: { en: "years", fr: "ans" },
  shelter: { en: "Monthly cost", fr: "Coût mensuel" },
  mortgageAmount: { en: "Mortgage amount", fr: "Montant du prêt" },
  condo: FEE_LABELS_FR("condo"),
  strata: FEE_LABELS_FR("strata"),
  strata_condo: FEE_LABELS_FR("strata_condo"),
  maintenance: FEE_LABELS_FR("maintenance"),
} as const;

function FEE_LABELS_FR(k: keyof typeof FEE_LABELS) {
  const fr = { condo: "Frais de copropriété", strata: "Frais de strata", strata_condo: "Frais de copropriété", maintenance: "Frais d'entretien" }[k];
  return { en: FEE_LABELS[k], fr };
}

export type SheetLabel = keyof typeof L;

export function sl(key: SheetLabel, lang: Language) {
  const l = L[key];
  return lang === "bilingual" ? (l.en === l.fr ? l.en : `${l.en} / ${l.fr}`) : l[lang];
}

/** Short words in a tight space: "fixed/fixe" when bilingual. */
export function slShort(key: SheetLabel, lang: Language) {
  const l = L[key];
  return lang === "bilingual" ? (l.en === l.fr ? l.en : `${l.en}/${l.fr}`) : l[lang];
}

/** A label as [main, second-language] lines; the second line is only used when bilingual. */
export function slLines(key: SheetLabel, lang: Language): [string, string | null] {
  const l = L[key];
  return lang === "bilingual" ? [l.en, l.en === l.fr ? null : l.fr] : [l[lang], null];
}

export function money(n: number, lang: Language) {
  return new Intl.NumberFormat(lang === "fr" ? "fr-CA" : "en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(Math.round(n));
}

export function percent(n: number, lang: Language) {
  const v = Math.round(n * 100) / 100;
  return lang === "fr" ? `${String(v).replace(".", ",")} %` : `${v}%`;
}

function longDate(iso: string, lang: Language) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString(lang === "fr" ? "fr-CA" : "en-CA", { year: "numeric", month: "long", day: "numeric" });
}

// ---------------------------------------------------------------------------
// Compliance text (always printed; the AI never writes it)
// ---------------------------------------------------------------------------

const DISCLAIMER = {
  en: "Payments are estimates for illustration only, on approved credit. Rates and terms subject to change.",
  fr: "Les paiements sont des estimations à titre indicatif seulement, sous réserve d'approbation du crédit. Taux et modalités sujets à changement.",
};
const INSURANCE_NOTE = {
  en: "Insured mortgages include the default insurance premium.",
  fr: "Les prêts assurés incluent la prime d'assurance prêt hypothécaire.",
};
const INCOME_NOTE = {
  en: "Minimum income qualifies at the greater of 5.25% or the rate + 2%, with 39% of income for housing, $100/mo heat and half the condo fee, and no other debts.",
  fr: "Revenu minimal calculé au plus élevé de 5,25 % ou du taux + 2 %, avec 39 % du revenu pour le logement, 100 $/mois de chauffage, la moitié des frais de copropriété et aucune autre dette.",
};

const both = (x: { en: string; fr: string }, lang: Language) => (lang === "bilingual" ? `${x.en} ${x.fr}` : x[lang]);

/** The fine print under the sheet: rate date, method notes and the fixed disclaimer, plus the broker's own text. */
export function sheetFinePrint(c: SheetConfig, results: ScenarioResult[], lang: Language): string {
  const parts: string[] = [];
  if (c.showRate && c.ratesAsOf) parts.push(`${sl("asOf", lang)} ${longDate(c.ratesAsOf, lang)}.`);
  if (results.some((r) => r.insured)) parts.push(both(INSURANCE_NOTE, lang));
  if (c.showMinimumIncome) parts.push(both(INCOME_NOTE, lang));
  parts.push(both(DISCLAIMER, lang));
  if (c.disclaimer.trim()) parts.push(c.disclaimer.trim());
  return parts.join(" ");
}

/** "Brokerage · Lic. M123" for the broker card (licence is required on mortgage advertising). */
export function brokerageLine(brokerage: string | null, licence: string | null, lang: Language) {
  return [brokerage, licence ? `${sl("licence", lang)} ${licence}` : null].filter(Boolean).join(" · ");
}

// ---------------------------------------------------------------------------
// Saved sheets (feature_sheets table) and how they render
// ---------------------------------------------------------------------------

export type FeatureSheet = {
  id: string;
  user_id: string;
  listing_id: string;
  language: Language;
  headline: string;
  photo_index: number | null;
  config: SheetConfig;
  created_at: string;
  updated_at: string;
};

/** The design a sheet renders with: the broker's brand colours and options plus the sheet's settings. */
export function designForSheet(profile: Profile, config: SheetConfig): Design {
  return {
    template: "classic",
    aspect: "portrait",
    text_mode: "all",
    primary: profile.brand_primary,
    secondary: profile.brand_secondary,
    accent: profile.brand_accent,
    show_logo: profile.include_logo && !!profile.logo_path,
    show_headshot: profile.include_headshot && !!profile.headshot_path,
    show_contact: true,
    show_brokerage: true,
    show_price: true,
    sheet: config,
  };
}

/** The single "whole sheet" slide for a saved sheet. */
export function sheetSlide(sheet: Pick<FeatureSheet, "headline" | "photo_index">): Slide {
  return { kind: "sheet", headline: sheet.headline, subtext: "", photo_index: sheet.photo_index ?? 0 };
}

/** Slides for a sheet post: the whole sheet, or a 3-slide carousel (cover, payments, contact). */
export function sheetPostSlides(format: "single" | "carousel", headline: string, photoIndex: number | null, lang: Language): Slide[] {
  const photo = photoIndex ?? 0;
  if (format === "single") return [{ kind: "sheet", headline, subtext: "", photo_index: photo }];
  const fr = lang === "fr";
  return [
    { kind: "cover", headline, subtext: "", photo_index: photo },
    { kind: "scenarios", headline: fr ? "Ce que ça coûte par mois" : "What It Costs Each Month", subtext: "", photo_index: null },
    { kind: "broker", headline: fr ? "Parlons de vos chiffres" : "Let's Talk Numbers", subtext: "", photo_index: null },
  ];
}
