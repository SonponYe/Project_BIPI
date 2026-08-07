// Manually maintained list of authored module IDs (one module-{id}.json
// each, see this folder's README). Needs to be a plain list rather than
// derived from the filesystem because the Daily BP Check card
// (components/dashboard/DailyCheckCard.tsx) picks from it client-side,
// where fs isn't available — update this array whenever a module is added.
export const AVAILABLE_MODULE_IDS = [
  2, 3, 4, 5, 6, 7, 8, 13, 14, 16, 17, 18, 35, 36, 37, 38, 39, 40, 42, 43, 44,
  45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 74, 75, 76, 77, 78, 79,
  80, 81, 83, 84, 85, 86, 92, 93, 97, 101, 102, 103, 120,
];
