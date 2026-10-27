"use client";

import Link from "next/link";
import { Show, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

// Client component so it updates as soon as Clerk's session changes.
export function AuthCta() {
  return (
    <>
      <Show when="signed-out">
        <SignInButton>
          <Button size="lg">Sign in with Google</Button>
        </SignInButton>
      </Show>
      <Show when="signed-in">
        <Button size="lg" nativeButton={false} render={<Link href="/dashboard" />}>
          Go to dashboard
        </Button>
      </Show>
    </>
  );
}
