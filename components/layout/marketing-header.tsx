"use client";

import Link from "next/link";
import { Show, SignInButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";

// Header for public pages. Client component so it updates right after sign-in/out.
export function MarketingHeader() {
  return (
    <header className="flex h-14 items-center justify-between border-b px-4">
      <Logo />
      <nav className="flex items-center gap-2">
        <ThemeToggle />
        <Show when="signed-out">
          <SignInButton>
            <Button size="sm">Sign in</Button>
          </SignInButton>
        </Show>
        <Show when="signed-in">
          <Button size="sm" nativeButton={false} render={<Link href="/dashboard" />}>
            Dashboard
          </Button>
        </Show>
      </nav>
    </header>
  );
}
