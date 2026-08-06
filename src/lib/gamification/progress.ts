export interface ResponseRecord {
  moduleId: number;
  isCorrect: boolean | null;
  droppedOff: boolean;
  createdAt: string; // ISO timestamp
}

export interface ProgressSummary {
  modulesCompleted: number;
  xp: number;
  streakDays: number;
}

// Pure function so it's usable from both the server (api/progress, reading
// from Supabase) and, later, a local-first offline cache without depending
// on either. Kept intentionally simple — this is the scaffold's first pass,
// not the full reward design in pitch Section 6/13 (badges, journal
// streak-loss framing, etc.).
export function computeProgress(responses: ResponseRecord[]): ProgressSummary {
  const completedModuleIds = new Set(
    responses.filter((r) => !r.droppedOff).map((r) => r.moduleId)
  );

  // 10 XP per correct answer, plus a flat 5 XP for finishing a module at all
  // (so audio stories/reflection journals, which have no right answer, still earn XP).
  const xp =
    responses.filter((r) => r.isCorrect === true).length * 10 + completedModuleIds.size * 5;

  const activeDates = new Set(responses.map((r) => r.createdAt.slice(0, 10)));
  let streakDays = 0;
  const cursor = new Date();
  // Walk backwards from today while each day has at least one logged response.
  while (activeDates.has(cursor.toISOString().slice(0, 10))) {
    streakDays += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return { modulesCompleted: completedModuleIds.size, xp, streakDays };
}
