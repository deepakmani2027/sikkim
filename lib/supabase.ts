import { createClient } from "@supabase/supabase-js"

// Read env vars without asserting non-null so we can run app without them.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only create the client if both vars exist; otherwise export null so callers can guard.
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
      })
    : null

export function isSupabaseEnabled(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey)
}

// Helpful console notice in dev so developers know why auth features may be disabled.
if (process.env.NODE_ENV !== "production" && !isSupabaseEnabled()) {
  // eslint-disable-next-line no-console
  console.warn(
    "[supabase] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY not set. Auth features are disabled. Create a .env.local file to enable them."
  )
}


