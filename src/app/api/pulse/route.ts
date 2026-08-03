import { NextRequest, NextResponse } from "next/server";
import { refreshPulseForWeek } from "@/lib/pulse/aggregate";

// Triggers (re)aggregation of one week's worth of consented responses into
// the anonymised `pulse` table. Intended to run on a schedule (e.g. a
// Supabase cron job or Vercel cron), not on every request.
export async function POST(request: NextRequest) {
  const { week } = await request.json();

  try {
    const rows = await refreshPulseForWeek(week);
    return NextResponse.json({ rows });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
