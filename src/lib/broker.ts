// Mortgage broker settings: province-aware titles and the defaults used to pre-fill feature sheets.

import { MAX_SCENARIOS, type PaymentFrequency, type RateType, type Rates, type RentDisplay } from "./mortgage-sheet";

export const PROVINCES = {
  AB: "Alberta",
  BC: "British Columbia",
  MB: "Manitoba",
  NB: "New Brunswick",
  NL: "Newfoundland and Labrador",
  NS: "Nova Scotia",
  NT: "Northwest Territories",
  NU: "Nunavut",
  ON: "Ontario",
  PE: "Prince Edward Island",
  QC: "Québec",
  SK: "Saskatchewan",
  YT: "Yukon",
} as const;
export type Province = keyof typeof PROVINCES;

/** Licensed titles by province (the regulator's terms). "Other" lets brokers type their own. */
const BROKER_TITLES: Partial<Record<Province, string[]>> & { default: string[] } = {
  ON: ["Mortgage Broker", "Mortgage Agent Level 1", "Mortgage Agent Level 2", "Principal Broker"],
  BC: ["Mortgage Broker", "Submortgage Broker"],
  AB: ["Mortgage Broker", "Mortgage Associate"],
  QC: ["Courtier hypothécaire", "Mortgage Broker"],
  NS: ["Mortgage Broker", "Mortgage Associate"],
  default: ["Mortgage Broker", "Mortgage Agent", "Mortgage Associate"],
};

export function brokerTitles(province: string | null | undefined): string[] {
  return BROKER_TITLES[province as Province] ?? BROKER_TITLES.default;
}

export const REALTOR_TITLES = ["REALTOR®", "Real Estate Agent", "Sales Representative", "Broker", "Personal Real Estate Corporation"];

/** The title after choosing or switching role: keeps a title the user typed, swaps the other role's default for this one's. */
export function titleForRole(role: "realtor" | "mortgage_broker", province: string | null | undefined, current: string | null | undefined): string {
  const preset = (t: string) => REALTOR_TITLES.includes(t) || brokerTitles(province).includes(t) || brokerTitles(null).includes(t);
  if (current?.trim() && !preset(current)) return current;
  return role === "mortgage_broker" ? brokerTitles(province)[0] : "REALTOR®";
}

export const FEE_LABELS = { condo: "Condo fee", strata: "Strata fee", strata_condo: "Strata / condo fee", maintenance: "Maintenance fee" } as const;
export type FeeLabel = keyof typeof FEE_LABELS;

export const FREQUENCIES: Record<PaymentFrequency, string> = {
  monthly: "Monthly",
  biweekly: "Biweekly",
  accelerated_biweekly: "Accelerated biweekly",
};

export const RENT_DISPLAYS: Record<RentDisplay, string> = {
  offset: "Subtract rent from cost",
  total: "Show total monthly cost",
  payment_only: "Mortgage payment only",
};

export const FOOTER_SHAPES = { straight: "Straight", rounded: "Rounded corners", curve: "Curve" } as const;
export type FooterShape = keyof typeof FOOTER_SHAPES;
export const SHADINGS = { natural: "Natural colours", tint: "Brand colour tint" } as const;
export type Shading = keyof typeof SHADINGS;

/** How the sheet's footer (broker and realtor cards) looks. */
export type SheetFooter = { color: "white" | "brand"; shape: FooterShape; stripe: boolean; line: string };

/** A default scenario; down is "20" (percent) or "$60000" (dollars). */
export type ScenarioDefault = { down: string; amortizationYears: number; rateType: RateType };

export type MortgageSettings = {
  rates: Rates;
  /** ISO date the rates were set, shown with any rate on the sheet. */
  ratesAsOf: string | null;
  showRate: boolean;
  showMinimumIncome: boolean;
  frequency: PaymentFrequency;
  firstTimeOrNewBuild: boolean;
  feeLabel: FeeLabel;
  rentDisplay: RentDisplay;
  scenarios: ScenarioDefault[];
  /** Extra disclaimer added to the fixed one. */
  disclaimer: string;
  footer: SheetFooter;
  shading: Shading;
  /** QR codes linking to the broker's and realtor's websites. */
  showQr: boolean;
};

