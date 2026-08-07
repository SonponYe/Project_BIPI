import { FEED_ITEMS } from "@/content/feed";

// Top 2-3 items only — this is meant to feel like a quick glance at "what's
// happening," not a full news reader.
export function CommunityFeed() {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        What&apos;s happening
      </h2>
      {FEED_ITEMS.slice(0, 3).map((item, index) => (
        <a
          key={item.id}
          href={item.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ "--delay": `${index * 120}ms` } as React.CSSProperties}
          className="animate-slide-up rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <p className="text-xs font-medium text-pulse-600">
            {item.dateLabel} · {item.sourceLabel}
          </p>
          <h3 className="mt-1 font-semibold text-gray-900">{item.headline}</h3>
          <p className="mt-1 text-sm leading-relaxed text-gray-500">{item.summary}</p>
        </a>
      ))}
    </section>
  );
}
