"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ScenarioPlayer } from "@/components/content-formats/ScenarioPlayer";
import { NewsClipPlayer } from "@/components/content-formats/NewsClipPlayer";
import { AudioStoryPlayer } from "@/components/content-formats/AudioStoryPlayer";
import { MiniGame } from "@/components/content-formats/MiniGame";
import { ReflectionJournal } from "@/components/content-formats/ReflectionJournal";
import { getOrCreateDeviceId } from "@/lib/identity/device-id";
import { HAPTIC, vibrate } from "@/lib/accessibility/haptics";
import type { Module } from "@/types/module";
import type { Language } from "@/types/user";

// Stage 4/5: dispatches a module to the right format player and, on
// completion, silently logs the interaction (module, topic, format, answer,
// correctness, time spent) via POST /api/responses — never the user's name.
//
// Reads localStorage in effects rather than at render time: this is a
// client component, but Next.js still renders it once on the server for the
// initial HTML, where `window`/localStorage don't exist yet.
export function ModulePlayer({ module: mod }: { module: Module }) {
  const [deviceId, setDeviceId] = useState("");
  const [language, setLanguage] = useState<Language>("en");
  const [result, setResult] = useState<string | null>(null);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    setDeviceId(getOrCreateDeviceId());
    setLanguage((window.localStorage.getItem("bipi_language") as Language) ?? "en");
  }, []);

  async function logResponse(answerGiven: string, isCorrect: boolean | null) {
    await fetch("/api/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deviceId,
        moduleId: mod.id,
        topic: mod.title,
        track: mod.track,
        contentFormatUsed: mod.format,
        answerGiven,
        isCorrect,
        timeSpentSeconds: Math.round((Date.now() - startedAt.current) / 1000),
      }),
    });

    // Formats without a right/wrong answer (audio story, news clip,
    // reflection journal) still get an acknowledgement — "you get your
    // score, yay" applies loosely to all of them, not just scored ones.
    vibrate(isCorrect === true ? HAPTIC.correct : isCorrect === false ? HAPTIC.incorrect : HAPTIC.complete);
    setResult(
      isCorrect === true
        ? "Nice work — you got it right!"
        : isCorrect === false
          ? "Logged. Check the explanation above for next time."
          : "Nice work completing this one."
    );
  }

  const body = mod.body[language] ?? mod.body.en;

  return (
    <div className="flex flex-col gap-4">
      {mod.format === "scenario" && (
        <ScenarioPlayer
          prompt={body}
          choices={mod.choices}
          timeLimitSeconds={mod.timeLimitSeconds}
          onResolve={(choice) => logResponse(choice.label, choice.isCorrect)}
        />
      )}
      {mod.format === "news_clip" && (
        <NewsClipPlayer
          videoUrl={mod.mediaUrl ?? ""}
          questions={mod.questions}
          onAnswered={(answers) => logResponse(answers.join(" | "), null)}
        />
      )}
      {mod.format === "audio_story" && (
        <AudioStoryPlayer
          audioUrl={mod.mediaUrl}
          transcript={body}
          language={language}
          followUpQuestion={mod.followUpQuestion}
          onAnswered={(answer) => logResponse(answer, null)}
        />
      )}
      {mod.format === "mini_game" && (
        <MiniGame
          items={mod.items}
          zones={mod.zones}
          onComplete={(correct, total) => logResponse(`${correct}/${total}`, correct === total)}
        />
      )}
      {mod.format === "reflection_journal" && (
        <ReflectionJournal prompt={body} onSave={(entry) => logResponse(entry, null)} />
      )}

      {result && (
        <div
          role="status"
          aria-live="polite"
          className="flex flex-col items-start gap-2 rounded-lg bg-pulse-50 p-4"
        >
          <p className="font-medium text-pulse-700">{result}</p>
          <Link href="/" className="text-sm text-pulse-600 underline">
            Back to dashboard
          </Link>
        </div>
      )}
    </div>
  );
}
