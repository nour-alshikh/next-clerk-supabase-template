import * as Sentry from "@sentry/nextjs";

// Runs once when the server starts: loads Sentry for the current runtime.
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") await import("./sentry.server.config");
  if (process.env.NEXT_RUNTIME === "edge") await import("./sentry.edge.config");
}

// Reports errors from Server Components, route handlers, actions and proxy.
export const onRequestError = Sentry.captureRequestError;
