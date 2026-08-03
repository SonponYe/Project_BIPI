# BIPI — Ghana's Ecological Pulse

> "Transforming climate awareness into climate action through technology"

BIPI is an offline-first Progressive Web App that delivers the 120-module GreenRes
climate curriculum through five accessible content formats, and passively turns
every learner's activity into **BIPI Pulse** — a live, anonymised, district-level
climate-knowledge intelligence layer for government agencies, NGOs, and researchers.

Full product/business context lives in the original pitch documents at the repo
root (`Project_BIPI_Team_5ive9ine.pdf`, `BIPI_Team_Pitch_v3.docx`) and is
distilled into [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and
[`docs/CURRICULUM_MAP.md`](docs/CURRICULUM_MAP.md).

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS |
| Offline / installability | Service worker via `next-pwa` |
| Backend & data | Supabase (Postgres, Auth, Storage) |
| AI content & localisation | Claude API (`@anthropic-ai/sdk`), offline fallback |
| Maps | Leaflet.js + Ghana district GeoJSON (Mapbox GL JS swappable) |
| Text-to-speech | Web Speech API (browser-native) |
| SMS/USSD fallback | Africa's Talking API |
| Push notifications | Web Push API |

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Supabase + Claude keys
npm run supabase:migrate     # applies supabase/migrations
npm run dev
```

## Project layout

```
src/
  app/            Routes (onboarding, learning tracks, journal, partner dashboard, API)
  components/     UI grouped by onboarding / content-formats / gamification / dashboard
  lib/            Supabase clients, device identity, AI, TTS, SMS fallback, Pulse aggregation
  content/        The five learning tracks as structured module data, plus Ghana GeoJSON
  i18n/           English, Twi, Pidgin strings
  types/          Shared TypeScript types (module, user, pulse)
supabase/
  migrations/     users / sessions / responses / pulse tables (see docs/ARCHITECTURE.md)
scripts/          Content-generation script driving Claude API against the curriculum brief
docs/             Architecture and curriculum-alignment reference notes
```

## Two-tier identity

Every user starts as an anonymous **Guest Profile** (a device UUID, no name/phone/email).
Users may optionally upgrade to a **Verified Profile** for cross-device sync and
leaderboard eligibility. Only aggregated, district-level data ever reaches the
`pulse` table — see `supabase/migrations/0001_init.sql`.
