"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// Chrome/Android don't reliably show their own install banner, so this
// shows BIPI's own "Install" nudge on open — the deployment flow the pitch
// describes (Section 10) is a WhatsApp/QR link that adds the app to the
// home screen in one tap. Mounted once in the root layout, alongside
// SessionTracker.
export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS Safari's own flag for "already added to home screen"
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (isStandalone) return;

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    }

    function handleAppInstalled() {
      setDeferredPrompt(null);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  if (!deferredPrompt || dismissed) return null;

  async function handleInstall() {
    await deferredPrompt!.prompt();
    await deferredPrompt!.userChoice;
    setDeferredPrompt(null);
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 flex items-center justify-between gap-3 rounded-lg bg-pulse-700 px-4 py-3 text-white shadow-lg">
      <span className="text-sm">Install BIPI for offline access, even with no data.</span>
      <div className="flex shrink-0 gap-2">
        <button onClick={() => setDismissed(true)} className="text-sm text-pulse-50 underline">
          Not now
        </button>
        <button
          onClick={handleInstall}
          className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-pulse-700"
        >
          Install
        </button>
      </div>
    </div>
  );
}
