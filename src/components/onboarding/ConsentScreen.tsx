"use client";

import { t } from "@/lib/i18n";
import { SpeakButton } from "@/components/SpeakButton";
import type { Language } from "@/types/user";

// Stage 3: Ghana Data Protection Act 2012 (Act 843) compliant consent.
// Declining still grants full platform access — only the BIPI Pulse
// aggregation pipeline is affected.
export function ConsentScreen({
  language,
  onDecision,
}: {
  language: Language;
  onDecision: (consentGiven: boolean) => void;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 p-6 text-center">
      <div className="flex items-center justify-center gap-2">
        <h2 className="text-lg font-semibold text-pulse-700">{t("consent_title", language)}</h2>
        <SpeakButton
          text={`${t("consent_title", language)}. ${t("consent_body", language)}`}
          language={language}
          className="h-7 w-7"
        />
      </div>
      <p className="leading-relaxed text-gray-600">{t("consent_body", language)}</p>
      <div className="mt-4 flex flex-col gap-3">
        <button
          onClick={() => onDecision(true)}
          className="rounded-lg bg-pulse-500 px-5 py-3 font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-pulse-600 hover:shadow"
        >
          {t("consent_yes", language)}
        </button>
        <button
          onClick={() => onDecision(false)}
          className="rounded-lg border border-gray-200 px-5 py-3 text-gray-600 transition hover:border-gray-300"
        >
          {t("consent_no", language)}
        </button>
      </div>
    </div>
  );
}
