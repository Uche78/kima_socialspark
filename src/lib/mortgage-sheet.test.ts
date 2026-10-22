import { describe, expect, it } from "vitest";
import { calculateScenario, monthlyPayment, parseDownPayment, paymentAtFrequency, premiumRate, type SheetInputs } from "./mortgage-sheet";

const base = (over: Partial<SheetInputs> = {}): SheetInputs => ({
  price: 500_000,
  monthlyFee: null,
  propertyTaxYearly: null,
  monthlyRent: null,
  rates: { insured: { fixed: 4.5, variable: 4.0 }, conventional: { fixed: 4.8, variable: 4.3 } },
  frequency: "monthly",
  firstTimeOrNewBuild: false,
  scenarios: [],
  ...over,
});
const pct = (value: number) => ({ kind: "percent" as const, value });
const amt = (value: number) => ({ kind: "amount" as const, value });

describe("monthlyPayment", () => {
  it("matches the published Canadian figure: $400,000 at 5% over 25 years (semi-annual) = $2,326.42", () => {
    expect(monthlyPayment(400_000, 5, 25, "fixed")).toBeCloseTo(2326.42, 2);
  });
  it("compounds variable rates monthly: $400,000 at 5% over 25 years = $2,338.36", () => {
    expect(monthlyPayment(400_000, 5, 25, "variable")).toBeCloseTo(2338.36, 2);
  });
  it("handles a 0% rate", () => {
    expect(monthlyPayment(300_000, 0, 25)).toBeCloseTo(1000, 6);
  });
});

describe("premiumRate", () => {
  it("uses the CMHC tiers", () => {
    expect(premiumRate(5, 500_000, 25)).toBe(0.04);
    expect(premiumRate(9.99, 500_000, 25)).toBe(0.04);
    expect(premiumRate(10, 500_000, 25)).toBe(0.031);
    expect(premiumRate(15, 500_000, 25)).toBe(0.028);
    expect(premiumRate(20, 500_000, 25)).toBe(0);
  });
  it("adds 0.20% for a 30-year insured amortization", () => {
    expect(premiumRate(5, 500_000, 30)).toBeCloseTo(0.042, 10);
  });
  it("has no insurance at $1.5M and above", () => {
    expect(premiumRate(20, 1_500_000, 25)).toBe(0);
  });
});

