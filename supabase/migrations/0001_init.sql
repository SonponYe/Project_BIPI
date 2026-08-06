-- BIPI core schema — mirrors pitch Section 9 (Identity and Data Architecture).
-- Four tables: bipi_users (guest/verified profiles), bipi_sessions,
-- bipi_responses (raw, consented interaction log), and bipi_pulse
-- (aggregated, district-level output with no device_id — this is the only
-- table the partner dashboard reads).
--
-- Tables are prefixed `bipi_` because this Supabase project is shared with
-- other, unrelated apps (it already has its own `users`, `sessions`, etc.
-- with a completely different schema) — the prefix keeps BIPI's schema
-- collision-free without touching anything that was already here.

create extension if not exists "pgcrypto";

create table if not exists bipi_users (
  device_id uuid primary key default gen_random_uuid(),
  region text,
  gender_type text check (gender_type in ('youth', 'woman', 'person-with-disability', 'other')),
  language text check (language in ('tw', 'pcm', 'en')) default 'tw',
  tier text check (tier in ('guest', 'verified')) default 'guest',
  consent_given boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists bipi_sessions (
  session_id uuid primary key default gen_random_uuid(),
  device_id uuid not null references bipi_users(device_id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  modules_attempted int not null default 0,
  modules_completed int not null default 0,
  connection_type text check (connection_type in ('online', 'offline')) default 'online'
);

create table if not exists bipi_responses (
  response_id uuid primary key default gen_random_uuid(),
  device_id uuid not null references bipi_users(device_id) on delete cascade,
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
create table if not exists bipi_pulse (
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

alter table bipi_users enable row level security;
alter table bipi_sessions enable row level security;
alter table bipi_responses enable row level security;

-- Each device may only read/write its own rows; aggregation into
-- `bipi_pulse` runs server-side with the service role key (see
-- lib/pulse/aggregate.ts).
create policy "device owns its user row" on bipi_users
  for all using (device_id = (current_setting('request.jwt.claims', true)::json ->> 'device_id')::uuid);

create policy "device owns its sessions" on bipi_sessions
  for all using (device_id = (current_setting('request.jwt.claims', true)::json ->> 'device_id')::uuid);

create policy "device owns its responses" on bipi_responses
  for all using (device_id = (current_setting('request.jwt.claims', true)::json ->> 'device_id')::uuid);
