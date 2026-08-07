"use client";

import { useState } from "react";

// Web Share API opens the device's native share sheet (WhatsApp, SMS,
// etc.) where supported; falls back to copying the text to clipboard on
// browsers without it (most desktop browsers).
export function ShareBadgeButton({ badgeName }: { badgeName: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const text = `I'm a ${badgeName} on BIPI — Ghana's Ecological Pulse. Know the signs, act before the crisis.`;

    if (navigator.share) {
      try {
        await navigator.share({ text, title: "BIPI", url: window.location.origin });
      } catch {
        // User cancelled the share sheet — not an error.
      }
      return;
    }

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleShare}
      className="self-start rounded-lg border border-pulse-500 px-3 py-1.5 text-sm font-medium text-pulse-700 transition hover:bg-pulse-50"
    >
      {copied ? "Copied!" : "Share badge"}
    </button>
  );
}
