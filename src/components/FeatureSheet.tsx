/* eslint-disable @next/next/no-img-element -- html-to-image needs plain <img> with CORS */
// Mortgage feature sheet slides. Every number comes from the calculator (mortgage-sheet.ts); the AI only
// writes the headline. Layouts scale with the slide width, so the same design serves posts, stories and PDF.

import type { CSSProperties, ReactNode } from "react";
import { brokerageLine, money, percent, readSheetConfig, sheetFinePrint, sheetResults, sl, slLines, slShort, type SheetConfig, type SheetLabel } from "@/lib/feature-sheet";
import { mediaUrl, postTypeLabel } from "@/lib/media";
import type { ScenarioResult } from "@/lib/mortgage-sheet";
import type { Design, Language, Listing, Profile, Slide } from "@/lib/types";
import { QrCode, qrUrl } from "./QrCode";

const SERIF = "var(--font-display), Georgia, serif";
const SANS = "var(--font-sans), Helvetica, Arial, sans-serif";
const INK = "#16202b";
const MUTED = "#5b6673";
const RULE = "#e3e1dc";

type Props = { slide: Slide; listing: Listing; profile: Profile; design: Design; language: Language; width: number; height: number };

export function FeatureSheetSlide({ slide, listing, profile, design, language, width, height }: Props) {
  const s = width / 1080;
  const config = readSheetConfig(design.sheet);
  const results = sheetResults(listing, config);
  const ctx = { slide, listing, profile, design, language, config, results, lang: language, s, width, height };
  if (slide.kind === "scenarios") return <ScenariosSlide {...ctx} />;
  if (slide.kind === "broker") return <BrokerSlide {...ctx} />;
  return <FullSheet {...ctx} />;
}

type Ctx = Props & { config: SheetConfig; results: ScenarioResult[]; lang: Language; s: number };

// ---------------------------------------------------------------------------
// Pieces
// ---------------------------------------------------------------------------

function Photo({ listing, slide, design, config, children }: Pick<Ctx, "listing" | "slide" | "design" | "config"> & { children?: ReactNode }) {
  const src = slide.photo_index != null ? listing.photos[slide.photo_index]?.url : listing.photos[0]?.url;
  const address = [listing.address, listing.city, listing.province].filter(Boolean).join(", ");
  return (
    <div style={{ position: "absolute", inset: 0, background: design.primary }}>
      {src && (
        <img src={src} alt={`Photo of ${address || "the property"}`} crossOrigin="anonymous" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      )}
      {config.shading === "tint" && <div style={{ position: "absolute", inset: 0, background: design.primary, opacity: 0.35, mixBlendMode: "multiply" }} />}
      {children}
    </div>
  );
}

function Badge({ design, lang, s }: Pick<Ctx, "design" | "lang" | "s">) {
  return (
    <div style={{ display: "inline-block", background: design.accent, color: design.primary, fontWeight: 800, fontSize: 20 * s, letterSpacing: 3 * s, textTransform: "uppercase", padding: `${10 * s}px ${18 * s}px` }}>
      {postTypeLabel("feature_sheet", lang)}
    </div>
  );
}

function Details({ listing, lang, s, color }: Pick<Ctx, "listing" | "lang" | "s"> & { color: string }) {
  const n = (v: number) => new Intl.NumberFormat(lang === "fr" ? "fr-CA" : "en-CA").format(v);
  const items = [
    listing.property_type,
    listing.bedrooms != null ? `${listing.bedrooms} ${sl("beds", lang)}` : null,
    listing.bathrooms != null ? `${n(listing.bathrooms)} ${sl("baths", lang)}` : null,
    listing.square_feet ? `${n(listing.square_feet)} ${sl("sqft", lang)}` : null,
    listing.mls_number ? `MLS® ${listing.mls_number}` : null,
  ].filter(Boolean);
  if (!items.length) return null;
  return <div style={{ fontSize: 22 * s, color, lineHeight: 1.35 }}>{items.join("  ·  ")}</div>;
}

