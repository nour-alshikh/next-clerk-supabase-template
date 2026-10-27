import * as Sentry from "@sentry/nextjs";

// Browser Sentry, loaded before the app becomes interactive.
// Off when NEXT_PUBLIC_SENTRY_DSN is empty.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,
});

// Traces client-side navigations
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
