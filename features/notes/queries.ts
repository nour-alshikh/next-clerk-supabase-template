import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { escapeLike, pageRange, type TableParams, type TableSort } from "@/lib/table-params";

// Columns the notes table may sort by (checked when parsing the URL)
export const noteSortable = ["content", "created_at"] as const;
export const noteDefaultSort: TableSort<NoteSortColumn> = { id: "created_at", desc: true };
export type NoteSortColumn = (typeof noteSortable)[number];

// RLS limits rows to the signed-in user, so no user_id filter is needed.
// Paging, sorting and search run in the database; only one page is sent.
export async function getNotes({ page, pageSize, sort, q }: TableParams<NoteSortColumn>) {
  const supabase = createServerSupabaseClient();
  const { from, to } = pageRange({ page, pageSize });

  let query = supabase
    .from("notes")
    .select("id, content, created_at", { count: "exact" })
    .order(sort.id, { ascending: !sort.desc })
    .order("id", { ascending: false }) // stable order when values tie
    .range(from, to);
  if (q) query = query.ilike("content", `%${escapeLike(q)}%`);

  const { data, error, count } = await query;
  // Asking for a page past the end (e.g. after deleting its last row) returns 416
  if (error?.code === "PGRST103") return { rows: [], total: count ?? 0 };
  if (error) throw new Error(`Failed to load notes: ${error.message}`);
  return { rows: data, total: count ?? 0 };
}

export async function getNotesCount() {
  const supabase = createServerSupabaseClient();
  const { count, error } = await supabase
    .from("notes")
    .select("*", { count: "exact", head: true });

  if (error) throw new Error(`Failed to count notes: ${error.message}`);
  return count ?? 0;
}

export type Note = Awaited<ReturnType<typeof getNotes>>["rows"][number];
