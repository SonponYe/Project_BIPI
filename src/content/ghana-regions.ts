// Ghana's 16 administrative regions. Used for the onboarding region picker
// and, downstream, for BIPI Pulse's district-level aggregation and the
// leaderboard (both keyed on `bipi_users.region`).
//
// This is a flat list rather than the pitch's planned interactive Ghana map
// (Design Lead's job, Section 14) — enough to unblock region capture without
// requiring the Ghana district GeoJSON that the map itself needs.
export const GHANA_REGIONS = [
  "Ahafo",
  "Ashanti",
  "Bono",
  "Bono East",
  "Central",
  "Eastern",
  "Greater Accra",
  "North East",
  "Northern",
  "Oti",
  "Savannah",
  "Upper East",
  "Upper West",
  "Volta",
  "Western",
  "Western North",
] as const;

export type GhanaRegion = (typeof GHANA_REGIONS)[number];
