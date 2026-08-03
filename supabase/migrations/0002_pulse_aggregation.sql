-- Server-side aggregation function called by lib/pulse/aggregate.ts
-- (via the service role client) to (re)build one week of `pulse` rows
-- from consented `responses`, joined against `users` for region/demographic.
create or replace function aggregate_pulse_for_week(target_week date)
returns setof pulse
language sql
security definer
as $$
  insert into pulse (region, topic, track, user_type, avg_score, fail_rate, drop_off_rate, format_used, week, cohort_size)
  select
    coalesce(u.region, 'unknown') as region,
    r.topic,
    r.track,
    coalesce(u.gender_type, 'other') as user_type,
    avg(case when r.is_correct then 1 else 0 end) * 100 as avg_score,
    avg(case when r.is_correct then 0 else 1 end) as fail_rate,
    avg(case when r.dropped_off then 1 else 0 end) as drop_off_rate,
    r.content_format_used as format_used,
    date_trunc('week', target_week)::date as week,
    count(distinct r.device_id) as cohort_size
  from responses r
  join users u on u.device_id = r.device_id
  where u.consent_given = true
    and date_trunc('week', r.created_at)::date = date_trunc('week', target_week)::date
  group by region, r.topic, r.track, user_type, format_used
  on conflict (region, topic, track, user_type, format_used, week)
  do update set
    avg_score = excluded.avg_score,
    fail_rate = excluded.fail_rate,
    drop_off_rate = excluded.drop_off_rate,
    cohort_size = excluded.cohort_size
  returning *;
$$;
