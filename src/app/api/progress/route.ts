import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { computeProgress } from "@/lib/gamification/progress";

// GET /api/progress?deviceId=... — reads one device's own responses and
// reduces them to { modulesCompleted, xp, streakDays } via
// lib/gamification/progress.ts. Used by the profile page.
export async function GET(request: NextRequest) {
  const deviceId = request.nextUrl.searchParams.get("deviceId");
  if (!deviceId) {
    return NextResponse.json({ error: "deviceId is required" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("responses")
    .select("module_id, is_correct, dropped_off, created_at")
    .eq("device_id", deviceId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const summary = computeProgress(
    (data ?? []).map((row) => ({
      moduleId: row.module_id,
      isCorrect: row.is_correct,
      droppedOff: row.dropped_off,
      createdAt: row.created_at,
    }))
  );

  return NextResponse.json(summary);
}
