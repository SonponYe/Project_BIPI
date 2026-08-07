-- Module content, moved out of static JSON files in the repo into the
-- database, so the app can pick modules server-side (real random
-- selection, not a hardcoded array shipped in the JS bundle) and content
-- can be updated without a code deploy.
--
-- Authoring still happens as JSON files in src/content/modules/ (git-
-- reviewable, matches the pitch's "review before it goes live" content
-- workflow) — scripts/sync-modules-to-db.ts pushes them here. The app
-- reads from this table at runtime, never from the filesystem.
--
-- Format-specific fields (choices, questions, items, zones) are stored as
-- jsonb rather than split into per-format tables — five formats with very
-- different shapes, and the app already has a typed discriminated union
-- (src/types/module.ts) that validates shape on the read side.
create table if not exists bipi_modules (
  id int primary key,
  track text not null check (track in (
    'climate-foundations', 'daily-life-inclusion', 'disaster-preparedness',
    'youth-green-jobs', 'green-economy'
  )),
  title text not null,
  format text not null check (format in (
    'scenario', 'news_clip', 'audio_story', 'mini_game', 'reflection_journal'
  )),
  assessment_method text not null,
  body_en text not null,
  body_tw text,
  body_pcm text,
  media_url text,
  time_limit_seconds int,
  choices jsonb,
  questions jsonb,
  follow_up_question text,
  items jsonb,
  zones jsonb,
  updated_at timestamptz not null default now()
);

alter table bipi_modules enable row level security;

-- Module content has no user data in it — it's meant to be publicly
-- readable by anyone using the app, unlike every other bipi_ table.
create policy "anyone can read modules" on bipi_modules
  for select
  using (true);
