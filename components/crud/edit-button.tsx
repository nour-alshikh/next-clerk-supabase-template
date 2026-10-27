"use client";

import { useState } from "react";
import { PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type EditButtonProps = {
  /** Accessible label for the icon button, e.g. "Edit note". */
  label: string;
  /** Drawer heading. */
  title: string;
  description?: string;
  /** The form, pre-filled with the row. Gets `close` to call after a successful save. */
  renderForm: (close: () => void) => React.ReactNode;
};

// Row "Edit" action: pencil icon that opens the form in a side drawer.
// The drawer content unmounts when closed, so the form re-reads the latest row on each open.
export function EditButton({ label, title, description, renderForm }: EditButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon-sm" aria-label={label} />}>
        <PencilIcon />
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <div className="px-4">{renderForm(() => setOpen(false))}</div>
      </SheetContent>
    </Sheet>
  );
}
