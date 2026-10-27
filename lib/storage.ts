// Supabase Storage helpers shared by client uploads and server queries.
// Bucket + RLS policies: supabase/migrations/0003_uploads_bucket.sql

export const UPLOADS_BUCKET = "uploads";
/** Keep in sync with file_size_limit in the migration. */
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

/**
 * Storage path for a user's file: <userId>/<uuid>-<name>.
 * RLS only allows writes inside the user's own folder; the uuid avoids clashes.
 */
export function userFilePath(userId: string, fileName: string) {
  const safeName = fileName.replace(/[^\w.\-]+/g, "_").slice(-100);
  return `${userId}/${crypto.randomUUID()}-${safeName}`;
}

/** Original file name from a path made by userFilePath. */
export function fileDisplayName(path: string) {
  const base = path.split("/").pop() ?? path;
  return base.replace(/^[0-9a-f-]{36}-/, "");
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
