// Standard VAPID-key conversion (the browser's pushManager.subscribe API
// wants a BufferSource, VAPID keys are distributed base64url-encoded).
//
// Built on a plain `new ArrayBuffer` rather than returning `Uint8Array.from(...)`
// directly — TypeScript 5.7's DOM lib types `Uint8Array`'s `.buffer` as the
// wider `ArrayBufferLike` (which includes `SharedArrayBuffer`), which no
// longer satisfies `PushSubscriptionOptionsInit.applicationServerKey`'s
// `BufferSource` without this.
function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const bytes = new Uint8Array(new ArrayBuffer(rawData.length));
  for (let i = 0; i < rawData.length; i++) {
    bytes[i] = rawData.charCodeAt(i);
  }
  return bytes;
}

export type PushSubscribeResult =
  | { status: "subscribed" }
  | { status: "unsupported" | "denied" | "no-vapid-key" | "error"; message?: string };

// Requests notification permission, subscribes via the service worker
// registered by next-pwa (its `push`/`notificationclick` handlers live in
// worker/index.js), then registers the subscription with the backend.
export async function subscribeToPush(deviceId: string): Promise<PushSubscribeResult> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    return { status: "unsupported" };
  }

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!publicKey) {
    return { status: "no-vapid-key" };
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    return { status: "denied" };
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });

    const response = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId, subscription: subscription.toJSON() }),
    });

    if (!response.ok) {
      return { status: "error", message: `Server rejected subscription (${response.status})` };
    }

    return { status: "subscribed" };
  } catch (err) {
    return { status: "error", message: (err as Error).message };
  }
}
