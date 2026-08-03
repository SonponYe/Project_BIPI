// Drives the curriculum-brief-to-module-content workflow described in pitch
// Section 16: draft with Claude, review by a team member before it ships.
// Usage: npm run content:generate -- --module=14
import fs from "node:fs";
import path from "node:path";
import { generateModuleDraft, localise } from "../src/lib/ai/claude";

async function main() {
  const moduleArg = process.argv.find((arg) => arg.startsWith("--module="));
  const moduleId = moduleArg?.split("=")[1];
  if (!moduleId) {
    console.error("Usage: npm run content:generate -- --module=<id>");
    process.exit(1);
  }

  const briefPath = path.join(process.cwd(), "docs/curriculum-briefs", `module-${moduleId}.txt`);
  if (!fs.existsSync(briefPath)) {
    console.error(`No curriculum brief found at ${briefPath}`);
    process.exit(1);
  }

  const brief = fs.readFileSync(briefPath, "utf-8");
  const en = await generateModuleDraft(brief);
  const tw = await localise(en, "tw");
  const pcm = await localise(en, "pcm");

  const outPath = path.join(process.cwd(), "src/content/modules", `module-${moduleId}.json`);
  console.log(`Draft generated for module ${moduleId}.`);
  console.log("Review the following before writing it to", outPath);
  console.log({ en, tw, pcm });
}

main();