type Row = { label: [string, string | null]; cells: string[]; strong?: boolean; highlight?: boolean };

/** Table rows. Cells are numbers only (language-neutral); labels carry the words. */
function tableRows({ listing, config, results, lang }: Pick<Ctx, "listing" | "config" | "results" | "lang">): Row[] {
  const dash = "—";
  const L = (k: SheetLabel) => slLines(k, lang);
  const val = (r: ScenarioResult, v: string) => (r.available ? v : dash);
  const tax = listing.property_tax_yearly ? listing.property_tax_yearly / 12 : 0;
  const fee = listing.monthly_fee ?? 0;
  const rent = listing.monthly_rent ?? 0;
  const paymentOnly = config.rentDisplay === "payment_only";
  const rows: Row[] = [
    { label: L("downPayment"), cells: results.map((r) => money(r.downPayment, lang)) },
    { label: L("insurance"), cells: results.map((r) => (r.premium ? money(r.premium, lang) : dash)) },
    { label: L("mortgage"), cells: results.map((r) => money(r.mortgageAmount, lang)) },
  ];
  if (config.showRate) rows.push({ label: L("rate"), cells: results.map((r) => (r.ratePercent != null ? percent(r.ratePercent, lang) : dash)) });
  rows.push({ label: L(config.frequency), cells: results.map((r) => (r.available ? money(r.payment, lang) : dash)), highlight: true });
  if (!paymentOnly) {
    if (tax) rows.push({ label: L("tax"), cells: results.map(() => money(tax, lang)) });
    if (fee) rows.push({ label: L(config.feeLabel), cells: results.map(() => money(fee, lang)) });
    if (tax || fee) rows.push({ label: L("total"), cells: results.map((r) => val(r, money(r.shelterMonthly, lang))), strong: true });
  }
  if (rent) {
    if (config.rentDisplay === "offset") {
      rows.push({ label: L("rent"), cells: results.map(() => `−${money(rent, lang)}`) });
      rows.push({ label: L("net"), cells: results.map((r) => val(r, money(r.afterRentMonthly ?? r.shelterMonthly - rent, lang))), strong: true });
    } else {
      rows.push({ label: L("rent_monthly"), cells: results.map(() => money(rent, lang)) });
    }
  }
  if (config.showMinimumIncome) rows.push({ label: L("income"), cells: results.map((r) => val(r, money(r.minimumIncome ?? 0, lang))) });
  return rows;
}

