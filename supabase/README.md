# Supabase database setup

## Prerequisites

1. Create a project at [supabase.com](https://supabase.com).
2. Copy your project URL and anon key into `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

## Run the migration

1. Open your Supabase project dashboard.
2. Go to **SQL Editor** → **New query**.
3. Paste the contents of [`migrations/001_initial_schema.sql`](./migrations/001_initial_schema.sql).
4. Click **Run**.

## Schema overview

| Table       | Purpose                                      |
| ----------- | -------------------------------------------- |
| `profiles`  | One row per user (`id` → `auth.users`), unique `handle` |
| `bookmarks` | User bookmarks with optional `is_public` flag |

## Security model

### Profiles

- Authenticated users can read, insert, and update **only their own** profile.
- `handle` is enforced unique at the database level.
- Anonymous users cannot read the `profiles` table directly. Use the `public_profiles` view (`id`, `handle`, `created_at`) for public profile pages.

### Bookmarks

- Authenticated users have full CRUD on **their own** bookmarks.
- Anonymous and authenticated users can **read** bookmarks where `is_public = true`.
- Private bookmarks are visible only to their owner.

### Sign-up hook

A trigger on `auth.users` automatically creates a `profiles` row with a generated handle when a user registers.
