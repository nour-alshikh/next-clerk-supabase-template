"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { PaginationState, SortingState, Updater } from "@tanstack/react-table";
import type { TableParams } from "@/lib/table-params";

const resolve = <T,>(updater: Updater<T>, current: T) =>
  typeof updater === "function" ? (updater as (old: T) => T)(current) : updater;

/**
 * Table state that lives in the URL (?page, size, sort, q). Changing it navigates,
 * the page re-runs its query on the server, and new rows arrive as props.
 */
export function useUrlTableState(params: TableParams) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const pagination: PaginationState = { pageIndex: params.page - 1, pageSize: params.pageSize };
  const sorting: SortingState = [{ id: params.sort.id, desc: params.sort.desc }];

  function navigate(changes: Record<string, string | number | null>) {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value === null || value === "" || (key === "page" && value === 1)) next.delete(key);
      else next.set(key, String(value));
    }
    const qs = next.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  }

  // Search box: local state for instant typing, URL updated after a pause
  const [search, setSearch] = useState(params.q);
  useEffect(() => {
    if (search.trim() === params.q) return;
    const id = setTimeout(() => navigate({ q: search.trim() || null, page: 1 }), 300);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- navigate changes every render
  }, [search, params.q]);

  return {
    isPending,
    search,
    setSearch,
    state: { pagination, sorting, globalFilter: params.q },
    onPaginationChange: (updater: Updater<PaginationState>) => {
      const next = resolve(updater, pagination);
      navigate(
        next.pageSize !== pagination.pageSize
          ? { size: next.pageSize, page: 1 }
          : { page: next.pageIndex + 1 },
      );
    },
    onSortingChange: (updater: Updater<SortingState>) => {
      const [next] = resolve(updater, sorting);
      navigate({ sort: next ? `${next.id}.${next.desc ? "desc" : "asc"}` : null, page: 1 });
    },
  };
}
