import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { computeProgress } from "@/lib/gamification/progress";

// GET /api/leaderboard?district=Greater%20Accra — ranks Verified Profiles
// (Guest Profiles aren't eligible, pitch Section 9) in a district by XP.
//
// N+1 query pattern: fine at pilot scale (tens of users per district per
// pitch Section 12's testing plan), but a production version should push
// this into a single SQL aggregation, the way
// supabase/migrations/0002_pulse_aggregation.sql does for BIPI Pulse.
//
// Note: onboarding doesn't currently capture `region` (the pitch's Ghana
// map region picker isn't built yet — see docs/ARCHITECTURE.md), so this
// will return an empty list until that's wired up and some users go
// Verified.
export async function GET(request: NextRequest) {
  const district = request.nextUrl.searchParams.get("district");
  if (!district) {
    return NextResponse.json({ error: "district is required" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  const { data: users, error: usersError } = await supabase
    .from("users")
    .select("device_id")
    .eq("tier", "verified")
    .eq("region", district);

  if (usersError) {
    return NextResponse.json({ error: usersError.message }, { status: 500 });
  }

  const entries = await Promise.all(
    (users ?? []).map(async ({ device_id }) => {
      const { data } = await supabase
        .from("responses")
        .select("module_id, is_correct, dropped_off, created_at")
        .eq("device_id", device_id);

      const { xp } = computeProgress(
        (data ?? []).map((row) => ({
          moduleId: row.module_id,
          isCorrect: row.is_correct,
          droppedOff: row.dropped_off,
          createdAt: row.created_at,
        }))
      );

      // Short, non-reversible tag rather than the raw device UUID — this is
      // a public leaderboard, and the full UUID is otherwise only ever used
      // as an internal key.
      return { displayName: `Learner-${device_id.slice(0, 4).toUpperCase()}`, xp };
    })
  );

  const ranked = entries
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 20)
    .map((entry, index) => ({ rank: index + 1, ...entry }));

  return NextResponse.json({ district, entries: ranked });
}
