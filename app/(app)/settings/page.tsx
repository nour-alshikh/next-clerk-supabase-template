import { Suspense } from "react";
import { UserProfile } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import { requireUser } from "@/lib/auth";

export default function SettingsPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <Profile />
      </Suspense>
    </div>
  );
}

async function Profile() {
  await requireUser();
  // Hash routing keeps Clerk's profile tabs on this one route
  return <UserProfile routing="hash" />;
}
