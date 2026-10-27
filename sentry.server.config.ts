import * as Sentry from "@sentry/nextjs";

// Server-side Sentry (Node.js runtime). Off when NEXT_PUBLIC_SENTRY_DSN is empty.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
  // Share of requests traced for performance; lower it on busy apps
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,
});
