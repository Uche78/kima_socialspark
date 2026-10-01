/* eslint-disable @next/next/no-img-element -- html-to-image needs plain <img> with CORS */
import { forwardRef, type CSSProperties, type ReactNode } from "react";
import { estimateMortgage, formatCurrency } from "@/lib/mortgage";
import { mediaUrl, postTypeLabel, t } from "@/lib/media";
import { type Design, type Language, type Listing, type MortgageInputs, type PostType, type Profile, type Slide } from "@/lib/types";

export type SlideCanvasProps = {
  slide: Slide;
  listing: Listing;
  profile: Profile;
  design: Design;
  mortgage: MortgageInputs | null;
  language: Language;
  postType: PostType;
  width: number;
  height: number;
  index: number;
  total: number;
};

const SERIF = "var(--font-display), Georgia, serif";
const SANS = "var(--font-sans), Helvetica, Arial, sans-serif";

function photoUrl(listing: Listing, i: number | null) {
  if (i == null) return null;
  return listing.photos[i]?.url ?? null;
}

function Bg({ src, style }: { src: string | null; style?: CSSProperties }) {
  if (!src) return null;
  return (
    <img
      src={src}
      alt=""
      crossOrigin="anonymous"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...style }}
    />
  );
}

/** Agent/brokerage strip shown at the bottom of every slide (toggleable). */
function BrandBar({ profile, design, listing, language, s, color }: { profile: Profile; design: Design; listing: Listing; language: Language; s: number; color: string }) {
  const logo = design.show_logo ? mediaUrl(profile.logo_path) : null;
  const showCourtesy =
    listing.listing_brokerage &&
    profile.brokerage_name &&
    listing.listing_brokerage.trim().toLowerCase() !== profile.brokerage_name.trim().toLowerCase();
  if (!logo && !design.show_contact && !design.show_brokerage) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18 * s, color, fontFamily: SANS }}>
      {logo && <img src={logo} alt="" crossOrigin="anonymous" style={{ height: 64 * s, maxWidth: 220 * s, objectFit: "contain" }} />}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 * s, minWidth: 0 }}>
        {design.show_contact && profile.full_name && (
          <div style={{ fontSize: 26 * s, fontWeight: 700 }}>
            {profile.full_name}
            {profile.title ? <span style={{ fontWeight: 400, opacity: 0.85 }}>{` · ${profile.title}`}</span> : null}
          </div>
        )}
        {design.show_brokerage && profile.brokerage_name && (
          <div style={{ fontSize: 20 * s, opacity: 0.9 }}>
            {profile.brokerage_name}
            {profile.role === "mortgage_broker" && profile.license_number ? ` · ${t("licence", language)} ${profile.license_number}` : ""}
          </div>
        )}
        {design.show_brokerage && showCourtesy && (
          <div style={{ fontSize: 16 * s, opacity: 0.75 }}>
            {t("courtesy", language)} {listing.listing_brokerage}
          </div>
        )}
      </div>
    </div>
  );
}

function Stats({ listing, language, s, color }: { listing: Listing; language: Language; s: number; color: string }) {
  const items = [
    listing.bedrooms != null && [String(listing.bedrooms), t("beds", language)],
    listing.bathrooms != null && [String(listing.bathrooms), t("baths", language)],
    listing.square_feet != null && [new Intl.NumberFormat("en-CA").format(listing.square_feet), t("sqft", language)],
  ].filter(Boolean) as [string, string][];
  if (!items.length) return null;
  return (
    <div style={{ display: "flex", gap: 36 * s, color, fontFamily: SANS }}>
      {items.map(([v, l]) => (
        <div key={l}>
          <div style={{ fontSize: 44 * s, fontWeight: 700, lineHeight: 1 }}>{v}</div>
          <div style={{ fontSize: 18 * s, textTransform: "uppercase", letterSpacing: 2 * s, opacity: 0.8, marginTop: 6 * s }}>{l}</div>
        </div>
      ))}
    </div>
  );
}

function priceText(listing: Listing, language: Language) {
  if (listing.price == null) return null;
  return `${formatCurrency(listing.price, language)}${listing.transaction_type === "rent" ? t("perMonth", language) : ""}`;
}

function fullAddress(listing: Listing) {
  return [listing.address, listing.city, listing.province].filter(Boolean).join(", ");
}

