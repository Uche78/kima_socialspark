import { ReviewLoginForm } from "./ReviewLoginForm";

// Unlinked password sign-in for app-store / Meta App Review test accounts.
// Regular users have no password, so they can only sign in with an emailed code.
export const metadata = { title: "Reviewer sign-in — SocialSpark", robots: { index: false, follow: false } };

export default function ReviewLoginPage() {
  return (
    <div className="mx-auto px-4 max-w-md">
      <div className="card p-8">
        <h1 className="font-[family-name:var(--font-heading)] tracking-[-0.02em] text-2xl text-brand">Reviewer sign-in</h1>
        <p className="mt-1 text-sm text-muted">For test accounts provided with an app review. Everyone else signs in with an emailed code.</p>
        <ReviewLoginForm />
      </div>
    </div>
  );
}
