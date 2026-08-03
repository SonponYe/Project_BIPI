import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Stage 5: Silent Data Capture. Logs one interaction per call — module,
// topic, track, format, answer, correctness, time spent — tagged only with
// device_id (never name/phone/email). Called from ModulePlayer on every
// answer, replay, or drop-off.
export async function POST(request: NextRequest) {
  const body = await request.json();
  const supabase = createClient();

  const { error } = await supabase.from("responses").insert({
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
