-- BIPI core schema — mirrors pitch Section 9 (Identity and Data Architecture).
-- Four tables: users (guest/verified profiles), sessions, responses (raw,
-- consented interaction log), and pulse (aggregated, district-level output
-- with no device_id — this is the only table the partner dashboard reads).

create extension if not exists "pgcrypto";

create table if not exists users (
  device_id uuid primary key default gen_random_uuid(),
  region text,
  gender_type text check (gender_type in ('youth', 'woman', 'person-with-disability', 'other')),
  language text check (language in ('tw', 'pcm', 'en')) default 'tw',
  tier text check (tier in ('guest', 'verified')) default 'guest',
  consent_given boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists sessions (
  session_id uuid primary key default gen_random_uuid(),
  device_id uuid not null references users(device_id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  modules_attempted int not null default 0,
  modules_completed int not null default 0,
  connection_type text check (connection_type in ('online', 'offline')) default 'online'
);

create table if not exists responses (
  response_id uuid primary key default gen_random_uuid(),
  device_id uuid not null references users(device_id) on delete cascade,
  module_id int not null,
  topic text not null,
  track text not null,
  content_format_used text not null,
  answer_given text,
  is_correct boolean,
  time_spent_seconds int,
  replayed boolean not null default false,
  dropped_off boolean not null default false,
  created_at timestamptz not null default now()
);

-- Aggregated, anonymised output. No device_id column — by construction, this
-- table cannot re-identify a user even if fully exported to a partner.
create table if not exists pulse (
  id bigint generated always as identity primary key,
  region text not null,
  topic text not null,
  track text not null,
  user_type text not null,
  avg_score numeric,
  fail_rate numeric,
  drop_off_rate numeric,
  format_used text,
  week date not null,
  cohort_size int not null,
  unique (region, topic, track, user_type, format_used, week)
);

alter table users enable row level security;
alter table sessions enable row level security;
alter table responses enable row level security;

-- Each device may only read/write its own rows; aggregation into `pulse`
-- runs server-side with the service role key (see lib/pulse/aggregate.ts).
create policy "device owns its user row" on users
  for all using (device_id = (current_setting('request.jwt.claims', true)::json ->> 'device_id')::uuid);

create policy "device owns its sessions" on sessions
  for all using (device_id = (current_setting('request.jwt.claims', true)::json ->> 'device_id')::uuid);

create policy "device owns its responses" on responses
  for all using (device_id = (current_setting('request.jwt.claims', true)::json ->> 'device_id')::uuid);
