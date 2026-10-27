import { Suspense } from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 p-8">
      <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
        <Dashboard />
      </Suspense>
    </main>
  );
}

async function Dashboard() {
  // Redirects signed-out visitors to /sign-in
  await auth.protect();
  const user = await currentUser();
  const supabase = createServerSupabaseClient();
  const { data: notes, error } = await supabase
    .from("notes")
    .select("id, content")
    .order("created_at", { ascending: false });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Welcome, {user?.firstName ?? user?.emailAddresses[0]?.emailAddress}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-sm text-destructive">
            Supabase: {error.message} (is Clerk added under Supabase → Third-Party
            Auth, and has supabase/migrations been run?)
          </p>
        ) : notes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No notes yet.</p>
        ) : (
          <ul className="list-disc pl-5 text-sm">
            {notes.map((note) => (
              <li key={note.id}>{note.content}</li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
