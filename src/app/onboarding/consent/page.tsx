"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ConsentScreen } from "@/components/onboarding/ConsentScreen";
import { getOrCreateDeviceId } from "@/lib/identity/device-id";
import type { Language } from "@/types/user";

// Stage 3: Consent Screen. Declining still grants full platform access —
// only the BIPI Pulse aggregation pipeline is skipped.
//
// Reads localStorage in an effect rather than at render time: this is a
// client component, but Next.js still renders it once on the server for the
// initial HTML, where `window` doesn't exist yet.
export default function ConsentPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>("tw");

  useEffect(() => {
    setLanguage((window.localStorage.getItem("bipi_language") as Language) ?? "tw");
  }, []);

  async function handleDecision(consentGiven: boolean) {
    const deviceId = getOrCreateDeviceId();
    const profile = JSON.parse(window.localStorage.getItem("bipi_profile") ?? "{}");

    await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deviceId,
        demographicType: profile.demographicType,
        region: profile.region,
        language,
        consentGiven,
      }),
    });

    router.push("/tracks");
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <ConsentScreen language={language} onDecision={handleDecision} />
    </main>
  );
}
