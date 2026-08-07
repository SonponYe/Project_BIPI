import { createServiceRoleClient } from "@/lib/supabase/server";
import { rowToModule } from "@/lib/content/module-row";
import type { Module } from "@/types/module";

// Shared by app/modules/[moduleId]/page.tsx and app/tracks/[trackId]/page.tsx
// — both need one authored module's content. Reads from bipi_modules
// (synced via scripts/sync-modules-to-db.ts), not the filesystem — the
// deployed app never reads src/content/modules/*.json directly.
export async function loadModule(moduleId: number | string): Promise<Module | null> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("bipi_modules")
    .select("*")
    .eq("id", Number(moduleId))
    .maybeSingle();

  if (error || !data) return null;
  return rowToModule(data);
}
