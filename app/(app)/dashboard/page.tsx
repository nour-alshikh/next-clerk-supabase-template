import { Suspense } from "react";
import { currentUser } from "@clerk/nextjs/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NoteForm } from "@/features/notes/components/note-form";
import { NoteList } from "@/features/notes/components/note-list";
import { NoteListSkeleton } from "@/features/notes/components/note-list-skeleton";
import { requireUser } from "@/lib/auth";

export default function DashboardPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-8">
      <Suspense fallback={<h1 className="h-8 text-2xl font-semibold" />}>
        <Greeting />
      </Suspense>
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <NoteForm />
          <Suspense fallback={<NoteListSkeleton />}>
            <ProtectedNoteList />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}

async function Greeting() {
  await requireUser();
  const user = await currentUser();
  const name = user?.firstName ?? user?.emailAddresses[0]?.emailAddress;
  return <h1 className="text-2xl font-semibold">Welcome, {name}</h1>;
}

async function ProtectedNoteList() {
  await requireUser();
  return <NoteList />;
}
