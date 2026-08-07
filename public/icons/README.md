`icon.png` (1024×1024) is the real BIPI mark — Ghana's outline merging into a
heartbeat/heart shape, with the wordmark — and is the primary PWA install
icon referenced in `public/manifest.json`.

`icon.svg` (a simple teal circle + pulse line placeholder) stays in the
manifest as a second entry so lightweight/scalable-icon-preferring browsers
have an option too; it's not the real logo and can be dropped once that
doesn't matter.

Not yet done: `icon.png` isn't declared `purpose: "maskable"` because its
circular background isn't verified safe inside Android's adaptive-icon crop
zone (maskable icons need their subject to fit within a centered ~80% safe
area — cropping this one could clip the wordmark). If a maskable variant is
wanted, generate a version with more padding and add it as a separate
manifest icon entry rather than relabeling this one.
