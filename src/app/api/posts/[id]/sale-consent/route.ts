import { NextResponse, type NextRequest } from "next/server";
import { getUser } from "@/lib/supabase/server";
import { confirmedNow, needsSaleConsent, readConsentRequest } from "@/lib/sale-consent";
import type { Post } from "@/lib/types";

/**
 * Records that the user has written consent to advertise this Sold post (for posts made before the app
 * asked). The time is set here, not by the browser. Ownership is enforced by the posts RLS policy.
 */
export async function POST(req: NextRequest, ctx: RouteContext<"/api/posts/[id]/sale-consent">) {
  const { id } = await ctx.params;
  const { supabase, user } = await getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const requested = readConsentRequest(await req.json().catch(() => null));
  if (!requested) return NextResponse.json({ error: "Tick the box to confirm you have written consent." }, { status: 400 });

  const { data: post } = await supabase.from("posts").select("post_type, status, design").eq("id", id).maybeSingle<Pick<Post, "post_type" | "status" | "design">>();
  if (!post) return NextResponse.json({ error: "Post not found." }, { status: 404 });
  if (!needsSaleConsent(post.post_type)) return NextResponse.json({ error: "Only Sold posts need this." }, { status: 400 });
  if (post.status === "published" || post.status === "publishing") return NextResponse.json({ error: "This post is already published." }, { status: 409 });

  const sale_consent = confirmedNow(requested.covers_price);
  // Without price consent the price comes off the design. A scheduled post's saved images still show it,
  // so it goes back to draft to be saved (re-rendered) and scheduled again.
  const hidePrice = !requested.covers_price && post.design.show_price;
  const unscheduled = hidePrice && post.status === "scheduled";
  const update = {
    sale_consent,
    ...(hidePrice ? { design: { ...post.design, show_price: false } } : {}),
    ...(unscheduled ? { status: "draft" as const, scheduled_at: null } : {}),
  };
  const { error } = await supabase.from("posts").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, sale_consent, price_hidden: hidePrice, unscheduled });
}
