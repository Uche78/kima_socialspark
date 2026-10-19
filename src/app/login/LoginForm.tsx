"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const RESEND_SECONDS = 60;

/**
 * Email sign-in with a one-time code: we email a code and the person types it here, so they
 * stay in the browser they started in (links can open elsewhere or be pre-clicked by scanners).
 * Guests use the same flow to turn their session into an account, keeping their work.
 */
export function LoginForm({ isGuest, next }: { isGuest: boolean; next: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function sendCode() {
    setError(null);
    setBusy(true);
    const supabase = createClient();
    // The link in the email (if the template still has one) also works, via /auth/callback.
    const redirect = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    const { error } = isGuest
      ? await supabase.auth.updateUser({ email }, { emailRedirectTo: redirect })
      : await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirect } });
    setBusy(false);
    if (error) return setError(error.message);
    setStep("code");
    setCode("");
    setCooldown(RESEND_SECONDS);
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const token = code.replace(/\D/g, "");
    const { error } = await createClient().auth.verifyOtp({ email, token, type: isGuest ? "email_change" : "email" });
    if (error) {
      setBusy(false);
      return setError(/expired|invalid/i.test(error.message) ? "That code is incorrect or has expired. Check the latest email, or send a new code." : error.message);
    }
    router.replace(next);
    router.refresh();
  }

  if (step === "code") {
    return (
      <form onSubmit={verify} className="mt-6 space-y-3">
        <p className="text-sm text-muted">
          We sent a code to <strong className="text-foreground">{email}</strong>. Enter it below.
        </p>
        <input
          className="input h-12 rounded-full px-5 text-center text-xl tracking-[0.4em]"
          inputMode="numeric"
          autoComplete="one-time-code"
          autoFocus
          required
          placeholder="Code"
          aria-label="Code from the email"
          maxLength={10}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
        />
        <button className="btn-primary h-12 w-full rounded-full text-base" disabled={busy || code.length < 6}>
          {busy ? "Checking…" : isGuest ? "Create my account" : "Sign in"}
        </button>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <div className="flex justify-between text-sm">
          <button type="button" className="text-muted underline" onClick={() => { setStep("email"); setError(null); }}>
            Use a different email
          </button>
          <button type="button" className="text-muted underline disabled:no-underline disabled:opacity-60" onClick={sendCode} disabled={busy || cooldown > 0}>
            {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void sendCode();
      }}
      className="mt-6 space-y-3"
    >
      <input className="input h-12 rounded-full px-5 text-base" type="email" required autoComplete="email" placeholder="you@brokerage.ca" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button className="btn-primary h-12 w-full rounded-full text-base" disabled={busy}>
        {busy ? "Sending…" : "Email me a code"}
      </button>
      {error && <p className="text-sm text-red-700">{error}</p>}
      {isGuest && (
        <p className="text-xs text-muted">
          Already have an account? Signing in to it will leave this guest session&apos;s work behind.{" "}
          <button type="button" className="underline" onClick={async () => { await createClient().auth.signOut(); window.location.reload(); }}>
            Sign in instead
          </button>
        </p>
      )}
    </form>
  );
}
