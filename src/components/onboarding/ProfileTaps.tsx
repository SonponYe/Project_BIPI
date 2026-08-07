"use client";

import { useState } from "react";
import type { CarePriority, ContentPreference, DemographicType } from "@/types/user";

// Three taps, no typing, no keyboard — part of onboarding screen 1
// (language + these taps + consent, all one page). Region is its own
// screen 2 (app/onboarding/region/page.tsx), not bundled in here, per
// product direction: keep screen 1 to "the huge parts," region gets its
// own screen.
export function ProfileTaps({
  onComplete,
}: {
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
}: {
  heading: string;
  options: readonly T[];
  onPick?: (value: T) => void;
  multi?: boolean;
  selected?: T[];
  onToggle?: (value: T) => void;
  onContinue?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <h2 className="text-lg font-medium text-pulse-700">{heading}</h2>
      <div className="flex flex-wrap justify-center gap-3">
        {options.map((option) => {
          const isSelected = selected?.includes(option);
          return (
            <button
              key={option}
              onClick={() => (multi ? onToggle?.(option) : onPick?.(option))}
              className={`rounded-lg border px-4 py-3 capitalize ${
                isSelected ? "border-pulse-600 bg-pulse-50" : "border-gray-300"
              }`}
            >
              {option.replace(/-/g, " ")}
            </button>
          );
        })}
      </div>
      {multi && (
        <button onClick={onContinue} className="mt-2 text-pulse-600 underline">
          Continue
        </button>
      )}
    </div>
  );
}
