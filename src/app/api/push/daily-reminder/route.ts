import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { createServiceRoleClient } from "@/lib/supabase/server";

// Triggered daily by Vercel Cron (see vercel.json) — sends the "Your BP is
// waiting, don't leave BP alone" reminder to every device with an active
// push subscription. Broadcast, not personalised (no streak/module state
// factored in yet); that's the next iteration once there's a reason to
// target the message.
//
// Guarded by CRON_SECRET so this can't be spammed by anyone who finds the
// URL — Vercel automatically sends `Authorization: Bearer $CRON_SECRET` on
// cron-triggered requests once that env var is set.
export async function GET(request: NextRequest) {
  if (process.env.CRON_SECRET) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "mailto:admin@bipi.app";
  if (!publicKey || !privateKey) {
    return NextResponse.json({ error: "VAPID keys not configured" }, { status: 500 });
  }
  webpush.setVapidDetails(subject, publicKey, privateKey);

  const supabase = createServiceRoleClient();
  const { data: subscriptions, error } = await supabase
    .from("bipi_push_subscriptions")
    .select("endpoint, p256dh, auth");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!subscriptions || subscriptions.length === 0) {
    return NextResponse.json({ sent: 0, total: 0 });
  }

  const payload = JSON.stringify({
    title: "Your BP is waiting",
    body: "Don't leave BP alone — take your Daily BP Check.",
    url: "/",
  });

  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload
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

  return NextResponse.json({
    sent: results.filter((r) => r.status === "fulfilled").length,
    total: subscriptions.length,
  });
}
