import { NextResponse, type NextRequest } from "next/server";
import { getUser } from "@/lib/supabase/server";
import { createState, PROVIDERS, redirectUri, siteUrl, type Provider } from "@/lib/oauth";
import { metaAuthUrl } from "@/lib/publish/meta";
import { linkedinAuthUrl } from "@/lib/publish/linkedin";

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/connect/[provider]/start">) {
  const { provider } = await ctx.params;
  if (!PROVIDERS.includes(provider as Provider)) return NextResponse.json({ error: "Unknown provider" }, { status: 404 });

  const { user } = await getUser();
  if (!user || user.is_anonymous) return NextResponse.redirect(`${siteUrl()}/login?next=/settings%23accounts`);

  const configured = provider === "meta" ? process.env.META_APP_ID : process.env.LINKEDIN_CLIENT_ID;
  if (!configured) return NextResponse.redirect(`${siteUrl()}/settings?connect_error=${provider}_not_configured#accounts`);

  const state = await createState(provider as Provider);
  const url =
    provider === "meta"
      ? metaAuthUrl(state, redirectUri("meta"))
      : linkedinAuthUrl(state, redirectUri("linkedin"));
  return NextResponse.redirect(url);
}
