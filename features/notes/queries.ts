import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// RLS limits rows to the signed-in user, so no user_id filter is needed.
export async function getNotes() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("notes")
    .select("id, content, created_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to load notes: ${error.message}`);
  return data;
}

export async function getNotesCount() {
  const supabase = createServerSupabaseClient();
  const { count, error } = await supabase
    .from("notes")
    .select("*", { count: "exact", head: true });

  if (error) throw new Error(`Failed to count notes: ${error.message}`);
  return count ?? 0;
}

export type Note =Awaited<ReturnType<typeof getNotes>>[number];
