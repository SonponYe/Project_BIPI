"use client";

import { MapContainer, GeoJSON, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { PulseRow } from "@/types/pulse";

// Region-level heat map (e.g. "which regions fail specific climate
// knowledge areas most frequently"). Reads only the aggregated `bipi_pulse`
// table — never per-user data (pitch Section 7).
//
// geoJson comes from src/content/geo/ghana-regions.geojson (geoBoundaries,
// see that folder's README for licensing) — its shapeName property carries
// a " Region" suffix that bipi_pulse.region / GHANA_REGIONS don't.
export function HeatMap({ rows, geoJson }: { rows: PulseRow[]; geoJson: GeoJSON.FeatureCollection }) {
  function colorForRegion(shapeName: string | undefined) {
    const region = shapeName?.replace(/\s+Region$/, "");
    const row = rows.find((r) => r.region === region);
    if (!row) return "#e5e7eb";
    // Higher fail rate → darker shade.
    const intensity = Math.min(1, row.failRate);
    const lightness = 90 - intensity * 55;
    return `hsl(4, 70%, ${lightness}%)`;
  }

  return (
    <MapContainer center={[7.9465, -1.0232]} zoom={6} className="h-96 w-full rounded-lg">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <GeoJSON
        data={geoJson}
        style={(feature) => ({
          fillColor: colorForRegion(feature?.properties?.shapeName),
          fillOpacity: 0.7,
          color: "#0f766e",
          weight: 1,
        })}
      />
    </MapContainer>
  );
}
