import { createServiceRoleClient } from "@/lib/supabase/server";
import type { PulseRow } from "@/types/pulse";

// Converts raw, consented `bipi_responses` rows into the anonymised,
// district-level `bipi_pulse` table rows that power the partner-facing
// BIPI Pulse dashboard. No device_id or other per-user field ever leaves
// this function.
export async function refreshPulseForWeek(week: string): Promise<PulseRow[]> {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase.rpc("bipi_aggregate_pulse_for_week", {
    target_week: week,
  });
  if (error) throw error;

  return data as PulseRow[];
}
