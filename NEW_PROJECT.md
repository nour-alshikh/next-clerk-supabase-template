# Starting a New Project From This Template

Checklist to follow every time you create a new project from this template.

---

## 1. Create the repo

**Option A: GitHub template (recommended)**
1. One time only: on GitHub, open this repo → **Settings** → tick **Template repository**.
2. Click **Use this template** → **Create a new repository**, or run:
   ```bash
   gh repo create <new-name> --template nour-alshikh/next-clerk-supabase-template --private --clone
   ```

**Option B: plain clone**
```bash
git clone https://github.com/nour-alshikh/next-clerk-supabase-template.git <new-name>
cd <new-name>
rm -rf .git && git init -b main
git remote add origin https://github.com/<you>/<new-name>.git
```

Then:
- Change `"name"` in `package.json`.
- In `config/site.ts`:
  - set `name` and `description`
  - pick `appLayout`: `"sidebar"` or `"topbar"`
  - edit the nav links
- Change the landing text in `app/(marketing)/page.tsx` and the logo mark in `components/layout/logo.tsx`.
- If you have a new Figma tokens file, swap the `--brand-*` / `--gray-*` colors in `app/globals.css`.

```bash
npm install
cp .env.example .env.local
```

---

## 2. Clerk (auth, Google sign-in)

