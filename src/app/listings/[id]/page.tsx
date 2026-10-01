import { notFound, redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { usageFor } from "@/lib/plans";
import type { Listing, Post, Profile } from "@/lib/types";
import { ListingWorkspace } from "./ListingWorkspace";

export default async function ListingPage({ params }: PageProps<"/listings/[id]">) {
  const { id } = await params;
  const { supabase, user } = await getUser();
  if (!user) redirect("/");

  const [{ data: listing }, { data: profile }, { data: posts }, { data: entitlement }] = await Promise.all([
    supabase.from("listings").select("*").eq("id", id).maybeSingle<Listing>(),
    supabase.from("profiles").select("*").eq("id", user.id).single<Profile>(),
    supabase.from("posts").select("*").eq("listing_id", id).order("created_at", { ascending: false }).returns<Post[]>(),
    supabase.from("entitlements").select("plan, generations_used").eq("user_id", user.id).maybeSingle(),
  ]);
  if (!listing || !profile) notFound();

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 lg:w-[90%] lg:px-0">
      <ListingWorkspace
        key={listing.id}
        listing={listing}
        profile={profile}
        posts={posts ?? []}
        usage={usageFor(entitlement?.plan, entitlement?.generations_used ?? 0, !!user.is_anonymous)}
      />
    </div>
  );
}
