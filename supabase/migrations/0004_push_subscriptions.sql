-- Web Push subscriptions (pitch Section 10: "Web Push API via service
-- worker — sends proactive module reminders, streak alerts, and new badge
-- notifications"). One row per browser subscription; a device can end up
-- with more than one if it subscribes from multiple browsers/installs.
create table if not exists bipi_push_subscriptions (
  id bigint generated always as identity primary key,
  device_id uuid not null references bipi_users(device_id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

alter table bipi_push_subscriptions enable row level security;

create policy "device owns its push subscriptions" on bipi_push_subscriptions
  for all using (device_id = (current_setting('request.jwt.claims', true)::json ->> 'device_id')::uuid);
