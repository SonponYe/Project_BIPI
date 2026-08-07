`ghana-regions.geojson` — Ghana's 16 ADM1 regions, sourced from
[geoBoundaries](https://www.geoboundaries.org/) (built from OpenStreetMap),
licensed CC BY-SA 4.0 (attribution + share-alike). Downloaded from:

https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/GHA/ADM1/geoBoundaries-GHA-ADM1_simplified.geojson

Each feature's `properties.shapeName` is the region name with a " Region"
suffix (e.g. `"Ashanti Region"`) — `components/dashboard/HeatMap.tsx` strips
that suffix to match against `src/content/ghana-regions.ts` /
`bipi_users.region` / `bipi_pulse.region`, which don't carry the suffix.

If this file is ever redistributed in modified form, the license requires
carrying forward the same CC BY-SA terms and this attribution.
