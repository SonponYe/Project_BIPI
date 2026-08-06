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

export interface LocalisedText {
  en: string;
  tw?: string;
  pcm?: string;
}

export interface ScenarioChoice {
  label: string;
  isCorrect: boolean;
  consequence: string;
}

export interface DragItem {
  id: string;
  label: string;
  correctZoneId: string;
}

export interface DropZone {
  id: string;
  label: string;
}

interface BaseModule {
  id: number;
  track: TrackId;
  title: string;
  assessmentMethod: string;
  body: LocalisedText;
  mediaUrl?: string;
}

// Each format carries the fields its player component actually needs — see
// src/components/ModulePlayer.tsx, which narrows on `format` to route to
// ScenarioPlayer / NewsClipPlayer / AudioStoryPlayer / MiniGame /
// ReflectionJournal and pass these through directly.
export interface ScenarioModule extends BaseModule {
  format: "scenario";
  choices: ScenarioChoice[];
  timeLimitSeconds?: number;
}

export interface NewsClipModule extends BaseModule {
  format: "news_clip";
  questions: string[];
}

export interface AudioStoryModule extends BaseModule {
  format: "audio_story";
  followUpQuestion: string;
}

export interface MiniGameModule extends BaseModule {
  format: "mini_game";
  items: DragItem[];
  zones: DropZone[];
}

export interface ReflectionJournalModule extends BaseModule {
  format: "reflection_journal";
}

export type Module =
  | ScenarioModule
  | NewsClipModule
  | AudioStoryModule
  | MiniGameModule
  | ReflectionJournalModule;
