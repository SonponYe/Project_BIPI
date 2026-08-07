import { FEED_ITEMS } from "@/content/feed";

// Top 2-3 items only — this is meant to feel like a quick glance at "what's
// happening," not a full news reader.
export function CommunityFeed() {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        What&apos;s happening
      </h2>
      {FEED_ITEMS.slice(0, 3).map((item) => (
        <a
          key={item.id}
          href={item.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-gray-200 p-3 hover:border-pulse-500"
        >
          <p className="text-xs text-gray-400">
            {item.dateLabel} · {item.sourceLabel}
          </p>
          <h3 className="font-medium">{item.headline}</h3>
          <p className="text-sm text-gray-600">{item.summary}</p>
        </a>
      ))}
    </div>
  );
}
