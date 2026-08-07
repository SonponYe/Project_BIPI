import Link from "next/link";
import { notFound } from "next/navigation";
import { tracks } from "@/content/tracks";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { TrackId } from "@/types/module";

// Next.js 15 made route params a Promise, the same way it did `cookies()`.
//
// Deliberately not statically generated (no generateStaticParams) — module
// content now lives in bipi_modules and can change without a redeploy, so
// this needs to query fresh on every request rather than bake the lesson
// list in at build time.
export default async function TrackPage({
  params,
}: {
  params: Promise<{ trackId: TrackId }>;
}) {
  const { trackId } = await params;
  const track = tracks.find((t) => t.id === trackId);
  if (!track) notFound();

  const supabase = createServiceRoleClient();
  const { data: lessons } = await supabase
    .from("bipi_modules")
    .select("id, title")
    .eq("track", trackId)
    .order("id");

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 p-6">
      <h1 className="text-xl font-bold text-pulse-800">{track.title}</h1>
      <p className="text-gray-500">{track.description}</p>
      {!lessons || lessons.length === 0 ? (
        <p className="text-sm text-gray-400">Lessons for this track are coming soon.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {lessons.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/modules/${lesson.id}`}
              className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h2 className="font-semibold text-gray-900">{lesson.title}</h2>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
