import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Keeps the Supabase session cookie fresh on every request.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  const { data } = await supabase.auth.getUser();

  // If Supabase sends a sign-in code to a page other than /auth/callback (e.g. when it falls back
  // to the Site URL), forward it there so the sign-in completes. Skip this once the user is signed
  // in with a real account: the code is spent, and Netlify carries the query string onto redirects,
  // so forwarding again would loop between the callback and the page.
  const { pathname, searchParams } = request.nextUrl;
  const signedIn = !!data.user && !data.user.is_anonymous;
  if (searchParams.has("code") && !signedIn && pathname !== "/auth/callback" && !pathname.startsWith("/api/")) {
    const callback = request.nextUrl.clone();
    callback.pathname = "/auth/callback";
    if (!callback.searchParams.has("next")) callback.searchParams.set("next", pathname);
    return NextResponse.redirect(callback);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/cron|api/stripe/webhook|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
