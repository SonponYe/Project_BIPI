// District badges unlocked after enough track completions
// (e.g. "Accra Climate Defender", "Volta Resilience Champion").
export function XPBadge({ xp, badgeName }: { xp: number; badgeName?: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-pulse-50 px-3 py-1 text-pulse-700">
      <span className="font-semibold">{xp} XP</span>
      {badgeName && <span className="text-sm">· {badgeName}</span>}
    </div>
  );
}
