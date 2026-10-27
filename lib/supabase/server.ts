import "server-only";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import type { Database } from "@/types/database";

// Supabase client for Server Components, Server Actions and Route Handlers.
// Sends the Clerk session token so RLS policies can read auth.jwt()->>'sub'.
export function createServerSupabaseClient() {
  return createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      async accessToken() {
        return (await auth()).getToken();
      },
    },
  );
}
