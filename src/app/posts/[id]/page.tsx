import { notFound, redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import type { Listing, Post, Profile, SocialAccount } from "@/lib/types";
import { PostEditor } from "./PostEditor";

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

  return <PostEditor initialPost={post} listing={listing} profile={profile} accounts={accounts ?? []} isGuest={!!user.is_anonymous} />;
}
