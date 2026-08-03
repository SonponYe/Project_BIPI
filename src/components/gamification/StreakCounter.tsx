// Loss-aversion mechanic named directly in the persuasive-technology
// assessment criterion (pitch Section 13).
export function StreakCounter({ days }: { days: number }) {
  return (
    <div className="flex items-center gap-1 text-orange-600">
      <span aria-hidden>🔥</span>
      <span>{days}-day streak</span>
    </div>
  );
}
