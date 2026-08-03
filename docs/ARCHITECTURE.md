# Architecture reference

Distilled from the full pitch (`Project_BIPI_Team_5ive9ine.pdf`,
`BIPI_Team_Pitch_v3.docx`) — see those for narrative context and rationale.

## Two-tier identity (Section 9)

| Tier | Created | Carries |
|---|---|---|
| Guest Profile | Automatically, on first open | Device UUID, region, demographic type, language, progress — no name/phone/email |
| Verified Profile | Opt-in | Phone or email, cross-device sync, leaderboard eligibility, Verified Reporter badge |

## Database (`supabase/migrations/`)

- `users` — one row per device_id (or verified account)
- `sessions` — per app-open session, tracks online/offline connection type
- `responses` — raw, consented interaction log (module, topic, format, correctness, timing)
- `pulse` — aggregated, district-level output only; **no device_id column** — this
  is the only table the partner dashboard (`src/app/partner/`) is allowed to read.

`supabase/migrations/0002_pulse_aggregation.sql` defines the
`aggregate_pulse_for_week` function that turns `responses` into `pulse` rows,
called from `src/lib/pulse/aggregate.ts`.

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

`next-pwa` (configured in `next.config.mjs`) caches all module content, audio,
and progress via a service worker so the app works with zero connectivity
after first load. `src/lib/sms/africasTalking.ts` extends reach further, to
basic-phone users with no data connection at all, via SMS/USSD.

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
