-- ================================================================
-- Umuganda V3 migration — auth, matching, verification, scouts
-- Run in Supabase SQL Editor after supabase-migration-v2.sql
-- ================================================================

-- Add status to helper_responses (pending → accepted / declined)
alter table helper_responses
  add column if not exists status text not null default 'pending';
-- 'pending' | 'accepted' | 'declined'

-- Update task_verifications to support two separate forms (poster + volunteer)
alter table task_verifications
  add column if not exists party text, -- 'poster' | 'volunteer'
  add column if not exists completed_at timestamptz;

-- Scout submissions (I saw a need elsewhere)
create table if not exists scout_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  title text not null,
  description text,
  area text,
  location text,
  category text,
  urgency text,
  contact_name text,
  contact_whatsapp text,
  source_url text,
  source_platform text, -- 'facebook' | 'whatsapp' | 'olx' | 'other'
  status text not null default 'pending', -- 'pending' | 'promoted' | 'rejected'
  promoted_need_id uuid references needs(id)
);

alter table scout_submissions enable row level security;
create policy "public insert scout_submissions"
  on scout_submissions for insert with check (true);
create policy "no public read scout_submissions"
  on scout_submissions for select using (false);

-- Index for faster admin queries
create index if not exists helper_responses_need_id_idx on helper_responses(need_id);
create index if not exists helper_responses_status_idx on helper_responses(status);
