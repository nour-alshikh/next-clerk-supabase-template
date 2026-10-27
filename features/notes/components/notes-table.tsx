"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { dataTableColumns } from "@/components/data-table/features";
import type { Note } from "../queries";
import { DeleteNoteButton } from "./delete-note-button";
import { EditNoteButton } from "./edit-note-button";

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });

// Module scope keeps columns stable between renders (TanStack Table requirement)
const col = dataTableColumns<Note>();
const columns = col.columns([
  col.accessor("content", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Note" />,
    cell: ({ row }) => (
      <span className="line-clamp-2 max-w-xl whitespace-pre-wrap">{row.original.content}</span>
    ),
  }),
  col.accessor("created_at", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
    cell: ({ row }) => (
      // Server and browser time zones can differ; the browser's value wins
      <time dateTime={row.original.created_at} suppressHydrationWarning className="text-muted-foreground">
        {dateFormat.format(new Date(row.original.created_at))}
      </time>
    ),
    enableGlobalFilter: false,
  }),
  col.display({
    id: "actions",
    cell: ({ row }) => (
      <div className="flex justify-end gap-1">
        <EditNoteButton note={row.original} />
        <DeleteNoteButton id={row.original.id} />
      </div>
    ),
  }),
]);

export function NotesTable({ data }: { data: Note[] }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder="Search notes…"
      emptyMessage="No notes yet. Create your first one."
    />
  );
}
