// Made-up agent, listings and posts for the home page showcase. Photos are CC0 stock
// (public/hero/CREDITS.md). Slides render with the real SlideCanvas, so they always match the app.

import type { Design, Listing, Platform, PostType, Profile, Slide, TextMode } from "@/lib/types";

export const DEMO_AGENT = {
  name: "Jordan Lee",
  handle: "jordanlee.realtor",
  title: "REALTOR®",
  brokerage: "Northline Realty",
  initials: "JL",
};

export const demoProfile: Profile = {
  id: "demo",
  role: "realtor",
  full_name: DEMO_AGENT.name,
  title: DEMO_AGENT.title,
  brokerage_name: DEMO_AGENT.brokerage,
  license_number: null,
  phone: "416-555-0142",
  email: "jordan@northlinerealty.ca",
  website: null,
  logo_path: null,
  headshot_path: null,
  brand_primary: "#0f2a44",
  brand_secondary: "#ffffff",
  brand_accent: "#d4a24c",
  default_language: "en",
  tone_preset: "warm",
  tone_notes: null,
  writing_samples: [],
  include_logo: false,
  include_headshot: false,
  include_contact: true,
};

const photo = (name: string) => ({ path: `hero/${name}.webp`, url: `/hero/${name}.webp`, width: 1600, height: 1067 });

function listing(id: string, fields: Partial<Listing>, photos: string[]): Listing {
  return {
    id,
    user_id: "demo",
    source_url: null,
    source_site: null,
    extraction_status: "complete",
    extraction_notes: null,
    address: null,
    city: null,
    province: "ON",
    postal_code: null,
    price: null,
    transaction_type: "sale",
    property_type: null,
    bedrooms: null,
    bathrooms: null,
    square_feet: null,
    lot_size: null,
    year_built: null,
    mls_number: null,
    description: null,
    features: [],
    listing_brokerage: DEMO_AGENT.brokerage,
    open_house: null,
    virtual_tour_url: null,
    photos: photos.map(photo),
    created_at: "",
    ...fields,
  };
}

const oakridge = listing(
  "oakridge",
  { address: "48 Oakridge Drive", city: "Oakville", price: 2_349_000, property_type: "Detached", bedrooms: 5, bathrooms: 4.5, square_feet: 3850 },
  ["pool-house", "kitchen", "ensuite"],
);
const harbour = listing(
  "harbour",
  { address: "1205 – 88 Harbour Street", city: "Toronto", price: 899_000, property_type: "Condo", bedrooms: 2, bathrooms: 2, square_feet: 940 },
  ["living-room", "dining-room", "soaker-tub"],
);
const maple = listing(
  "maple",
  { address: "17 Maple Lane", city: "Stouffville", price: 1_189_000, property_type: "Detached", bedrooms: 4, bathrooms: 3, square_feet: 2400, open_house: "Sat & Sun, 2–4 PM" },
  ["porch-house", "bedroom"],
);
const laurier = listing(
  "laurier",
  { address: "302 Laurier Avenue", city: "Ottawa", price: 1_025_000, property_type: "Townhouse", bedrooms: 3, bathrooms: 2.5, square_feet: 1900 },
  ["modern-exterior", "living-room"],
);

export type DemoPost = {
  id: string;
  platform: Platform;
  listing: Listing;
  postType: PostType;
  template: Design["template"];
  aspect: "portrait" | "square";
  textMode: TextMode;
  slide: Slide;
  /** First line or two of the caption, as the feed shows it. */
  caption: string;
  /** Carousel dot count (1 = single image). */
  slides: number;
  likes: number;
  comments: number;
};

