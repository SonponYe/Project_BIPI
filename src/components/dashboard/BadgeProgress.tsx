"use client";

import { useEffect, useState } from "react";
import { ProgressRing } from "@/components/ProgressRing";
import { ShareBadgeButton } from "@/components/ShareBadgeButton";
import { getOrCreateDeviceId } from "@/lib/identity/device-id";
import { getDistrictBadge, BADGE_UNLOCK_THRESHOLD } from "@/lib/gamification/badges";
import type { ProgressSummary } from "@/lib/gamification/progress";

// The ring the dashboard leads with: progress toward the next district
// badge (pitch Stage 6), not just an abstract completion percentage —
// "help them finish what they're supposed to do and get their badges."
export function BadgeProgress() {
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
  const percent = Math.min(100, (completed / BADGE_UNLOCK_THRESHOLD) * 100);

  return (
    <section className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-md">
      <ProgressRing
        percent={badgeName ? 100 : percent}
        label={badgeName ? "🏅" : `${completed}/${BADGE_UNLOCK_THRESHOLD}`}
        sublabel={badgeName ? undefined : "check-ins"}
      />
      <div className="flex flex-1 flex-col gap-2">
        {badgeName ? (
          <>
            <p className="font-semibold text-pulse-800">{badgeName}</p>
            <p className="text-sm text-gray-500">You earned this one. Nice work.</p>
            <ShareBadgeButton badgeName={badgeName} />
          </>
        ) : (
          <>
            <p className="font-semibold text-pulse-800">On your way to a badge</p>
            <p className="text-sm text-gray-500">
              {Math.max(0, BADGE_UNLOCK_THRESHOLD - completed)} more check-in
              {BADGE_UNLOCK_THRESHOLD - completed === 1 ? "" : "s"} to unlock one.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
