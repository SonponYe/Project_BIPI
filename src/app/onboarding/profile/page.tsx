"use client";

import { useRouter } from "next/navigation";
import { ProfileTaps } from "@/components/onboarding/ProfileTaps";
import type { GhanaRegion } from "@/content/ghana-regions";
import type { CarePriority, ContentPreference, DemographicType } from "@/types/user";

// Stage 2: Profile Setup (Three Taps, No Typing) plus a region pick.
export default function ProfileSetupPage() {
  const router = useRouter();

  function handleComplete(profile: {
    demographicType: DemographicType;
    carePriorities: CarePriority[];
    contentPreference: ContentPreference;
    region: GhanaRegion;
  }) {
    window.localStorage.setItem("bipi_profile", JSON.stringify(profile));
    router.push("/onboarding/consent");
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <ProfileTaps onComplete={handleComplete} />
    </main>
  );
}
