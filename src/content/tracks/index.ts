import type { Track } from "@/types/module";

// The 120 GreenRes modules organised into BIPI's five tracks (pitch Section 5).
// Individual module content lives in src/content/modules/ once authored;
// this index is what app/(learn)/tracks/page.tsx renders.
export const tracks: Track[] = [
  {
    id: "climate-foundations",
    title: "Climate Foundations",
    moduleRange: "Modules 1–20",
    description:
      "Entry point for all users: climate basics, causes, and Ghana-specific hazards, built up from no prior knowledge.",
    moduleIds: Array.from({ length: 20 }, (_, i) => i + 1),
  },
  {
    id: "daily-life-inclusion",
    title: "Daily Life, Health, Women & Disability Inclusion",
    moduleRange: "Modules 21–34, 42–57",
    description:
      "The largest track: household and health impacts, plus eight dedicated modules each for women's climate vulnerability and disability-inclusive climate action.",
    moduleIds: [
      ...Array.from({ length: 14 }, (_, i) => i + 21),
      ...Array.from({ length: 16 }, (_, i) => i + 42),
    ],
  },
  {
    id: "disaster-preparedness",
    title: "Disaster Preparedness & Resilience",
    moduleRange: "Modules 74–80",
    description:
      "Scenario-heavy preparedness and response training, including disability-inclusive evacuation planning.",
    moduleIds: Array.from({ length: 7 }, (_, i) => i + 74),
  },
  {
    id: "youth-green-jobs",
    title: "Youth, Green Jobs & Career Pathways",
    moduleRange: "Modules 35–40, 83–84, 120",
    description:
      "Connects climate awareness to economic opportunity via the Career Pathway Explorer and fact-check challenges.",
    moduleIds: [...Array.from({ length: 6 }, (_, i) => i + 35), 83, 84, 120],
  },
  {
    id: "green-economy",
    title: "Green Economy & Enterprise",
    moduleRange: "Modules 81–82, 85–104",
    description:
      "From understanding to doing: circular economy, green enterprise, climate finance, and the Module 97 citizen-science layer that powers BIPI Pulse.",
    moduleIds: [81, 82, ...Array.from({ length: 20 }, (_, i) => i + 85)],
  },
];
