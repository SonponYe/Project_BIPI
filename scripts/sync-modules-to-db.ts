// Pushes every src/content/modules/module-{id}.json into the bipi_modules
// table. Run after authoring or editing a module: `npm run modules:sync`.
// The JSON files stay the source of truth for content review (git diffs);
// this script is the one-way sync from "authored" to "served."
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const projectRoot = path.join(__dirname, "..");

const envText = fs.readFileSync(path.join(projectRoot, ".env.local"), "utf-8");
for (const line of envText.split("\n")) {
  const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (match) process.env[match[1]] = match[2].trim();
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const modulesDir = path.join(projectRoot, "src/content/modules");
  const files = fs.readdirSync(modulesDir).filter((f) => /^module-\d+\.json$/.test(f));

  console.log(`Syncing ${files.length} modules...`);

  for (const file of files) {
    const mod = JSON.parse(fs.readFileSync(path.join(modulesDir, file), "utf-8"));

    const row = {
      id: mod.id,
      track: mod.track,
      title: mod.title,
      format: mod.format,
      assessment_method: mod.assessmentMethod,
      body_en: mod.body.en,
      body_tw: mod.body.tw ?? null,
      body_pcm: mod.body.pcm ?? null,
      media_url: mod.mediaUrl ?? null,
      time_limit_seconds: mod.timeLimitSeconds ?? null,
      choices: mod.choices ?? null,
      questions: mod.questions ?? null,
      follow_up_question: mod.followUpQuestion ?? null,
      items: mod.items ?? null,
      zones: mod.zones ?? null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("bipi_modules").upsert(row);
    if (error) {
      console.error(`  module ${mod.id} failed:`, error.message);
      process.exitCode = 1;
    } else {
      console.log(`  module ${mod.id} synced`);
    }
  }
}

main();
