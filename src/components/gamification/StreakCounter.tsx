import { FlameIcon } from "@/components/icons";

// Loss-aversion mechanic named directly in the persuasive-technology
// assessment criterion (pitch Section 13).
export function StreakCounter({ days }: { days: number }) {
  return (
    <div className="flex items-center gap-1.5 text-orange-600">
      <FlameIcon className="h-4 w-4" />
      <span>{days}-day streak</span>
    </div>
  );
}
