"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// "Take your Daily BP Check": the one thing on the dashboard that isn't
// browsing. No module picker — one tap asks the server for a random
// authored module (GET /api/modules/random, picked from the real
// bipi_modules table) and jumps straight there. The product direction is
// for this to eventually pick based on what's happening in the user's own
// community rather than pure chance — that needs region-tagged content,
// which doesn't exist yet, so random is the honest placeholder for "for now."
export function DailyCheckCard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/modules/random");
      const data = await res.json();
      if (data.id) router.push(`/modules/${data.id}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="group relative flex flex-col items-start gap-1 overflow-hidden rounded-3xl bg-gradient-to-br from-pulse-500 to-pulse-700 p-6 text-left text-white shadow-lg shadow-pulse-700/25 transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-80"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10 transition group-hover:scale-110"
      />
      <span className="text-xs font-semibold uppercase tracking-wider text-pulse-100">
        Daily check
      </span>
      <span className="text-xl font-bold">Take your Daily BP Check</span>
      <span className="text-sm text-pulse-50">
        {loading ? "Picking one for you…" : "One quick lesson, picked for you →"}
      </span>
    </button>
  );
}
