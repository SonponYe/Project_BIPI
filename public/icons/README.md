`icon.svg` is a placeholder mark (teal circle + pulse line), wired into
`public/manifest.json` so the PWA install prompt isn't broken. It's not real
branding — swap it and add proper `icon-192.png` / `icon-512.png` (with a
maskable variant for Android's adaptive icon safe zone) once the Design Lead
has a real logo, then update `manifest.json`'s `icons` array to match.
