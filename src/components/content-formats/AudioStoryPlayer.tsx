"use client";

import { useState } from "react";
import { speak, stopSpeaking } from "@/lib/tts/speech";
import type { Language } from "@/types/user";

// 90-second narrated story, no reading required at any point — the default
// format for the women's track (modules 42–49) and low-literacy users.
//
// The transcript is always visible, not just spoken: a deaf or
// hard-of-hearing user gets nothing at all from an audio-only "audio
// story" — this used to accept a transcript prop and never render it,
// which meant that group had literally no way to use this format.
export function AudioStoryPlayer({
  audioUrl,
  transcript,
  language,
  followUpQuestion,
  onAnswered,
}: {
  audioUrl?: string;
  transcript: string;
  language: Language;
  followUpQuestion: string;
  onAnswered: (answer: string) => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  function togglePlayback() {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
      return;
    }
    // Falls back to browser TTS when no pre-recorded audioUrl is available.
    speak(transcript, language === "en" ? "en" : language);
    setIsPlaying(true);
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      {audioUrl ? (
        <audio controls src={audioUrl} className="w-full" />
      ) : (
        <button
          onClick={togglePlayback}
          aria-pressed={isPlaying}
          className="rounded-lg bg-pulse-500 px-4 py-3 text-white"
        >
          {isPlaying ? "Stop" : "Play story"}
        </button>
      )}
      <p className="whitespace-pre-line rounded-lg bg-gray-50 p-4 text-gray-800">{transcript}</p>
      <form
        className="flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          onAnswered(String(formData.get("answer") ?? ""));
        }}
      >
        <label className="flex flex-col gap-1">
          <span>{followUpQuestion}</span>
          <input
            name="answer"
            aria-label={followUpQuestion}
            className="rounded border border-gray-300 px-3 py-2"
          />
        </label>
        <button type="submit" className="rounded-lg bg-pulse-500 px-4 py-2 text-white">
          Submit
        </button>
      </form>
    </div>
  );
}
