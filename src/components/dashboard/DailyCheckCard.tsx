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
      className="flex flex-col items-start gap-1 rounded-xl bg-pulse-500 p-5 text-left text-white hover:bg-pulse-600"
    >
      <span className="text-xs uppercase tracking-wide text-pulse-50">Daily check</span>
      <span className="text-lg font-semibold">Take your Daily BP Check</span>
      <span className="text-sm text-pulse-50">One quick module, picked for you.</span>
    </button>
  );
}
