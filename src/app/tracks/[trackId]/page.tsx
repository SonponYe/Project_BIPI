import Link from "next/link";
import { notFound } from "next/navigation";
import { tracks } from "@/content/tracks";
import { loadModule } from "@/lib/content/load-module";
import type { TrackId } from "@/types/module";

export function generateStaticParams() {
  return tracks.map((track) => ({ trackId: track.id }));
}

// Next.js 15 made route params a Promise, the same way it did `cookies()`.
export default async function TrackPage({
  params,
}: {
  params: Promise<{ trackId: TrackId }>;
}) {
  const { trackId } = await params;
  const track = tracks.find((t) => t.id === trackId);
  if (!track) notFound();

  // Only show lessons that are actually written — a grid of unauthored IDs
  // is dev/backend detail nobody using the app should see.
  const availableLessons = track.moduleIds
    .map((id) => ({ id, module: loadModule(id) }))
    .filter((entry): entry is { id: number; module: NonNullable<ReturnType<typeof loadModule>> } =>
      Boolean(entry.module)
    );

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 p-6">
      <h1 className="text-xl font-bold text-pulse-800">{track.title}</h1>
      <p className="text-gray-500">{track.description}</p>
      {availableLessons.length === 0 ? (
        <p className="text-sm text-gray-400">Lessons for this track are coming soon.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {availableLessons.map(({ id, module: mod }) => (
            <Link
              key={id}
              href={`/modules/${id}`}
              className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h2 className="font-semibold text-gray-900">{mod.title}</h2>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
