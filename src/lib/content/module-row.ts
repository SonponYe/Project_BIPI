import type {
  DragItem,
  DropZone,
  Module,
  ScenarioChoice,
} from "@/types/module";

// Reverses scripts/sync-modules-to-db.ts's mapping — turns a bipi_modules
// row back into the app's typed discriminated union. No runtime shape
// validation beyond what Postgres's column constraints already guarantee
// (format is a checked enum).
export function rowToModule(row: Record<string, unknown>): Module {
  const base = {
    id: row.id as number,
    track: row.track as Module["track"],
    title: row.title as string,
    assessmentMethod: row.assessment_method as string,
    body: {
      en: row.body_en as string,
      tw: (row.body_tw as string | null) ?? undefined,
      pcm: (row.body_pcm as string | null) ?? undefined,
    },
    mediaUrl: (row.media_url as string | null) ?? undefined,
  };

  switch (row.format as Module["format"]) {
    case "scenario":
      return {
        ...base,
        format: "scenario",
        choices: row.choices as ScenarioChoice[],
        timeLimitSeconds: (row.time_limit_seconds as number | null) ?? undefined,
      };
    case "news_clip":
      return {
        ...base,
        format: "news_clip",
        questions: row.questions as string[],
      };
    case "audio_story":
      return {
        ...base,
        format: "audio_story",
        followUpQuestion: row.follow_up_question as string,
      };
    case "mini_game":
      return {
        ...base,
        format: "mini_game",
        items: row.items as DragItem[],
        zones: row.zones as DropZone[],
      };
    case "reflection_journal":
      return { ...base, format: "reflection_journal" };
    default:
      throw new Error(`Unknown module format: ${row.format}`);
  }
}
