import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { PageHeader } from "@/components/page-header";
import { FilesTable } from "@/features/files/components/files-table";
import { UploadFileButton } from "@/features/files/components/upload-file-button";
import { getFiles } from "@/features/files/queries";
import { requireUser } from "@/lib/auth";

export default function FilesPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
      <PageHeader
        title="Files"
        description="Uploads to a private Supabase Storage bucket, one folder per user."
        actions={<UploadFileButton />}
      />
      <Suspense fallback={<DataTableSkeleton />}>
        <ProtectedFilesTable />
      </Suspense>
    </div>
  );
}

async function ProtectedFilesTable() {
  const userId = await requireUser();
  const files = await getFiles(userId);
  return <FilesTable data={files} />;
}
