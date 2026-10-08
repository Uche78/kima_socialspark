"use client";

import { useState } from "react";
import { Chips } from "@/components/Chips";
import { FocusChips } from "@/components/FocusChips";
import { estimateMortgage, formatCurrency } from "@/lib/mortgage";
import Link from "next/link";
import { remaining as left, type Usage } from "@/lib/plans";
import { MAX_FOCUS } from "@/lib/focus";
import { ASPECT_LABELS, PLATFORM_SPECS, POST_TYPES, textModeOptions, type Aspect, type TextMode, type Design, type Language, type Listing, type MortgageInputs, type Platform, type PostFormat, type PostType, type Profile } from "@/lib/types";

export type PostSettings = {
  platform: Platform;
  format: PostFormat;
  post_type: PostType;
  language: Language;
  template: Design["template"];
  aspect: Aspect;
  text_mode: TextMode;
  /** Features to lead with; empty = Claude chooses. */
  focus: string[];
  /** Agent's notes: facts not in the listing. */
  notes: string;
  include_contact_slide: boolean;
  /** Mention the listing's virtual tour (link on Facebook/LinkedIn, "DM TOUR" on Instagram). */
  include_tour: boolean;
  mortgage: MortgageInputs | null;
};

type Props = {
  listing: Listing;
  profile: Profile;
  usage: Usage;
  generating: boolean;
  error: string | null;
  onGenerate: (settings: PostSettings) => void;
};

