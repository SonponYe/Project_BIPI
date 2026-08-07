import Link from "next/link";
import { tracks } from "@/content/tracks";
import { createServiceRoleClient } from "@/lib/supabase/server";

// Without this, Next.js has no signal that this page depends on live data
// (no cookies/headers/dynamic params involved) and would statically cache
// the lesson counts at build time — silently stale the moment content
// changes via `npm run modules:sync` without a redeploy, which defeats the
// point of moving content into the database.
export const dynamic = "force-dynamic";

export default async function TracksPage() {
  const supabase = createServiceRoleClient();

  const counts = await Promise.all(
    tracks.map((track) =>
      supabase
        .from("bipi_modules")
        .select("*", { count: "exact", head: true })
        .eq("track", track.id)
        .then(({ count }) => count ?? 0)
    )
  );

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 p-6">
      <h1 className="text-xl font-bold text-pulse-800">Choose a track</h1>
      {tracks.map((track, i) => (
        <Link
          key={track.id}
          href={`/tracks/${track.id}`}
          className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <h2 className="font-semibold text-gray-900">{track.title}</h2>
          <p className="text-xs font-medium text-pulse-600">
            {counts[i]} lesson{counts[i] === 1 ? "" : "s"} available
          </p>
          <p className="mt-1 text-sm text-gray-500">{track.description}</p>
        </Link>
      ))}
    </main>
  );
}
