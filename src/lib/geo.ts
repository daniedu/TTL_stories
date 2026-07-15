import ngeohash from "ngeohash";

const GEOFIRE_PRECISION = 7;

export function encodeGeohash(lat: number, lng: number): string {
  return ngeohash.encode(lat, lng, GEOFIRE_PRECISION);
}

export function geohashQueryBounds(
  lat: number,
  lng: number,
  radiusKm: number,
): string[] {
  const latAdj = radiusKm / 111;
  const lngAdj = radiusKm / (111 * Math.cos((lat * Math.PI) / 180));

  const latMin = Math.max(-90, lat - latAdj);
  const latMax = Math.min(90, lat + latAdj);
  const lngMin = Math.max(-180, lng - lngAdj);
  const lngMax = Math.min(180, lng + lngAdj);

  const hashMin = ngeohash.encode(latMin, lngMin, GEOFIRE_PRECISION);
  const hashMax = ngeohash.encode(latMax, lngMax, GEOFIRE_PRECISION);

  return ngeohash.bboxes(
    Math.min(latMin, latMax),
    Math.min(lngMin, lngMax),
    Math.max(latMin, latMax),
    Math.max(lngMin, lngMax),
    GEOFIRE_PRECISION,
  );
}
