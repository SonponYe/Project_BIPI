"use client";

import { useState } from "react";

// Private, prompted personal journal (modules 31, 86, 115, 119). Entries are
// never aggregated into BIPI Pulse — this is the one format that stays
// entirely off the intelligence layer by design.
export function ReflectionJournal({
  prompt,
  onSave,
}: {
  prompt: string;
  onSave: (entry: string) => void;
}) {
  const [entry, setEntry] = useState("");
  const [saved, setSaved] = useState(false);

  return (
    <div className="flex flex-col gap-3 p-6">
      <p className="text-gray-700">{prompt}</p>
      <textarea
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        rows={5}
        className="rounded-lg border border-gray-300 p-3"
        placeholder="Write, or use voice input, to reflect. Only you can see this."
      />
      <button
        onClick={() => {
          onSave(entry);
          setSaved(true);
        }}
        className="self-start rounded-lg bg-pulse-500 px-4 py-2 text-white"
      >
        {saved ? "Saved" : "Save privately"}
      </button>
    </div>
  );
}
