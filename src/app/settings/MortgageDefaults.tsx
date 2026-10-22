"use client";

import { FEE_LABELS, FOOTER_SHAPES, FREQUENCIES, RENT_DISPLAYS, SHADINGS, type FeeLabel, type FooterShape, type MortgageSettings, type ScenarioDefault, type Shading } from "@/lib/broker";
import { MAX_SCENARIOS, parseDownPayment, type PaymentFrequency, type RentDisplay } from "@/lib/mortgage-sheet";

const RATE_ROWS = [
  ["insured", "Insured (under 20% down)"],
  ["conventional", "Conventional (20% down or more)"],
] as const;

/**
 * Broker defaults that pre-fill every mortgage feature sheet. `embedded` renders the same controls
 * without the settings card, for editing one sheet in the post editor.
 */
export function MortgageDefaults<T extends MortgageSettings>({ value, onChange, embedded = false, disabled = false }: { value: T; onChange: (v: T) => void; embedded?: boolean; disabled?: boolean }) {
  const set = <K extends keyof MortgageSettings>(k: K, v: MortgageSettings[K]) => onChange({ ...value, [k]: v });
  const setFooter = (patch: Partial<MortgageSettings["footer"]>) => set("footer", { ...value.footer, ...patch });
  const setRate = (group: "insured" | "conventional", type: "fixed" | "variable", raw: string) => {
    const n = raw === "" ? null : Number(raw);
    set("rates", { ...value.rates, [group]: { ...value.rates[group], [type]: n != null && Number.isFinite(n) ? n : null } });
  };
  const setScenario = (i: number, patch: Partial<ScenarioDefault>) =>
    set("scenarios", value.scenarios.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  const usesVariable = value.scenarios.some((s) => s.rateType === "variable");

  const Wrapper = embedded ? "div" : "section";
  return (
    <Wrapper {...(embedded ? {} : { id: "mortgage" })} className={embedded ? "space-y-5" : "card scroll-mt-24 space-y-5 p-5"}>
      {!embedded && (
        <div>
          <h2 className="font-semibold">Feature sheet defaults</h2>
          <p className="mt-1 text-sm text-muted">New sheets start with these. You can change everything per sheet in the Sheet Builder.</p>
        </div>
      )}
      <fieldset disabled={disabled} className="space-y-5">

      <div>
        <span className="label">Rates (%)</span>
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="grid grid-cols-[1fr_6rem_6rem] gap-2 bg-black/[0.03] px-3 py-2 text-xs font-medium text-muted">
            <span />
            <span>Fixed</span>
            <span>Variable</span>
          </div>
          {RATE_ROWS.map(([group, label]) => (
            <div key={group} className="grid grid-cols-[1fr_6rem_6rem] items-center gap-2 border-t border-border px-3 py-2 text-sm">
              <span>{label}</span>
              {(["fixed", "variable"] as const).map((type) => (
                <input
                  key={type}
                  className="input"
                  type="number"
                  step="0.01"
                  min={0}
                  max={25}
                  inputMode="decimal"
                  aria-label={`${label} ${type} rate`}
                  value={value.rates[group][type] ?? ""}
                  onChange={(e) => setRate(group, type, e.target.value)}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <label className="flex items-center gap-2">
            Rates as of
            <input className="input w-auto" type="date" value={value.ratesAsOf ?? ""} onChange={(e) => set("ratesAsOf", e.target.value || null)} />
          </label>
          {usesVariable && (value.rates.insured.variable == null || value.rates.conventional.variable == null) && (
            <span className="text-xs text-amber-800">A scenario uses a variable rate: enter the variable rates it needs.</span>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block">
          <span className="label">Payment frequency</span>
          <select className="input" value={value.frequency} onChange={(e) => set("frequency", e.target.value as PaymentFrequency)}>
            {Object.entries(FREQUENCIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="label">Call the monthly fee</span>
          <select className="input" value={value.feeLabel} onChange={(e) => set("feeLabel", e.target.value as FeeLabel)}>
            {Object.entries(FEE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="label">When rent is entered</span>
          <select className="input" value={value.rentDisplay} onChange={(e) => set("rentDisplay", e.target.value as RentDisplay)}>
            {Object.entries(RENT_DISPLAYS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
      </div>

      <div className="space-y-2 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={value.showRate} onChange={(e) => set("showRate", e.target.checked)} />
          Show the rate on the sheet
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={value.showMinimumIncome} onChange={(e) => set("showMinimumIncome", e.target.checked)} />
          Show minimum household income
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={value.firstTimeOrNewBuild} onChange={(e) => set("firstTimeOrNewBuild", e.target.checked)} />
          First-time buyer or new build (allows a 30-year insured amortization)
        </label>
      </div>

      <div>
        <span className="label">Payment scenarios (up to {MAX_SCENARIOS})</span>
        <div className="space-y-2">
          {value.scenarios.map((s, i) => {
            const invalid = !parseDownPayment(s.down);
            return (
              <div key={i} className="grid grid-cols-[1fr_7rem_7rem_auto] items-center gap-2">
                <input
                  className={`input ${invalid ? "border-red-400" : ""}`}
                  aria-label={`Scenario ${i + 1} down payment`}
                  placeholder="20 or $60,000"
                  value={s.down}
                  onChange={(e) => setScenario(i, { down: e.target.value })}
                />
                <select className="input" aria-label={`Scenario ${i + 1} amortization`} value={s.amortizationYears} onChange={(e) => setScenario(i, { amortizationYears: Number(e.target.value) })}>
                  {[15, 20, 25, 30].map((y) => <option key={y} value={y}>{y} years</option>)}
                </select>
                <select className="input" aria-label={`Scenario ${i + 1} rate`} value={s.rateType} onChange={(e) => setScenario(i, { rateType: e.target.value as "fixed" | "variable" })}>
                  <option value="fixed">Fixed</option>
                  <option value="variable">Variable</option>
                </select>
                <button type="button" className="btn-ghost px-2 text-red-700" aria-label={`Remove scenario ${i + 1}`} disabled={value.scenarios.length <= 1} onClick={() => set("scenarios", value.scenarios.filter((_, j) => j !== i))}>
                  ✕
                </button>
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-muted">Down payment as a percent (20) or a dollar amount ($60,000). Anything below the legal minimum is raised automatically.</p>
          {value.scenarios.length < MAX_SCENARIOS && (
            <button type="button" className="btn-secondary" onClick={() => set("scenarios", [...value.scenarios, { down: "20", amortizationYears: 25, rateType: "fixed" }])}>
              + Add a scenario
            </button>
          )}
        </div>
      </div>

      <label className="block">
        <span className="label">Your disclaimer (optional)</span>
        <textarea
          className="input min-h-16"
          maxLength={500}
          placeholder="Added after the standard disclaimer, e.g. lender or brokerage wording."
          value={value.disclaimer}
          onChange={(e) => set("disclaimer", e.target.value)}
        />
        <span className="mt-1 block text-xs text-muted">
          Every sheet always includes your brokerage and licence number, the rate&apos;s &quot;as of&quot; date, and: &quot;Payments are estimates for illustration
          only, on approved credit. Rates and terms subject to change.&quot;
        </span>
      </label>

      <div className="space-y-3 border-t border-border pt-5">
        <span className="label">Sheet design</span>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block">
            <span className="label">Footer colour</span>
            <select className="input" value={value.footer.color} onChange={(e) => setFooter({ color: e.target.value as "white" | "brand" })}>
              <option value="white">White</option>
              <option value="brand">Brand colour</option>
            </select>
          </label>
          <label className="block">
            <span className="label">Footer shape</span>
            <select className="input" value={value.footer.shape} onChange={(e) => setFooter({ shape: e.target.value as FooterShape })}>
              {Object.entries(FOOTER_SHAPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="label">Photo</span>
            <select className="input" value={value.shading} onChange={(e) => set("shading", e.target.value as Shading)}>
              {Object.entries(SHADINGS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
        </div>
        <label className="block">
          <span className="label">Footer line (optional)</span>
          <input className="input" maxLength={120} placeholder="e.g. Get pre-approved before you book a showing" value={value.footer.line} onChange={(e) => setFooter({ line: e.target.value })} />
        </label>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={value.footer.stripe} onChange={(e) => setFooter({ stripe: e.target.checked })} />
            Accent stripe on the footer
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={value.showQr} onChange={(e) => set("showQr", e.target.checked)} />
            QR codes to your and the realtor&apos;s websites
          </label>
        </div>
      </div>
      </fieldset>
    </Wrapper>
  );
}
