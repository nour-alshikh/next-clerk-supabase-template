# Building a Module

Every feature ("module") follows the same shape. `features/notes` is the working reference: copy it.

## Folder layout

```
app/
  (marketing)/            public pages (landing)
  (auth)/                 sign-in, sign-up
  (app)/                  signed-in area: loading.tsx + error.tsx shared by all pages here
    <module>/page.tsx     the module's route
features/
  <module>/
    schema.ts             zod schemas, shared by form (client) and actions (server)
    queries.ts            reads (server-only)
    actions.ts            Server Actions: create / update / delete
    components/           UI used only by this module
components/
  ui/                     shadcn components (npx shadcn@latest add <name>)
  motion/                 Reveal, Stagger, SplitText
lib/
  auth.ts                 requireUser(), getUserId()
  action.ts               createAction() wrapper + ActionError
  action-result.ts        ActionResult type
  forms.ts                handleActionResult() for react-hook-form
  env.ts / env.server.ts  validated env vars
  supabase/               typed Supabase clients
  gsap.ts                 registered GSAP + plugins
types/database.ts         generated DB types (npm run db:types)
supabase/
  migrations/             applied to the database in order
  templates/              copy-paste starting points (not applied)
```

Route groups like `(app)` don't appear in the URL: `app/(app)/dashboard/page.tsx` is `/dashboard`.

---

## Step by step: adding a module

Example: a `projects` module.

### 1. Database

```bash
npm run db:link              # one time per project, asks for the project ref + DB password
npm run db:new projects      # creates supabase/migrations/<timestamp>_projects.sql
```

Paste in `supabase/templates/user-owned-table.sql`, rename `items` → `projects`, edit columns, then:

```bash
npm run db:push              # apply to Supabase
npm run db:types             # regenerate types/database.ts
```

> Every user-owned table needs `user_id text default (auth.jwt()->>'sub')` + the four RLS policies. Without RLS, every user can read every row.

### 2. `features/projects/schema.ts`

```ts
import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(100),
});
export type ProjectInput = z.infer<typeof projectSchema>;
```

### 3. `features/projects/queries.ts`

```ts
import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getProjects() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from("projects").select("*").order("created_at");
  if (error) throw new Error(`Failed to load projects: ${error.message}`);
  return data; // fully typed from types/database.ts
}
```

RLS already limits rows to the current user, so there's no need to filter by `user_id`.

### 4. `features/projects/actions.ts`

```ts
"use server";

import { refresh } from "next/cache";
import { ActionError, createAction } from "@/lib/action";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { projectSchema } from "./schema";

export const createProject = createAction(projectSchema, async (input, { userId }) => {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("projects").insert(input);
  if (error) throw new ActionError(`Could not create project: ${error.message}`);
  refresh(); // re-render the current page with fresh data
});
```

`createAction` handles all of these for you:
- returns an error if the user isn't signed in
- validates input with the schema and returns per-field errors
- catches errors and returns `{ ok: false, error }`, so it never throws to the client
  - `ActionError` messages are shown to the user
  - anything else is logged, and the user sees a generic message

The result is always `{ ok: true, data } | { ok: false, error, fieldErrors? }`.

### 5. Form component

```tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { handleActionResult } from "@/lib/forms";
import { createProject } from "../actions";
import { projectSchema, type ProjectInput } from "../schema";

const form = useForm<ProjectInput>({ resolver: zodResolver(projectSchema), defaultValues: { name: "" } });

async function onSubmit(values: ProjectInput) {
  const result = await createProject(values);
  if (handleActionResult(form, result, "Project created")) form.reset();
}
```

`handleActionResult` puts server field errors on the inputs and shows a toast. For field markup (`Field`, `FieldLabel`, `FieldError` + `Controller`), see `features/notes/components/note-form.tsx`.

For buttons that aren't forms (delete, toggle), use `useTransition` + `toast`. See `delete-note-button.tsx`.

### 6. Page: `app/(app)/projects/page.tsx`

```tsx
import { Suspense } from "react";
import { requireUser } from "@/lib/auth";

export default function ProjectsPage() {
  return (
    <main>
      <Suspense fallback={<ProjectListSkeleton />}>
        <ProtectedProjectList />
      </Suspense>
    </main>
  );
}

async function ProtectedProjectList() {
  await requireUser(); // redirects to /sign-in if signed out
  return <ProjectList />;
}
```

---

## Rules

| Rule | Why |
| --- | --- |
| Call `requireUser()` in every page that shows user data. `createAction` does it for actions. | Layouts don't re-run on client navigation, so auth checks in a layout can be skipped. |
| Anything that awaits auth, cookies, headers or user data goes inside `<Suspense>`. | Required by `cacheComponents`. Without it, the build fails. |
| Don't use `"use cache"` on per-user queries. | Cached output could be served to another user. |
| After a mutation, call `refresh()`. Use `revalidatePath`/`updateTag` only for shared cached data. | Per-user pages aren't cached, so `refresh()` is enough. |
| Auth-dependent UI in layouts (header, nav) must be a client component. | Server-rendered layout UI goes stale after sign-in/out. |
| Only `NEXT_PUBLIC_*` env vars in client code. Add new vars to `lib/env.ts` or `lib/env.server.ts` **and** `.env.example`. | Validation fails fast with a clear message. |
| Import GSAP from `@/lib/gsap`, never from `"gsap"` directly. | Plugins are registered there. |

---

## Animation primitives (`components/motion`)

All of them skip animation for users with "reduce motion" turned on, and hide content until GSAP starts so nothing flashes.

```tsx
import { Reveal } from "@/components/motion/reveal";
import { Stagger } from "@/components/motion/stagger";
import { SplitText } from "@/components/motion/split-text";

// Fade/slide in when scrolled into view
<Reveal>...</Reveal>
<Reveal y={40} delay={0.2} repeat>...</Reveal>          // replay when scrolling back
<Reveal immediate>...</Reveal>                          // on mount, not on scroll

// Children animate in one after another
<Stagger as="ul" stagger={0.1}>
  <li>…</li><li>…</li>
</Stagger>

// Headline split into words/lines/chars
<SplitText as="h1" by="words">Big headline here</SplitText>
```

Custom animations: use `useGSAP` from `@/lib/gsap` with a `scope` ref, and wrap in `gsap.matchMedia().add(MOTION_OK, ...)` to respect reduced motion.

---

## npm scripts

| Script | Does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run db:link` | Link the Supabase CLI to your project (once) |
| `npm run db:new <name>` | New migration file |
| `npm run db:push` | Apply migrations to Supabase |
| `npm run db:types` | Regenerate `types/database.ts` |
