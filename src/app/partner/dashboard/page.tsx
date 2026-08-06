import { createClient } from "@/lib/supabase/server";
import { TrendChart } from "@/components/dashboard/TrendChart";
import type { PulseRow } from "@/types/pulse";

// Reads exclusively from the aggregated `pulse` table — no device_id ever
// appears in a query this page can issue (pitch Section 7).
export default async function PartnerDashboardPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("bipi_pulse").select("*").order("week", { ascending: false });

  const rows: PulseRow[] = (data ?? []).map((row) => ({
    region: row.region,
    topic: row.topic,
    track: row.track,
    userType: row.user_type,
    avgScore: row.avg_score,
    failRate: row.fail_rate,
    dropOffRate: row.drop_off_rate,
    formatUsed: row.format_used,
    week: row.week,
    cohortSize: row.cohort_size,
  }));

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 p-6">
      <TrendChart rows={rows} />
      <p className="text-sm text-gray-500">
        Heat map view (components/dashboard/HeatMap.tsx) renders once
        src/content/geo/ghana-districts.geojson is added.
      </p>
    </main>
  );
}
