"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TapStep } from "@/components/onboarding/ProfileTaps";
import { GHANA_REGIONS, type GhanaRegion } from "@/content/ghana-regions";
import { getOrCreateDeviceId } from "@/lib/identity/device-id";
import type { Language } from "@/types/user";

// Onboarding screen 2 of 2. Region is what BIPI Pulse and the district
// leaderboard key on, so this is also where the full profile (screen 1's
// draft, plus region) actually gets persisted via POST /api/users — nothing
// is saved to Supabase until onboarding is fully complete.
export default function RegionPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    setLanguage((window.localStorage.getItem("bipi_language") as Language) ?? "tw");
  }, []);

  async function handlePick(region: GhanaRegion) {
    const deviceId = getOrCreateDeviceId();
    const draftProfile = JSON.parse(window.localStorage.getItem("bipi_profile") ?? "{}");
    const fullProfile = { ...draftProfile, region };
    window.localStorage.setItem("bipi_profile", JSON.stringify(fullProfile));

    await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deviceId,
        demographicType: draftProfile.demographicType,
        region,
        language,
        consentGiven: draftProfile.consentGiven,
      }),
    });

    router.push("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <TapStep
        heading="Which region are you in?"
        options={GHANA_REGIONS}
        language={language}
        onPick={handlePick}
      />
    </main>
  );
}
