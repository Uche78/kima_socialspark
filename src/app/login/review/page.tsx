import { ReviewLoginForm } from "./ReviewLoginForm";

// Unlinked password sign-in for app-store / Meta App Review test accounts.
// Regular users have no password, so they can only sign in with the email link.
export const metadata = { title: "Reviewer sign-in — SocialSpark", robots: { index: false, follow: false } };

export default function ReviewLoginPage() {
  return (
    <div className="mx-auto px-4 max-w-md">
      <div className="card p-8">
        <h1 className="font-[family-name:var(--font-display)] text-2xl text-brand">Reviewer sign-in</h1>
        <p className="mt-1 text-sm text-muted">For test accounts provided with an app review. Everyone else signs in with an email link.</p>
        <ReviewLoginForm />
      </div>
    </div>
  );
}
