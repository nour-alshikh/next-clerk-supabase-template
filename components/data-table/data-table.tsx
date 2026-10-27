"use client";

import { useTable, type ColumnDef, type RowData } from "@tanstack/react-table";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./data-table-pagination";
import { dataTableFeatures, type DataTableFeatures } from "./features";

type DataTableProps<TData extends RowData> = {
  /** Keep stable: define at module scope (see features/notes/components/notes-table.tsx). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- columns mix value types
  columns: ColumnDef<DataTableFeatures, TData, any>[];
  data: TData[];
  /** Shows a search box that filters across all columns. */
  searchPlaceholder?: string;
  /** Shown when there are no rows at all (vs. no search results). */
  emptyMessage?: React.ReactNode;
  pageSize?: number;
};

/**
 * Client-side table: sorting, search and pagination over the rows it's given.
 * Fine for hundreds of rows; for large tables move paging/filtering to the query.
 */
export function DataTable<TData extends RowData>({
  columns,
  data,
  searchPlaceholder,
  emptyMessage = "Nothing here yet.",
  pageSize = 10,
}: DataTableProps<TData>) {
  const table = useTable({
    features: dataTableFeatures,
    columns,
    data,
    globalFilterFn: "includesString",
    initialState: { pagination: { pageIndex: 0, pageSize } },
  });

  const rows = table.getRowModel().rows;

  return (
    <div className="flex flex-col gap-4">
      {searchPlaceholder && (
        <div className="relative max-w-sm">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={String(table.state.globalFilter ?? "")}
            onChange={(e) => table.setGlobalFilter(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-8"
          />
        </div>
      )}

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  {data.length === 0 ? emptyMessage : "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}