function ScenarioTable(ctx: Pick<Ctx, "listing" | "config" | "results" | "lang" | "design"> & { s: number }) {
  const { results, lang, design, s } = ctx;
  if (!results.length) {
    return <div style={{ fontSize: 24 * s, color: MUTED }}>{lang === "fr" ? "Ajoutez le prix pour voir les scénarios." : "Add the listing price to see payment scenarios."}</div>;
  }
  const rows = tableRows(ctx);
  const cols = `${280 * s}px repeat(${results.length}, 1fr)`;
  const cell: CSSProperties = { padding: `${9 * s}px ${12 * s}px`, textAlign: "right", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" };
  return (
    <div style={{ fontSize: 21 * s, color: INK }}>
      <div style={{ display: "grid", gridTemplateColumns: cols, alignItems: "end", borderBottom: `${3 * s}px solid ${design.primary}` }}>
        <div />
        {results.map((r, i) => (
          <div key={i} style={{ ...cell, paddingBottom: 10 * s }}>
            <div style={{ fontSize: 32 * s, fontWeight: 800, color: design.primary, lineHeight: 1.05 }}>{percent(Math.round(r.downPercent * 10) / 10, lang)}</div>
            <div style={{ fontSize: 16 * s, fontWeight: 700, color: design.primary, whiteSpace: "normal", lineHeight: 1.2 }}>{slShort("down", lang)}</div>
            <div style={{ fontSize: 15 * s, color: MUTED, whiteSpace: "normal", lineHeight: 1.25, marginTop: 2 * s }}>
              {r.downRaised ? `${slShort("minimum", lang)} · ` : ""}
              {r.amortizationYears} {slShort("years", lang)} · {slShort(r.rateType, lang)}
            </div>
          </div>
        ))}
      </div>
      {rows.map((row) => (
        <div
          key={row.label[0]}
          style={{
            display: "grid",
            gridTemplateColumns: cols,
            alignItems: "center",
            borderBottom: `${1 * s}px solid ${RULE}`,
            background: row.highlight ? `${design.accent}33` : undefined,
            fontWeight: row.strong || row.highlight ? 800 : 500,
            fontSize: (row.highlight ? 25 : 21) * s,
          }}
        >
          <div style={{ ...cell, textAlign: "left", color: row.highlight || row.strong ? INK : MUTED, fontWeight: row.highlight || row.strong ? 700 : 500, whiteSpace: "normal", fontSize: 19 * s, lineHeight: 1.2 }}>
            {row.label[0]}
            {row.label[1] && <div style={{ fontSize: 15 * s, fontWeight: 500, color: MUTED }}>{row.label[1]}</div>}
          </div>
          {row.cells.map((c, i) => <div key={i} style={cell}>{c}</div>)}
        </div>
      ))}
    </div>
  );
}

function PersonCard(p: { name: string | null; title: string | null; phone: string | null; email: string | null; line: string | null; photo: string | null; qr: string | null; s: number; color: string; muted: string; big?: boolean }) {
  const { s, big } = p;
  const k = big ? 1.35 : 1;
  if (!p.name) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18 * s * k, minWidth: 0, color: p.color, width: big ? "100%" : undefined }}>
      {p.photo && <img src={p.photo} alt="" crossOrigin="anonymous" style={{ width: 104 * s * k, height: 104 * s * k, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />}
      <div style={{ minWidth: 0, lineHeight: 1.3, flex: big ? 1 : undefined }}>
        <div style={{ fontSize: 25 * s * k, fontWeight: 800 }}>{p.name}</div>
        {p.title && <div style={{ fontSize: 18 * s * k, color: p.muted }}>{p.title}</div>}
        {(p.phone || p.email) && <div style={{ fontSize: 18 * s * k, marginTop: 4 * s }}>{[p.phone, p.email].filter(Boolean).join("  ·  ")}</div>}
        {p.line && <div style={{ fontSize: 16 * s * k, color: p.muted, marginTop: 2 * s }}>{p.line}</div>}
      </div>
      {p.qr && (
        <div style={{ flexShrink: 0, background: "#fff", padding: 4 * s, borderRadius: 6 * s }}>
          <QrCode text={p.qr} size={88 * s * k} color={INK} />
        </div>
      )}
    </div>
  );
}

function Cards({ profile, config, design, lang, s, onDark, big }: Pick<Ctx, "profile" | "config" | "design" | "lang" | "s"> & { onDark: boolean; big?: boolean }) {
  const color = onDark ? design.secondary : INK;
  const muted = onDark ? `${design.secondary}cc` : MUTED;
  const r = config.realtor;
  const logo = design.show_logo ? mediaUrl(profile.logo_path) : null;
  return (
    <div style={{ display: "flex", flexDirection: big ? "column" : "row", alignItems: big ? "stretch" : "center", justifyContent: "space-between", gap: (big ? 36 : 28) * s }}>
      <PersonCard
        name={profile.full_name}
        title={profile.title}
        phone={profile.phone}
        email={profile.email}
        line={brokerageLine(profile.brokerage_name, profile.license_number, lang)}
        photo={design.show_headshot ? mediaUrl(profile.headshot_path) : null}
        qr={config.showQr ? qrUrl(profile.website) : null}
        s={s}
        color={color}
        muted={muted}
        big={big}
      />
      {r ? (
        <PersonCard
          name={r.full_name}
          title={r.title}
          phone={r.phone}
          email={r.email}
          line={r.brokerage_name}
          photo={mediaUrl(r.headshot_path)}
          qr={config.showQr ? qrUrl(r.website) : null}
          s={s}
          color={color}
          muted={muted}
          big={big}
        />
      ) : (
        logo && <img src={logo} alt="" crossOrigin="anonymous" style={{ height: 80 * s, maxWidth: 260 * s, objectFit: "contain" }} />
      )}
    </div>
  );
}

