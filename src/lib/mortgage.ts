// Canadian mortgage estimate. Fixed-rate Canadian mortgages compound
// semi-annually by law (Interest Act), so the monthly rate is
// (1 + r/2)^(1/6) - 1 rather than r/12.

/** Minimum down payment under current federal rules (insured cap $1.5M). */
export function minimumDownPayment(price: number): number {
  if (price >= 1_500_000) return price * 0.2;
  if (price <= 500_000) return price * 0.05;
  return 500_000 * 0.05 + (price - 500_000) * 0.1;
}

/** CMHC-style default insurance premium rate by loan-to-value. */
export function insurancePremiumRate(downPercent: number, price: number): number {
  if (downPercent >= 20 || price >= 1_500_000) return 0;
  if (downPercent >= 15) return 0.028;
  if (downPercent >= 10) return 0.031;
  return 0.04;
}

export type MortgageEstimate = {
  downPayment: number;
  minDownPayment: number;
  belowMinimum: boolean;
  insurance: number;
  principal: number;
  monthlyPayment: number;
  biweeklyPayment: number;
};

export function estimateMortgage(price: number, downPercent: number, ratePercent: number, years: number): MortgageEstimate {
  const downPayment = (price * downPercent) / 100;
  const minDown = minimumDownPayment(price);
  const insurance = (price - downPayment) * insurancePremiumRate(downPercent, price);
  const principal = price - downPayment + insurance;
  const n = years * 12;
  const i = Math.pow(1 + ratePercent / 100 / 2, 1 / 6) - 1;
  const monthly = i === 0 ? principal / n : (principal * i) / (1 - Math.pow(1 + i, -n));
  return {
    downPayment,
    minDownPayment: minDown,
    belowMinimum: downPayment + 0.5 < minDown,
    insurance,
    principal,
    monthlyPayment: monthly,
    biweeklyPayment: (monthly * 12) / 26,
  };
}

export function formatCurrency(n: number | null | undefined, lang: "en" | "fr" | "bilingual" = "en"): string {
  if (n == null || Number.isNaN(n)) return "";
  return new Intl.NumberFormat(lang === "fr" ? "fr-CA" : "en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(n);
}
