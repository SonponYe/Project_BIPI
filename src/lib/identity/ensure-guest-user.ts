import type { SupabaseClient } from "@supabase/supabase-js";

// `sessions.device_id` and `responses.device_id` both have a foreign key
// into `users` (supabase/migrations/0001_init.sql). A device can generate
// sessions/responses from Stage 1 (First Open), but its `users` row isn't
// created until Stage 3 (Consent Screen) — see app/api/users/route.ts. Any
// route that inserts into sessions/responses on a guest's behalf must call
// this first so the FK is satisfied even before consent.
//
// ignoreDuplicates means an existing row (e.g. one already populated with a
// real profile at consent time) is never overwritten by this call.
export async function ensureGuestUser(supabase: SupabaseClient, deviceId: string) {
  await supabase.from("users").upsert({ device_id: deviceId }, { onConflict: "device_id", ignoreDuplicates: true });
}
