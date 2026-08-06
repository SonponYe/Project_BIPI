import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

// `navigator.sendBeacon` only issues POST requests, so tab-close /
// visibility-change session closing (fired from components/SessionTracker.tsx)
// goes through this dedicated endpoint instead of the PATCH handler on
// /api/sessions, which stays available for closing a session with known
// modulesAttempted/modulesCompleted counts.
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.sessionId) {
    return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  const { error } = await supabase
    .from("sessions")
    .update({ ended_at: new Date().toISOString() })
    .eq("session_id", body.sessionId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
