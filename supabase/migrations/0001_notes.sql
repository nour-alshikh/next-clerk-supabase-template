-- Example table scoped to the Clerk user via RLS.
-- auth.jwt()->>'sub' is the Clerk user id (requires the Clerk third-party auth integration in Supabase).
create table public.notes (
  id bigint generated always as identity primary key,
  user_id text not null default (auth.jwt()->>'sub'),
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.notes enable row level security;

create policy "Users read own notes" on public.notes
  for select to authenticated using ((select auth.jwt()->>'sub') = user_id);

create policy "Users insert own notes" on public.notes
  for insert to authenticated with check ((select auth.jwt()->>'sub') = user_id);

create policy "Users update own notes" on public.notes
  for update to authenticated using ((select auth.jwt()->>'sub') = user_id);

create policy "Users delete own notes" on public.notes
  for delete to authenticated using ((select auth.jwt()->>'sub') = user_id);
