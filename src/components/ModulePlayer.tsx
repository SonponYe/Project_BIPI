"use client";

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
export function ModulePlayer({ module: mod }: { module: Module }) {
  const deviceId = typeof window !== "undefined" ? getOrCreateDeviceId() : "";
  const language = (typeof window !== "undefined"
    ? (window.localStorage.getItem("bipi_language") as Language)
    : null) ?? "en";

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
      }),
    });
  }

  switch (mod.format) {
    case "scenario":
      return (
        <ScenarioPlayer
          prompt={mod.body[language] ?? mod.body.en}
          choices={[]}
          onResolve={(choice) => logResponse(choice.label, choice.isCorrect)}
        />
      );
    case "news_clip":
      return (
        <NewsClipPlayer
          videoUrl={mod.mediaUrl ?? ""}
          questions={[]}
          onAnswered={(answers) => logResponse(answers.join(" | "), null)}
        />
      );
    case "audio_story":
      return (
        <AudioStoryPlayer
          audioUrl={mod.mediaUrl}
          transcript={mod.body[language] ?? mod.body.en}
          language={language}
          followUpQuestion="What would you do in this situation?"
          onAnswered={(answer) => logResponse(answer, null)}
        />
      );
    case "mini_game":
      return (
        <MiniGame
          items={[]}
          zones={[]}
          onComplete={(correct, total) => logResponse(`${correct}/${total}`, correct === total)}
        />
      );
    case "reflection_journal":
      return (
        <ReflectionJournal
          prompt={mod.body[language] ?? mod.body.en}
          onSave={(entry) => logResponse(entry, null)}
        />
      );
  }
}
