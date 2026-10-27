"use client";

import { useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { UploadIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatBytes, MAX_UPLOAD_BYTES, UPLOADS_BUCKET, userFilePath } from "@/lib/storage";
import { useSupabase } from "@/lib/supabase/client";

/**
 * Uploads straight from the browser to Supabase Storage (no 1 MB Server Action
 * body limit), into the user's own folder. RLS checks the folder on the server.
 * `onUploaded` gets the storage path: save it in a table or refresh a list.
 */
export function FileUploadButton({
  onUploaded,
  accept,
  maxBytes = MAX_UPLOAD_BYTES,
  children = "Upload",
}: {
  onUploaded?: (path: string) => void;
  /** e.g. "image/*" or ".pdf,.docx" */
  accept?: string;
  maxBytes?: number;
  children?: React.ReactNode;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { userId } = useAuth();
  const supabase = useSupabase();

  async function upload(file: File) {
    if (!userId) return toast.error("You must be signed in.");
    if (file.size > maxBytes) return toast.error(`File is too big (max ${formatBytes(maxBytes)}).`);

    setUploading(true);
    const path = userFilePath(userId, file.name);
    const { error } = await supabase.storage
      .from(UPLOADS_BUCKET)
      .upload(path, file, { contentType: file.type || undefined });
    setUploading(false);

    if (error) return toast.error(`Upload failed: ${error.message}`);
    toast.success(`Uploaded ${file.name}`);
    onUploaded?.(path);
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = ""; // allow picking the same file again
          if (file) void upload(file);
        }}
      />
      <Button onClick={() => inputRef.current?.click()} disabled={uploading}>
        <UploadIcon />
        {uploading ? "Uploading…" : children}
      </Button>
    </>
  );
}
