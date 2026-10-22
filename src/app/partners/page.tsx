import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { PARTNER_COLUMNS, partnerKindFor, type PartnerRealtor } from "@/lib/broker";
import type { Profile } from "@/lib/types";
import { PartnersManager } from "./PartnersManager";

// Private or utility page: keep it out of search results.
export const metadata = { title: "Partners", robots: { index: false, follow: false } };

/** Brokers' partner realtors, or realtors' partner mortgage brokers. */
export default async function PartnersPage() {
  const { supabase, user } = await getUser();
  if (!user) redirect("/");
  if (user.is_anonymous) redirect("/login?next=/partners");
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single<Profile>();
  if (!profile) redirect("/");
  const kind = partnerKindFor(profile.role);
  const { data: partners } = await supabase.from("partner_realtors").select(PARTNER_COLUMNS).eq("kind", kind).order("full_name").returns<PartnerRealtor[]>();

  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4">
      <div>
        <h1 className="text-2xl font-semibold">Partners</h1>
        <p className="mt-1 text-sm text-muted">
          {kind === "realtor" ? (
            <>The realtors you work with. Add them to your mortgage feature sheets to co-brand them, with their photo, contact details and a QR code.</>
          ) : (
            <>
              The mortgage brokers you work with. Send them a listing from its page (<strong>Send to my mortgage broker</strong>) so they can create a
              mortgage feature sheet co-branded with you.
            </>
          )}
        </p>
        <p className="mt-1 text-xs text-muted">
          When someone you shared a listing with adds it, you&apos;re both added to each other&apos;s partners automatically.{" "}
          {kind === "realtor" ? <Link href="/sheets" className="underline">Your feature sheets</Link> : null}
        </p>
      </div>
      <PartnersManager userId={user.id} initial={partners ?? []} kind={kind} province={profile.province} />
    </div>
  );
}
