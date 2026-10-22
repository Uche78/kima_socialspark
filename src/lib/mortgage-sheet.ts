// Mortgage feature sheet calculations (Canada). Exact arithmetic only: the AI never produces numbers.
//
// Rules used (federal, as of 2026):
// - Minimum down payment: 5% of the first $500,000, 10% of the portion up to $1.5M; 20% at $1.5M and above
//   (no default insurance available).
// - Default insurance (CMHC-style) premiums on the loan: 4.00% (5–9.99% down), 3.10% (10–14.99%),
//   2.80% (15–19.99%), plus 0.20% for a 30-year insured amortization. None at 20%+ down.
// - Insured amortization: 25 years, or 30 for first-time buyers and new builds. Conventional: up to 30.
// - Fixed rates compound semi-annually (Interest Act); variable rates are treated as compounding monthly.
// - Qualifying (stress test) rate: the greater of the contract rate + 2% and 5.25%.
// - Minimum income: gross debt service of 39% with no other debts, counting the qualifying payment,
//   property tax, an estimated heating cost and half of any condo fee.

import { minimumDownPayment } from "./mortgage";

export type RateType = "fixed" | "variable";
export type PaymentFrequency = "monthly" | "biweekly" | "accelerated_biweekly";
export type RentDisplay = "offset" | "total" | "payment_only";

/** A broker's rates, in percent. Insured applies under 20% down, conventional at 20%+. */
export type Rates = {
  insured: { fixed: number | null; variable: number | null };
  conventional: { fixed: number | null; variable: number | null };
};

/** Down payment as a percent of the price (20) or a dollar amount (60000). */
export type DownPaymentInput = { kind: "percent"; value: number } | { kind: "amount"; value: number };

export type ScenarioInput = { down: DownPaymentInput; amortizationYears: number; rateType: RateType };

export type SheetInputs = {
  price: number;
  /** Condo / strata / maintenance fee per month; 0 or null when there isn't one. */
  monthlyFee: number | null;
  /** Yearly property tax; null when unknown. */
  propertyTaxYearly: number | null;
  /** Expected monthly rent (e.g. a basement suite); null when not shown. */
  monthlyRent: number | null;
  rates: Rates;
  frequency: PaymentFrequency;
  /** First-time buyer or new build: allows a 30-year insured amortization. */
  firstTimeOrNewBuild: boolean;
  scenarios: ScenarioInput[];
};

export type ScenarioResult = {
  downPayment: number;
  downPercent: number;
  /** True when the requested down payment was below the legal minimum and was raised. */
  downRaised: boolean;
  insured: boolean;
  /** False when no rate was entered for this case, or the price/down combination isn't possible. */
  available: boolean;
  amortizationYears: number;
  /** True when the requested amortization exceeded what's allowed and was reduced. */
  amortizationReduced: boolean;
  rateType: RateType;
  ratePercent: number | null;
  premiumRate: number;
  premium: number;
  /** Total mortgage, including any default insurance premium. */
  mortgageAmount: number;
  /** Payment at the chosen frequency. */
  payment: number;
  /** The payment expressed per month (for adding up monthly costs). */
  monthlyEquivalent: number;
  /** Mortgage + property tax + fee, per month. */
  shelterMonthly: number;
  /** Shelter cost after rent, when rent is entered. */
  afterRentMonthly: number | null;
  qualifyingRatePercent: number | null;
  minimumIncome: number | null;
  notes: string[];
};

export const MAX_SCENARIOS = 4;
export const INSURED_PRICE_CAP = 1_500_000;
export const MIN_QUALIFYING_RATE = 5.25;
export const GDS_LIMIT = 0.39;
/** Monthly heating estimate lenders commonly use when qualifying. */
export const HEATING_MONTHLY = 100;
const THIRTY_YEAR_SURCHARGE = 0.002;

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Periodic interest rate for monthly payments. */
function monthlyRate(ratePercent: number, rateType: RateType) {
  const r = ratePercent / 100;
  return rateType === "fixed" ? Math.pow(1 + r / 2, 1 / 6) - 1 : r / 12;
}

/** Standard amortized monthly payment. */
export function monthlyPayment(principal: number, ratePercent: number, years: number, rateType: RateType = "fixed") {
  const n = years * 12;
  const i = monthlyRate(ratePercent, rateType);
  return i === 0 ? principal / n : (principal * i) / (1 - Math.pow(1 + i, -n));
}

/** Default insurance premium rate for a down payment percent and amortization. */
export function premiumRate(downPercent: number, price: number, amortizationYears: number) {
  if (downPercent >= 20 || price >= INSURED_PRICE_CAP) return 0;
  const base = downPercent >= 15 ? 0.028 : downPercent >= 10 ? 0.031 : 0.04;
  return base + (amortizationYears > 25 ? THIRTY_YEAR_SURCHARGE : 0);
}

