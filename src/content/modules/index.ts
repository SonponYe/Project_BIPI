// Manually maintained list of authored module IDs (one module-{id}.json
// each, see this folder's README). Needs to be a plain list rather than
// derived from the filesystem because the Daily BP Check card
// (components/dashboard/DailyCheckCard.tsx) picks from it client-side,
// where fs isn't available — update this array whenever a module is added.
export const AVAILABLE_MODULE_IDS = [2, 5, 14, 42, 97];
