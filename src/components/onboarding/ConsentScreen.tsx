"use client";

import { t } from "@/lib/i18n";
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
    <div className="mx-auto flex max-w-md flex-col gap-4 p-8 text-center">
      <h2 className="text-lg font-semibold text-pulse-700">{t("consent_title", language)}</h2>
      <p className="text-gray-700">{t("consent_body", language)}</p>
      <div className="mt-4 flex flex-col gap-3">
        <button
          onClick={() => onDecision(true)}
          className="rounded-lg bg-pulse-500 px-5 py-3 text-white hover:bg-pulse-600"
        >
          {t("consent_yes", language)}
        </button>
        <button
          onClick={() => onDecision(false)}
          className="rounded-lg border border-gray-300 px-5 py-3"
        >
          {t("consent_no", language)}
        </button>
      </div>
    </div>
  );
}