function FinePrint({ config, results, lang, s, color }: Pick<Ctx, "config" | "results" | "lang" | "s"> & { color: string }) {
  return <div style={{ fontSize: (lang === "bilingual" ? 11.5 : 13.5) * s, lineHeight: 1.35, color, marginTop: 12 * s }}>{sheetFinePrint(config, results, lang)}</div>;
}

// ---------------------------------------------------------------------------
// Slides
// ---------------------------------------------------------------------------

/** The whole sheet on one page: photo hero, details strip, numbers table, shelter-cost bar, contact cards, footer. */
function FullSheet(ctx: Ctx) {
  const { listing, design, slide, lang, s, width, height, config, results } = ctx;
  // Squarer formats have less room under the photo, so the lower half is set a little smaller.
  const k = Math.min(1, Math.max(0.6, height / width / 1.75));
  const t = s * k;
  const pad = 64 * s;
  const caps: CSSProperties = { textTransform: "uppercase", letterSpacing: 3 * t };
  const location = [[listing.city, listing.province].filter(Boolean).join(", "), listing.postal_code].filter(Boolean).join(" ");
  const dark = config.footer.color === "brand";
  const years = [...new Set(results.map((r) => r.amortizationYears))];

  return (
    <div style={{ width, height, display: "flex", flexDirection: "column", background: "#f7f6f3", fontFamily: SANS, overflow: "hidden", color: INK }}>
      {/* Hero */}
      <div style={{ position: "relative", flex: "1 1 0", minHeight: height * 0.2 }}>
        <Photo {...ctx}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,.72) 100%)" }} />
          <div style={{ position: "absolute", left: pad, right: pad, bottom: 34 * t, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 32 * t, color: "#fff" }}>
            <div style={{ minWidth: 0 }}>
              {location && <div style={{ ...caps, fontSize: 19 * t, fontWeight: 700, color: design.accent }}>{location}</div>}
              <div style={{ fontSize: 66 * t, fontWeight: 600, lineHeight: 1.05, marginTop: 10 * t, textTransform: "uppercase", letterSpacing: 1 * t }}>{listing.address || slide.headline}</div>
              <div style={{ width: 90 * t, height: 6 * t, background: design.accent, marginTop: 16 * t }} />
              {slide.headline && listing.address && <div style={{ fontFamily: SERIF, fontSize: 28 * t, marginTop: 12 * t, opacity: 0.95 }}>{slide.headline}</div>}
            </div>
            {listing.price != null && (
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ ...caps, fontSize: 19 * t, fontWeight: 600, opacity: 0.9 }}>{sl("purchasePrice", lang)}</div>
                <div style={{ fontSize: 76 * t, fontWeight: 800, lineHeight: 1.05 }}>{money(listing.price, lang)}</div>
              </div>
            )}
          </div>
        </Photo>
      </div>

      {/* Details strip */}
      <DetailStrip {...ctx} t={t} pad={pad} caps={caps} />

      {/* Numbers */}
      <div style={{ padding: `${20 * t}px ${pad}px 0`, flexShrink: 0 }}>
        {results.length > 0 && (
          <div style={{ ...caps, fontSize: 17 * t, fontWeight: 700, color: MUTED, marginBottom: 14 * t }}>
            {[sl("yourNumbers", lang), `${results.length} ${sl("waysToBuy", lang)}`, years.length === 1 ? `${years[0]} ${sl("years_long", lang)}` : null].filter(Boolean).join(" · ")}
          </div>
        )}
        <NumbersCard {...ctx} t={t} caps={caps} showYears={years.length > 1} />
        <ShelterBar {...ctx} t={t} caps={caps} />
      </div>

      {/* Contact cards */}
      <div style={{ padding: `${16 * t}px ${pad}px ${(config.footer.shape === "curve" ? 20 * t + 38 * s : 20 * t)}px`, display: "grid", gridTemplateColumns: config.realtor ? "1fr 1fr" : "1fr", gap: 18 * t, flexShrink: 0 }}>
        <ContactCard
          t={t}
          caps={caps}
          design={design}
          title={ctx.profile.title}
          name={ctx.profile.full_name}
          phone={ctx.profile.phone}
          email={ctx.profile.email}
          website={ctx.profile.website}
          line={brokerageLine(ctx.profile.brokerage_name, ctx.profile.license_number, lang)}
          photo={design.show_headshot ? mediaUrl(ctx.profile.headshot_path) : null}
          qr={config.showQr ? qrUrl(ctx.profile.website) : null}
        />
        {config.realtor && (
          <ContactCard
            t={t}
            caps={caps}
            design={design}
            title={config.realtor.title}
            name={config.realtor.full_name}
            phone={config.realtor.phone}
            email={config.realtor.email}
            website={config.realtor.website}
            line={brokerageLine(config.realtor.brokerage_name, config.realtor.license_number ?? null, lang)}
            photo={mediaUrl(config.realtor.headshot_path)}
            qr={config.showQr ? qrUrl(config.realtor.website) : null}
          />
        )}
      </div>

      {/* Footer: logo and fine print */}
      <SheetFooter {...ctx} t={t} pad={pad} dark={dark} />
    </div>
  );
}

