import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import type { Profile, Role } from "@/lib/types";
import { WelcomeForm } from "./WelcomeForm";

// Private or utility page: keep it out of search results.
export const metadata = { title: "Welcome", robots: { index: false, follow: false } };

/** Only allow same-site paths ("/x"), never protocol-relative ("//evil.com") or absolute URLs. */
function safeNext(value: string | undefined) {
  return value && value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\") ? value : "/";
}

/** After sign-up: new accounts choose Realtor or Mortgage broker. Everyone else passes straight through. */
export default async function WelcomePage({ searchParams }: { searchParams: Promise<{ next?: string; role?: string }> }) {
  const { supabase, user } = await getUser();
  const sp = await searchParams;
  const next = safeNext(sp.next);
  if (!user || user.is_anonymous) redirect(`/login?next=${encodeURIComponent(`/welcome?next=${encodeURIComponent(next)}`)}`);

  const { data: profile } = await supabase.from("profiles").select("role, role_chosen, province, title").eq("id", user.id).maybeSingle<Pick<Profile, "role" | "role_chosen" | "province" | "title">>();
  if (!profile || profile.role_chosen) redirect(next);

  // Preselect: the page they signed up from (?role=), else what they used as a guest.
  const initial: Role = sp.role === "mortgage_broker" || sp.role === "realtor" ? sp.role : profile.role;

  return (
    <div className="mx-auto max-w-2xl px-4">
      <h1 className="text-center font-[family-name:var(--font-heading)] text-3xl font-medium tracking-[-0.02em] text-[#141414] sm:text-4xl">Welcome to SocialSpark</h1>
      <p className="mt-3 text-center text-[#141414]/70">Which best describes you? We&apos;ll set things up for the way you work. You can change this later in Settings.</p>
      <WelcomeForm initialRole={initial} initialProvince={profile.province} currentTitle={profile.title} next={next} />
    </div>
  );
}
