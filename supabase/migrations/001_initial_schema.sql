-- LinkVault initial schema
-- Run this migration in the Supabase SQL Editor (Dashboard → SQL → New query).
--
-- Creates:
--   • public.profiles  — one row per auth user, unique handle
--   • public.bookmarks — per-user bookmarks with optional public visibility
--   • Row Level Security policies for both tables
--   • Trigger to auto-create a profile when a user signs up

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  handle text not null,
  created_at timestamptz not null default now(),

  constraint profiles_handle_unique unique (handle),
  constraint profiles_handle_format check (
    handle ~ '^[a-z0-9][a-z0-9_-]{2,29}$'
  ),
  constraint profiles_email_format check (
    email ~ '^[^@]+@[^@]+\.[^@]+$'
  )
);

comment on table public.profiles is 'Application profile for each authenticated user.';
comment on column public.profiles.handle is 'Unique public username (3–30 chars, lowercase alphanumeric, _ or -).';

create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  url text not null,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),

  constraint bookmarks_title_not_empty check (char_length(trim(title)) > 0),
  constraint bookmarks_url_not_empty check (char_length(trim(url)) > 0),
  constraint bookmarks_url_format check (
    url ~ '^https?://[^\s]+$'
  )
);

comment on table public.bookmarks is 'User bookmarks. is_public = true makes a bookmark visible to anonymous visitors.';

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index profiles_handle_idx on public.profiles (handle);

create index bookmarks_user_id_idx on public.bookmarks (user_id);
create index bookmarks_public_idx on public.bookmarks (is_public) where is_public = true;
create index bookmarks_user_created_idx on public.bookmarks (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Auto-create profile on sign-up
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_handle text;
  candidate_handle text;
  suffix integer := 0;
begin
  -- Derive a handle from the email local-part; fall back to user id prefix.
  base_handle := lower(regexp_replace(split_part(new.email, '@', 1), '[^a-z0-9_-]', '', 'g'));

  if base_handle = '' or char_length(base_handle) < 3 then
    base_handle := 'user_' || left(replace(new.id::text, '-', ''), 8);
  end if;

  base_handle := left(base_handle, 30);
  candidate_handle := base_handle;

  -- Resolve collisions by appending a numeric suffix.
  while exists (select 1 from public.profiles where handle = candidate_handle) loop
    suffix := suffix + 1;
    candidate_handle := left(base_handle, 30 - char_length(suffix::text)) || suffix::text;
  end loop;

  insert into public.profiles (id, email, handle)
  values (new.id, new.email, candidate_handle);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security — profiles
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;

-- Authenticated users can read their own profile.
create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (id = (select auth.uid()));

-- Authenticated users can update their own profile (handle uniqueness enforced by constraint).
create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- Authenticated users can insert their own profile (e.g. if trigger was skipped).
create policy "profiles_insert_own"
  on public.profiles
  for insert
  to authenticated
  with check (id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- Public profile view (exposes only non-sensitive columns)
-- ---------------------------------------------------------------------------

-- security_invoker = false: view runs as owner and bypasses RLS, exposing only safe columns.
create view public.public_profiles
with (security_invoker = false) as
  select id, handle, created_at
  from public.profiles;

comment on view public.public_profiles is
  'Safe read surface for public profile pages. Use this instead of profiles when querying by handle.';

-- ---------------------------------------------------------------------------
-- Row Level Security — bookmarks
-- ---------------------------------------------------------------------------

alter table public.bookmarks enable row level security;

-- Owners can read all of their bookmarks (public and private).
create policy "bookmarks_select_own"
  on public.bookmarks
  for select
  to authenticated
  using (user_id = (select auth.uid()));

-- Anyone (including anonymous visitors) can read public bookmarks.
create policy "bookmarks_select_public"
  on public.bookmarks
  for select
  to anon, authenticated
  using (is_public = true);

-- Owners can create bookmarks for themselves only.
create policy "bookmarks_insert_own"
  on public.bookmarks
  for insert
  to authenticated
  with check (user_id = (select auth.uid()));

-- Owners can update their own bookmarks.
create policy "bookmarks_update_own"
  on public.bookmarks
  for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Owners can delete their own bookmarks.
create policy "bookmarks_delete_own"
  on public.bookmarks
  for delete
  to authenticated
  using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------

grant usage on schema public to anon, authenticated;

grant select on public.profiles to authenticated;
grant insert, update on public.profiles to authenticated;

grant select on public.public_profiles to anon, authenticated;

grant select on public.bookmarks to anon, authenticated;
grant insert, update, delete on public.bookmarks to authenticated;
