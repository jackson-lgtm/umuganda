-- ================================================================
-- Umuganda V2-ready schema migration
-- Run in Supabase SQL Editor after the original supabase-schema.sql
-- ================================================================

-- USERS table (forward-compatible with V2 auth)
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  email text unique,
  phone text,
  full_name text,
  is_verified boolean default false,
  is_suspended boolean default false,
  suspension_reason text,
  -- internal trust counters, never shown publicly
  tasks_completed int default 0,
  tasks_flagged int default 0
);

-- Add moderation columns to needs
alter table needs
  add column if not exists user_id uuid references users(id),
  add column if not exists moderation_status text not null default 'live',
  add column if not exists moderation_note text,
  add column if not exists required_verifications text[] default '{}';

-- Add moderation columns to helpers
alter table helpers
  add column if not exists user_id uuid references users(id),
  add column if not exists moderation_status text not null default 'live',
  add column if not exists moderation_note text;

-- POST-TASK VERIFICATION (yes/no trust signals)
create table if not exists task_verifications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  need_id uuid references needs(id) not null,
  helper_response_id uuid references helper_responses(id),
  -- from need poster
  volunteer_showed_up boolean,
  task_safe_and_genuine boolean,
  -- from volunteer
  task_completed boolean,
  volunteer_task_safe boolean,
  -- flagged if any answer is false
  flagged boolean default false
);

-- DOCUMENT VERIFICATION (V2 — licence uploads, checks)
create table if not exists user_documents (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  user_id uuid references users(id) not null,
  document_type text not null, -- 'identity' | 'working_with_children' | 'medical' | 'trade_licence'
  file_url text not null,
  is_verified boolean default false,
  verified_at timestamptz
);

-- RLS for new tables
alter table users enable row level security;
alter table task_verifications enable row level security;
alter table user_documents enable row level security;

-- No public read of user data
create policy "no public read users"
  on users for select
  using (false);

-- Anyone can submit a task verification (both parties can respond)
create policy "public insert task_verifications"
  on task_verifications for insert
  with check (true);

-- No public read of verifications
create policy "no public read task_verifications"
  on task_verifications for select
  using (false);

-- No public read of documents
create policy "no public read user_documents"
  on user_documents for select
  using (false);

-- Update the public needs read policy to also filter by moderation_status
drop policy if exists "Public can read open needs" on needs;
create policy "Public can read live open needs"
  on needs for select
  using (pipeline != 'Closed' and moderation_status = 'live');
