import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { NoteForm } from "@/features/notes/components/note-form";
import { requireUser } from "@/lib/auth";

// Used when notesConfig.createMode is "page" (also works as a direct link in drawer mode).
export default function NewNotePage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <Button
        variant="ghost"
        size="sm"
        className="self-start"
        nativeButton={false}
        render={<Link href="/notes" />}
      >
        <ArrowLeftIcon /> Back to notes
      </Button>
      <PageHeader title="New note" description="Notes are private to your account." />
      <Card>
        <CardContent>
          <Suspense fallback={<Skeleton className="h-40 w-full" />}>
            <ProtectedForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

async function ProtectedForm() {
  await requireUser();
  return <NoteForm redirectTo="/notes" />;
}
