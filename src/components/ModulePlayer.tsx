"use client";

import { useEffect, useRef, useState } from "react";
import { ScenarioPlayer } from "@/components/content-formats/ScenarioPlayer";
import { NewsClipPlayer } from "@/components/content-formats/NewsClipPlayer";
import { AudioStoryPlayer } from "@/components/content-formats/AudioStoryPlayer";
import { MiniGame } from "@/components/content-formats/MiniGame";
import { ReflectionJournal } from "@/components/content-formats/ReflectionJournal";
import { getOrCreateDeviceId } from "@/lib/identity/device-id";
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
  }

  const body = mod.body[language] ?? mod.body.en;

  switch (mod.format) {
    case "scenario":
      return (
        <ScenarioPlayer
          prompt={body}
          choices={mod.choices}
          timeLimitSeconds={mod.timeLimitSeconds}
          onResolve={(choice) => logResponse(choice.label, choice.isCorrect)}
        />
      );
    case "news_clip":
      return (
        <NewsClipPlayer
          videoUrl={mod.mediaUrl ?? ""}
          questions={mod.questions}
          onAnswered={(answers) => logResponse(answers.join(" | "), null)}
        />
      );
    case "audio_story":
      return (
        <AudioStoryPlayer
          audioUrl={mod.mediaUrl}
          transcript={body}
          language={language}
          followUpQuestion={mod.followUpQuestion}
          onAnswered={(answer) => logResponse(answer, null)}
        />
      );
    case "mini_game":
      return (
        <MiniGame
          items={mod.items}
          zones={mod.zones}
          onComplete={(correct, total) => logResponse(`${correct}/${total}`, correct === total)}
        />
      );
    case "reflection_journal":
      return <ReflectionJournal prompt={body} onSave={(entry) => logResponse(entry, null)} />;
  }
}
