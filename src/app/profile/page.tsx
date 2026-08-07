"use client";

import { useEffect, useState } from "react";
import { ProgressRing } from "@/components/ProgressRing";
import { XPBadge } from "@/components/gamification/XPBadge";
import { StreakCounter } from "@/components/gamification/StreakCounter";
import { ShareBadgeButton } from "@/components/ShareBadgeButton";
import { getOrCreateDeviceId } from "@/lib/identity/device-id";
import type { ProgressSummary } from "@/lib/gamification/progress";
import { getDistrictBadge } from "@/lib/gamification/badges";
import { PushSubscribeButton } from "@/components/PushSubscribeButton";

const TOTAL_MODULES = 120;

// Stage 6: Feedback and Reward. Fetches this device's own progress from
// /api/progress — real (if empty) computed state, not a hardcoded display.
export default function ProfilePage() {
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [region, setRegion] = useState<string | null>(null);

  useEffect(() => {
    const deviceId = getOrCreateDeviceId();
    const profile = JSON.parse(window.localStorage.getItem("bipi_profile") ?? "{}");
    setRegion(profile.region ?? null);

    fetch(`/api/progress?deviceId=${deviceId}`)
      .then((res) => res.json())
      .then(setSummary)
      .catch(() => setSummary({ modulesCompleted: 0, xp: 0, streakDays: 0 }));
  }, []);

  const completed = summary?.modulesCompleted ?? 0;
  const badgeName = getDistrictBadge(region, completed);

  return (
    <main className="mx-auto flex max-w-xl flex-col gap-6 p-6">
      <h1 className="text-xl font-bold text-pulse-800">Your progress</h1>

      <section className="flex items-center gap-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <ProgressRing
          percent={(completed / TOTAL_MODULES) * 100}
          label={`${completed}`}
          sublabel={`of ${TOTAL_MODULES}`}
        />
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <XPBadge xp={summary?.xp ?? 0} badgeName={badgeName ?? undefined} />
            <StreakCounter days={summary?.streakDays ?? 0} />
          </div>
          {badgeName && <ShareBadgeButton badgeName={badgeName} />}
        </div>
      </section>

      {summary === null && <p className="text-sm text-gray-400">Loading…</p>}

      <PushSubscribeButton />
    </main>
  );
}
