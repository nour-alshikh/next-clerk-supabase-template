import { Skeleton } from "@/components/ui/skeleton";

export function DataTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-8 w-full max-w-sm" />
      <div className="flex flex-col gap-3 rounded-lg border p-4">
        {Array.from({ length: rows }, (_, i) => (
          <Skeleton key={i} className="h-6 w-full" />
        ))}
      </div>
    </div>
  );
}
