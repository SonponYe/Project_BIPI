import Link from "next/link";
import { notFound } from "next/navigation";
import { tracks } from "@/content/tracks";
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

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 p-6">
      <h1 className="text-xl font-semibold text-pulse-700">{track.title}</h1>
      <p className="text-gray-700">{track.description}</p>
      <div className="grid grid-cols-4 gap-2">
        {track.moduleIds.map((moduleId) => (
          <Link
            key={moduleId}
            href={`/modules/${moduleId}`}
            className="rounded-lg border border-gray-200 py-3 text-center hover:border-pulse-500"
          >
            {moduleId}
          </Link>
        ))}
      </div>
    </main>
  );
}
