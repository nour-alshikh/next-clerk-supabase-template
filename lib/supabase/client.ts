"use client";

import { useMemo } from "react";
import { useSession } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import type { Database } from "@/types/database";

// Supabase client for Client Components, authenticated with the Clerk session.
// Prefer server queries + Server Actions; use this for realtime or client-only reads.
export function useSupabase() {
  const { session } = useSession();

  return useMemo(
    () =>
      createClient<Database>(
        env.NEXT_PUBLIC_SUPABASE_URL,
        env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
        {
          async accessToken() {
            return (await session?.getToken()) ?? null;
          },
        },
      ),
    [session],
  );
}
