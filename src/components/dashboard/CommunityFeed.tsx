"use client";

import { useEffect, useState } from "react";
import { FEED_ITEMS } from "@/content/feed";

const ROTATE_MS = 4000;

// Rotates through headlines one at a time instead of stacking them —
// "an animation rotisserie." Auto-advance is paused on hover/focus and
// stops entirely under prefers-reduced-motion; a visible play/pause
// control is required regardless (WCAG 2.2.2 — auto-updating content
// running longer than 5s needs a way to stop it), not optional polish.
//
// Deliberately compact — no summary paragraph, single truncated line —
// this is a glance, not a reading experience.
export function CommunityFeed() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const onChange = () => setReducedMotion(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % FEED_ITEMS.length), ROTATE_MS);
    return () => clearInterval(timer);
  }, [paused, reducedMotion]);

  const item = FEED_ITEMS[index];

  return (
    <section
      aria-label="What's happening"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-2.5 shadow-md"
    >
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
        aria-label={paused ? "Resume rotating headlines" : "Pause rotating headlines"}
        className="shrink-0 text-sm text-gray-300 hover:text-pulse-600"
      >
        {paused || reducedMotion ? "▶" : "❚❚"}
      </button>

      <a
        key={item.id}
        href={item.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex min-w-0 flex-1 items-baseline gap-2 ${reducedMotion ? "" : "animate-fade-slide"}`}
      >
        <span className="shrink-0 text-[11px] font-medium text-pulse-600">{item.sourceLabel}</span>
        <span className="truncate text-sm font-medium text-gray-800">{item.headline}</span>
      </a>

      <div className="flex shrink-0 gap-1" role="group" aria-label="Choose headline">
        {FEED_ITEMS.map((feedItem, i) => (
          <button
            key={feedItem.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show headline ${i + 1} of ${FEED_ITEMS.length}`}
            aria-current={i === index ? "true" : undefined}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-3 bg-pulse-500" : "w-1.5 bg-pulse-100"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
