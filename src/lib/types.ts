export type Platform = "instagram" | "facebook" | "linkedin";
export type PostFormat = "single" | "carousel";
export type Language = "en" | "fr" | "bilingual";
export type Role = "realtor" | "mortgage_broker";
export type PostStatus = "draft" | "scheduled" | "publishing" | "published" | "failed";

export const POST_TYPES = {
  just_listed: "Just Listed",
  open_house: "Open House",
  price_reduced: "Price Reduced",
  coming_soon: "Coming Soon",
  sold: "Sold",
  featured: "Featured Property",
} as const;
export type PostType = keyof typeof POST_TYPES;

export const TONE_PRESETS = {
  professional: "Professional and polished",
  warm: "Warm and personable",
  luxury: "Elegant, luxury-focused",
  energetic: "Upbeat and energetic",
  casual: "Casual and conversational",
  concise: "Short, punchy, to the point",
} as const;

export type Photo = { path: string; url: string; source_url?: string; width?: number; height?: number };

export type Listing = {
  id: string;
  user_id: string;
  source_url: string | null;
  source_site: string | null;
  extraction_status: "complete" | "partial" | "manual";
  extraction_notes: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  price: number | null;
  transaction_type: "sale" | "rent";
  property_type: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  square_feet: number | null;
  lot_size: string | null;
  year_built: number | null;
  mls_number: string | null;
  description: string | null;
  features: string[];
  listing_brokerage: string | null;
  open_house: string | null;
  /** 3D or video tour link (Matterport, iGUIDE, YouTube…). */
  virtual_tour_url: string | null;
  photos: Photo[];
  created_at: string;
};

export type Profile = {
  id: string;
  role: Role;
  full_name: string | null;
  title: string | null;
  brokerage_name: string | null;
  license_number: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo_path: string | null;
  headshot_path: string | null;
  brand_primary: string;
  brand_secondary: string;
  brand_accent: string;
  default_language: Language;
  tone_preset: keyof typeof TONE_PRESETS | string;
  tone_notes: string | null;
  writing_samples: string[];
  include_logo: boolean;
  include_headshot: boolean;
  include_contact: boolean;
};

export type Slide = {
  /** Stable id for reordering in the editor (older posts get one on load). */
  id?: string;
  kind: "cover" | "photo" | "details" | "mortgage" | "contact";
  headline: string;
  subtext: string;
  photo_index: number | null;
};

export type Design = {
  template: "classic" | "modern" | "minimal";
  /** Image shape; optional because older posts predate the choice (see aspectOf). */
  aspect?: Aspect;
  /** Which slides get text overlays; optional for older posts (see textModeOf). */
  text_mode?: TextMode;
  primary: string;
  secondary: string;
  accent: string;
  show_logo: boolean;
  show_headshot: boolean;
  show_contact: boolean;
  show_brokerage: boolean;
  show_price: boolean;
};

export type MortgageInputs = {
  enabled: boolean;
  price: number;
  down_payment_percent: number;
  rate_percent: number;
  amortization_years: number;
  cta: string;
};

export type Post = {
  id: string;
  user_id: string;
  listing_id: string;
  platform: Platform;
  format: PostFormat;
  post_type: PostType;
  language: Language;
  /** Agent's free-text notes: facts not in the listing. */
  highlights: string | null;
  /** Features the user asked the post to lead with. */
  focus: string[];
  /** Selling points Claude actually led with. */
  focused_on: string[];
  caption: string;
  hashtags: string[];
  slides: Slide[];
  design: Design;
  mortgage: MortgageInputs | null;
  status: PostStatus;
  social_account_id: string | null;
  scheduled_at: string | null;
  published_at: string | null;
  external_post_id: string | null;
  external_url: string | null;
  error: string | null;
  image_paths: string[];
  created_at: string;
  updated_at?: string;
};

export type SocialAccount = {
  id: string;
  platform: Platform;
  external_id: string;
  account_name: string;
  account_type: string | null;
  avatar_url: string | null;
  /** When the connection's token expires (LinkedIn ~60 days); null = doesn't expire. Server-filled. */
  expires_at?: string | null;
};

export type Aspect = "portrait" | "square";
export type Size = { w: number; h: number };

/** Text overlays: on every slide, only the cover, or none (clean listing photos). */
export type TextMode = "all" | "cover" | "none";

export const TEXT_MODE_LABELS: Record<TextMode, string> = { all: "All slides", cover: "Cover only", none: "None (clean photos)" };

