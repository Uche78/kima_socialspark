import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient, getUser } from "@/lib/supabase/server";
import { isValidEmail, normalizeEmail } from "@/lib/contact-format";
import { PROVINCES } from "@/lib/broker";
import { esc, sendEmail } from "@/lib/email";
import { SALES_EMAIL } from "@/lib/site";
import { TEAM_AUDIENCES as AUDIENCES, TEAM_SIZES } from "@/lib/team";

/** A team or brokerage asking about a team plan: saved, then emailed to sales. Open to anyone (signed in or not). */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const str = (k: string, max: number) => String(body[k] ?? "").trim().slice(0, max);
  // Bots fill every field, including this one, which people never see.
  if (str("website", 200)) return NextResponse.json({ ok: true });

  const name = str("name", 120);
  const email = normalizeEmail(str("email", 200));
  const company = str("company", 160);
  const agents = str("agents", 20);
  const audience = str("audience", 30) as keyof typeof AUDIENCES;
  const province = str("province", 2);
  const message = str("message", 2000);
  if (!name || !company) return NextResponse.json({ error: "Add your name and your team or brokerage." }, { status: 400 });
  if (!isValidEmail(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  if (!(TEAM_SIZES as readonly string[]).includes(agents) || !(audience in AUDIENCES)) return NextResponse.json({ error: "Choose your team size and who's on it." }, { status: 400 });

  const admin = createAdminClient();
  const ip = req.headers.get("x-nf-client-connection-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  // At most 3 enquiries an hour from one address.
  if (ip) {
    const { count } = await admin.from("team_enquiries").select("id", { count: "exact", head: true }).eq("ip", ip).gte("created_at", new Date(Date.now() - 3_600_000).toISOString());
    if ((count ?? 0) >= 3) return NextResponse.json({ error: "Thanks, we've got your enquiry. We'll be in touch soon." }, { status: 429 });
  }

  const { user } = await getUser();
  const { error } = await admin.from("team_enquiries").insert({
    user_id: user && !user.is_anonymous ? user.id : null,
    name,
    email,
    company,
    agents,
    audience,
    province: province in PROVINCES ? province : null,
    message: message || null,
    ip,
  });
  if (error) {
    console.error("team enquiry", error.message);
    return NextResponse.json({ error: "Couldn't send that. Please try again, or email us." }, { status: 500 });
  }

  const where = province in PROVINCES ? PROVINCES[province as keyof typeof PROVINCES] : "Not given";
  const rows: [string, string][] = [
    ["Name", name],
    ["Email", email],
    ["Team or brokerage", company],
    ["Agents", agents],
    ["Who", AUDIENCES[audience]],
    ["Province", where],
  ];
  try {
    await sendEmail({
      to: SALES_EMAIL,
      replyTo: email,
      subject: `Team plan enquiry: ${company} (${agents} agents)`,
      html: `<div style="font-family:Helvetica,Arial,sans-serif;color:#16202b"><p style="font-size:16px">New Team plan enquiry from the pricing section.</p><table style="border-collapse:collapse;font-size:15px">${rows
        .map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#5b6673">${k}</td><td style="padding:4px 0"><strong>${esc(v)}</strong></td></tr>`)
        .join("")}</table>${message ? `<p style="margin-top:16px;padding:12px 16px;background:#f6f5f1;border-left:4px solid #d4a24c">${esc(message).replace(/\n/g, "<br>")}</p>` : ""}<p style="font-size:13px;color:#5b6673">Reply to this email to answer them directly.</p></div>`,
      text: `New Team plan enquiry\n\n${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}${message ? `\n\n${message}` : ""}`,
    });
  } catch (e) {
    // Saved already, so the lead isn't lost; the email can be resent from the table.
    console.error("team enquiry email", e);
  }
  return NextResponse.json({ ok: true });
}
