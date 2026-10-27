"use client";

import type { ReactTable, RowData } from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DataTableFeatures } from "./features";

// Rendered by DataTable, which re-renders on every state change, so plain reads are current.
export function DataTablePagination<TData extends RowData>({
  table,
}: {
  table: ReactTable<DataTableFeatures, TData>;
}) {
  const pageIndex = table.state.pagination.pageIndex;
  const pageCount = Math.max(table.getPageCount(), 1);

  return (
    <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
      <span>{table.getFilteredRowModel().rows.length} row(s)</span>
      <div className="flex items-center gap-2">
        <span>
          Page {pageIndex + 1} of {pageCount}
        </span>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Previous page"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeftIcon />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Next page"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRightIcon />
        </Button>
      </div>
    </div>
  );
}