export const DEMO_POSTS: DemoPost[] = [
  {
    id: "ig-oakridge",
    platform: "instagram",
    listing: oakridge,
    postType: "just_listed",
    template: "classic",
    aspect: "portrait",
    textMode: "all",
    slide: { kind: "cover", headline: "Resort-Style Backyard", subtext: "Heated saltwater pool, steps from the lake", photo_index: 0 },
    caption: "Saturday mornings by a heated saltwater pool, ten minutes from the lake. 🌊",
    slides: 8,
    likes: 214,
    comments: 31,
  },
  {
    id: "fb-maple",
    platform: "facebook",
    listing: maple,
    postType: "open_house",
    template: "modern",
    aspect: "square",
    textMode: "all",
    slide: { kind: "cover", headline: "Wraparound Porch", subtext: "Open house this weekend, 2–4 PM", photo_index: 0 },
    caption: "Come see the wraparound porch everyone on Maple Lane talks about. Open house Saturday and Sunday, 2–4 PM.",
    slides: 1,
    likes: 86,
    comments: 12,
  },
  {
    id: "li-harbour",
    platform: "linkedin",
    listing: harbour,
    postType: "featured",
    template: "minimal",
    aspect: "square",
    textMode: "all",
    slide: { kind: "cover", headline: "Light From Two Sides", subtext: "Corner suite with lake views", photo_index: 0 },
    caption: "Relocating to Toronto's waterfront? This corner suite puts the PATH, Union Station and the lake within a short walk.",
    slides: 6,
    likes: 58,
    comments: 7,
  },
  {
    id: "ig-harbour",
    platform: "instagram",
    listing: harbour,
    postType: "price_reduced",
    template: "modern",
    aspect: "portrait",
    textMode: "cover",
    slide: { kind: "cover", headline: "Lake Views, New Price", subtext: "Two beds, two baths, 940 sq ft", photo_index: 1 },
    caption: "Same lake views, better number. Swipe through the kitchen →",
    slides: 10,
    likes: 172,
    comments: 24,
  },
  {
    id: "fb-oakridge",
    platform: "facebook",
    listing: oakridge,
    postType: "just_listed",
    template: "classic",
    aspect: "square",
    textMode: "none",
    slide: { kind: "cover", headline: "", subtext: "", photo_index: 1 },
    caption: "Just listed in Oakville: 5 beds, 4.5 baths and a chef's kitchen made for hosting. $2,349,000. Message me for a private showing.",
    slides: 20,
    likes: 133,
    comments: 19,
  },
  {
    id: "ig-maple",
    platform: "instagram",
    listing: maple,
    postType: "sold",
    template: "minimal",
    aspect: "portrait",
    textMode: "all",
    slide: { kind: "cover", headline: "Sold in 6 Days", subtext: "Another happy family on Maple Lane", photo_index: 1 },
    caption: "Thinking of selling in Stouffville? Let's talk about what your home could get.",
    slides: 1,
    likes: 309,
    comments: 47,
  },
  {
    id: "li-laurier",
    platform: "linkedin",
    listing: laurier,
    postType: "coming_soon",
    template: "classic",
    aspect: "square",
    textMode: "all",
    slide: { kind: "cover", headline: "Coming Soon to Centretown", subtext: "Three-storey modern townhouse", photo_index: 0 },
    caption: "A first look for my network before this Centretown townhouse hits the market. Know someone moving to Ottawa?",
    slides: 7,
    likes: 41,
    comments: 5,
  },
];

export function demoDesign(p: DemoPost): Design {
  return {
    template: p.template,
    aspect: p.aspect,
    text_mode: p.textMode,
    primary: demoProfile.brand_primary,
    secondary: demoProfile.brand_secondary,
    accent: demoProfile.brand_accent,
    show_logo: false,
    show_headshot: false,
    show_contact: true,
    show_brokerage: true,
    show_price: true,
  };
}

/** One listing, written three ways: for the "Built for Canadian real estate" section. */
export const SAME_LISTING_POSTS: DemoPost[] = [
  {
    ...DEMO_POSTS.find((p) => p.id === "ig-oakridge")!,
    id: "same-ig",
    caption:
      "Saturday mornings by a heated saltwater pool, ten minutes from the lake. 🌊 Swipe through the chef's kitchen and the spa-style ensuite → DM 'TOUR' and I'll send you the full walkthrough.",
  },
  {
    ...DEMO_POSTS.find((p) => p.id === "fb-oakridge")!,
    id: "same-fb",
    caption:
      "Just listed in Oakville: 5 bedrooms, 4.5 baths and a chef's kitchen made for hosting, on a quiet street ten minutes from the lake. $2,349,000. Message me to book a private showing this week.",
  },
  {
    id: "same-li",
    platform: "linkedin",
    listing: DEMO_POSTS.find((p) => p.id === "ig-oakridge")!.listing,
    postType: "just_listed",
    template: "minimal",
    aspect: "square",
    textMode: "all",
    slide: { kind: "cover", headline: "Room to Grow in Oakville", subtext: "Five bedrooms, ten minutes from the lake", photo_index: 2 },
    caption:
      "Families relocating to the GTA keep asking for room to grow near the lake. This new Oakville listing has five bedrooms and a resort-style backyard, ten minutes from the water. Know someone making the move? I'd be glad to help.",
    slides: 8,
    likes: 64,
    comments: 9,
  },
];
