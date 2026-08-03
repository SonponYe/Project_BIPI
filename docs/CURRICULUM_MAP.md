# Curriculum-to-platform map

The 120 GreenRes modules, organised into BIPI's five tracks
(`src/content/tracks/index.ts`) — full detail in the pitch's Section 5.

| Track | Modules | Focus |
|---|---|---|
| Climate Foundations | 1–20 | Entry point for all users: basics, causes, Ghana-specific hazards |
| Daily Life, Health, Women & Disability Inclusion | 21–34, 42–57 | Largest track; eight dedicated modules each for women's climate vulnerability and disability-inclusive climate action |
| Disaster Preparedness & Resilience | 74–80 | Scenario-heavy: evacuation, household/community emergency planning |
| Youth, Green Jobs & Career Pathways | 35–40, 83–84, 120 | Career Pathway Explorer, fact-check challenges |
| Green Economy & Enterprise | 81–82, 85–104 | Circular economy, green finance, **Module 97 (Citizen Science) → BIPI Pulse** |

## Module 97 — why BIPI Pulse exists

Module 97 explicitly calls for a citizen science dashboard, interactive
reporting map, community leaderboard, and mobile reporting interface. BIPI
Pulse (`src/app/partner/dashboard/`, `src/lib/pulse/`) is that module's direct
fulfilment, not an added feature — see pitch Section 7.

## Authoring a module

1. Add the curriculum brief to `docs/curriculum-briefs/module-{id}.txt`.
2. Run `npm run content:generate -- --module=<id>` to get a Claude-drafted
   English/Twi/Pidgin version (falls back to manual drafting per
   `docs/ARCHITECTURE.md` if `ANTHROPIC_API_KEY` isn't set).
3. Review for accuracy and local relevance, then save as
   `src/content/modules/module-{id}.json` conforming to the `Module` type in
   `src/types/module.ts`.
