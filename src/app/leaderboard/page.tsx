"use client";

import { useEffect, useState } from "react";
import { DistrictLeaderboard, type LeaderboardEntry } from "@/components/gamification/DistrictLeaderboard";

const FALLBACK_DISTRICT = "Greater Accra";

// Verified-Profile-only feature; Guest Profiles are not ranked (pitch
// Section 9). Defaults to the viewer's own onboarding region (see
// onboarding/profile's region tap), falling back to Greater Accra for
// anyone who hasn't onboarded on this device.
export default function LeaderboardPage() {
  const [district, setDistrict] = useState(FALLBACK_DISTRICT);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const profile = JSON.parse(window.localStorage.getItem("bipi_profile") ?? "{}");
    setDistrict(profile.region ?? FALLBACK_DISTRICT);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/leaderboard?district=${encodeURIComponent(district)}`)
      .then((res) => res.json())
      .then((data) => setEntries(data.entries ?? []))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, [district]);

  return (
    <main className="mx-auto max-w-xl p-6">
      <DistrictLeaderboard district={district} entries={entries} />
      {!loading && entries.length === 0 && (
        <p className="mt-2 text-sm text-gray-400">No Verified Profile learners in {district} yet.</p>
      )}
    </main>
  );
}
