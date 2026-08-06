-- Minimal local dev seed: one consented guest user with a few responses,
-- enough to exercise bipi_aggregate_pulse_for_week() during development.
insert into bipi_users (device_id, region, gender_type, language, tier, consent_given)
values ('11111111-1111-1111-1111-111111111111', 'Greater Accra', 'youth', 'tw', 'guest', true)
on conflict do nothing;

insert into bipi_responses (device_id, module_id, topic, track, content_format_used, answer_given, is_correct, time_spent_seconds, dropped_off)
values
  ('11111111-1111-1111-1111-111111111111', 14, 'urban-flooding', 'climate-foundations', 'scenario', 'evacuate', true, 45, false),
  ('11111111-1111-1111-1111-111111111111', 17, 'urban-flooding', 'climate-foundations', 'scenario', 'wait', false, 30, true)
on conflict do nothing;
