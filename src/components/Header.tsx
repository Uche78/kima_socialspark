import Link from "next/link";
import { getUser } from "@/lib/supabase/server";
import { mediaUrl } from "@/lib/media";
import { AccountMenu } from "./AccountMenu";
import { HeaderShell } from "./HeaderShell";
import { MobileNav } from "./MobileNav";
import { LoginLink } from "./LoginLink";

// Text and button styles when the header floats over the home page hero.
const ON_PHOTO = "group-data-[overlay=true]:text-[#f3f1ec] group-data-[overlay=true]:hover:bg-white/10";

export async function Header() {
  const { supabase, user } = await getUser();
  const guest = !user || user.is_anonymous;
  const profile = guest
    ? null
    : (await supabase.from("profiles").select("full_name, headshot_path").eq("id", user.id).maybeSingle()).data;
  return (
    <HeaderShell>
      {/* Phones: logo left, actions right. From md: three columns so the main nav stays centred. */}
      <div className="mx-auto flex h-14 w-full max-w-[1600px] items-center justify-between gap-2 px-4 md:grid md:grid-cols-[1fr_auto_1fr] lg:w-[90%] lg:px-0">
        <Link href="/" className="justify-self-start py-2 font-[family-name:var(--font-display)] text-xl font-semibold text-brand group-data-[overlay=true]:text-[#f3f1ec]">
          Social<span className="text-accent">Spark</span>
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 text-sm md:flex">
          {user && (
            <>
              <Link href="/" className={`btn-ghost ${ON_PHOTO}`}>Listings</Link>
              <Link href="/posts" className={`btn-ghost ${ON_PHOTO}`}>Posts</Link>
            </>
          )}
          <Link href="/pricing" className={`btn-ghost ${ON_PHOTO}`}>Pricing</Link>
        </nav>
        <div className="flex items-center justify-self-end text-sm">
          {/* Signed-in users reach Brand & voice from the avatar menu; guests have no avatar. */}
          {user && guest && <Link href="/settings" className={`btn-ghost hidden md:inline-flex ${ON_PHOTO}`}>Brand &amp; voice</Link>}
          {guest ? (
            <LoginLink
              // Outlined pill everywhere: navy on white pages, off-white over the home page photo.
              className="btn ml-2 h-10 whitespace-nowrap rounded-full border border-brand bg-transparent px-4 text-brand hover:bg-brand/5 sm:px-5 group-data-[overlay=true]:border-[#f3f1ec]/80 group-data-[overlay=true]:text-[#f3f1ec] group-data-[overlay=true]:hover:bg-white/10"
            >
              {user ? "Save your work" : "Sign in"}
            </LoginLink>
          ) : (
            <AccountMenu name={profile?.full_name ?? null} email={user.email ?? null} avatarUrl={mediaUrl(profile?.headshot_path)} />
          )}
          <MobileNav
            items={
              user
                ? [
                    { href: "/", label: "Listings" },
                    { href: "/posts", label: "Posts" },
                    { href: "/pricing", label: "Pricing" },
                    ...(guest ? [{ href: "/settings", label: "Brand & voice" }] : []),
                  ]
                : []
            }
          />
        </div>
      </div>
      {user?.is_anonymous && (
        <div className="bg-accent/15 px-4 py-1.5 text-center text-xs text-foreground group-data-[overlay=true]:bg-black/40 group-data-[overlay=true]:text-[#f3f1ec] group-data-[overlay=true]:backdrop-blur-sm">
          You&apos;re trying SocialSpark as a guest.{" "}
          <Link href="/login" className="inline-block py-1 font-semibold underline">Create a free account</Link> to keep your work and publish to social media.
        </div>
      )}
    </HeaderShell>
  );
}
