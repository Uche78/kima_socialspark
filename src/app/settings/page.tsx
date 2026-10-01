import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { usageFor } from "@/lib/plans";
import type { Profile, SocialAccount } from "@/lib/types";
import { SettingsForm } from "./SettingsForm";

export default async function SettingsPage({ searchParams }: PageProps<"/settings">) {
  const { supabase, user } = await getUser();
  if (!user) redirect("/");
  const sp = await searchParams;

  const [{ data: profile }, { data: accounts }, { data: entitlement }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single<Profile>(),
    supabase.from("social_accounts").select("id, platform, external_id, account_name, account_type, avatar_url").returns<SocialAccount[]>(),
    supabase.from("entitlements").select("plan, generations_used").eq("user_id", user.id).maybeSingle(),
  ]);
  if (!profile) redirect("/");

  return (
    <SettingsForm
      profile={profile}
      accounts={accounts ?? []}
      isGuest={!!user.is_anonymous}
      usage={{ plan: entitlement?.plan ?? "free", ...usageFor(entitlement?.plan, entitlement?.generations_used ?? 0, !!user.is_anonymous) }}
      connected={typeof sp.connected === "string" ? sp.connected : null}
      connectError={typeof sp.connect_error === "string" ? sp.connect_error : null}
    />
  );
}
