import { ModulePlayer } from "@/components/ModulePlayer";
import { loadModule } from "@/lib/content/load-module";

// Next.js 15 made route params a Promise, the same way it did `cookies()`.
export default async function ModulePage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const module_ = await loadModule(moduleId);

  if (!module_) {
    return (
      <main className="mx-auto max-w-xl p-6 text-center text-gray-500">
        This one&apos;s still being written — check back soon.
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <ModulePlayer module={module_} />
    </main>
  );
}