1. Go to [dashboard.clerk.com](https://dashboard.clerk.com) → **Create application** → enable **Google**.
   - To make Google the only sign-in method, turn off **Email** and **Password** under *User & authentication*.
2. **API keys** → copy into `.env.local`:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```
3. Open [dashboard.clerk.com/setup/supabase](https://dashboard.clerk.com/setup/supabase) → pick the app → **Activate Supabase integration**.
   - This adds the `role: authenticated` claim Supabase needs.
   - Copy the **Clerk domain** it shows, e.g. `https://xxxx.clerk.accounts.dev`.

---

## 3. Supabase (database)

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**. Save the DB password.
2. **Project Settings → API** → copy into `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   SUPABASE_SECRET_KEY=sb_secret_...      # server only
   SUPABASE_DB_PASSWORD=...               # server only
   ```
3. **Authentication → Sign In / Providers → Third-Party Auth → Add provider → Clerk**.
   - Paste the Clerk domain **with `https://`** and **no trailing slash**: `https://xxxx.clerk.accounts.dev`
4. Run the migrations in `supabase/migrations/`:
   - In the **SQL Editor**, paste each file in order and run it, **or**
   - with the CLI: `npm run db:link` (enter project ref + DB password), then `npm run db:push`.
5. `npm run db:types` to regenerate `types/database.ts` for the new project.

> ⚠️ **Never** put the secret key (`sb_secret_...`) or `CLERK_SECRET_KEY` in a `NEXT_PUBLIC_*` variable, because those are sent to the browser.
> ⚠️ **Never** put real values in `.env.example`, because it is committed. Real values go only in `.env.local`, which is gitignored.

The migrations create `notes` (example), `profiles` (synced from Clerk) and the private `uploads` Storage bucket.

---

## 3b. Optional services

Each one switches itself off when its env vars are empty, so the app runs without them.

**Clerk webhook (fills `profiles`, deletes user data on account deletion, sends welcome email)**
1. Clerk → **Webhooks** → **Add endpoint**: `https://<your-domain>/api/webhooks/clerk`, events `user.created`, `user.updated`, `user.deleted`.
   - Local dev: expose port 3000 with a tunnel (e.g. `ngrok http 3000`) and use that URL.
2. Copy the **Signing secret** → `CLERK_WEBHOOK_SIGNING_SECRET`. The webhook also needs `SUPABASE_SECRET_KEY`.
3. New user-owned table or bucket? Add it to `deleteUserData()` in `app/api/webhooks/clerk/route.ts`.

**Sentry (error monitoring)**: create a Next.js project at sentry.io → `NEXT_PUBLIC_SENTRY_DSN`. For readable stack traces in production also set `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN` in the hosting env (source maps upload at build).

**Upstash (rate limiting)**: console.upstash.com → create Redis → `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`. Every `createAction` is then limited to 30 calls/min per user (`lib/rate-limit.ts`).

**Resend (email)**: resend.com → verify your domain → `RESEND_API_KEY`, `EMAIL_FROM`. Templates live in `emails/`; preview them with `npm run email:dev`. Without a key, emails are logged instead of sent.

**Vercel Analytics / Speed Insights**: enable both in the Vercel project dashboard. No env vars; they do nothing outside Vercel.

**Security headers / CSP**: set in `next.config.ts`. When you add a third-party script, image host or browser-side API, add its host to the CSP there, or the browser will block it (check the console for `Content-Security-Policy` errors).

---

## 4. Run and verify

```bash
npm run dev
```

| Check | Expected |
| --- | --- |
| Open `/` | Landing page with a **Sign in with Google** button |
| Sign in | Redirects to `/dashboard` |
| Header while signed in | **Dashboard**, **Sign out**, avatar |
| `/dashboard` | "Welcome, <name>" and "No notes yet." |
| Sign out | Back to `/`, **Sign in** button shown |
| Open `/dashboard` while signed out | Redirects to `/sign-in` |

---

## 5. Troubleshooting

| Symptom | Cause / fix |
| --- | --- |
| Page bounces between `/dashboard` and `/sign-in`, or actions say "You must be signed in" | **PC clock is out of sync.** In dev, `proxy.ts` tolerates up to 60s (production: Clerk's default 5s); beyond that it breaks. Windows: Settings → Time & language → Date & time → **Sync now** (or `w32tm /resync` as admin). Log shows `Clock skew detected`. |
| `Supabase: No suitable key or wrong key type` | Clerk not added under Supabase **Third-Party Auth**, or the domain is wrong (must be `https://...clerk.accounts.dev`). |
| `permission denied` / empty results when data exists | Supabase integration not **activated** in Clerk (step 2.3), or the row's `user_id` doesn't match the Clerk user id. |
| `relation "public.notes" does not exist` | Migrations not run (step 3.4). |
| Build error: `usePathname() ... outside of <Suspense>` | With `cacheComponents`, anything reading auth, session or URL on the server must be inside `<Suspense>`. |
| Header shows stale signed-in/out state | Auth UI in layouts must be a client component (see `components/layout/`). |
| Env changes not picked up | Restart `npm run dev`. |

---

## 6. Going to production

- [ ] Clerk: create a **Production instance** and add your domain + DNS records.
- [ ] Clerk: add your **own Google OAuth client ID/secret** (Google Cloud Console). Dev instances use Clerk's shared credentials, which production doesn't allow.
- [ ] Clerk: activate the Supabase integration for the production instance as well.
- [ ] Supabase: add a **second** Clerk Third-Party Auth provider with the production domain (`https://clerk.yourdomain.com`).
- [ ] Hosting (e.g. Vercel): add all `.env.local` variables using the **production** Clerk keys (`pk_live_` / `sk_live_`).
- [ ] Supabase: check **Advisors → Security** for missing RLS policies.

---

## Stack reference

| Piece | Where |
| --- | --- |
| Auth middleware | `proxy.ts` (Next 16 renamed `middleware` to `proxy`) |
| Protect a page | `await requireUser()` from `lib/auth.ts` (actions: use `createAction`) |
| Add a feature | Follow `docs/MODULES.md` |
| Supabase (server) | `createServerSupabaseClient()` from `lib/supabase/server.ts` |
| Supabase (client) | `useSupabase()` from `lib/supabase/client.ts` |
| GSAP | import `gsap`, `useGSAP`, `ScrollTrigger` from `lib/gsap.ts` |
| UI components | `components/ui/` and add more with `npx shadcn@latest add <name>` |
| New table | `npm run db:new <name>` + paste `supabase/templates/user-owned-table.sql` |
| Big table (server paging) | `DataTable` `server` prop + `parseTableParams` (see `features/notes`) |
| File uploads | `<FileUploadButton>` from `components/file-upload-button.tsx` (see `features/files`) |
| Send email | `sendEmail()` from `lib/email.ts`, templates in `emails/` |
| Rate limit | built into `createAction`; custom: `rateLimit(key)` from `lib/rate-limit.ts` |
| User data (names/avatars) | `profiles` table, synced by `app/api/webhooks/clerk/route.ts` |
| Errors | Sentry: `instrumentation.ts`, `instrumentation-client.ts`, `app/global-error.tsx` |
| Security headers / CSP | `next.config.ts` |
