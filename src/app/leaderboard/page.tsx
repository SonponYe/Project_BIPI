import { DistrictLeaderboard } from "@/components/gamification/DistrictLeaderboard";

// Verified-Profile-only feature; Guest Profiles are not ranked.
export default function LeaderboardPage() {
  return (
    <main className="mx-auto max-w-xl p-6">
      <DistrictLeaderboard district="Greater Accra" entries={[]} />
    </main>
  );
}
