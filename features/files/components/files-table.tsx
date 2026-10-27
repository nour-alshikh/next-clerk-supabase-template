"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { dataTableColumns } from "@/components/data-table/features";
import { formatBytes } from "@/lib/storage";
import type { UserFile } from "../queries";
import { DeleteFileButton } from "./delete-file-button";

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });

// Module scope keeps columns stable between renders (TanStack Table requirement)
const col = dataTableColumns<UserFile>();
const columns = col.columns([
  col.accessor("name", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) =>
      row.original.url ? (
        <a
          href={row.original.url}
          target="_blank"
          rel="noreferrer"
          className="font-medium underline-offset-4 hover:underline"
        >
          {row.original.name}
        </a>
      ) : (
        row.original.name
      ),
  }),
  col.accessor("size", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Size" />,
    cell: ({ row }) => <span className="text-muted-foreground">{formatBytes(row.original.size)}</span>,
    enableGlobalFilter: false,
  }),
  col.accessor("created_at", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Uploaded" />,
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
      <div className="flex justify-end">
        <DeleteFileButton path={row.original.path} />
      </div>
    ),
  }),
]);

export function FilesTable({ data }: { data: UserFile[] }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder="Search files…"
      emptyMessage="No files yet. Upload your first one."
    />
  );
}
