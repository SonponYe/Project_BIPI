export interface LeaderboardEntry {
  rank: number;
  displayName: string;
  xp: number;
}

// Verified-Profile-only feature (Guest Profiles aren't eligible — see
// pitch Section 9's two-tier identity system).
export function DistrictLeaderboard({
  district,
  entries,
}: {
  district: string;
  entries: LeaderboardEntry[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-semibold text-pulse-700">{district} leaderboard</h3>
      <ol className="flex flex-col gap-1">
        {entries.map((entry) => (
          <li key={entry.rank} className="flex justify-between rounded bg-gray-50 px-3 py-2">
            <span>
              #{entry.rank} {entry.displayName}
            </span>
            <span>{entry.xp} XP</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
