// URL state for server-side tables: ?page=2&size=20&sort=created_at.desc&q=milk
// Shared by pages (parse) and <DataTable> (write), so it must stay client-safe.

export type TableSort<TColumn extends string = string> = { id: TColumn; desc: boolean };

export type TableParams<TColumn extends string = string> = {
  /** 1-based page number */
  page: number;
  pageSize: number;
  sort: TableSort<TColumn>;
  q: string;
};

export const PAGE_SIZES = [10, 20, 50, 100] as const;

type SearchParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

/**
 * Reads table params from page `searchParams`. Only columns in `sortable` are
 * accepted, so the sort value can go straight into a query.
 */
export function parseTableParams<const TColumn extends string>(
  searchParams: SearchParams,
  { sortable, defaultSort }: { sortable: readonly TColumn[]; defaultSort: TableSort<TColumn> },
): TableParams<TColumn> {
  const page = Math.max(1, Number.parseInt(first(searchParams.page) ?? "", 10) || 1);

  const size = Number.parseInt(first(searchParams.size) ?? "", 10);
  const pageSize = (PAGE_SIZES as readonly number[]).includes(size) ? size : PAGE_SIZES[0];

  const [id, dir] = (first(searchParams.sort) ?? "").split(".");
  const sort = (sortable as readonly string[]).includes(id)
    ? { id: id as TColumn, desc: dir === "desc" }
    : defaultSort;

  const q = (first(searchParams.q) ?? "").trim().slice(0, 100);

  return { page, pageSize, sort, q };
}

/** Row range for Supabase `.range(from, to)` (inclusive). */
export function pageRange({ page, pageSize }: Pick<TableParams, "page" | "pageSize">) {
  const from = (page - 1) * pageSize;
  return { from, to: from + pageSize - 1 };
}

/** Escapes `%`, `_` and `\` so user text matches literally in `ilike`. */
export function escapeLike(text: string) {
  return text.replace(/[\\%_]/g, (c) => `\\${c}`);
}
