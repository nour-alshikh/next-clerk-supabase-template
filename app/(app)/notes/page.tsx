import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { PageHeader } from "@/components/page-header";
import { CreateNoteButton } from "@/features/notes/components/create-note-button";
import { NotesTable } from "@/features/notes/components/notes-table";
import { getNotes, noteDefaultSort, noteSortable } from "@/features/notes/queries";
import { requireUser } from "@/lib/auth";
import { parseTableParams } from "@/lib/table-params";

export default function NotesPage({ searchParams }: PageProps<"/notes">) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
      <PageHeader
        title="Notes"
        description="Example module — copy features/notes for new ones."
        actions={<CreateNoteButton />}
      />
      <Suspense fallback={<DataTableSkeleton />}>
        <ProtectedNotesTable searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

// searchParams is read inside Suspense so the page header stays in the static shell
async function ProtectedNotesTable({ searchParams }: Pick<PageProps<"/notes">, "searchParams">) {
  await requireUser();
  const params = parseTableParams(await searchParams, {
    sortable: noteSortable,
    defaultSort: noteDefaultSort,
  });
  const { rows, total } = await getNotes(params);
  return <NotesTable data={rows} params={params} total={total} />;
}
