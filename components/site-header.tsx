"use client";

import Link from "next/link";
import { Show, SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

// Client component on purpose: the root layout isn't re-rendered on client-side
// navigation, so a server-rendered header would go stale after sign-in/out.
export function SiteHeader() {
  return (
    <header className="flex h-14 items-center justify-between border-b px-4">
      <Link href="/" className="font-semibold">
        Next Template
      </Link>
      <nav className="flex items-center gap-2">
        <Show when="signed-out">
          <SignInButton>
            <Button size="sm">Sign in</Button>
          </SignInButton>
        </Show>
        <Show when="signed-in">
          <Button variant="ghost" size="sm" render={<Link href="/dashboard" />}>
            Dashboard
          </Button>
          <SignOutButton redirectUrl="/">
            <Button variant="outline" size="sm">
              Sign out
            </Button>
          </SignOutButton>
          <UserButton />
        </Show>
      </nav>
    </header>
  );
}
