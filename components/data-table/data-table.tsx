"use client";

import { useTable, type ColumnDef, type ReactTable, type RowData } from "@tanstack/react-table";
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
import type { TableParams } from "@/lib/table-params";
import { cn } from "@/lib/utils";
import { DataTablePagination } from "./data-table-pagination";
import { dataTableFeatures, type DataTableFeatures } from "./features";
import { useUrlTableState } from "./use-url-table-state";

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
  /**
   * Server-side mode: `data` is one page already sorted/filtered by the query,
   * `params` come from parseTableParams(searchParams) and `rowCount` is the total.
   * Paging, sorting and search then update the URL instead of the rows in memory.
   */
  server?: { params: TableParams; rowCount: number };
};

/**
 * Sorting, search and pagination. Without `server` it works over the rows it's
 * given (fine for hundreds); with `server` the database does it (any size).
 */
export function DataTable<TData extends RowData>(props: DataTableProps<TData>) {
  return props.server ? (
    <ServerDataTable {...props} server={props.server} />
  ) : (
    <ClientDataTable {...props} />
  );
}

function ClientDataTable<TData extends RowData>({
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

  return (
    <DataTableView
      table={table}
      search={
        searchPlaceholder
          ? {
              placeholder: searchPlaceholder,
              value: String(table.state.globalFilter ?? ""),
              onChange: table.setGlobalFilter,
            }
          : undefined
      }
      emptyMessage={data.length === 0 ? emptyMessage : "No results."}
    />
  );
}

function ServerDataTable<TData extends RowData>({
  columns,
  data,
  searchPlaceholder,
  emptyMessage = "Nothing here yet.",
  server,
}: DataTableProps<TData> & { server: NonNullable<DataTableProps<TData>["server"]> }) {
  const url = useUrlTableState(server.params);

  const table = useTable({
    features: dataTableFeatures,
    columns,
    data,
    state: url.state,
    onPaginationChange: url.onPaginationChange,
    onSortingChange: url.onSortingChange,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    // New rows arrive with every page; resetting the page index would navigate
    autoResetPageIndex: false,
    rowCount: server.rowCount,
  });

  return (
    <DataTableView
      table={table}
      pending={url.isPending}
      search={
        searchPlaceholder
          ? { placeholder: searchPlaceholder, value: url.search, onChange: url.setSearch }
          : undefined
      }
      emptyMessage={server.rowCount === 0 && !server.params.q ? emptyMessage : "No results."}
    />
  );
}

function DataTableView<TData extends RowData>({
  table,
  search,
  emptyMessage,
  pending,
}: {
  table: ReactTable<DataTableFeatures, TData>;
  search?: { placeholder: string; value: string; onChange: (value: string) => void };
  emptyMessage: React.ReactNode;
  pending?: boolean;
}) {
  const rows = table.getRowModel().rows;

  return (
    <div className="flex flex-col gap-4">
      {search && (
        <div className="relative max-w-sm">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search.value}
            onChange={(e) => search.onChange(e.target.value)}
            placeholder={search.placeholder}
            className="pl-8"
          />
        </div>
      )}

      <div
        className={cn("overflow-hidden rounded-lg border transition-opacity", pending && "opacity-60")}
        aria-busy={pending}
      >
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
                <TableCell
                  colSpan={table.getAllLeafColumns().length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
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
