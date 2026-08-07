

# Architecture reference

Distilled from the full pitch (`Project_BIPI_Team_5ive9ine.pdf`,
`BIPI_Team_Pitch_v3.docx`) — see those for narrative context and rationale.

## Two-tier identity (Section 9)

| Tier | Created | Carries |
|---|---|---|
| Guest Profile | Automatically, on first open | Device UUID, region, demographic type, language, progress — no name/phone/email |
| Verified Profile | Opt-in | Phone or email, cross-device sync, leaderboard eligibility, Verified Reporter badge |

## Database (`supabase/migrations/`)

All BIPI tables are prefixed `bipi_` because the Supabase project this runs
against is shared with other, unrelated apps — the prefix keeps BIPI's schema
collision-free (it already collided once with a pre-existing, unrelated
`users` table during setup).

- `bipi_users` — one row per device_id (or verified account)
- `bipi_sessions` — per app-open session, tracks online/offline connection type
- `bipi_responses` — raw, consented interaction log (module, topic, format, correctness, timing)
- `bipi_pulse` — aggregated, district-level output only; **no device_id column** — this
  is the only table the partner dashboard (`src/app/partner/`) is allowed to read.
- `bipi_push_subscriptions` — one row per browser Web Push subscription, keyed on `endpoint`
- `bipi_modules` — learning content (questions, choices, video links, transcripts).
  Publicly readable (RLS `using (true)`) — it's the only `bipi_` table with no user data in it.

### Module content: authored as files, served from the database

`src/content/modules/module-{id}.json` is where content is written and
reviewed (git-diffable). It is **not** what the deployed app reads —
`npm run modules:sync` (`scripts/sync-modules-to-db.ts`) pushes those files
into `bipi_modules`, and `src/lib/content/load-module.ts` /
`src/app/api/modules/random/route.ts` read from there at request time. This
means content can be corrected or added without a redeploy, and the Daily
BP Check's "random module" is a real server-side random pick over the
`bipi_modules` table, not a client picking from a hardcoded list baked into
the JS bundle (the original design — moved off after user feedback).
Forgetting to re-run the sync script after editing a JSON file is the one
sharp edge here: the file and the database drift apart until you do.

`supabase/migrations/0002_pulse_aggregation.sql` defines the
`bipi_aggregate_pulse_for_week` function that turns `bipi_responses` into
`bipi_pulse` rows, called from `src/lib/pulse/aggregate.ts`.

All API routes that write on a guest's behalf (`api/users`, `api/sessions`,
`api/responses`, `api/push/subscribe`) use the service-role client
(`createServiceRoleClient()` in `src/lib/supabase/server.ts`), not the
cookie-based one — guest users never hold a Supabase Auth session (onboarding
is explicitly zero-login), so they have no JWT to satisfy the device_id RLS
policies. The route handler itself is the trust boundary instead. The
cookie-based client stays reserved for the partner dashboard, which *does*
authenticate via Supabase Auth (`src/app/partner/login/`).

## AI degradation path (Section 11)

The Claude API (`src/lib/ai/claude.ts`) is a build-time/career-advisor tool,
not a runtime dependency of the core learning loop:

- **Demo-day outage** → all demo modules are pre-generated and stored in Supabase.
- **Build-phase outage** → module drafting/localisation can be done manually against
  the curriculum brief.
- **Cost at scale** → the only live call in production is the career advisor
  (`src/app/api/ai/career-advisor/route.ts`), which falls back to
  `src/lib/ai/fallback.ts`'s pre-generated responses.

## Offline-first (Section 3, 10)

`next-pwa` builds the service worker from a **custom source file**,
`worker/index.js`, in Workbox's InjectManifest mode (`swSrc` in
`next.config.mjs`) rather than its default GenerateSW mode — GenerateSW has
no hook for the custom `push`/`notificationclick` listeners Web Push needs,
so `worker/index.js` hand-implements what `next.config.mjs` used to
configure declaratively: precaching all module content/audio/build output,
a cache-first route for media files, a network-first route for
`/api/pulse`, and an `/offline.html` fallback for navigation when there's no
cached page. `src/lib/sms/africasTalking.ts` extends reach further, to
basic-phone users with no data connection at all, via SMS/USSD.

## Web Push (Section 10)

VAPID keys are self-generated (`npx web-push generate-vapid-keys` —
no external push-service account needed) and live in `.env.local` as
`NEXT_PUBLIC_VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY`. The flow:

1. `src/components/PushSubscribeButton.tsx` (wired into the profile page)
   requests notification permission and subscribes via
   `src/lib/push/subscribe.ts`, which registers the subscription against
   `POST /api/push/subscribe`.
2. `worker/index.js`'s `push` event listener shows the notification;
   `notificationclick` focuses an existing tab or opens one.
3. `src/lib/push/send.ts` (used by `POST /api/push/send`) sends to every
   subscription on file for a device, and prunes subscriptions the push
   service reports as gone (404/410).

Nothing schedules *when* to send a streak/badge/reminder notification yet —
`api/push/send` is a manual trigger only. A real scheduler (e.g. a Vercel
Cron job that finds devices due for a reminder and calls
`sendPushToDevice`) isn't built.

## Five content formats → components

| Format | Component |
|---|---|
| Scenario | `src/components/content-formats/ScenarioPlayer.tsx` |
| News Clip | `src/components/content-formats/NewsClipPlayer.tsx` |
| Audio Story | `src/components/content-formats/AudioStoryPlayer.tsx` |
| Mini Game | `src/components/content-formats/MiniGame.tsx` |
| Reflection Journal | `src/components/content-formats/ReflectionJournal.tsx` |

`src/components/ModulePlayer.tsx` dispatches a `Module` (see
`src/types/module.ts`) to the right one and silently logs the interaction via
`POST /api/responses`.
