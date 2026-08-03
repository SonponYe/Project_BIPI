import fs from "node:fs";
import path from "node:path";
import { ModulePlayer } from "@/components/ModulePlayer";
import type { Module } from "@/types/module";

// Modules are authored incrementally (pitch Section 16: quality over
// quantity). Until src/content/modules/module-{id}.json exists, the page
// shows a "not yet authored" state rather than a broken route.
function loadModule(moduleId: string): Module | null {
  const filePath = path.join(process.cwd(), "src/content/modules", `module-${moduleId}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export default function ModulePage({ params }: { params: { moduleId: string } }) {
  const module_ = loadModule(params.moduleId);

  if (!module_) {
    return (
      <main className="mx-auto max-w-xl p-6 text-center text-gray-500">
        Module {params.moduleId} is on the roadmap but not authored yet.
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <ModulePlayer module={module_} />
    </main>
  );
}
