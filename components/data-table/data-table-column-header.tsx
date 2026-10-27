"use client";

import type { Column, RowData } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DataTableFeatures } from "./features";

// Sortable column header: header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />
export function DataTableColumnHeader<TData extends RowData, TValue>({
  column,
  title,
}: {
  column: Column<DataTableFeatures, TData, TValue>;
  title: string;
}) {
  if (!column.getCanSort()) return <span>{title}</span>;

  const sorted = column.getIsSorted();
  const Icon = sorted === "asc" ? ArrowUpIcon : sorted === "desc" ? ArrowDownIcon : ChevronsUpDownIcon;

  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-2.5"
      onClick={() => column.toggleSorting(sorted === "asc")}
    >
      {title}
      <Icon className="text-muted-foreground" />
    </Button>
  );
}
