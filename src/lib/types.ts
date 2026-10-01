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
};

export type SocialAccount = {
  id: string;
  platform: Platform;
  external_id: string;
  account_name: string;
  account_type: string | null;
  avatar_url: string | null;
};

export type Aspect = "portrait" | "square";
export type Size = { w: number; h: number };

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
    maxSlides: 10,
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
    maxSlides: 10,
    captionLimit: 5000,
    hashtagTarget: "0-3 hashtags",
  },
  linkedin: {
    label: "LinkedIn",
    sizes: { portrait: { w: 1080, h: 1350 }, square: { w: 1200, h: 1200 } },
    aspects: ["square", "portrait"],
    defaultAspect: "square",
    legacyAspect: { single: "square", carousel: "square" },
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

export const PROVINCES = ["AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT"];
