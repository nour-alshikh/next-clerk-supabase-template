import { clerkMiddleware } from "@clerk/nextjs/server";

// Makes the Clerk session available to auth()/currentUser().
// Protect routes inside each page/layout/route handler with `await auth.protect()`.
export default clerkMiddleware({
  // Dev only: tolerate a PC clock up to 60s off (Clerk's default is 5s), which
  // otherwise shows up as sign-in redirect loops and "You must be signed in".
  // Production keeps the strict default.
  clockSkewInMs: process.env.NODE_ENV === "development" ? 60_000 : undefined,
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
