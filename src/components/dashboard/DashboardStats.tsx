"use client";

import { useEffect, useState } from "react";
import { getOrCreateDeviceId } from "@/lib/identity/device-id";
import { FlameIcon, MedalIcon } from "@/components/icons";
import type { ProgressSummary } from "@/lib/gamification/progress";

// Two small stat tiles rather than folding XP/streak into the badge-ring
// card — the varied card sizes (small tiles + one larger ring card +
// full-width feed + hero card below) is the "bento" layout being asked for,
// not just one more stacked full-width box.
export function DashboardStats() {
  const [summary, setSummary] = useState<ProgressSummary | null>(null);

  useEffect(() => {
    const deviceId = getOrCreateDeviceId();
    fetch(`/api/progress?deviceId=${deviceId}`)
      .then((res) => res.json())
      .then(setSummary)
      .catch(() => setSummary({ modulesCompleted: 0, xp: 0, streakDays: 0 }));
  }, []);

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="flex flex-col gap-1 rounded-2xl bg-white p-4 shadow-md">
        <MedalIcon className="h-5 w-5 text-pulse-500" />
        <span className="text-xl font-bold text-pulse-800">{summary?.xp ?? 0}</span>
        <span className="text-xs text-gray-400">XP earned</span>
      </div>
      <div className="flex flex-col gap-1 rounded-2xl bg-white p-4 shadow-md">
        <FlameIcon className="h-5 w-5 text-orange-500" />
        <span className="text-xl font-bold text-pulse-800">{summary?.streakDays ?? 0}</span>
        <span className="text-xs text-gray-400">day streak</span>
      </div>
    </div>
  );
}
