"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { CreateMode } from "@/config/site";

type CreateButtonProps = {
  mode: CreateMode;
  label: string;
  /** "page" mode: where the create page lives, e.g. "/notes/new". */
  href: string;
  /** "drawer" mode: drawer heading. */
  title: string;
  description?: string;
  /** "drawer" mode: the form. Gets `close` to call after a successful save. */
  renderForm: (close: () => void) => React.ReactNode;
};

// "Create" action for a module's index page: opens a drawer or links to a /new page.
export function CreateButton({ mode, label, href, title, description, renderForm }: CreateButtonProps) {
  const [open, setOpen] = useState(false);

  if (mode === "page") {
    return (
      <Button nativeButton={false} render={<Link href={href} />}>
        <PlusIcon /> {label}
      </Button>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button />}>
        <PlusIcon /> {label}
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
