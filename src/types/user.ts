export type Language = "tw" | "pcm" | "en";

// Stage 2, first tap — icon-based, no reading required.
export type DemographicType = "youth" | "woman" | "person-with-disability" | "other";

// Stage 2, second tap — user picks up to two.
export type CarePriority = "food" | "water" | "jobs" | "safety" | "community";

// Stage 2, third tap — sets the default content format for every module.
export type ContentPreference = "read" | "listen" | "watch";

export type ProfileTier = "guest" | "verified";

// Guest Profile: created automatically on first open, device-scoped, no PII.
export interface GuestProfile {
  deviceId: string;
  region: string | null;
  demographicType: DemographicType | null;
  carePriorities: CarePriority[];
  contentPreference: ContentPreference | null;
  language: Language;
  consentGiven: boolean;
  tier: ProfileTier;
}
