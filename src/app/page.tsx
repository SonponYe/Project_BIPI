"use client";

import { useRouter } from "next/navigation";
import { LanguagePicker } from "@/components/onboarding/LanguagePicker";
import { getOrCreateDeviceId } from "@/lib/identity/device-id";
import type { Language } from "@/types/user";

// Stage 1: First Open. No login, no registration, no email field.
export default function FirstOpenPage() {
  const router = useRouter();

  function handleLanguageSelect(language: Language) {
    getOrCreateDeviceId();
    window.localStorage.setItem("bipi_language", language);
    router.push("/onboarding/profile");
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <LanguagePicker onSelect={handleLanguageSelect} />
    </main>
  );
}
