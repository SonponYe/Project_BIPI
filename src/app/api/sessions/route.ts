import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Opens/closes a session row, used to compute engagement metrics
// (completion rates by district, connection_type online/offline splits).
export async function POST(request: NextRequest) {
  const body = await request.json();
  const supabase = createClient();

  const { data, error } = await supabase
    .from("sessions")
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
  const supabase = createClient();

  const { error } = await supabase
    .from("sessions")
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
