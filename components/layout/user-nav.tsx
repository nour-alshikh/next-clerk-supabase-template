"use client";

import { SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import { LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

// Avatar (opens Clerk's account menu) + name + sign out.
// `compact` hides the name, e.g. in the top bar.
export function UserNav({ compact = false }: { compact?: boolean }) {
  const { user } = useUser();

  return (
    <div className="flex min-w-0 items-center gap-2">
      <UserButton />
      {!compact && (
        <div className="flex min-w-0 flex-1 flex-col text-sm leading-tight group-data-[collapsible=icon]:hidden">
          <span className="truncate font-medium">{user?.fullName ?? user?.username}</span>
          <span className="truncate text-xs text-muted-foreground">
            {user?.primaryEmailAddress?.emailAddress}
          </span>
        </div>
      )}
      <SignOutButton redirectUrl="/">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Sign out"
          className="group-data-[collapsible=icon]:hidden"
        >
          <LogOutIcon />
        </Button>
      </SignOutButton>
    </div>
  );
}