export const SlideCanvas = forwardRef<HTMLDivElement, SlideCanvasProps>(function SlideCanvas(props, ref) {
  const { slide, listing, profile, design, mortgage, language, postType, width, height, index, total } = props;
  const s = width / 1080; // scale factor so every template works at any output size
  const photo = photoUrl(listing, slide.photo_index);
  const root: CSSProperties = {
    position: "relative",
    width,
    height,
    overflow: "hidden",
    background: design.primary,
    fontFamily: SANS,
  };
  const pad = 64 * s;
  const badge = (
    <div
      style={{
        display: "inline-block",
        background: design.accent,
        color: design.primary,
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 24 * s,
        letterSpacing: 3 * s,
        textTransform: "uppercase",
        padding: `${12 * s}px ${22 * s}px`,
      }}
    >
      {postTypeLabel(postType, language)}
    </div>
  );
  const counter =
    total > 1 ? (
      <div style={{ position: "absolute", top: pad * 0.6, right: pad * 0.6, color: "#fff", fontSize: 20 * s, background: "rgba(0,0,0,.45)", padding: `${6 * s}px ${14 * s}px`, borderRadius: 999 }}>
        {index + 1}/{total}
      </div>
    ) : null;

  let body: ReactNode;

  if (slide.kind === "details") {
    body = (
      <>
        <Bg src={photo} style={{ opacity: 0.18, filter: "blur(2px)" }} />
        <div style={{ position: "absolute", inset: 0, padding: pad, display: "flex", flexDirection: "column", justifyContent: "space-between", color: design.secondary }}>
          <div>
            <div style={{ width: 80 * s, height: 6 * s, background: design.accent, marginBottom: 32 * s }} />
            <div style={{ fontFamily: SERIF, fontSize: 72 * s, lineHeight: 1.05 }}>{slide.headline}</div>
            {slide.subtext && <div style={{ fontSize: 30 * s, marginTop: 20 * s, opacity: 0.9 }}>{slide.subtext}</div>}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 40 * s }}>
            <Stats listing={listing} language={language} s={s} color={design.secondary} />
            {design.show_price && priceText(listing, language) && (
              <div style={{ fontSize: 64 * s, fontWeight: 800, color: design.accent }}>{priceText(listing, language)}</div>
            )}
            <div style={{ fontSize: 28 * s, opacity: 0.9 }}>{fullAddress(listing)}</div>
            <BrandBar profile={profile} design={design} listing={listing} language={language} s={s} color={design.secondary} />
          </div>
        </div>
      </>
    );
  } else if (slide.kind === "mortgage" && mortgage) {
    const est = estimateMortgage(mortgage.price, mortgage.down_payment_percent, mortgage.rate_percent, mortgage.amortization_years);
    body = (
      <>
        <Bg src={photo} style={{ opacity: 0.15 }} />
        <div style={{ position: "absolute", inset: 0, padding: pad, display: "flex", flexDirection: "column", justifyContent: "space-between", color: design.secondary }}>
          <div>
            <div style={{ fontFamily: SERIF, fontSize: 68 * s, lineHeight: 1.05 }}>{slide.headline}</div>
            {slide.subtext && <div style={{ fontSize: 30 * s, marginTop: 20 * s, opacity: 0.9 }}>{slide.subtext}</div>}
          </div>
          <div>
            <div style={{ fontSize: 24 * s, textTransform: "uppercase", letterSpacing: 3 * s, opacity: 0.8 }}>{t("estPayment", language)}</div>
            <div style={{ fontSize: 120 * s, fontWeight: 800, color: design.accent, lineHeight: 1.1 }}>
              {formatCurrency(est.monthlyPayment, language)}
              <span style={{ fontSize: 40 * s, fontWeight: 500 }}>{t("perMonth", language)}</span>
            </div>
            <div style={{ fontSize: 26 * s, marginTop: 16 * s, opacity: 0.9 }}>
              {formatCurrency(mortgage.price, language)} · {mortgage.down_payment_percent}% {t("down", language)} · {mortgage.rate_percent}% {t("rate", language)} ·{" "}
              {mortgage.amortization_years} {t("amort", language)}
            </div>
            {mortgage.cta && (
              <div style={{ display: "inline-block", marginTop: 36 * s, background: design.accent, color: design.primary, fontWeight: 800, fontSize: 30 * s, padding: `${16 * s}px ${28 * s}px` }}>
                {mortgage.cta}
              </div>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 * s }}>
            <BrandBar profile={profile} design={design} listing={listing} language={language} s={s} color={design.secondary} />
            <div style={{ fontSize: 16 * s, opacity: 0.7 }}>{t("disclaimer", language)}</div>
          </div>
        </div>
      </>
    );
  } else if (slide.kind === "contact") {
    const headshot = design.show_headshot ? mediaUrl(profile.headshot_path) : null;
    body = (
      <div style={{ position: "absolute", inset: 0, padding: pad, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 28 * s, color: design.secondary, background: design.primary }}>
        {headshot && <img src={headshot} alt="" crossOrigin="anonymous" style={{ width: 300 * s, height: 300 * s, borderRadius: "50%", objectFit: "cover", border: `${8 * s}px solid ${design.accent}` }} />}
        <div style={{ fontFamily: SERIF, fontSize: 64 * s, lineHeight: 1.1 }}>{slide.headline}</div>
        {slide.subtext && <div style={{ fontSize: 30 * s, opacity: 0.9, maxWidth: 800 * s }}>{slide.subtext}</div>}
        <div style={{ fontSize: 30 * s, lineHeight: 1.6 }}>
          {profile.full_name && <div style={{ fontWeight: 700, fontSize: 38 * s }}>{profile.full_name}</div>}
          {profile.title && <div style={{ opacity: 0.85 }}>{profile.title}</div>}
          {profile.phone && <div>{profile.phone}</div>}
          {profile.email && <div>{profile.email}</div>}
          {profile.website && <div>{profile.website.replace(/^https?:\/\//, "")}</div>}
        </div>
        {design.show_brokerage && profile.brokerage_name && (
          <div style={{ fontSize: 22 * s, opacity: 0.85 }}>
            {profile.brokerage_name}
            {profile.role === "mortgage_broker" && profile.license_number ? ` · ${t("licence", language)} ${profile.license_number}` : ""}
          </div>
        )}
        {design.show_logo && mediaUrl(profile.logo_path) && (
          <img src={mediaUrl(profile.logo_path)!} alt="" crossOrigin="anonymous" style={{ height: 80 * s, maxWidth: 320 * s, objectFit: "contain" }} />
        )}
      </div>
    );
  } else if (design.template === "modern") {
    const split = Math.round(height * 0.64);
    body = (
      <>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: split, overflow: "hidden" }}>
          <Bg src={photo} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: split, height: 8 * s, background: design.accent }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: split + 8 * s, bottom: 0, padding: `${40 * s}px ${pad}px`, display: "flex", flexDirection: "column", justifyContent: "space-between", color: design.secondary }}>
          <div>
            {slide.kind === "cover" ? (
              <>
                <div style={{ fontSize: 22 * s, fontWeight: 800, letterSpacing: 3 * s, textTransform: "uppercase", color: design.accent }}>{postTypeLabel(postType, language)}</div>
                <div style={{ fontFamily: SERIF, fontSize: 60 * s, lineHeight: 1.05, marginTop: 10 * s }}>{slide.headline}</div>
                <div style={{ fontSize: 26 * s, marginTop: 12 * s, opacity: 0.9 }}>
                  {[design.show_price ? priceText(listing, language) : null, fullAddress(listing)].filter(Boolean).join("  ·  ")}
                </div>
              </>
            ) : (
              <>
                <div style={{ fontFamily: SERIF, fontSize: 56 * s, lineHeight: 1.05 }}>{slide.headline}</div>
                {slide.subtext && <div style={{ fontSize: 28 * s, marginTop: 12 * s, opacity: 0.9 }}>{slide.subtext}</div>}
              </>
            )}
          </div>
          <BrandBar profile={profile} design={design} listing={listing} language={language} s={s * 0.9} color={design.secondary} />
        </div>
        {counter}
      </>
    );
  } else if (design.template === "minimal") {
    const frame = 48 * s;
    const photoH = Math.round(height * 0.66);
    body = (
      <div style={{ position: "absolute", inset: 0, background: design.secondary, color: design.primary }}>
        <div style={{ position: "absolute", left: frame, right: frame, top: frame, height: photoH, overflow: "hidden" }}>
          <Bg src={photo} />
        </div>
        <div style={{ position: "absolute", left: frame, right: frame, top: frame + photoH + 32 * s, bottom: frame, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: SERIF, fontSize: 58 * s, lineHeight: 1.05 }}>{slide.headline}</div>
            <div style={{ fontSize: 26 * s, marginTop: 10 * s, opacity: 0.8 }}>
              {slide.kind === "cover"
                ? [design.show_price ? priceText(listing, language) : null, fullAddress(listing)].filter(Boolean).join("  ·  ")
                : slide.subtext}
            </div>
          </div>
          <BrandBar profile={profile} design={design} listing={listing} language={language} s={s * 0.85} color={design.primary} />
        </div>
        {counter}
      </div>
    );
  } else {
    // classic: full-bleed photo with gradient and bottom brand band
    body = (
      <>
        <Bg src={photo} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.1) 55%, rgba(0,0,0,0.78) 100%)" }} />
        {slide.kind === "cover" && <div style={{ position: "absolute", top: pad, left: pad }}>{badge}</div>}
        <div style={{ position: "absolute", left: pad, right: pad, bottom: pad, color: "#fff", display: "flex", flexDirection: "column", gap: 28 * s }}>
          <div>
            <div style={{ fontFamily: SERIF, fontSize: (slide.kind === "cover" ? 76 : 60) * s, lineHeight: 1.05, textShadow: "0 2px 12px rgba(0,0,0,.35)" }}>
              {slide.headline}
            </div>
            {slide.kind === "cover" ? (
              <div style={{ fontSize: 30 * s, marginTop: 14 * s, display: "flex", gap: 24 * s, alignItems: "baseline" }}>
                {design.show_price && priceText(listing, language) && <span style={{ fontWeight: 800, fontSize: 44 * s, color: design.accent }}>{priceText(listing, language)}</span>}
                <span style={{ opacity: 0.95 }}>{fullAddress(listing) || slide.subtext}</span>
              </div>
            ) : (
              slide.subtext && <div style={{ fontSize: 30 * s, marginTop: 12 * s, opacity: 0.95 }}>{slide.subtext}</div>
            )}
          </div>
          <div style={{ borderTop: `${2 * s}px solid rgba(255,255,255,.35)`, paddingTop: 24 * s }}>
            <BrandBar profile={profile} design={design} listing={listing} language={language} s={s} color="#fff" />
          </div>
        </div>
        {counter}
      </>
    );
  }

  return (
    <div ref={ref} style={root}>
      {body}
    </div>
  );
});
