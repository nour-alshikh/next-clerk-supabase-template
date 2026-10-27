"use client";

import { useTransition } from "react";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteNote } from "../actions";

export function DeleteNoteButton({ id }: { id: number }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Delete note"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await deleteNote({ id });
          if (result.ok) toast.success("Note deleted");
          else toast.error(result.error);
        })
      }
    >
      <Trash2Icon />
    </Button>
  );
}
