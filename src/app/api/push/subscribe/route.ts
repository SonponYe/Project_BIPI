import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { ensureGuestUser } from "@/lib/identity/ensure-guest-user";

// Stores a browser's PushSubscription against its device, keyed on
// `endpoint` (unique per browser/device pair) so re-subscribing just
// refreshes the keys rather than creating a duplicate row.
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { deviceId, subscription } = body;

  if (!deviceId || !subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
    return NextResponse.json({ error: "deviceId and a valid subscription are required" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();
  await ensureGuestUser(supabase, deviceId);

  const { error } = await supabase.from("bipi_push_subscriptions").upsert(
    {
      device_id: deviceId,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    },
    { onConflict: "endpoint" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

// Called when a subscription is revoked client-side (e.g. the user turns
// off notifications, or the browser invalidates the subscription).
export async function DELETE(request: NextRequest) {
  const { endpoint } = await request.json();
  if (!endpoint) {
    return NextResponse.json({ error: "endpoint is required" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("bipi_push_subscriptions").delete().eq("endpoint", endpoint);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
