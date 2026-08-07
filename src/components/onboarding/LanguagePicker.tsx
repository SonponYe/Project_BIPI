"use client";

import { SpeakButton } from "@/components/SpeakButton";
import type { Language } from "@/types/user";

const LANGUAGES: { code: Language; label: string }[] = [
  { code: "tw", label: "Twi" },
  { code: "pcm", label: "Pidgin" },
  { code: "en", label: "English" },
];

// Stage 1: the very first screen. One question, one tap, under thirty
// seconds, zero personal information collected.
export function LanguagePicker({ onSelect }: { onSelect: (language: Language) => void }) {
  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-pulse-700">How do you prefer to use the app?</h2>
        <SpeakButton
          text="How do you prefer to use the app? Choose from: Twi, Pidgin, or English."
          className="h-7 w-7"
        />
      </div>
      <div className="flex gap-3">
        {LANGUAGES.map(({ code, label }) => (
          <button
            key={code}
            onClick={() => onSelect(code)}
            className="rounded-lg bg-pulse-500 px-5 py-3 font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-pulse-600 hover:shadow"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
