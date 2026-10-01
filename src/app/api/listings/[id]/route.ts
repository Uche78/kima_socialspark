import { NextResponse, type NextRequest } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getUser } from "@/lib/supabase/server";

async function listFiles(supabase: SupabaseClient, prefix: string): Promise<string[]> {
  const { data } = await supabase.storage.from("media").list(prefix, { limit: 1000 });
  return (data ?? []).filter((f) => f.id).map((f) => `${prefix}/${f.name}`);
}

// Deletes a listing, its posts (via FK cascade), and every stored file for them.
export async function DELETE(_req: NextRequest, ctx: RouteContext<"/api/listings/[id]">) {
  const { id } = await ctx.params;
  const { supabase, user } = await getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { data: listing } = await supabase.from("listings").select("id").eq("id", id).maybeSingle();
  if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

  const { data: posts } = await supabase.from("posts").select("id").eq("listing_id", id);
  const prefixes = [`${user.id}/listings/${id}`, ...(posts ?? []).map((p) => `${user.id}/posts/${p.id}`)];
  const files = (await Promise.all(prefixes.map((p) => listFiles(supabase, p)))).flat();
  if (files.length) await supabase.storage.from("media").remove(files);

  const { error } = await supabase.from("listings").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, filesRemoved: files.length });
}
