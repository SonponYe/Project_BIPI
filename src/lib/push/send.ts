import webpush from "web-push";
import { createServiceRoleClient } from "@/lib/supabase/server";

// pitch Section 10: "Sends proactive module reminders, streak alerts, and
// new badge notifications without requiring the app to be open." This is
// the send side; the receive side lives in worker/index.js's `push` event
// listener.
//
// Needs NEXT_PUBLIC_VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY set (generate with
// `npx web-push generate-vapid-keys`) — without them this throws rather than
// silently doing nothing, since a caller triggering a notification send
// should know it didn't happen.
function getWebPushClient() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "mailto:admin@bipi.app";

  if (!publicKey || !privateKey) {
    throw new Error("NEXT_PUBLIC_VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY are not set");
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
  return webpush;
}

interface NotificationPayload {
  title: string;
  body: string;
  url?: string;
}

// Sends to every subscription on file for a device (a device can have more
// than one if it subscribed from multiple browsers). Subscriptions the push
// service reports as gone (404/410 — the user uninstalled, cleared data, or
// revoked permission) are deleted rather than retried.
export async function sendPushToDevice(deviceId: string, payload: NotificationPayload) {
  const client = getWebPushClient();
  const supabase = createServiceRoleClient();

  const { data: subscriptions, error } = await supabase
    .from("bipi_push_subscriptions")
    .select("endpoint, p256dh, auth")
    .eq("device_id", deviceId);

  if (error) throw error;
  if (!subscriptions || subscriptions.length === 0) return { sent: 0 };

  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      client.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        JSON.stringify(payload)
      )
    )
  );

  const staleEndpoints = subscriptions
    .filter((sub, i) => {
      const result = results[i];
      return (
        result.status === "rejected" &&
        [404, 410].includes((result.reason as { statusCode?: number })?.statusCode ?? 0)
      );
    })
    .map((sub) => sub.endpoint);

  if (staleEndpoints.length > 0) {
    await supabase.from("bipi_push_subscriptions").delete().in("endpoint", staleEndpoints);
  }

  return { sent: results.filter((r) => r.status === "fulfilled").length };
}
