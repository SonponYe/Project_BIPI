"use client";

import { useEffect, useState } from "react";
import { DistrictLeaderboard, type LeaderboardEntry } from "@/components/gamification/DistrictLeaderboard";

const DEFAULT_DISTRICT = "Greater Accra";

// Verified-Profile-only feature; Guest Profiles are not ranked (pitch
// Section 9). District selection defaults to Greater Accra until the
// onboarding region picker exists — see api/leaderboard/route.ts's note.
export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/leaderboard?district=${encodeURIComponent(DEFAULT_DISTRICT)}`)
      .then((res) => res.json())
      .then((data) => setEntries(data.entries ?? []))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-xl p-6">
      <DistrictLeaderboard district={DEFAULT_DISTRICT} entries={entries} />
      {!loading && entries.length === 0 && (
        <p className="mt-2 text-sm text-gray-400">
          No Verified Profile learners in {DEFAULT_DISTRICT} yet.
        </p>
      )}
    </main>
  );
}
