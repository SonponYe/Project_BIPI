export function ProgressBar({ completed, total }: { completed: number; total: number }) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return (
    <div className="w-full">
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-pulse-500 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-xs text-gray-500">
        {completed}/{total} modules
      </span>
    </div>
  );
}
