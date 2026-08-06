import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

// Upserts a Guest Profile at the end of onboarding (Stage 3: Consent
// Screen). Uses the service-role client for the same reason as
// api/responses and api/sessions — guest users never hold a Supabase Auth
// session, so the browser's anon-key client can't satisfy the device_id RLS
// policy on `users`.
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.deviceId) {
    return NextResponse.json({ error: "deviceId is required" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  const { error } = await supabase.from("users").upsert({
    device_id: body.deviceId,
    region: body.region ?? null,
    gender_type: body.demographicType ?? null,
    language: body.language ?? "tw",
    consent_given: body.consentGiven,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
