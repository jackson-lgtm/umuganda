-- Run this in your Supabase SQL editor

create table if not exists needs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  title text not null,
  description text,
  category text[] default '{}',
  area text,
  location text,
  urgency text,
  helpers_needed integer default 1,
  time_required text,
  contact_name text,
  contact_whatsapp text,
  submitted_by text,
  pipeline text default 'Open'
);

create table if not exists helpers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  whatsapp text,
  email text,
  area text,
  skills text[] default '{}',
  availability text[] default '{}',
  time_per_session text,
  languages text[] default '{}',
  about text,
  pipeline text default 'New'
);

create table if not exists helper_responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  need_id uuid references needs(id) on delete cascade,
  helper_name text not null,
  helper_whatsapp text,
  helper_email text,
  message text
);

-- Enable row level security
alter table needs enable row level security;
alter table helpers enable row level security;
alter table helper_responses enable row level security;

-- Allow anyone to read open needs
create policy "Public can read open needs"
  on needs for select
  using (pipeline != 'Closed');

-- Allow anyone to insert a need
create policy "Anyone can submit a need"
  on needs for insert
  with check (true);

-- Allow anyone to insert a helper
create policy "Anyone can register as helper"
  on helpers for insert
  with check (true);

-- Allow anyone to insert a helper response
create policy "Anyone can respond to a need"
  on helper_responses for insert
  with check (true);

-- Service role can do everything (used by server actions)
