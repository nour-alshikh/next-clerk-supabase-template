import "server-only";
import { auth } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import { z } from "zod";
import type { ActionResult } from "@/lib/action-result";
import { rateLimit } from "@/lib/rate-limit";

// Throw this inside an action handler to show `message` to the user.
// Any other error is logged (and sent to Sentry) and replaced with a generic message.
export class ActionError extends Error {}

/**
 * Wraps a Server Action: checks the user is signed in, rate limits per user,
 * validates input with `schema`, and turns the outcome into an ActionResult
 * instead of throwing.
 *
 * export const createThing = createAction(thingSchema, async (input, { userId }) => { ... });
 */
export function createAction<S extends z.ZodType, T>(
  schema: S,
  handler: (input: z.output<S>, ctx: { userId: string }) => Promise<T>,
) {
  return async (input: z.input<S>): Promise<ActionResult<T>> => {
    const { userId } = await auth();
    if (!userId) return { ok: false, error: "You must be signed in." };

    if (!(await rateLimit(`action:${userId}`)).success) {
      return { ok: false, error: "Too many requests. Please wait a moment and try again." };
    }

    const parsed = schema.safeParse(input);
    if (!parsed.success) {
      return {
        ok: false,
        error: "Please fix the highlighted fields.",
        fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]>,
      };
    }

    try {
      return { ok: true, data: await handler(parsed.data, { userId }) };
    } catch (error) {
      if (error instanceof ActionError) return { ok: false, error: error.message };
      console.error(error);
      Sentry.captureException(error);
      return { ok: false, error: "Something went wrong. Please try again." };
    }
  };
}