function DetailStrip({ listing, lang, t, pad, caps, design }: Ctx & { t: number; pad: number; caps: CSSProperties }) {
  const n = (v: number) => new Intl.NumberFormat(lang === "fr" ? "fr-CA" : "en-CA").format(v);
  const layout = [listing.bedrooms != null ? `${n(listing.bedrooms)} ${sl("bed", lang)}` : null, listing.bathrooms != null ? `${n(listing.bathrooms)} ${sl("bath", lang)}` : null]
    .filter(Boolean)
    .join(" / ");
  const items = [
    listing.property_type ? [sl("type", lang), listing.property_type] : null,
    layout ? [sl("layout", lang), layout] : null,
    listing.square_feet ? [sl("size", lang), `${n(listing.square_feet)} ${sl("sqft", lang)}`] : null,
    listing.mls_number ? ["MLS®", listing.mls_number] : null,
  ].filter(Boolean) as [string, string][];
  if (!items.length) return null;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 24 * t, padding: `${18 * t}px ${pad}px`, borderBottom: `${2 * t}px solid ${RULE}`, flexShrink: 0 }}>
      {items.map(([label, value], i) => (
        <div key={label} style={{ textAlign: i === items.length - 1 && items.length > 1 ? "right" : "left", minWidth: 0 }}>
          <div style={{ ...caps, fontSize: 16 * t, fontWeight: 700, color: design.primary }}>{label}</div>
          <div style={{ ...caps, letterSpacing: 1.5 * t, fontSize: 27 * t, fontWeight: 600, marginTop: 6 * t, whiteSpace: "nowrap" }}>{value}</div>
        </div>
      ))}
    </div>
  );
}

type SheetRow = { label: string; cells: string[]; small?: boolean };

