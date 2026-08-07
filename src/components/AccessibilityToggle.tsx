"use client";

import { useEffect, useState } from "react";

const CONTRAST_KEY = "bipi_high_contrast";

// Also syncs <html lang> to the user's actual chosen language on mount —
// it was hardcoded "en" in the root layout regardless of onboarding choice,
// which matters for screen-reader pronunciation, not just visual display.
export function AccessibilityToggle() {
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const savedContrast = window.localStorage.getItem(CONTRAST_KEY) === "true";
    setHighContrast(savedContrast);
    document.documentElement.dataset.contrast = savedContrast ? "high" : "normal";

    const language = window.localStorage.getItem("bipi_language");
    if (language) document.documentElement.lang = language;
  }, []);

  function toggle() {
    const next = !highContrast;
    setHighContrast(next);
    window.localStorage.setItem(CONTRAST_KEY, String(next));
    document.documentElement.dataset.contrast = next ? "high" : "normal";
  }

  return (
    <button
      onClick={toggle}
      aria-pressed={highContrast}
      className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:border-pulse-500"
    >
      {highContrast ? "Standard contrast" : "High contrast"}
    </button>
  );
}
