"use client";

import { useEffect, useRef } from "react";
import { getOrCreateDeviceId } from "@/lib/identity/device-id";

// Mounted once in the root layout. Opens a `sessions` row on first render
// and closes it when the tab is hidden or unloaded, via sendBeacon (which
// still fires as the page is torn down, unlike a normal fetch).
//
// Does not track modulesAttempted/modulesCompleted — that requires wiring
// through ModulePlayer's completion events, which isn't built yet. The
// PATCH handler on /api/sessions accepts those counts once something does.
export function SessionTracker() {
  const sessionId = useRef<string | null>(null);

  useEffect(() => {
    const deviceId = getOrCreateDeviceId();
    let cancelled = false;

    fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deviceId,
        connectionType: navigator.onLine ? "online" : "offline",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) sessionId.current = data.session_id ?? null;
      })
      .catch(() => {
        // Offline on first load — no session row this visit. Responses
        // still get logged and synced once /api/responses is reachable.
      });

    function closeSession() {
      if (!sessionId.current) return;
      const payload = JSON.stringify({ sessionId: sessionId.current });
      navigator.sendBeacon?.(
        "/api/sessions/close",
        new Blob([payload], { type: "application/json" })
      );
      sessionId.current = null;
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") closeSession();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", closeSession);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", closeSession);
    };
  }, []);

  return null;
}
