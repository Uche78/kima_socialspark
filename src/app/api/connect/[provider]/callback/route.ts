import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient, getUser } from "@/lib/supabase/server";
import { PROVIDERS, redirectUri, siteUrl, verifyState, type Provider } from "@/lib/oauth";
import { metaExchangeCode } from "@/lib/publish/meta";
import { linkedinExchangeCode } from "@/lib/publish/linkedin";

type NewAccount = {
  platform: "facebook" | "instagram" | "linkedin";
  external_id: string;
  account_name: string;
  account_type: string;
  avatar_url: string | null;
  access_token: string;
  refresh_token?: string | null;
  expires_at?: string | null;
};

export async function GET(req: NextRequest, ctx: RouteContext<"/api/connect/[provider]/callback">) {
  const { provider } = await ctx.params;
  const back = (q: string) => NextResponse.redirect(`${siteUrl()}/settings?${q}#accounts`);
  if (!PROVIDERS.includes(provider as Provider)) return back("connect_error=unknown_provider");

  const { user } = await getUser();
  if (!user || user.is_anonymous) return NextResponse.redirect(`${siteUrl()}/login`);

  const params = req.nextUrl.searchParams;
  if (!(await verifyState(provider as Provider, params.get("state")))) return back("connect_error=state_mismatch");
  const code = params.get("code");
  if (!code) return back(`connect_error=${encodeURIComponent(params.get("error_description") ?? "cancelled")}`);

  let accounts: NewAccount[];
  try {
    if (provider === "meta") {
      accounts = await metaExchangeCode(code, redirectUri("meta"));
    } else {
      const li = await linkedinExchangeCode(code, redirectUri("linkedin"));
      accounts = [{ platform: "linkedin", account_type: "member", ...li }];
    }
  } catch (e) {
    return back(`connect_error=${encodeURIComponent(e instanceof Error ? e.message : "connection_failed")}`);
  }
  if (!accounts.length) return back("connect_error=no_pages_found");

  const admin = createAdminClient();
  for (const a of accounts) {
    const { data: row, error } = await admin
      .from("social_accounts")
      .upsert(
        {
          user_id: user.id,
          platform: a.platform,
          external_id: a.external_id,
          account_name: a.account_name,
          account_type: a.account_type,
          avatar_url: a.avatar_url,
        },
        { onConflict: "user_id,platform,external_id" },
      )
      .select("id")
      .single();
    if (error || !row) continue;
    await admin.from("social_tokens").upsert({
      social_account_id: row.id,
      access_token: a.access_token,
      refresh_token: a.refresh_token ?? null,
      expires_at: a.expires_at ?? null,
      updated_at: new Date().toISOString(),
    });
  }
  return back(`connected=${provider}`);
}
