import nextPWA from "next-pwa";

const withPWA = nextPWA({
  dest: "public",
  register: true,
  // Custom worker source (offline caching + offline.html fallback +
  // web push), bundled via Workbox InjectManifest instead of next-pwa's
  // default GenerateSW — see worker/index.js for why. `skipWaiting`,
  // `runtimeCaching`, and `fallbacks` below don't apply in this mode
  // (they're GenerateSW-only options); the worker source handles all of
  // that itself now.
  swSrc: "worker/index.js",
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default withPWA(nextConfig);
