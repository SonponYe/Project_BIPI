-- This Supabase project auto-enables row level security on new tables
-- (confirmed after 0001_init.sql ran: bipi_pulse came back with RLS on even
-- though that migration never said so). 0001 only defined policies for
-- bipi_users/bipi_sessions/bipi_responses, so bipi_pulse — RLS on, zero
-- policies — was unreadable by anyone but the service-role key. That would
-- have silently broken the partner dashboard, which reads bipi_pulse via
-- the cookie-based/Supabase Auth client (src/app/partner/dashboard/page.tsx),
-- not the service role.
--
-- bipi_pulse holds only aggregated, district-level data with no device_id —
-- there is nothing in it to protect per-user, so any authenticated
-- (Supabase Auth) session, i.e. any logged-in institutional partner, may
-- read it.
alter table bipi_pulse enable row level security;

create policy "authenticated partners can read pulse" on bipi_pulse
  for select
  using (auth.role() = 'authenticated');
