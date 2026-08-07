"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LanguagePicker } from "@/components/onboarding/LanguagePicker";
import { ProfileTaps } from "@/components/onboarding/ProfileTaps";
import { ConsentScreen } from "@/components/onboarding/ConsentScreen";
import { SpeakButton } from "@/components/SpeakButton";
import type { CarePriority, ContentPreference, DemographicType, Language } from "@/types/user";

type Step = "language" | "profile" | "consent";
const STEP_ORDER: Step[] = ["language", "profile", "consent"];

interface DraftProfile {
  demographicType: DemographicType;
  carePriorities: CarePriority[];
  contentPreference: ContentPreference;
}

// Onboarding screen 1 of 2: welcome, language, the profile taps, and
// consent all live on this one page/route — no navigation between them,
// just internal step state. Region is deliberately its own screen
// (app/onboarding/region/page.tsx), which is where the whole onboarding
// flow finishes and the profile actually gets persisted.
export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("language");
  const [language, setLanguage] = useState<Language>("tw");
  const [draftProfile, setDraftProfile] = useState<DraftProfile | null>(null);

  function handleLanguage(selected: Language) {
    setLanguage(selected);
    window.localStorage.setItem("bipi_language", selected);
    setStep("profile");
  }

  function handleProfile(profile: DraftProfile) {
    setDraftProfile(profile);
    setStep("consent");
  }

  function handleConsent(consentGiven: boolean) {
    window.localStorage.setItem(
      "bipi_profile",
      JSON.stringify({ ...draftProfile, consentGiven })
    );
    router.push("/onboarding/region");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-b from-pulse-50 via-white to-white px-4">
      <Image src="/icons/icon.png" alt="BIPI" width={64} height={64} className="rounded-full" />
      {step === "language" && (
        <div className="flex items-center gap-2 text-center">
          <div>
            <h1 className="text-2xl font-bold text-pulse-800">Welcome to BIPI</h1>
            <p className="mt-1 text-sm text-gray-500">Know the signs. Act before the crisis.</p>
          </div>
          <SpeakButton text="Welcome to BIPI. Know the signs, act before the crisis." />
        </div>
      )}

      <div className="w-full max-w-md rounded-2xl bg-white p-2 shadow-sm">
        {step === "language" && <LanguagePicker onSelect={handleLanguage} />}
        {step === "profile" && <ProfileTaps language={language} onComplete={handleProfile} />}
        {step === "consent" && <ConsentScreen language={language} onDecision={handleConsent} />}
      </div>

      {/* Screen 1 of 2 — progress within this screen's internal steps. */}
      <div className="flex gap-1.5" aria-hidden="true">
        {STEP_ORDER.map((s) => (
          <span
            key={s}
            className={`h-1.5 w-6 rounded-full ${s === step ? "bg-pulse-600" : "bg-pulse-100"}`}
          />
        ))}
      </div>
    </main>
  );
}
