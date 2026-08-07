"use client";

import { useEffect, useState } from "react";
import type { ScenarioChoice } from "@/types/module";

// Timed decision-based exercise (e.g. modules 14, 17, 74, 76, 77 — flooding,
// disaster risk, household/community emergency).
export function ScenarioPlayer({
  prompt,
  choices,
  timeLimitSeconds = 20,
  onResolve,
}: {
  prompt: string;
  choices: ScenarioChoice[];
  timeLimitSeconds?: number;
  onResolve: (choice: ScenarioChoice) => void;
}) {
  const [secondsLeft, setSecondsLeft] = useState(timeLimitSeconds);
  const [resolved, setResolved] = useState<ScenarioChoice | null>(null);

  useEffect(() => {
    if (resolved || secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, resolved]);

  function handleChoice(choice: ScenarioChoice) {
    setResolved(choice);
    onResolve(choice);
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Visual-only countdown: a screen reader announcing every second is
          an established anti-pattern, so this is aria-hidden with a single
          static announcement of the time limit instead. */}
      <div aria-hidden="true" className="text-sm text-gray-500">
        {secondsLeft}s remaining
      </div>
      <span className="sr-only">You have {timeLimitSeconds} seconds to decide.</span>
      <p className="text-lg">{prompt}</p>
      {!resolved ? (
        <div className="flex flex-col gap-2">
          {choices.map((choice) => (
            <button
              key={choice.label}
              onClick={() => handleChoice(choice)}
              className="rounded-lg border border-gray-300 px-4 py-3 text-left hover:border-pulse-500"
            >
              {choice.label}
            </button>
          ))}
        </div>
      ) : (
        <p
          role="status"
          aria-live="polite"
          className={resolved.isCorrect ? "text-pulse-700" : "text-red-700"}
        >
          {resolved.consequence}
        </p>
      )}
    </div>
  );
}
