"use client";

import { useRouter } from "next/navigation";
import { ConsentScreen } from "@/components/onboarding/ConsentScreen";
import { createClient } from "@/lib/supabase/client";
import { getOrCreateDeviceId } from "@/lib/identity/device-id";
import type { Language } from "@/types/user";

// Stage 3: Consent Screen. Declining still grants full platform access —
// only the BIPI Pulse aggregation pipeline is skipped.
export default function ConsentPage() {
  const router = useRouter();
  const language = (window.localStorage.getItem("bipi_language") as Language) ?? "tw";

  async function handleDecision(consentGiven: boolean) {
    const deviceId = getOrCreateDeviceId();
    const profile = JSON.parse(window.localStorage.getItem("bipi_profile") ?? "{}");

    const supabase = createClient();
    await supabase.from("users").upsert({
      device_id: deviceId,
      gender_type: profile.demographicType,
      language,
      consent_given: consentGiven,
    });

    router.push("/tracks");
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <ConsentScreen language={language} onDecision={handleDecision} />
    </main>
  );
}
