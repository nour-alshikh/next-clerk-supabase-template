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
- Change `title` and `description` in `app/layout.tsx`.
- Change the project name in `components/site-header.tsx` and `app/page.tsx`.

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
   - with the CLI: `npx supabase link --project-ref <project-ref>` then `npx supabase db push`.

> ⚠️ **Never** put the secret key (`sb_secret_...`) or `CLERK_SECRET_KEY` in a `NEXT_PUBLIC_*` variable, because those are sent to the browser.
> ⚠️ **Never** put real values in `.env.example`, because it is committed. Real values go only in `.env.local`, which is gitignored.

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
| Page bounces between `/dashboard` and `/sign-in` | **PC clock is out of sync.** Clerk allows ~5s. Windows: Settings → Time & language → Date & time → **Sync now** (or `w32tm /resync` as admin). Log shows `Clock skew detected`. |
| `Supabase: No suitable key or wrong key type` | Clerk not added under Supabase **Third-Party Auth**, or the domain is wrong (must be `https://...clerk.accounts.dev`). |
| `permission denied` / empty results when data exists | Supabase integration not **activated** in Clerk (step 2.3), or the row's `user_id` doesn't match the Clerk user id. |
| `relation "public.notes" does not exist` | Migrations not run (step 3.4). |
| Build error: `usePathname() ... outside of <Suspense>` | With `cacheComponents`, anything reading auth, session or URL on the server must be inside `<Suspense>`. |
| Header shows stale signed-in/out state | Auth UI in layouts must be a client component (see `components/site-header.tsx`). |
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
| Protect a page/action | `await auth.protect()` inside it |
| Supabase (server) | `createServerSupabaseClient()` from `lib/supabase/server.ts` |
| Supabase (client) | `useSupabase()` from `lib/supabase/client.ts` |
| GSAP | import `gsap`, `useGSAP`, `ScrollTrigger` from `lib/gsap.ts` |
| UI components | `components/ui/` and add more with `npx shadcn@latest add <name>` |
| New table | Copy `supabase/migrations/0001_notes.sql` pattern: `user_id text default auth.jwt()->>'sub'` + RLS policies |
