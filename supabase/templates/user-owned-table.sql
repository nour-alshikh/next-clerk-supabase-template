-- Template for a table owned by the signed-in Clerk user. Not run automatically.
-- 1. `npm run db:new <name>` to create a migration file
-- 2. Paste this in, replace `items` and the columns
-- 3. `npm run db:push`, then `npm run db:types`

create table public.items (
  id bigint generated always as identity primary key,
  -- Clerk user id, filled in automatically from the session token
  user_id text not null default (auth.jwt()->>'sub'),
  -- your columns here
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index items_user_id_idx on public.items (user_id);

alter table public.items enable row level security;

create policy "Users read own items" on public.items
  for select to authenticated using ((select auth.jwt()->>'sub') = user_id);

create policy "Users insert own items" on public.items
  for insert to authenticated with check ((select auth.jwt()->>'sub') = user_id);

create policy "Users update own items" on public.items
  for update to authenticated
  using ((select auth.jwt()->>'sub') = user_id)
  with check ((select auth.jwt()->>'sub') = user_id);

create policy "Users delete own items" on public.items
  for delete to authenticated using ((select auth.jwt()->>'sub') = user_id);
