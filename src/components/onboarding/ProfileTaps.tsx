"use client";

import { useState } from "react";
import { SpeakButton } from "@/components/SpeakButton";
import type { CarePriority, ContentPreference, DemographicType, Language } from "@/types/user";

// Three taps, no typing, no keyboard — part of onboarding screen 1
// (language + these taps + consent, all one page). Region is its own
// screen 2 (app/onboarding/region/page.tsx), not bundled in here, per
// product direction: keep screen 1 to "the huge parts," region gets its
// own screen.
export function ProfileTaps({
  language = "en",
  onComplete,
}: {
  language?: Language;
  onComplete: (profile: {
    demographicType: DemographicType;
    carePriorities: CarePriority[];
    contentPreference: ContentPreference;
  }) => void;
}) {
  const [step, setStep] = useState(0);
  const [demographicType, setDemographicType] = useState<DemographicType | null>(null);
  const [carePriorities, setCarePriorities] = useState<CarePriority[]>([]);

  if (step === 0) {
    const options: DemographicType[] = ["youth", "woman", "person-with-disability", "other"];
    return (
      <TapStep
        heading="I am..."
        options={options}
        language={language}
        onPick={(value) => {
          setDemographicType(value);
          setStep(1);
        }}
      />
    );
  }

  if (step === 1) {
    const options: CarePriority[] = ["food", "water", "jobs", "safety", "community"];
    return (
      <TapStep
        heading="I care most about... (pick up to two)"
        options={options}
        language={language}
        multi
        selected={carePriorities}
        onToggle={(value) => {
          setCarePriorities((prev) =>
            prev.includes(value)
              ? prev.filter((p) => p !== value)
              : prev.length < 2
                ? [...prev, value]
                : prev
          );
        }}
        onContinue={() => setStep(2)}
      />
    );
  }

  const options: ContentPreference[] = ["read", "listen", "watch"];
  return (
    <TapStep
      heading="I prefer to..."
      options={options}
      language={language}
      onPick={(value) =>
        onComplete({
          demographicType: demographicType!,
          carePriorities,
          contentPreference: value,
        })
      }
    />
  );
}

export function TapStep<T extends string>({
  heading,
  options,
  onPick,
  multi,
  selected,
  onToggle,
  onContinue,
  language = "en",
}: {
  heading: string;
  options: readonly T[];
  onPick?: (value: T) => void;
  multi?: boolean;
  selected?: T[];
  onToggle?: (value: T) => void;
  onContinue?: () => void;
  language?: Language;
}) {
  const readable = `${heading}. Choose from: ${options.map((o) => o.replace(/-/g, " ")).join(", ")}.`;

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-pulse-700">{heading}</h2>
        <SpeakButton text={readable} language={language} className="h-7 w-7" />
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {options.map((option) => {
          const isSelected = selected?.includes(option);
          return (
            <button
              key={option}
              onClick={() => (multi ? onToggle?.(option) : onPick?.(option))}
              aria-pressed={multi ? isSelected : undefined}
              className={`rounded-lg border px-4 py-3 capitalize shadow-sm transition hover:-translate-y-0.5 ${
                isSelected
                  ? "border-pulse-600 bg-pulse-50 text-pulse-700"
                  : "border-gray-200 bg-white hover:border-pulse-300"
              }`}
            >
              {option.replace(/-/g, " ")}
            </button>
          );
        })}
      </div>
      {multi && (
        <button
          onClick={onContinue}
          className="mt-2 rounded-lg bg-pulse-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-pulse-700"
        >
          Continue
        </button>
      )}
    </div>
  );
}
