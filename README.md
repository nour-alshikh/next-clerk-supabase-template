# Next Template

Next.js 16 · Clerk (Google sign-in) · Supabase · shadcn/ui · GSAP

> **Starting a new project from this template? Follow [NEW_PROJECT.md](NEW_PROJECT.md).**
> **Adding a feature? Follow [docs/MODULES.md](docs/MODULES.md).**

## Setup

1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in the keys.
3. **Clerk** (dashboard.clerk.com)
   - Create an application → API keys → copy publishable + secret keys.
   - User & authentication → SSO connections → enable **Google**. Disable email/password if Google should be the only option.
   - For production, add your own Google OAuth client ID/secret (dev instances use Clerk's shared credentials).
4. **Supabase** (supabase.com/dashboard)
   - Project Settings → API → copy the project URL and publishable key.
   - Authentication → Sign In / Providers → Third-Party Auth → add **Clerk** (follow the link to Clerk's Supabase integration page and paste the Clerk domain).
   - Run `supabase/migrations/0001_notes.sql` in the SQL editor (or `supabase db push`).
5. `npm run dev`

## Where things live

| Path | Purpose |
| --- | --- |
| `proxy.ts` | Clerk middleware; protect pages with `requireUser()` from `lib/auth.ts` |
| `features/<module>/` | One folder per feature: schema, queries, actions, components |
| `features/notes/` | Reference module: copy it for new features |
| `lib/action.ts` | `createAction()`: auth + zod validation + error handling for Server Actions |
| `lib/supabase/` | Typed Supabase clients, authed with the Clerk token |
| `lib/env.ts` | Validated env vars |
| `components/motion/` | `Reveal`, `Stagger`, `SplitText` animation primitives |
| `components/ui/` | shadcn components (`npx shadcn@latest add <name>`) |
| `supabase/templates/` | Migration template for user-owned tables |

Full guide: [docs/MODULES.md](docs/MODULES.md).

With `cacheComponents` on, anything reading auth/session/URL (Clerk `Show`, `SignIn`, `auth()`, `currentUser()`) must render inside `<Suspense>`.
