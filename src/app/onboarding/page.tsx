"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LanguagePicker } from "@/components/onboarding/LanguagePicker";
import { ProfileTaps } from "@/components/onboarding/ProfileTaps";
import { ConsentScreen } from "@/components/onboarding/ConsentScreen";
import type { CarePriority, ContentPreference, DemographicType, Language } from "@/types/user";

type Step = "language" | "profile" | "consent";

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
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      {step === "language" && (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-pulse-700">Welcome to BIPI</h1>
          <p className="mt-1 text-sm text-gray-500">Know the signs. Act before the crisis.</p>
        </div>
      )}
      {step === "language" && <LanguagePicker onSelect={handleLanguage} />}
      {step === "profile" && <ProfileTaps onComplete={handleProfile} />}
      {step === "consent" && <ConsentScreen language={language} onDecision={handleConsent} />}
    </main>
  );
}
