// District badges (pitch Stage 6): "If they have completed enough modules
// in a track, a district badge unlocks: Accra Climate Defender, Volta
// Resilience Champion, Northern Preparedness Leader." Those three are the
// only names the pitch actually specifies — everything else falls back to
// a generic pattern the team should replace with real per-region names.
const NAMED_BADGES: Record<string, string> = {
  "Greater Accra": "Accra Climate Defender",
  Volta: "Volta Resilience Champion",
  Northern: "Northern Preparedness Leader",
};

// The pitch ties this to modules completed *in a track*; computeProgress()
// only totals modules completed across all tracks, so this checks the
// simpler global count for now — swap in a per-track total once
// lib/gamification/progress.ts groups by track. The pitch also doesn't
// specify a number — "enough modules" — so this is a placeholder threshold
// pending real usage data from the pilot (Section 12).
export const BADGE_UNLOCK_THRESHOLD = 5;

export function getDistrictBadge(
  region: string | null | undefined,
  modulesCompleted: number
): string | null {
  if (!region || modulesCompleted < BADGE_UNLOCK_THRESHOLD) return null;
  return NAMED_BADGES[region] ?? `${region} Climate Guardian`;
}
