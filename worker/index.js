// Custom source service worker, bundled and injected with a precache
// manifest by next-pwa's InjectManifest mode (next.config.mjs's `swSrc`).
//
// Switched from next-pwa's default GenerateSW mode specifically to add the
// `push`/`notificationclick` listeners below — GenerateSW has no hook for
// custom event listeners. Everything above the "Web Push" section
// reimplements what next.config.mjs used to configure declaratively
// (offline caching, offline.html fallback), because none of GenerateSW's
// `runtimeCaching`/`fallbacks` options carry over once `swSrc` is set —
// InjectManifest expects the worker source itself to set that up.
import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst, NetworkFirst } from "workbox-strategies";
import { clientsClaim } from "workbox-core";
import { offlineFallback } from "workbox-recipes";

self.skipWaiting();
clientsClaim();

// Injection point — next-pwa's webpack plugin replaces this with the actual
// precache manifest (all `.next/static` build output plus everything in
// `public/`, offline.html included) at build time. Do not rename/reformat.
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// Modules, audio, and quiz progress must survive total connectivity loss —
// this is the core offline-first requirement, not an optimization.
registerRoute(/^https:\/\/.*\.(mp3|mp4|wav|ogg)$/, new CacheFirst({ cacheName: "bipi-media" }));
registerRoute(/\/api\/pulse/, new NetworkFirst({ cacheName: "bipi-pulse-api" }));

offlineFallback({ pageFallback: "/offline.html" });

// --- Web Push (pitch Section 10) ---
// Receive side of src/lib/push/send.ts. A push message's payload is
// whatever JSON that sender passed to webpush.sendNotification().
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: "BIPI", body: event.data ? event.data.text() : "" };
  }

  const title = data.title || "BIPI";
  const options = {
    body: data.body || "",
    icon: "/icons/icon.png",
    badge: "/icons/icon.png",
    data: { url: data.url || "/" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientsArr) => {
      const existing = clientsArr.find((client) => client.url.includes(url));
      if (existing) return existing.focus();
      return self.clients.openWindow(url);
    })
  );
});
