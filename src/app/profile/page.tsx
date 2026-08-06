"use client";

import { useEffect, useState } from "react";
import { ProgressBar } from "@/components/gamification/ProgressBar";
import { XPBadge } from "@/components/gamification/XPBadge";
import { StreakCounter } from "@/components/gamification/StreakCounter";
import { getOrCreateDeviceId } from "@/lib/identity/device-id";
import type { ProgressSummary } from "@/lib/gamification/progress";
import { tracks } from "@/content/tracks";

const TOTAL_MODULES = 120;

// Stage 6: Feedback and Reward. Fetches this device's own progress from
// /api/progress — real (if empty) computed state, not a hardcoded display.
export default function ProfilePage() {
  const [summary, setSummary] = useState<ProgressSummary | null>(null);

  useEffect(() => {
    const deviceId = getOrCreateDeviceId();
    fetch(`/api/progress?deviceId=${deviceId}`)
      .then((res) => res.json())
      .then(setSummary)
      .catch(() => setSummary({ modulesCompleted: 0, xp: 0, streakDays: 0 }));
  }, []);

  const completed = summary?.modulesCompleted ?? 0;

  return (
    <main className="mx-auto flex max-w-xl flex-col gap-4 p-6">
      <h1 className="text-xl font-semibold text-pulse-700">Your progress</h1>
      <ProgressBar completed={completed} total={TOTAL_MODULES} />
      <div className="flex items-center gap-4">
        <XPBadge xp={summary?.xp ?? 0} />
        <StreakCounter days={summary?.streakDays ?? 0} />
      </div>
      {summary === null && <p className="text-sm text-gray-400">Loading…</p>}
      <p className="text-xs text-gray-400">
        Tracks {tracks.length}, {TOTAL_MODULES} modules total across the GreenRes curriculum.
      </p>
    </main>
  );
}
