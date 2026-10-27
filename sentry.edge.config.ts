import * as Sentry from "@sentry/nextjs";

// Edge-runtime Sentry (proxy.ts, edge route handlers). Off when NEXT_PUBLIC_SENTRY_DSN is empty.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,
});
