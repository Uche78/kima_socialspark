import { NextResponse, type NextRequest } from "next/server";
import { getUser } from "@/lib/supabase/server";
import { designForSheet, readSheetConfig, sheetPostSlides, type FeatureSheet } from "@/lib/feature-sheet";
import type { Profile } from "@/lib/types";

/**
 * Starts a post from a sheet: a free draft (no caption yet) that opens in the post page, where the broker
 * picks where it goes and writes the caption. Writing the caption is what uses a post.
 */
export async function POST(_req: NextRequest, ctx: RouteContext<"/api/sheets/[id]/post">) {
  const { id } = await ctx.params;
  const { supabase, user } = await getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const [{ data: sheet }, { data: profile }] = await Promise.all([
    supabase.from("feature_sheets").select("*").eq("id", id).maybeSingle<FeatureSheet>(),
    supabase.from("profiles").select("*").eq("id", user.id).single<Profile>(),
  ]);
  if (!sheet || !profile) return NextResponse.json({ error: "Sheet not found." }, { status: 404 });

  const config = readSheetConfig(sheet.config);
  const { data, error } = await supabase
    .from("posts")
    .insert({
      user_id: user.id,
      listing_id: sheet.listing_id,
      sheet_id: sheet.id,
      platform: "instagram",
      format: "single",
      post_type: "feature_sheet",
      language: sheet.language,
      caption: "",
      hashtags: [],
      focus: [],
      focused_on: [],
      slides: sheetPostSlides("single", sheet.headline, sheet.photo_index, sheet.language),
      design: { ...designForSheet(profile, config), aspect: "portrait" },
    })
    .select("id")
    .single();
  if (error || !data) return NextResponse.json({ error: error?.message ?? "Couldn't start the post." }, { status: 500 });
  return NextResponse.json({ id: data.id });
}
