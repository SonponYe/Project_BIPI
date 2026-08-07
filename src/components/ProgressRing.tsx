// Plain SVG, no charting library — a stroke-dashoffset ring is the whole
// technique. Used for "progress toward your next badge" on the dashboard
// and profile page.
export function ProgressRing({
  percent,
  size = 96,
  strokeWidth = 8,
  label,
  sublabel,
}: {
  percent: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label: string;
  sublabel?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(100, Math.max(0, percent)) / 100);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" role="img" aria-label={`${label}${sublabel ? `, ${sublabel}` : ""}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-pulse-100"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-pulse-500 transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-lg font-bold text-pulse-800">{label}</span>
        {sublabel && <span className="text-[10px] text-gray-400">{sublabel}</span>}
      </div>
    </div>
  );
}
