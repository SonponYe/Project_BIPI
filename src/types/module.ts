// One of the five delivery formats every GreenRes module maps to (pitch Section 4).
export type ContentFormat =
  | "scenario"
  | "news_clip"
  | "audio_story"
  | "mini_game"
  | "reflection_journal";

export type TrackId =
  | "climate-foundations"
  | "daily-life-inclusion"
  | "disaster-preparedness"
  | "youth-green-jobs"
  | "green-economy";

export interface Track {
  id: TrackId;
  title: string;
  moduleRange: string;
  description: string;
  moduleIds: number[];
}

export interface Module {
  id: number;
  track: TrackId;
  title: string;
  format: ContentFormat;
  assessmentMethod: string;
  body: {
    en: string;
    tw?: string;
    pcm?: string;
  };
  mediaUrl?: string;
}
