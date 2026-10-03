import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { LoginForm } from "./LoginForm";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { user } = await getUser();
  const { next, error } = await searchParams;
  // Already signed in with a real account: nothing to do here.
  if (user && !user.is_anonymous) redirect(next?.startsWith("/") && !next.startsWith("//") ? next : "/");
  return (
    <div className="mx-auto px-4 max-w-md">
      <div className="card p-8">
        <h1 className="font-[family-name:var(--font-display)] text-2xl text-brand">
          {user?.is_anonymous ? "Save your work" : "Sign in to SocialSpark"}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {user?.is_anonymous
            ? "Add your email to turn this guest session into a free account. Your listings and posts come with you."
            : "We'll email you a secure sign-in link. No password needed."}
        </p>
        {error && <p className="mt-3 text-sm text-red-700">That link has expired. Please request a new one.</p>}
        <LoginForm isGuest={!!user?.is_anonymous} next={next?.startsWith("/") ? next : "/"} />
      </div>
    </div>
  );
}
