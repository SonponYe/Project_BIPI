// Mirrors the `bipi_pulse` table: aggregated, district-level only — never per-device.
export interface PulseRow {
  region: string;
  topic: string;
  track: string;
  userType: string;
  avgScore: number;
  failRate: number;
  dropOffRate: number;
  formatUsed: string;
  week: string;
  cohortSize: number;
}