function sheetRows({ listing, config, results, lang }: Ctx): SheetRow[] {
  const dash = "—";
  const tax = listing.property_tax_yearly ? listing.property_tax_yearly / 12 : 0;
  const fee = listing.monthly_fee ?? 0;
  const rent = listing.monthly_rent ?? 0;
  const paymentOnly = config.rentDisplay === "payment_only";
  const rows: SheetRow[] = [{ label: sl("downPayment", lang), cells: results.map((r) => money(r.downPayment, lang)) }];
  if (config.showRate)
    rows.push({ label: sl("rate", lang), small: true, cells: results.map((r) => (r.ratePercent != null ? `${percent(r.ratePercent, lang)} ${slShort(r.insured ? "insured" : "conventional", lang)}` : dash)) });
  rows.push({ label: sl("insurance", lang), cells: results.map((r) => (r.premium ? money(r.premium, lang) : sl("none", lang))) });
  rows.push({ label: sl("mortgageAmount", lang), cells: results.map((r) => money(r.mortgageAmount, lang)) });
  rows.push({ label: sl(config.frequency, lang), cells: results.map((r) => (r.available ? money(r.payment, lang) : dash)) });
  if (!paymentOnly) {
    if (tax) rows.push({ label: sl("tax", lang), cells: results.map(() => money(tax, lang)) });
    if (fee) rows.push({ label: sl(config.feeLabel, lang), cells: results.map(() => money(fee, lang)) });
  }
  if (rent) rows.push({ label: sl(config.rentDisplay === "offset" ? "rent" : "rent_monthly", lang), cells: results.map(() => (config.rentDisplay === "offset" ? `−${money(rent, lang)}` : money(rent, lang))) });
  if (config.showMinimumIncome) rows.push({ label: sl("income", lang), cells: results.map((r) => (r.available && r.minimumIncome ? `${money(r.minimumIncome, lang)}${sl("perYear", lang)}` : dash)) });
  return rows;
}

