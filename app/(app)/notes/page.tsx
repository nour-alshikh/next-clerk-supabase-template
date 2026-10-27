import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { PageHeader } from "@/components/page-header";
import { CreateNoteButton } from "@/features/notes/components/create-note-button";
import { NotesTable } from "@/features/notes/components/notes-table";
import { getNotes } from "@/features/notes/queries";
import { requireUser } from "@/lib/auth";

export default function NotesPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
      <PageHeader
        title="Notes"
        description="Example module — copy features/notes for new ones."
        actions={<CreateNoteButton />}
      />
      <Suspense fallback={<DataTableSkeleton />}>
        <ProtectedNotesTable />
      </Suspense>
    </div>
  );
}

async function ProtectedNotesTable() {
  await requireUser();
  const notes = await getNotes();
  return <NotesTable data={notes} />;
}
