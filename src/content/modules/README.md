Individual module content (one file per module, e.g. `module-14.json`) is
authored here — either hand-written or drafted via
`scripts/generate-module-content.ts` and reviewed before merge (see
`docs/CURRICULUM_MAP.md`). Each file must conform to one of the format-specific
variants of the `Module` union type in `src/types/module.ts` — the required
fields differ by `format` (e.g. `scenario` needs `choices`, `mini_game` needs
`items`/`zones`).

Per the pitch's content strategy (Section 16): build fewer modules to a high
standard first, rather than stubbing all 120 at once.

**Modules 2, 5, 14, 42, and 97** are seeded as worked examples, one per
content format, so the routes render real content out of the box. Module 5
(`news_clip`) has an empty `mediaUrl` — replace it with a curated link to real
footage (Joy News, Citinewsroom, GhanaWeb) before it's user-facing; BIPI
curates existing footage rather than producing video.
