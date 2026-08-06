import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { ensureGuestUser } from "@/lib/identity/ensure-guest-user";

// Opens/closes a session row, used to compute engagement metrics
// (completion rates by district, connection_type online/offline splits).
//
// Uses the service-role client because guest users never hold a Supabase
// Auth session (see lib/supabase/server.ts for why).
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.deviceId) {
    return NextResponse.json({ error: "deviceId is required" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();
  await ensureGuestUser(supabase, body.deviceId);

  const { data, error } = await supabase
    .from("bipi_sessions")
    .insert({ device_id: body.deviceId, connection_type: body.connectionType ?? "online" })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();

  if (!body.sessionId) {
    return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  const { error } = await supabase
    .from("bipi_sessions")
    .update({
      ended_at: new Date().toISOString(),
      modules_attempted: body.modulesAttempted,
      modules_completed: body.modulesCompleted,
    })
    .eq("session_id", body.sessionId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
