"use client";

import { useRouter } from "next/navigation";
import { FileUploadButton } from "@/components/file-upload-button";

export function UploadFileButton() {
  const router = useRouter();
  // The upload goes straight to Storage, so re-render the server list afterwards
  return <FileUploadButton onUploaded={() => router.refresh()}>Upload file</FileUploadButton>;
}
