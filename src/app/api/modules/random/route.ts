import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

// Picks a genuinely random module server-side from bipi_modules, instead
// of the client picking from a static array shipped in the JS bundle.
// Optional ?track= restricts to one track (used by track detail pages'
// "surprise me" — not wired up yet, but the endpoint supports it).
//
// Supabase JS has no ORDER BY random() shorthand, so this counts rows and
// selects a random offset — fine at this scale (dozens to low hundreds of
// rows); would need a dedicated SQL function if the catalog grows into the
// thousands.
export async function GET(request: NextRequest) {
  const track = request.nextUrl.searchParams.get("track");
  const supabase = createServiceRoleClient();

  let countQuery = supabase.from("bipi_modules").select("*", { count: "exact", head: true });
  if (track) countQuery = countQuery.eq("track", track);
  const { count, error: countError } = await countQuery;

  if (countError) {
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }
  if (!count || count === 0) {
    return NextResponse.json({ error: "No modules available" }, { status: 404 });
  }

  const offset = Math.floor(Math.random() * count);
  let rowQuery = supabase.from("bipi_modules").select("*").range(offset, offset);
  if (track) rowQuery = rowQuery.eq("track", track);
  const { data, error } = await rowQuery.single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}
