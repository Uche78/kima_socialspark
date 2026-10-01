"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm({ isGuest, next }: { isGuest: boolean; next: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setState("sending");
    const supabase = createClient();
    const redirect = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    const { error } = isGuest
      ? await supabase.auth.updateUser({ email }, { emailRedirectTo: redirect })
      : await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirect } });
    if (error) {
      setError(error.message);
      setState("idle");
    } else setState("sent");
  }

  if (state === "sent") {
    return (
      <div className="mt-6 rounded-lg bg-green-50 p-4 text-sm text-green-900">
        Check <strong>{email}</strong> for a link to {isGuest ? "confirm your account" : "sign in"}.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-3">
      <input className="input h-12 rounded-full px-5 text-base" type="email" required placeholder="you@brokerage.ca" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button className="btn-primary h-12 w-full rounded-full text-base" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : isGuest ? "Create my account" : "Email me a sign-in link"}
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
