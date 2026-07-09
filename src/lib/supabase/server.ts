import { createServerClient, type SetAllCookies } from "@supabase/ssr";
import { cookies } from "next/headers";

// Use in Server Components, Route Handlers, and Server Actions only.
// Cookie writes are swallowed when called from a Server Component render
// (Next.js forbids it there) — middleware is responsible for refreshing
// the session cookie in that case. No auth middleware is wired up yet;
// add one in middleware.ts once routes require a signed-in session.
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: Parameters<SetAllCookies>[0]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from a Server Component — safe to ignore, see middleware note above.
          }
        },
      },
    },
  );
}
