import { createBrowserClient } from "@supabase/ssr";

// Safe to call from Client Components — uses the public anon key only.
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
