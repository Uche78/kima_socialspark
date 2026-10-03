import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Keeps the Supabase session cookie fresh on every request.
export async function proxy(request: NextRequest) {
  // If Supabase sends a sign-in code to any page other than /auth/callback (e.g. when it falls
  // back to the Site URL), forward it there so the sign-in still completes.
  const { pathname, searchParams } = request.nextUrl;
  if (searchParams.has("code") && pathname !== "/auth/callback" && !pathname.startsWith("/api/")) {
    const callback = request.nextUrl.clone();
    callback.pathname = "/auth/callback";
    if (!callback.searchParams.has("next")) callback.searchParams.set("next", pathname);
    return NextResponse.redirect(callback);
  }

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

  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/cron|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
