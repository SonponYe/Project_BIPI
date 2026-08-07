import fs from "node:fs";
import path from "node:path";
import type { Module } from "@/types/module";

// Shared by app/modules/[moduleId]/page.tsx and app/tracks/[trackId]/page.tsx
// — both need to read authored module JSON server-side.
export function loadModule(moduleId: number | string): Module | null {
  const filePath = path.join(process.cwd(), "src/content/modules", `module-${moduleId}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}
