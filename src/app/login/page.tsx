import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { LoginForm } from "./LoginForm";
import { PAID_PLANS } from "@/lib/plans";
import { planChoiceFromNext } from "@/lib/subscribe";

// Private or utility page: keep it out of search results.
export const metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string; role?: string }> }) {
  const { user } = await getUser();
  const { next, error, role } = await searchParams;
  // Already signed in with a real account: nothing to do here.
  if (user && !user.is_anonymous) redirect(next?.startsWith("/") && !next.startsWith("//") ? next : "/");
  // Signing in to buy a plan: say which, so the click visibly worked and checkout is the next step.
  const choice = planChoiceFromNext(next);
  const plan = choice ? PAID_PLANS[choice.plan] : null;
  return (
    <div className="mx-auto px-4 max-w-md">
      <div className="card p-8">
        {choice && plan ? (
          <>
            <h1 className="font-[family-name:var(--font-heading)] tracking-[-0.02em] text-2xl text-brand">Start the {plan.name} plan</h1>
            <p className="mt-1 text-sm font-medium text-foreground">
              {choice.interval === "year" ? `${plan.yearly} CAD/year (${plan.yearlyPerMonth}/month)` : `${plan.price} CAD/month`}, plus tax · {plan.posts} posts a month · Cancel anytime
            </p>
            <p className="mt-2 text-sm text-muted">
              {user?.is_anonymous ? "Add your email to save your work as an account" : "Enter your email"}. We&apos;ll send a one-time code, then take you
              straight to secure checkout.
            </p>
          </>
        ) : (
          <>
            <h1 className="font-[family-name:var(--font-heading)] tracking-[-0.02em] text-2xl text-brand">
              {user?.is_anonymous ? "Save your work" : "Sign in to SocialSpark"}
            </h1>
            <p className="mt-1 text-sm text-muted">
              {user?.is_anonymous
                ? "Add your email to turn this guest session into a free account. Your listings and posts come with you."
                : "We'll email you a one-time code. No password needed."}
            </p>
          </>
        )}
        {error && <p className="mt-3 text-sm text-red-700">That link has expired. Enter your email to get a sign-in code instead.</p>}
        <LoginForm isGuest={!!user?.is_anonymous} next={next?.startsWith("/") ? next : "/"} role={role === "mortgage_broker" ? role : undefined} />
      </div>
    </div>
  );
}
