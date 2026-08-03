import Link from "next/link";
import { tracks } from "@/content/tracks";

export default function TracksPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 p-6">
      <h1 className="text-xl font-semibold text-pulse-700">Choose a track</h1>
      {tracks.map((track) => (
        <Link
          key={track.id}
          href={`/tracks/${track.id}`}
          className="rounded-lg border border-gray-200 p-4 hover:border-pulse-500"
        >
          <h2 className="font-medium">{track.title}</h2>
          <p className="text-sm text-gray-500">{track.moduleRange}</p>
          <p className="mt-1 text-sm text-gray-700">{track.description}</p>
        </Link>
      ))}
    </main>
  );
}
