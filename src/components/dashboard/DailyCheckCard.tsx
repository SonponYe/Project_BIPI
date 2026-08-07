"use client";

import { useRouter } from "next/navigation";
import { AVAILABLE_MODULE_IDS } from "@/content/modules";

// "Take your Daily BP Check": the one thing on the dashboard that isn't
// browsing. No module picker — one tap auto-selects a module, currently at
// random from whatever's authored. The product direction is for this to
// eventually pick based on what's happening in the user's own community
// (the feed above, tagged by region) rather than pure chance — that needs
// the modules/feed data layer to carry region tags, which doesn't exist
// yet, so random is the honest placeholder for "for now."
export function DailyCheckCard() {
  const router = useRouter();

  function handleClick() {
    const randomId = AVAILABLE_MODULE_IDS[Math.floor(Math.random() * AVAILABLE_MODULE_IDS.length)];
    router.push(`/modules/${randomId}`);
  }

  return (
    <button
      onClick={handleClick}
      className="group relative flex flex-col items-start gap-1 overflow-hidden rounded-3xl bg-gradient-to-br from-pulse-500 to-pulse-700 p-6 text-left text-white shadow-lg shadow-pulse-700/25 transition hover:-translate-y-0.5 hover:shadow-xl"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10 transition group-hover:scale-110"
      />
      <span className="text-xs font-semibold uppercase tracking-wider text-pulse-100">
        Daily check
      </span>
      <span className="text-xl font-bold">Take your Daily BP Check</span>
      <span className="text-sm text-pulse-50">One quick lesson, picked for you →</span>
    </button>
  );
}
