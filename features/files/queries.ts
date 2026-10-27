import "server-only";
import { fileDisplayName, UPLOADS_BUCKET } from "@/lib/storage";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/** Signed links expire; the page creates new ones on every visit. */
const LINK_SECONDS = 60 * 60;

// Lists the user's folder in the private bucket, with short-lived download links.
// RLS on storage.objects only returns the user's own files.
export async function getFiles(userId: string) {
  const supabase = createServerSupabaseClient();
  const bucket = supabase.storage.from(UPLOADS_BUCKET);

  const { data, error } = await bucket.list(userId, {
    limit: 1000,
    sortBy: { column: "created_at", order: "desc" },
  });
  if (error) throw new Error(`Failed to load files: ${error.message}`);

  const files = data.filter((f) => f.id); // skip folder placeholders
  if (!files.length) return [];

  const paths = files.map((f) => `${userId}/${f.name}`);
  const { data: links, error: linkError } = await bucket.createSignedUrls(paths, LINK_SECONDS);
  if (linkError) throw new Error(`Failed to sign file links: ${linkError.message}`);

  return files.map((f, i) => ({
    path: paths[i],
    name: fileDisplayName(f.name),
    size: Number(f.metadata?.size ?? 0),
    type: String(f.metadata?.mimetype ?? ""),
    created_at: f.created_at ?? f.updated_at ?? "",
    url: links[i]?.signedUrl ?? null,
  }));
}

export type UserFile = Awaited<ReturnType<typeof getFiles>>[number];