function NumbersCard(ctx: Ctx & { t: number; caps: CSSProperties; showYears: boolean }) {
  const { results, lang, design, t, caps, showYears } = ctx;
  if (!results.length) return <div style={{ fontSize: 24 * t, color: MUTED }}>{lang === "fr" ? "Ajoutez le prix pour voir les scénarios." : "Add the listing price to see payment scenarios."}</div>;
  const cols = `${270 * t}px repeat(${results.length}, 1fr)`;
  const cell: CSSProperties = { padding: `${10 * t}px ${8 * t}px`, textAlign: "right", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" };
  return (
    <div style={{ background: "#fff", border: `${2 * t}px solid ${RULE}`, borderRadius: 18 * t, padding: `${18 * t}px ${36 * t}px ${8 * t}px` }}>
      <div style={{ display: "grid", gridTemplateColumns: cols, alignItems: "start", borderBottom: `${2 * t}px solid ${RULE}`, paddingBottom: 10 * t }}>
        <div />
        {results.map((r, i) => (
          <div key={i} style={{ textAlign: "right", padding: `0 ${8 * t}px` }}>
            <div style={{ ...caps, fontSize: 19 * t, fontWeight: 800, color: design.primary }}>
              {r.downRaised ? sl("minimumDown", lang) : `${percent(Math.round(r.downPercent * 10) / 10, lang)} ${sl("down", lang)}`}
            </div>
            {(r.downRaised || showYears || r.rateType === "variable") && (
              <div style={{ fontSize: 15 * t, color: MUTED, marginTop: 4 * t }}>
                {[r.downRaised ? percent(Math.round(r.downPercent * 10) / 10, lang) : null, showYears ? `${r.amortizationYears} ${slShort("years", lang)}` : null, r.rateType === "variable" ? slShort("variable", lang) : null]
                  .filter(Boolean)
                  .join(" · ")}
              </div>
            )}
          </div>
        ))}
      </div>
      {sheetRows(ctx).map((row, ri, all) => (
        <div key={row.label} style={{ display: "grid", gridTemplateColumns: cols, alignItems: "center", borderBottom: ri < all.length - 1 ? `${1.5 * t}px solid ${RULE}` : undefined }}>
          <div style={{ ...caps, fontSize: 16 * t, fontWeight: 600, color: MUTED, padding: `${10 * t}px 0`, whiteSpace: "normal", lineHeight: 1.25 }}>{row.label}</div>
          {row.cells.map((c, i) => (
            <div key={i} style={{ ...cell, fontSize: (row.small ? 22 : 28) * t, fontWeight: 700 }}>{c}</div>
          ))}
        </div>
      ))}
    </div>
  );
}

function ShelterBar(ctx: Ctx & { t: number; caps: CSSProperties }) {
  const { listing, config, results, lang, design, t, caps } = ctx;
  if (!results.length || config.rentDisplay === "payment_only") return null;
  const rent = listing.monthly_rent ?? 0;
  const hasCosts = !!(listing.property_tax_yearly || listing.monthly_fee);
  const net = rent > 0 && config.rentDisplay === "offset";
  if (!hasCosts && !net) return null;
  const cols = `${270 * t}px repeat(${results.length}, 1fr)`;
  return (
    <div style={{ display: "grid", gridTemplateColumns: cols, alignItems: "center", background: design.primary, color: design.secondary, borderRadius: 14 * t, padding: `${18 * t}px ${36 * t}px`, marginTop: 14 * t }}>
      <div style={{ ...caps, fontSize: 18 * t, fontWeight: 700, lineHeight: 1.25 }}>{sl(net ? "net" : "shelter", lang)}</div>
      {results.map((r, i) => (
        <div key={i} style={{ textAlign: "right", fontSize: 40 * t, fontWeight: 800, padding: `0 ${8 * t}px`, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
          {r.available ? money(net ? (r.afterRentMonthly ?? r.shelterMonthly - rent) : r.shelterMonthly, lang) : "—"}
        </div>
      ))}
    </div>
  );
}

function initials(name: string | null) {
  return (name ?? "").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join("");
}

function ContactCard(p: {
  t: number;
  caps: CSSProperties;
  design: Design;
  title: string | null;
  name: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  line: string | null;
  photo: string | null;
  qr: string | null;
}) {
  const { t, caps, design } = p;
  if (!p.name) return null;
  const size = 108 * t;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18 * t, background: "#fff", border: `${2 * t}px solid ${RULE}`, borderRadius: 18 * t, padding: `${20 * t}px ${22 * t}px`, minWidth: 0 }}>
      {p.photo ? (
        <img src={p.photo} alt="" crossOrigin="anonymous" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
      ) : (
        <div style={{ width: size, height: size, borderRadius: "50%", background: design.primary, color: design.secondary, display: "grid", placeItems: "center", fontSize: 38 * t, fontWeight: 800, flexShrink: 0 }}>
          {initials(p.name)}
        </div>
      )}
      <div style={{ minWidth: 0, flex: 1, lineHeight: 1.35 }}>
        {p.title && <div style={{ ...caps, letterSpacing: 2 * t, fontSize: 14 * t, fontWeight: 700, color: design.primary }}>{p.title}</div>}
        <div style={{ fontSize: 26 * t, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5 * t, marginTop: 2 * t, lineHeight: 1.1 }}>{p.name}</div>
        <div style={{ fontSize: 16 * t, marginTop: 6 * t, color: INK }}>
          {[p.phone, p.email, p.website?.replace(/^https?:\/\//, "")].filter(Boolean).map((x) => (
            <div key={x} style={{ overflowWrap: "anywhere" }}>{x}</div>
          ))}
        </div>
        {p.line && <div style={{ fontSize: 14 * t, color: MUTED, marginTop: 4 * t }}>{p.line}</div>}
      </div>
      {p.qr && (
        <div style={{ flexShrink: 0 }}>
          <QrCode text={p.qr} size={84 * t} color={INK} />
        </div>
      )}
    </div>
  );
}

