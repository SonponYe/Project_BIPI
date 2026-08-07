"use client";

import { useState } from "react";
import type { DragItem, DropZone } from "@/types/module";

// Sort items into zones (modules 2, 26, 73, 85, 92, 93). Tap-to-select then
// tap-a-zone-to-place is the primary interaction — native HTML5
// drag-and-drop is kept as a progressive enhancement for desktop mouse
// users, but it has no keyboard/screen-reader equivalent and is notoriously
// unreliable on touchscreens, which undercuts "works on basic
// touchscreens" for the actual majority of users on this platform.
export function MiniGame({
  items,
  zones,
  onComplete,
}: {
  items: DragItem[];
  zones: DropZone[];
  onComplete: (correctCount: number, total: number) => void;
}) {
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  function place(itemId: string, zoneId: string) {
    const next = { ...placements, [itemId]: zoneId };
    setPlacements(next);
    setSelectedItemId(null);
    if (Object.keys(next).length === items.length) {
      const correctCount = items.filter((item) => next[item.id] === item.correctZoneId).length;
      onComplete(correctCount, items.length);
    }
  }

  const remaining = items.filter((item) => !placements[item.id]);

  return (
    <div className="flex flex-col gap-6 p-6">
      <p role="status" aria-live="polite" className="text-sm text-gray-500">
        {items.length - remaining.length} of {items.length} placed
        {selectedItemId ? " — now choose where it goes" : ""}
      </p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Items to sort">
        {remaining.map((item) => (
          <button
            key={item.id}
            type="button"
            draggable
            onDragStart={(e) => e.dataTransfer.setData("text/plain", item.id)}
            onClick={() => setSelectedItemId((current) => (current === item.id ? null : item.id))}
            aria-pressed={selectedItemId === item.id}
            className={`cursor-move rounded-lg border px-3 py-2 ${
              selectedItemId === item.id ? "border-pulse-600 bg-pulse-50" : "border-gray-300"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {zones.map((zone) => (
          <button
            key={zone.id}
            type="button"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => place(e.dataTransfer.getData("text/plain"), zone.id)}
            onClick={() => selectedItemId && place(selectedItemId, zone.id)}
            aria-label={`Place selected item in ${zone.label}`}
            className={`rounded-lg border-2 border-dashed p-4 text-center ${
              selectedItemId ? "border-pulse-500" : "border-gray-300"
            }`}
          >
            {zone.label}
          </button>
        ))}
      </div>
    </div>
  );
}
