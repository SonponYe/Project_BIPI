import Link from "next/link";
import { tracks } from "@/content/tracks";
import { AVAILABLE_MODULE_IDS } from "@/content/modules";

export default function TracksPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 p-6">
      <h1 className="text-xl font-bold text-pulse-800">Choose a track</h1>
      {tracks.map((track) => {
        const availableCount = track.moduleIds.filter((id) =>
          AVAILABLE_MODULE_IDS.includes(id)
        ).length;
        return (
          <Link
            key={track.id}
            href={`/tracks/${track.id}`}
            className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <h2 className="font-semibold text-gray-900">{track.title}</h2>
            <p className="text-xs font-medium text-pulse-600">
              {availableCount} lesson{availableCount === 1 ? "" : "s"} available
            </p>
            <p className="mt-1 text-sm text-gray-500">{track.description}</p>
          </Link>
        );
      })}
    </main>
  );
}