/** Payment at a frequency, from the monthly payment (the conventions Canadian lenders quote). */
export function paymentAtFrequency(monthly: number, frequency: PaymentFrequency) {
  if (frequency === "biweekly") return (monthly * 12) / 26;
  if (frequency === "accelerated_biweekly") return monthly / 2;
  return monthly;
}

/** The payment converted back to a per-month amount. */
function perMonth(payment: number, frequency: PaymentFrequency) {
  return frequency === "monthly" ? payment : (payment * 26) / 12;
}

export function calculateScenario(input: SheetInputs, scenario: ScenarioInput): ScenarioResult {
  const { price, rates, frequency } = input;
  const notes: string[] = [];

  // Down payment: accept % or $, raise to the legal minimum.
  const requested = scenario.down.kind === "percent" ? (price * scenario.down.value) / 100 : scenario.down.value;
  const minDown = minimumDownPayment(price);
  const downRaised = requested + 0.5 < minDown;
  const downPayment = Math.min(Math.max(requested, minDown), price);
  if (downRaised) notes.push("Down payment raised to the legal minimum.");
  const downPercent = price > 0 ? (downPayment / price) * 100 : 0;
  const insured = downPercent < 20 && price < INSURED_PRICE_CAP;

  // Amortization: insured is capped at 25 years unless first-time buyer / new build.
  const maxYears = insured ? (input.firstTimeOrNewBuild ? 30 : 25) : 30;
  const amortizationYears = Math.min(Math.max(Math.round(scenario.amortizationYears), 5), maxYears);
  const amortizationReduced = amortizationYears < scenario.amortizationYears;
  if (amortizationReduced) notes.push(`Amortization limited to ${maxYears} years for this down payment.`);

  const rateSet = insured ? rates.insured : rates.conventional;
  const ratePercent = rateSet[scenario.rateType];
  const available = price > 0 && ratePercent != null && ratePercent >= 0;
  if (ratePercent == null) notes.push(`No ${insured ? "insured" : "conventional"} ${scenario.rateType} rate entered.`);

  const pRate = premiumRate(downPercent, price, amortizationYears);
  const loan = price - downPayment;
  const premium = round2(loan * pRate);
  const mortgageAmount = round2(loan + premium);

  const monthly = available ? monthlyPayment(mortgageAmount, ratePercent!, amortizationYears, scenario.rateType) : 0;
  const payment = round2(paymentAtFrequency(monthly, frequency));
  const monthlyEquivalent = round2(perMonth(payment, frequency));

  const tax = input.propertyTaxYearly ? input.propertyTaxYearly / 12 : 0;
  const fee = input.monthlyFee ?? 0;
  const shelterMonthly = round2(monthlyEquivalent + tax + fee);
  const afterRentMonthly = input.monthlyRent ? round2(shelterMonthly - input.monthlyRent) : null;

  // Minimum income at the stress-test rate (always qualified on a monthly payment).
  let qualifyingRatePercent: number | null = null;
  let minimumIncome: number | null = null;
  if (available) {
    qualifyingRatePercent = Math.max(ratePercent! + 2, MIN_QUALIFYING_RATE);
    const qualifyingPayment = monthlyPayment(mortgageAmount, qualifyingRatePercent, amortizationYears, scenario.rateType);
    const housing = qualifyingPayment + tax + HEATING_MONTHLY + fee * 0.5;
    minimumIncome = Math.ceil(((housing * 12) / GDS_LIMIT) / 100) * 100;
    if (!input.propertyTaxYearly) notes.push("Minimum income excludes property tax (not entered).");
  }

  return {
    downPayment: round2(downPayment),
    downPercent: round2(downPercent),
    downRaised,
    insured,
    available,
    amortizationYears,
    amortizationReduced,
    rateType: scenario.rateType,
    ratePercent: ratePercent ?? null,
    premiumRate: pRate,
    premium,
    mortgageAmount,
    payment,
    monthlyEquivalent,
    shelterMonthly,
    afterRentMonthly,
    qualifyingRatePercent,
    minimumIncome,
    notes,
  };
}

export function calculateSheet(input: SheetInputs): ScenarioResult[] {
  return input.scenarios.slice(0, MAX_SCENARIOS).map((s) => calculateScenario(input, s));
}

/** Parses "20", "20%", "$60,000" or "60000" into a down payment input (≤100 treated as a percent). */
export function parseDownPayment(raw: string): DownPaymentInput | null {
  const t = raw.trim();
  if (!t) return null;
  const n = Number(t.replace(/[$,%\s]/g, ""));
  if (!Number.isFinite(n) || n < 0) return null;
  if (t.includes("%")) return { kind: "percent", value: n };
  if (t.includes("$")) return { kind: "amount", value: n };
  return n <= 100 ? { kind: "percent", value: n } : { kind: "amount", value: n };
}
