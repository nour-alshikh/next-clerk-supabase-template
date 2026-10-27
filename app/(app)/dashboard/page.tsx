import { Suspense } from "react";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { NotebookPenIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getNotesCount } from "@/features/notes/queries";
import { requireUser } from "@/lib/auth";

export default function DashboardPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
      <Suspense fallback={<Skeleton className="h-8 w-56" />}>
        <Greeting />
      </Suspense>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <NotebookPenIcon className="size-4" /> Notes
            </CardDescription>
            <CardTitle className="text-3xl">
              <Suspense fallback={<Skeleton className="h-9 w-12" />}>
                <NotesCount />
              </Suspense>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" nativeButton={false} render={<Link href="/notes" />}>
              View notes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

async function Greeting() {
  await requireUser();
  const user = await currentUser();
  const name = user?.firstName ?? user?.emailAddresses[0]?.emailAddress;
  return <h1 className="text-2xl font-semibold">Welcome, {name}</h1>;
}

async function NotesCount() {
  await requireUser();
  return await getNotesCount();
}
