import "server-only";
import { z } from "zod";

// Server-only env vars. Importing this from a client component fails the build.
// Optional services (webhooks, rate limiting, email) switch off when their vars are empty.
const optional = z.string().optional().transform((v) => v || undefined);

const schema = z.object({
  CLERK_SECRET_KEY: z.string().startsWith("sk_"),
  // Clerk webhook (user sync to the profiles table)
  CLERK_WEBHOOK_SIGNING_SECRET: optional,
  // Bypasses RLS: only for webhooks and admin jobs, never with user input alone
  SUPABASE_SECRET_KEY: optional,
  // Upstash Redis (rate limiting)
  UPSTASH_REDIS_REST_URL: optional,
  UPSTASH_REDIS_REST_TOKEN: optional,
  // Resend (email)
  RESEND_API_KEY: optional,
  EMAIL_FROM: optional,
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(
    `Invalid server env vars — check .env.local:\n${z.prettifyError(parsed.error)}`,
  );
}

export const serverEnv = parsed.data;
