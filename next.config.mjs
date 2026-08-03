import nextPWA from "next-pwa";

const withPWA = nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  // Modules, audio, and quiz progress must survive total connectivity loss —
  // this is the core offline-first requirement, not an optimization.
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/.*\.(mp3|mp4|wav|ogg)$/,
      handler: "CacheFirst",
      options: { cacheName: "bipi-media" },
    },
    {
      urlPattern: /\/api\/pulse/,
      handler: "NetworkFirst",
      options: { cacheName: "bipi-pulse-api" },
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default withPWA(nextConfig);
