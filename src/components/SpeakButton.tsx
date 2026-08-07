"use client";

import { useEffect, useState } from "react";
import { speak, stopSpeaking } from "@/lib/tts/speech";
import { SpeakerIcon, SpeakerOffIcon } from "@/components/icons";
import type { Language } from "@/types/user";

// Read-aloud button for screens that are otherwise text-only — onboarding
// especially, since low-literacy and blind/low-vision users hit that flow
// before any content-format preference has even been set. Small and
// icon-only by design so it doesn't compete with the actual content, but
// present on every screen that has text worth reading.
export function SpeakButton({
  text,
  language = "en",
  className = "",
}: {
  text: string;
  language?: Language;
  className?: string;
}) {
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => stopSpeaking, []);

  function toggle() {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    speak(text, language, () => setSpeaking(false));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={speaking}
      aria-label={speaking ? "Stop reading aloud" : "Read this aloud"}
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pulse-50 text-pulse-600 transition hover:bg-pulse-100 ${className}`}
    >
      {speaking ? <SpeakerOffIcon className="h-4 w-4" /> : <SpeakerIcon className="h-4 w-4" />}
    </button>
  );
}
