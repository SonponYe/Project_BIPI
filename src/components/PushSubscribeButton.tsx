"use client";

import { useState } from "react";
import { getOrCreateDeviceId } from "@/lib/identity/device-id";
import { subscribeToPush } from "@/lib/push/subscribe";

const STATUS_MESSAGE: Record<string, string> = {
  subscribed: "Reminders on.",
  unsupported: "Notifications aren't supported on this browser.",
  denied: "Permission denied — enable notifications for BIPI in your browser settings to turn this on.",
  "no-vapid-key": "Push isn't configured yet.",
  error: "Something went wrong — try again.",
};

// Stage 6-adjacent: opts a device into streak/reminder/badge push
// notifications. Not automatic — the pitch's onboarding flow is explicitly
// zero-friction, so this stays a deliberate, separate action rather than a
// permission prompt sprung on first open.
export function PushSubscribeButton() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const deviceId = getOrCreateDeviceId();
    const result = await subscribeToPush(deviceId);
    setStatus(result.status);
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handleClick}
        disabled={loading || status === "subscribed"}
        className="self-start rounded-lg border border-pulse-500 px-3 py-1.5 text-sm text-pulse-700 disabled:opacity-60"
      >
        {status === "subscribed" ? "Reminders on" : "Turn on reminders"}
      </button>
      {status && status !== "subscribed" && (
        <p className="text-xs text-gray-400">{STATUS_MESSAGE[status]}</p>
      )}
    </div>
  );
}
