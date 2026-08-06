"use client";

import { useState } from "react";
import type { DragItem, DropZone } from "@/types/module";

// Drag-and-drop exercise (sort waste, fix the drain, plant the right crop —
// modules 2, 26, 73, 85, 92, 93). Simple enough for basic touchscreens.
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

  function place(itemId: string, zoneId: string) {
    const next = { ...placements, [itemId]: zoneId };
    setPlacements(next);
    if (Object.keys(next).length === items.length) {
      const correctCount = items.filter((item) => next[item.id] === item.correctZoneId).length;
      onComplete(correctCount, items.length);
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-wrap gap-2">
        {items
          .filter((item) => !placements[item.id])
          .map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", item.id)}
              className="cursor-move rounded-lg border border-gray-300 px-3 py-2"
            >
              {item.label}
            </div>
          ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {zones.map((zone) => (
          <div
            key={zone.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => place(e.dataTransfer.getData("text/plain"), zone.id)}
            className="rounded-lg border-2 border-dashed border-gray-300 p-4 text-center"
          >
            {zone.label}
          </div>
        ))}
      </div>
    </div>
  );
}