function SheetFooter(ctx: Ctx & { t: number; pad: number; dark: boolean }) {
  const { design, config, profile, t, pad, dark, s } = ctx;
  const bg = dark ? design.primary : "#ffffff";
  const radius = config.footer.shape === "rounded" ? 36 * s : 0;
  const logo = design.show_logo ? mediaUrl(profile.logo_path) : null;
  return (
    <div style={{ position: "relative", marginTop: "auto", background: bg, borderTopLeftRadius: radius, borderTopRightRadius: radius, padding: `${18 * t}px ${pad}px ${16 * t}px`, flexShrink: 0 }}>
      {config.footer.shape === "curve" && (
        <svg viewBox="0 0 1080 40" preserveAspectRatio="none" style={{ position: "absolute", left: 0, right: 0, top: -38 * s, width: "100%", height: 40 * s }}>
          <path d="M0 40 C 270 0, 810 0, 1080 40 Z" fill={bg} />
        </svg>
      )}
      {config.footer.stripe && <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 6 * s, background: design.accent, borderTopLeftRadius: radius, borderTopRightRadius: radius }} />}
      <div style={{ display: "flex", alignItems: "center", gap: 28 * t }}>
        {logo && (
          <>
            <img src={logo} alt="" crossOrigin="anonymous" style={{ height: 76 * t, maxWidth: 240 * t, objectFit: "contain", flexShrink: 0 }} />
            <div style={{ alignSelf: "stretch", width: 1.5 * t, background: dark ? `${design.secondary}55` : RULE, flexShrink: 0 }} />
          </>
        )}
        <div style={{ minWidth: 0, flex: 1 }}>
          {config.footer.line && <div style={{ fontSize: 19 * t, fontWeight: 700, color: dark ? design.secondary : design.primary, marginBottom: 6 * t }}>{config.footer.line}</div>}
          <FinePrint {...ctx} s={t * 1.15} color={dark ? `${design.secondary}d9` : MUTED} />
        </div>
      </div>
    </div>
  );
}

/** Carousel slide: the numbers, large. */
function ScenariosSlide(ctx: Ctx) {
  const { listing, design, slide, lang, s, width, height } = ctx;
  const pad = 56 * s;
  return (
    <div style={{ width, height, display: "flex", flexDirection: "column", background: design.primary, fontFamily: SANS, overflow: "hidden" }}>
      <div style={{ padding: `${pad}px ${pad}px ${28 * s}px`, color: design.secondary }}>
        <Badge {...ctx} />
        <div style={{ fontFamily: SERIF, fontSize: 58 * s, lineHeight: 1.05, marginTop: 22 * s }}>{slide.headline}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18 * s, marginTop: 14 * s, flexWrap: "wrap" }}>
          {listing.price != null && <span style={{ fontSize: 36 * s, fontWeight: 800, color: design.accent }}>{money(listing.price, lang)}</span>}
          <span style={{ fontSize: 22 * s, opacity: 0.9 }}>{[listing.address, listing.city].filter(Boolean).join(", ")}</span>
        </div>
      </div>
      <div style={{ flex: 1, margin: `0 ${36 * s}px ${36 * s}px`, background: "#fff", borderRadius: 24 * s, padding: `${28 * s}px ${28 * s}px`, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <Details {...ctx} color={MUTED} />
          <div style={{ marginTop: 18 * s }}>
            <ScenarioTable {...ctx} s={s * (ctx.results.length <= 3 ? 1.2 : 1.05)} />
          </div>
        </div>
        <FinePrint {...ctx} color={MUTED} />
      </div>
    </div>
  );
}

/** Carousel slide: who to call, with QR codes. */
function BrokerSlide(ctx: Ctx) {
  const { design, slide, s, width, height } = ctx;
  const pad = 64 * s;
  return (
    <div style={{ width, height, display: "flex", flexDirection: "column", justifyContent: "space-between", background: design.primary, color: design.secondary, fontFamily: SANS, padding: pad, overflow: "hidden" }}>
      <div>
        <Badge {...ctx} />
        <div style={{ fontFamily: SERIF, fontSize: 64 * s, lineHeight: 1.05, marginTop: 26 * s }}>{slide.headline}</div>
        {slide.subtext && <div style={{ fontSize: 28 * s, marginTop: 14 * s, opacity: 0.9 }}>{slide.subtext}</div>}
      </div>
      <div style={{ background: "#fff", borderRadius: 24 * s, padding: 36 * s, display: "flex", flexDirection: "column", gap: 28 * s }}>
        <Cards {...ctx} onDark={false} big />
        {ctx.config.footer.line && <div style={{ fontSize: 22 * s, fontWeight: 700, color: design.primary }}>{ctx.config.footer.line}</div>}
      </div>
      <FinePrint {...ctx} color={`${design.secondary}b3`} />
    </div>
  );
}
