import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { publishPost } from "@/lib/publish";
import type { Post } from "@/lib/types";

export const maxDuration = 60;

// Called every few minutes by the Netlify scheduled function.
export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  // Claiming via a conditional update means overlapping runs can't double-publish.
  const { data: due, error } = await admin
    .from("posts")
    .update({ status: "publishing" })
    .eq("status", "scheduled")
    .lte("scheduled_at", new Date().toISOString())
    .select("*")
    .returns<Post[]>();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const results = await Promise.all((due ?? []).map((p) => publishPost(admin, p)));
  return NextResponse.json({ processed: results.length, failed: results.filter((r) => !r.ok).length });
}
