import "server-only";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import { serverEnv } from "@/lib/env.server";
import type { Database } from "@/types/database";

// Supabase client with the secret key: BYPASSES RLS.
// Only for trusted server code with no signed-in user (webhooks, cron jobs).
// For anything a user triggers, use createServerSupabaseClient() so RLS applies.
export function createAdminSupabaseClient() {
  if (!serverEnv.SUPABASE_SECRET_KEY) {
    throw new Error("SUPABASE_SECRET_KEY is not set — add it to .env.local.");
  }
  return createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, serverEnv.SUPABASE_SECRET_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
