// Web Vibration API — Android Chrome supports it, iOS Safari does not (no
// API to feature-detect around that beyond `"vibrate" in navigator`, which
// this already checks). Silently does nothing where unsupported rather
// than throwing, since haptics are a nice-to-have, not a requirement.
export function vibrate(pattern: number | readonly number[]) {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  navigator.vibrate(pattern as number | number[]);
}

// Short, distinct patterns so correct/incorrect are felt differently, not
// just "a buzz happened."
export const HAPTIC = {
  correct: 40,
  incorrect: [30, 60, 30],
  complete: [20, 40, 20, 40, 60],
} as const;
