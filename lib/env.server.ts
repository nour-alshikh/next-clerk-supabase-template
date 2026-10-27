import "server-only";
import { z } from "zod";

// Server-only env vars. Importing this from a client component fails the build.
const schema = z.object({
  CLERK_SECRET_KEY: z.string().startsWith("sk_"),
  SUPABASE_SECRET_KEY: z.string().optional(),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(
    `Invalid server env vars — check .env.local:\n${z.prettifyError(parsed.error)}`,
  );
}

export const serverEnv = parsed.data;
