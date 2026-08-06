import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { ensureGuestUser } from "@/lib/identity/ensure-guest-user";

// Stage 5: Silent Data Capture. Logs one interaction per call — module,
// topic, track, format, answer, correctness, time spent — tagged only with
// device_id (never name/phone/email). Called from ModulePlayer on every
// answer, replay, or drop-off.
//
// Uses the service-role client because guest users never hold a Supabase
// Auth session (see lib/supabase/server.ts for why).
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.deviceId || !body.moduleId) {
    return NextResponse.json({ error: "deviceId and moduleId are required" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();
  await ensureGuestUser(supabase, body.deviceId);

  const { error } = await supabase.from("bipi_responses").insert({
    device_id: body.deviceId,
    module_id: body.moduleId,
    topic: body.topic,
    track: body.track,
    content_format_used: body.contentFormatUsed,
    answer_given: body.answerGiven,
    is_correct: body.isCorrect,
    time_spent_seconds: body.timeSpentSeconds ?? null,
    replayed: body.replayed ?? false,
    dropped_off: body.droppedOff ?? false,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