export const ASPECT_LABELS: Record<Aspect, string> = { square: "Square (1:1)", portrait: "Portrait (4:5)" };

/**
 * Output sizes per platform's recommended feed dimensions.
 * Facebook and LinkedIn default to square: portrait images get colour-filled side
 * bars in Facebook's desktop feed. Instagram displays 4:5 cleanly, so it stays portrait.
 */
export const PLATFORM_SPECS: Record<
  Platform,
  {
    label: string;
    sizes: Record<Aspect, Size>;
    aspects: Aspect[];
    defaultAspect: Aspect;
    /** Size used by posts created before the aspect choice existed. */
    legacyAspect: Record<PostFormat, Aspect>;
    /** Default text overlays for new posts. */
    defaultTextMode: TextMode;
    maxSlides: number;
    captionLimit: number;
    hashtagTarget: string;
  }
> = {
  instagram: {
    label: "Instagram",
    sizes: { portrait: { w: 1080, h: 1350 }, square: { w: 1080, h: 1080 } },
    aspects: ["portrait"],
    defaultAspect: "portrait",
    legacyAspect: { single: "portrait", carousel: "portrait" },
    defaultTextMode: "all",
    maxSlides: 10, // Instagram's own carousel limit
    captionLimit: 2200,
    hashtagTarget: "5-10 targeted hashtags",
  },
  facebook: {
    label: "Facebook",
    sizes: { portrait: { w: 1080, h: 1350 }, square: { w: 1080, h: 1080 } },
    aspects: ["square", "portrait"],
    defaultAspect: "square",
    // Older Facebook posts also render square: portrait gets colour bars on desktop.
    // Images are re-rendered on every publish, so this never changes a live post.
    legacyAspect: { single: "square", carousel: "square" },
    // Facebook shows the Page name above every post, so clean listing photos are the norm.
    defaultTextMode: "none",
    maxSlides: 20, // photo-album posts; Facebook shows them as a grid
    captionLimit: 5000,
    hashtagTarget: "0-3 hashtags",
  },
  linkedin: {
    label: "LinkedIn",
    sizes: { portrait: { w: 1080, h: 1350 }, square: { w: 1200, h: 1200 } },
    aspects: ["square", "portrait"],
    defaultAspect: "square",
    legacyAspect: { single: "square", carousel: "square" },
    defaultTextMode: "all",
    maxSlides: 9,
    captionLimit: 3000,
    hashtagTarget: "3-5 professional hashtags",
  },
};

/** The aspect a post renders at (falls back to the pre-choice default for older posts). */
export function aspectOf(post: { platform: Platform; format: PostFormat; design: { aspect?: Aspect } }): Aspect {
  const spec = PLATFORM_SPECS[post.platform];
  const a = post.design?.aspect;
  return a && spec.aspects.includes(a) ? a : spec.legacyAspect[post.format];
}

/** Text overlays a post renders with (older posts had text on every slide). */
export function textModeOf(post: { design: { text_mode?: TextMode } }): TextMode {
  return post.design?.text_mode ?? "all";
}

/** Whether a given slide shows text overlays under the post's text mode. */
export function slideHasText(mode: TextMode, slide: { kind: string }, index: number): boolean {
  if (slide.kind === "details" || slide.kind === "mortgage" || slide.kind === "contact") return true; // info cards are text by nature
  return mode === "all" || (mode === "cover" && index === 0);
}

export const PROVINCES = ["AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT"];

/** Text-on-photos choices that make sense for a format (single images have no "cover only"). */
export function textModeOptions(format: PostFormat): Record<string, string> {
  return format === "single"
    ? { all: "Text on photo", none: "Clean photo" }
    : { all: TEXT_MODE_LABELS.all, cover: TEXT_MODE_LABELS.cover, none: TEXT_MODE_LABELS.none };
}

/** A post left on "publishing" this long was almost certainly interrupted (see the publish route). */
export const STUCK_AFTER_MS = 5 * 60 * 1000;

export function isStuck(post: { status: PostStatus; updated_at?: string | null }, now = Date.now()) {
  return post.status === "publishing" && !!post.updated_at && now - new Date(post.updated_at).getTime() > STUCK_AFTER_MS;
}

/** The status label shown to users ("stuck, retry" for interrupted publishes). */
export function statusLabel(post: { status: PostStatus; updated_at?: string | null }) {
  return isStuck(post) ? "stuck, retry" : post.status;
}
