Individual module content (one file per module, e.g. `module-14.json`) is
authored here — either hand-written or drafted via
`scripts/generate-module-content.ts` and reviewed before merge (see
`docs/CURRICULUM_MAP.md`). Each file must conform to one of the format-specific
variants of the `Module` union type in `src/types/module.ts` — the required
fields differ by `format` (e.g. `scenario` needs `choices`, `mini_game` needs
`items`/`zones`).

**These files are the authored source, not what the deployed app reads.**
After adding or editing a module, run `npm run modules:sync` to push it into
the `bipi_modules` table — the app reads from there at runtime (server-side
random selection, no redeploy needed to update content). See
`docs/ARCHITECTURE.md` and `scripts/sync-modules-to-db.ts`.

53 modules are authored as of this writing, spanning all five tracks —
including the full disability track (modules 50–57). `news_clip` modules
have an empty `mediaUrl` — replace with a curated link to real footage
(Joy News, Citinewsroom, GhanaWeb) before they're user-facing; BIPI curates
existing footage rather than producing video. Remember to re-run
`npm run modules:sync` after filling those in.
