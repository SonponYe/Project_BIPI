"use client";

import { useEffect, useState } from "react";
import { FEED_ITEMS } from "@/content/feed";

const ROTATE_MS = 4000;

// Rotates through headlines one at a time instead of stacking them —
// "an animation rotisserie." Auto-advance is paused on hover/focus and
// stops entirely under prefers-reduced-motion; a visible play/pause
// control is required regardless (WCAG 2.2.2 — auto-updating content
// running longer than 5s needs a way to stop it), not optional polish.
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
      className="relative rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          What&apos;s happening
        </h2>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          aria-label={paused ? "Resume rotating headlines" : "Pause rotating headlines"}
          className="text-gray-400 hover:text-pulse-600"
        >
          {paused || reducedMotion ? "▶" : "❚❚"}
        </button>
      </div>

      <a
        key={item.id}
        href={item.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-2 block ${reducedMotion ? "" : "animate-fade-slide"}`}
      >
        <p className="text-xs font-medium text-pulse-600">
          {item.dateLabel} · {item.sourceLabel}
        </p>
        <h3 className="mt-1 font-semibold text-gray-900">{item.headline}</h3>
        <p className="mt-1 text-sm leading-relaxed text-gray-500">{item.summary}</p>
        <span className="mt-2 inline-block text-xs font-semibold text-pulse-600">Read more →</span>
      </a>

      <div className="mt-3 flex justify-center gap-1.5" role="group" aria-label="Choose headline">
        {FEED_ITEMS.map((feedItem, i) => (
          <button
            key={feedItem.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show headline ${i + 1} of ${FEED_ITEMS.length}`}
            aria-current={i === index ? "true" : undefined}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-4 bg-pulse-500" : "w-1.5 bg-pulse-100"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
