"use client";

import { useTransition } from "react";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteFile } from "../actions";

export function DeleteFileButton({ path }: { path: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Delete file"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await deleteFile({ path });
          if (result.ok) toast.success("File deleted");
          else toast.error(result.error);
        })
      }
    >
      <Trash2Icon />
    </Button>
  );
}
