-- One row per Clerk user, kept in sync by the Clerk webhook (app/api/webhooks/clerk/route.ts).
-- Join on it for names/avatars; the webhook writes with the secret key, users can only read their own row.

-- Reusable trigger: keeps updated_at current on any table that has the column.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  -- Clerk user id (user_...), same value as user_id on user-owned tables
  id text primary key,
  email text,
  first_name text,
  last_name text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

create policy "Users read own profile" on public.profiles
  for select to authenticated using ((select auth.jwt()->>'sub') = id);
