import { notFound, redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import type { Listing, Post, Profile, SocialAccount } from "@/lib/types";
import { PARTNER_COLUMNS, type PartnerRealtor } from "@/lib/broker";
import type { FeatureSheet } from "@/lib/feature-sheet";
import { remaining, usageFrom, type EntitlementRow } from "@/lib/plans";
import { PostEditor } from "./PostEditor";

// Private or utility page: keep it out of search results.
export const metadata = { title: "Post", robots: { index: false, follow: false } };

export default async function PostPage({ params }: PageProps<"/posts/[id]">) {
  const { id } = await params;
  const { supabase, user } = await getUser();
  if (!user) redirect("/");

  const { data: post } = await supabase.from("posts").select("*").eq("id", id).maybeSingle<Post>();
  if (!post) notFound();

  const [{ data: listing }, { data: profile }, { data: accounts }] = await Promise.all([
    supabase.from("listings").select("*").eq("id", post.listing_id).single<Listing>(),
    supabase.from("profiles").select("*").eq("id", user.id).single<Profile>(),
    supabase.from("social_accounts").select("id, platform, external_id, account_name, account_type, avatar_url").returns<SocialAccount[]>(),
  ]);
  if (!listing || !profile) notFound();

  const [{ data: sheetRow }, { data: entitlement }] = post.sheet_id
    ? await Promise.all([
        supabase.from("feature_sheets").select("*").eq("id", post.sheet_id).maybeSingle<FeatureSheet>(),
        supabase.from("entitlements").select("*").eq("user_id", user.id).maybeSingle<EntitlementRow>(),
      ])
    : [{ data: null }, { data: null }];
  const usage = usageFrom(entitlement, !!user.is_anonymous);
  const left = remaining(usage, post.caption?.trim() ? "regen" : "post");

  const { data: realtors } =
    post.post_type === "feature_sheet"
      ? await supabase.from("partner_realtors").select(PARTNER_COLUMNS).eq("kind", "realtor").order("full_name").returns<PartnerRealtor[]>()
      : { data: [] as PartnerRealtor[] };

  return <PostEditor initialPost={post} listing={listing} profile={profile} accounts={accounts ?? []} isGuest={!!user.is_anonymous} realtors={realtors ?? []} sheetRow={sheetRow ?? null} remaining={left} />;
}