export const DEFAULT_MORTGAGE_SETTINGS: MortgageSettings = {
  rates: { insured: { fixed: null, variable: null }, conventional: { fixed: null, variable: null } },
  ratesAsOf: null,
  showRate: true,
  showMinimumIncome: false,
  frequency: "monthly",
  firstTimeOrNewBuild: false,
  feeLabel: "condo",
  rentDisplay: "offset",
  scenarios: [
    { down: "5", amortizationYears: 25, rateType: "fixed" },
    { down: "10", amortizationYears: 25, rateType: "fixed" },
    { down: "20", amortizationYears: 25, rateType: "fixed" },
  ],
  disclaimer: "",
  footer: { color: "white", shape: "straight", stripe: true, line: "" },
  shading: "natural",
  showQr: true,
};

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) && v >= 0 && v < 100 ? v : null);
const pick = <T extends string>(v: unknown, allowed: Record<T, unknown>, fallback: T): T => (typeof v === "string" && v in allowed ? (v as T) : fallback);

/** Reads stored settings (JSON from the database) safely, filling in defaults. */
export function readMortgageSettings(raw: unknown): MortgageSettings {
  const d = DEFAULT_MORTGAGE_SETTINGS;
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const rates = (r.rates ?? {}) as { insured?: Record<string, unknown>; conventional?: Record<string, unknown> };
  const scenarios = Array.isArray(r.scenarios)
    ? (r.scenarios as Record<string, unknown>[])
        .filter((s) => s && typeof s.down === "string")
        .slice(0, MAX_SCENARIOS)
        .map((s) => ({
          down: String(s.down).slice(0, 20),
          amortizationYears: [15, 20, 25, 30].includes(Number(s.amortizationYears)) ? Number(s.amortizationYears) : 25,
          rateType: s.rateType === "variable" ? ("variable" as const) : ("fixed" as const),
        }))
    : d.scenarios;
  return {
    rates: {
      insured: { fixed: num(rates.insured?.fixed), variable: num(rates.insured?.variable) },
      conventional: { fixed: num(rates.conventional?.fixed), variable: num(rates.conventional?.variable) },
    },
    ratesAsOf: typeof r.ratesAsOf === "string" && /^\d{4}-\d{2}-\d{2}$/.test(r.ratesAsOf) ? r.ratesAsOf : null,
    showRate: typeof r.showRate === "boolean" ? r.showRate : d.showRate,
    showMinimumIncome: typeof r.showMinimumIncome === "boolean" ? r.showMinimumIncome : d.showMinimumIncome,
    frequency: pick(r.frequency, FREQUENCIES, d.frequency),
    firstTimeOrNewBuild: typeof r.firstTimeOrNewBuild === "boolean" ? r.firstTimeOrNewBuild : d.firstTimeOrNewBuild,
    feeLabel: pick(r.feeLabel, FEE_LABELS, d.feeLabel),
    rentDisplay: pick(r.rentDisplay, RENT_DISPLAYS, d.rentDisplay),
    scenarios: scenarios.length ? scenarios : d.scenarios,
    disclaimer: typeof r.disclaimer === "string" ? r.disclaimer.slice(0, 500) : "",
    footer: readFooter(r.footer),
    shading: pick(r.shading, SHADINGS, d.shading),
    showQr: typeof r.showQr === "boolean" ? r.showQr : d.showQr,
  };
}

function readFooter(raw: unknown): SheetFooter {
  const d = DEFAULT_MORTGAGE_SETTINGS.footer;
  const f = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    color: f.color === "brand" ? "brand" : "white",
    shape: pick(f.shape, FOOTER_SHAPES, d.shape),
    stripe: typeof f.stripe === "boolean" ? f.stripe : d.stripe,
    line: typeof f.line === "string" ? f.line.slice(0, 120) : "",
  };
}

/** A partner: a realtor (for brokers) or a mortgage broker (for realtors). Stored in partner_realtors. */
export type PartnerKind = "realtor" | "broker";

export type PartnerRealtor = {
  id: string;
  kind?: PartnerKind;
  license_number?: string | null;
  full_name: string;
  title: string | null;
  brokerage_name: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  headshot_path: string | null;
};

/** Columns to select for partners. */
export const PARTNER_COLUMNS = "id, kind, full_name, title, brokerage_name, license_number, phone, email, website, headshot_path";

/** The kind of partner a user works with: brokers co-brand with realtors; realtors work with brokers. */
export const partnerKindFor = (role: string): PartnerKind => (role === "mortgage_broker" ? "realtor" : "broker");
