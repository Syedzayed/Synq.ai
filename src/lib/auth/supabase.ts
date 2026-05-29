import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    "Missing Supabase environment variables. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
  );
}

/**
 * Browser-side Supabase client.
 *
 * Uses createBrowserClient from @supabase/ssr instead of the vanilla createClient.
 * This is critical: createBrowserClient writes the session to BOTH localStorage
 * AND cookies, so the server-side proxy (createServerClient) can read the session
 * on the very next request — preventing the post-login redirect loop.
 */
export const supabase = createBrowserClient(supabaseUrl, supabasePublishableKey);

/** Signs the current user out and clears the local session and cookies. */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

