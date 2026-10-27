import "server-only";
import { auth } from "@clerk/nextjs/server";

// For pages: redirects signed-out visitors to /sign-in, returns the Clerk user id.
export async function requireUser() {
  const { userId } = await auth.protect();
  return userId;
}

// For optional auth: returns the Clerk user id or null.
export async function getUserId() {
  const { userId } = await auth();
  return userId;
}