export function CreatePostCard({ listing, profile, usage, generating, error, onGenerate }: Props) {
  const isBroker = profile.role === "mortgage_broker";
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [format, setFormat] = useState<PostFormat>("carousel");
  const [postType, setPostType] = useState<PostType>(listing.open_house ? "open_house" : "just_listed");
  const [language, setLanguage] = useState<Language>(profile.default_language);
  const [template, setTemplate] = useState<Design["template"]>("classic");
  const [aspect, setAspect] = useState<Aspect>(PLATFORM_SPECS.instagram.defaultAspect);
  const [textMode, setTextModeState] = useState<TextMode>(PLATFORM_SPECS.instagram.defaultTextMode);
  // Clean-photo posts usually end on a photo, not a text card.
  function setTextMode(m: TextMode) {
    setTextModeState(m);
    setContactSlide(m === "all" && profile.include_contact);
  }
  const aspects = PLATFORM_SPECS[platform].aspects;
  // Each platform has its own allowed sizes; reset to its default when switching.
  function choosePlatform(p: Platform) {
    setPlatform(p);
    setAspect(PLATFORM_SPECS[p].defaultAspect);
    setTextMode(PLATFORM_SPECS[p].defaultTextMode);
  }
  const [focus, setFocus] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [contactSlide, setContactSlide] = useState(profile.include_contact);
  const hasTour = !!listing.virtual_tour_url;
  const [includeTour, setIncludeTour] = useState(true);
  const [mortgage, setMortgage] = useState<MortgageInputs>({
    enabled: isBroker,
    price: 0, // 0 = use the listing price
    down_payment_percent: 20,
    rate_percent: 4.5,
    amortization_years: 25,
    cta: profile.default_language === "fr" ? "Obtenez votre préapprobation" : "Get pre-approved today",
  });

  const mortgagePrice = mortgage.price || listing.price || 0;
  const est = mortgagePrice > 0 ? estimateMortgage(mortgagePrice, mortgage.down_payment_percent, mortgage.rate_percent, mortgage.amortization_years) : null;
  const remaining = left(usage, "post");

  function submit() {
    onGenerate({
      platform,
      format,
      post_type: postType,
      language,
      template,
      aspect,
      text_mode: format === "single" && textMode === "cover" ? "all" : textMode,
      focus,
      notes,
      include_contact_slide: format === "carousel" && contactSlide,
      include_tour: hasTour && includeTour,
      mortgage: isBroker ? { ...mortgage, price: mortgagePrice } : null,
    });
  }

  return (
    <section className="card p-5">
      <h2 className="mb-4 text-lg font-semibold">Create a post</h2>
      {/* Options across the top */}
      <div className="flex flex-wrap gap-x-8 gap-y-4">
        <Chips label="Platform" value={platform} onChange={choosePlatform} options={{ instagram: "Instagram", facebook: "Facebook", linkedin: "LinkedIn" }} />
        <Chips label="Format" value={format} onChange={setFormat} options={{ single: "Single image", carousel: "Carousel" }} />
        {aspects.length > 1 && (
          <Chips label="Size" value={aspect} onChange={setAspect} options={Object.fromEntries(aspects.map((a) => [a, ASPECT_LABELS[a]])) as Record<Aspect, string>} />
        )}
        <Chips
          label="Text on photos"
          value={format === "single" && textMode === "cover" ? "all" : textMode}
          onChange={(v) => setTextMode(v as TextMode)}
          options={textModeOptions(format)}
        />
        <Chips label="Design" value={template} onChange={setTemplate} options={{ classic: "Classic", modern: "Modern", minimal: "Minimal" }} />
        <Chips label="Language" value={language} onChange={setLanguage} options={{ en: "English", fr: "Français (QC)", bilingual: "Bilingual" }} />
        <Chips label="Post type" value={postType} onChange={setPostType} options={POST_TYPES} />
      </div>

      {(format === "carousel" || hasTour) && (
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          {format === "carousel" && (
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={contactSlide} onChange={(e) => setContactSlide(e.target.checked)} />
              Add a contact slide at the end
            </label>
          )}
          {hasTour && (
            <label className="flex items-center gap-2 text-sm" title={platform === "instagram" ? "Instagram captions can't hold clickable links, so the post invites people to DM for the tour." : undefined}>
              <input type="checkbox" checked={includeTour} onChange={(e) => setIncludeTour(e.target.checked)} />
              Include virtual tour{platform === "instagram" ? " (as a “DM for the tour” invite)" : " link"}
            </label>
          )}
        </div>
      )}

      <div className="mt-4 space-y-4">
        {isBroker && (
          <div className="rounded-lg border border-border p-3">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" checked={mortgage.enabled} onChange={(e) => setMortgage({ ...mortgage, enabled: e.target.checked })} />
              Include a mortgage payment estimate
            </label>
            {mortgage.enabled && (
              <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-5">
                <label><span className="label">Price</span><input className="input" type="number" value={mortgagePrice || ""} onChange={(e) => setMortgage({ ...mortgage, price: Number(e.target.value) })} /></label>
                <label><span className="label">Down %</span><input className="input" type="number" min={5} max={100} step={0.5} value={mortgage.down_payment_percent} onChange={(e) => setMortgage({ ...mortgage, down_payment_percent: Number(e.target.value) })} /></label>
                <label><span className="label">Rate %</span><input className="input" type="number" min={0} step={0.01} value={mortgage.rate_percent} onChange={(e) => setMortgage({ ...mortgage, rate_percent: Number(e.target.value) })} /></label>
                <label><span className="label">Amortization</span>
                  <select className="input" value={mortgage.amortization_years} onChange={(e) => setMortgage({ ...mortgage, amortization_years: Number(e.target.value) })}>
                    {[15, 20, 25, 30].map((y) => <option key={y} value={y}>{y} years</option>)}
                  </select>
                </label>
                <label className="col-span-2 lg:col-span-1"><span className="label">Call to action</span><input className="input" value={mortgage.cta} onChange={(e) => setMortgage({ ...mortgage, cta: e.target.value })} /></label>
                {est && (
                  <div className="col-span-2 text-sm lg:col-span-5">
                    ≈ <strong>{formatCurrency(est.monthlyPayment)}</strong>/month
                    {est.insurance > 0 && <span className="text-muted"> (incl. {formatCurrency(est.insurance)} default insurance)</span>}
                    {est.belowMinimum && <div className="mt-1 text-red-700">Below the minimum down payment ({formatCurrency(est.minDownPayment)}).</div>}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Focus + agent notes at the bottom */}
        <div>
          <span className="label">Focus on (optional)</span>
          {listing.features.length > 0 ? (
            <>
              <FocusChips features={listing.features} selected={focus} onChange={setFocus} max={MAX_FOCUS} />
              <p className="mt-1.5 text-xs text-muted">
                {focus.length
                  ? `The post will lead with ${focus.length === 1 ? "this" : "these"}. Pick up to ${MAX_FOCUS}.`
                  : `Leave blank and Claude picks the strongest angle, or choose up to ${MAX_FOCUS}.`}
              </p>
            </>
          ) : (
            <p className="text-xs text-muted">Claude will pick the strongest angle from the listing.</p>
          )}
        </div>
        {showNotes || notes ? (
          <label className="block">
            <span className="label">Details Claude should know (optional)</span>
            <textarea
              className="input min-h-20"
              autoFocus={!notes}
              placeholder="Anything not in the listing? e.g. bathrooms renovated in 2024, open house Sat 2–4 pm, condo fees include heat and hydro"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>
        ) : (
          <button type="button" className="text-sm font-medium text-brand underline" onClick={() => setShowNotes(true)}>
            + Add details Claude should know
          </button>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-4">
        <button className="btn-primary h-11 px-8" onClick={submit} disabled={generating || listing.photos.length === 0 || remaining === 0}>
          {generating ? "Writing your post…" : "Generate post"}
        </button>
        <span className="text-sm text-muted">
          {listing.photos.length === 0
            ? "Add at least one photo to create a post."
            : usage.paid
            ? `${remaining} of ${usage.posts.limit} new posts left this month${usage.resetsAt ? `, resets ${new Date(usage.resetsAt).toLocaleDateString([], { month: "short", day: "numeric" })}` : ""}.`
            : usage.isGuest
            ? remaining > 0 ? "Free preview: generate 1 post." : "Preview used. Create a free account for 2 more."
            : <>{remaining} of {usage.posts.limit} free generations left. <Link href="/pricing" className="underline">See plans</Link></>}
        </span>
        {error && <span className="w-full text-sm text-red-700">{error}</span>}
      </div>
    </section>
  );
}
