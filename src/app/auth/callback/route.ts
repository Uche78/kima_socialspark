import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

/** Only allow same-site paths ("/x"), never protocol-relative ("//evil.com") or absolute URLs. */
function safeNext(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\") ? value : "/";
}

// Handles magic-link sign-in and guest-to-account email confirmation.
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const next = safeNext(params.get("next"));
  const supabase = await createClient();

  const code = params.get("code");
  const tokenHash = params.get("token_hash");
  const type = params.get("type") as EmailOtpType | null;

  let ok = false;
  if (code) ok = !(await supabase.auth.exchangeCodeForSession(code)).error;
  else if (tokenHash && type) ok = !(await supabase.auth.verifyOtp({ token_hash: tokenHash, type })).error;

  // Sign-in links work once. If this one was already used (opened twice, or pre-opened by the
  // browser or email app) but the person is signed in with a real account, carry on into the app.
  if (!ok) {
    const { data } = await supabase.auth.getUser();
    ok = !!data.user && !data.user.is_anonymous;
  }

  // New accounts choose Realtor or Mortgage broker first; /welcome passes everyone else straight on.
  const role = params.get("role") === "mortgage_broker" ? "&role=mortgage_broker" : "";
  return NextResponse.redirect(new URL(ok ? `/welcome?next=${encodeURIComponent(next)}${role}` : "/login?error=link_expired", request.url));
}
