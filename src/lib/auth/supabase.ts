import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    "Missing Supabase environment variables. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
  );
}

/**
 * Public Supabase client — safe for use in browser and server components.
 * Uses the publishable key; Row Level Security (RLS) applies.
 */
export const supabase = createClient(supabaseUrl, supabasePublishableKey);

/** Signs the current user out and clears the local session. */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

