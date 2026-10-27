"use client";

import { useMemo } from "react";
import { useSession } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";

// Supabase client for Client Components, authenticated with the Clerk session.
export function useSupabase() {
  const { session } = useSession();

  return useMemo(
    () =>
      createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
          async accessToken() {
            return (await session?.getToken()) ?? null;
          },
        },
      ),
    [session],
  );
}
