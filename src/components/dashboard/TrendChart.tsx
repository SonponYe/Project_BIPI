import type { PulseRow } from "@/types/pulse";

// "Trending knowledge gap report": what Ghana is collectively misunderstanding
// about climate change this week, ranked by fail rate.
export function TrendChart({ rows }: { rows: PulseRow[] }) {
  const topGaps = [...rows].sort((a, b) => b.failRate - a.failRate).slice(0, 5);

  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-semibold text-pulse-700">Top knowledge gaps this week</h3>
      <ul className="flex flex-col gap-1">
        {topGaps.map((row) => (
          <li key={`${row.region}-${row.topic}`} className="flex items-center gap-3">
            <span className="w-32 truncate text-sm text-gray-600">{row.topic}</span>
            <div className="h-2 flex-1 rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-red-500"
                style={{ width: `${Math.round(row.failRate * 100)}%` }}
              />
            </div>
            <span className="w-10 text-right text-sm">{Math.round(row.failRate * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