describe("calculateScenario", () => {
  it("5% down on $500,000: $25,000 down, 4% premium, $494,000 mortgage, insured fixed rate", () => {
    const r = calculateScenario(base(), { down: pct(5), amortizationYears: 25, rateType: "fixed" });
    expect(r.downPayment).toBe(25_000);
    expect(r.insured).toBe(true);
    expect(r.premium).toBe(19_000);
    expect(r.mortgageAmount).toBe(494_000);
    expect(r.ratePercent).toBe(4.5);
    expect(r.payment).toBeCloseTo(2734.16, 2);
  });

  it("raises a down payment below the minimum ($750,000 needs $50,000)", () => {
    const r = calculateScenario(base({ price: 750_000 }), { down: pct(5), amortizationYears: 25, rateType: "fixed" });
    expect(r.downRaised).toBe(true);
    expect(r.downPayment).toBe(50_000);
    expect(r.premium).toBe(28_000); // 4% of $700,000
  });

  it("accepts a dollar down payment", () => {
    const r = calculateScenario(base(), { down: amt(100_000), amortizationYears: 25, rateType: "fixed" });
    expect(r.downPercent).toBe(20);
    expect(r.insured).toBe(false);
    expect(r.ratePercent).toBe(4.8); // conventional
    expect(r.premium).toBe(0);
  });

  it("requires 20% down at $1.5M and is never insured", () => {
    const r = calculateScenario(base({ price: 1_500_000 }), { down: pct(10), amortizationYears: 25, rateType: "fixed" });
    expect(r.downPayment).toBe(300_000);
    expect(r.insured).toBe(false);
  });

  it("allows insured just under $1.5M with tiered minimum", () => {
    const r = calculateScenario(base({ price: 1_499_000 }), { down: pct(5), amortizationYears: 25, rateType: "fixed" });
    expect(r.downPayment).toBeCloseTo(124_900, 0); // 25,000 + 10% of 999,000
    expect(r.insured).toBe(true);
  });

  it("limits insured amortization to 25 years unless first-time buyer or new build", () => {
    const capped = calculateScenario(base(), { down: pct(5), amortizationYears: 30, rateType: "fixed" });
    expect(capped.amortizationYears).toBe(25);
    expect(capped.amortizationReduced).toBe(true);
    const ftb = calculateScenario(base({ firstTimeOrNewBuild: true }), { down: pct(5), amortizationYears: 30, rateType: "fixed" });
    expect(ftb.amortizationYears).toBe(30);
    expect(ftb.premiumRate).toBeCloseTo(0.042, 10);
  });

  it("allows 30 years conventional without the first-time flag", () => {
    const r = calculateScenario(base(), { down: pct(20), amortizationYears: 30, rateType: "fixed" });
    expect(r.amortizationYears).toBe(30);
    expect(r.amortizationReduced).toBe(false);
  });

  it("is unavailable when the needed rate wasn't entered", () => {
    const r = calculateScenario(base({ rates: { insured: { fixed: 4.5, variable: null }, conventional: { fixed: 4.8, variable: null } } }), {
      down: pct(5),
      amortizationYears: 25,
      rateType: "variable",
    });
    expect(r.available).toBe(false);
    expect(r.payment).toBe(0);
  });

  it("adds property tax and fee to shelter cost, and subtracts rent", () => {
    const r = calculateScenario(base({ propertyTaxYearly: 4_800, monthlyFee: 500, monthlyRent: 1_800 }), {
      down: pct(20),
      amortizationYears: 25,
      rateType: "fixed",
    });
    expect(r.shelterMonthly).toBeCloseTo(r.monthlyEquivalent + 400 + 500, 2);
    expect(r.afterRentMonthly).toBeCloseTo(r.shelterMonthly - 1_800, 2);
  });

  it("calculates minimum income at the stress-test rate (39% GDS)", () => {
    // $500,000, 20% down → $400,000 at 4.8% conventional; qualifies at 6.8%.
    const r = calculateScenario(base({ propertyTaxYearly: 3_600 }), { down: pct(20), amortizationYears: 25, rateType: "fixed" });
    expect(r.qualifyingRatePercent).toBeCloseTo(6.8, 10);
    const qp = monthlyPayment(400_000, 6.8, 25, "fixed");
    const expected = Math.ceil((((qp + 300 + 100) * 12) / 0.39) / 100) * 100;
    expect(r.minimumIncome).toBe(expected);
  });

  it("uses the 5.25% floor when the contract rate + 2% is lower", () => {
    const r = calculateScenario(base({ rates: { insured: { fixed: 2.5, variable: null }, conventional: { fixed: 3, variable: null } } }), {
      down: pct(20),
      amortizationYears: 25,
      rateType: "fixed",
    });
    expect(r.qualifyingRatePercent).toBe(5.25);
  });
});

describe("payment frequency", () => {
  it("biweekly = monthly × 12 / 26; accelerated = monthly / 2", () => {
    expect(paymentAtFrequency(2600, "biweekly")).toBeCloseTo(1200, 6);
    expect(paymentAtFrequency(2600, "accelerated_biweekly")).toBe(1300);
  });
  it("converts back to a monthly equivalent for shelter cost", () => {
    const r = calculateScenario(base({ frequency: "accelerated_biweekly" }), { down: pct(20), amortizationYears: 25, rateType: "fixed" });
    expect(r.monthlyEquivalent).toBeCloseTo((r.payment * 26) / 12, 2);
  });
});

describe("parseDownPayment", () => {
  it("reads percents and dollar amounts", () => {
    expect(parseDownPayment("20")).toEqual({ kind: "percent", value: 20 });
    expect(parseDownPayment("10%")).toEqual({ kind: "percent", value: 10 });
    expect(parseDownPayment("$60,000")).toEqual({ kind: "amount", value: 60_000 });
    expect(parseDownPayment("600000")).toEqual({ kind: "amount", value: 600_000 });
    expect(parseDownPayment("abc")).toBeNull();
  });
});
