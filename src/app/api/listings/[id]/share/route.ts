import { NextResponse, type NextRequest } from "next/server";
import { getUser } from "@/lib/supabase/server";
import { isValidEmail, normalizeEmail } from "@/lib/contact-format";
import { esc, sendEmail } from "@/lib/email";
import { formatCurrency } from "@/lib/mortgage";
import { createShareToken, SHARE_DAYS } from "@/lib/share-token";
import { SITE_URL } from "@/lib/site";
import type { Listing, Profile } from "@/lib/types";

/** A realtor sends one of their listings to a mortgage broker, who can add it to SocialSpark to make a feature sheet. */
export async function POST(req: NextRequest, ctx: RouteContext<"/api/listings/[id]/share">) {
  const { id } = await ctx.params;
  const { supabase, user } = await getUser();
  if (!user || user.is_anonymous) return NextResponse.json({ error: "Create a free account to share listings." }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as { email?: string; note?: string };
  const email = normalizeEmail(String(body.email ?? ""));
  if (!email || !isValidEmail(email)) return NextResponse.json({ error: "Enter your broker's email address." }, { status: 400 });
  if (email === user.email?.toLowerCase()) return NextResponse.json({ error: "That's your own email. Enter your mortgage broker's." }, { status: 400 });
  const note = String(body.note ?? "").trim().slice(0, 500);

  const [{ data: listing }, { data: profile }] = await Promise.all([
    supabase.from("listings").select("*").eq("id", id).maybeSingle<Listing>(),
    supabase.from("profiles").select("*").eq("id", user.id).single<Profile>(),
  ]);
  if (!listing || !profile) return NextResponse.json({ error: "Listing not found." }, { status: 404 });

  const link = `${SITE_URL}/shared/${createShareToken({ listingId: listing.id, fromUser: user.id, toEmail: email })}`;
  const sender = profile.full_name || user.email || "A realtor";
  const where = [listing.address, listing.city].filter(Boolean).join(", ") || "a listing";
  const price = listing.price != null ? formatCurrency(listing.price) : null;
  const photo = listing.photos[0]?.url;

  const html = `<div style="font-family:Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#16202b">
  <p style="font-size:16px">${esc(sender)}${profile.brokerage_name ? ` (${esc(profile.brokerage_name)})` : ""} shared a listing with you on SocialSpark so you can create a mortgage feature sheet for it.</p>
  ${note ? `<blockquote style="margin:16px 0;padding:12px 16px;background:#f6f5f1;border-left:4px solid #d4a24c;font-size:15px">${esc(note).replace(/\n/g, "<br>")}</blockquote>` : ""}
  ${photo ? `<img src="${esc(photo)}" alt="" width="560" style="width:100%;max-width:560px;border-radius:12px;display:block">` : ""}
  <p style="font-size:18px;font-weight:bold;margin:16px 0 4px">${esc(where)}</p>
  ${price ? `<p style="font-size:16px;margin:0 0 20px;color:#5b6673">${esc(price)}</p>` : ""}
  <a href="${link}" style="display:inline-block;background:#141414;color:#fff;text-decoration:none;padding:14px 24px;border-radius:999px;font-weight:bold">Create a feature sheet</a>
  <p style="font-size:13px;color:#5b6673;margin-top:24px">The link works for ${SHARE_DAYS} days. SocialSpark turns listings into branded social posts and mortgage feature sheets for Canadian realtors and brokers.</p>
</div>`;
  const text = `${sender} shared a listing with you on SocialSpark: ${where}${price ? `, ${price}` : ""}.\n${note ? `\n"${note}"\n` : ""}\nCreate a feature sheet: ${link}\n\nThe link works for ${SHARE_DAYS} days.`;

  try {
    await sendEmail({ to: email, subject: `${sender} shared ${where} with you`, html, text, replyTo: profile.email || user.email });
  } catch (e) {
    console.error("share email", e);
    return NextResponse.json({ error: "Couldn't send the email. Please try again." }, { status: 502 });
  }

  // Remember the send for the listing card ("Sent to Priya · Oct 22"), named after the saved partner if there is one.
  const { data: partner } = await supabase.from("partner_realtors").select("full_name").eq("kind", "broker").ilike("email", email.replace(/[%_\\]/g, "\\$&")).limit(1).maybeSingle<{ full_name: string }>();
  const { data: share } = await supabase
    .from("listing_shares")
    .insert({ user_id: user.id, listing_id: listing.id, to_email: email, to_name: partner?.full_name ?? null })
    .select("to_email, to_name, created_at")
    .single();
  return NextResponse.json({ ok: true, share });
}
