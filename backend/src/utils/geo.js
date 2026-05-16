const EARTH_RADIUS_METERS = 6371008.8;
const SQ_METERS_PER_ACRE = 4046.8564224;

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function closeRing(ring) {
  if (!Array.isArray(ring) || ring.length < 4) {
    throw new Error("Boundary polygon needs at least three points.");
  }

  const first = ring[0];
  const last = ring[ring.length - 1];
  return first[0] === last[0] && first[1] === last[1] ? ring : [...ring, first];
}

function ringAreaSquareMeters(ring) {
  if (!Array.isArray(ring) || ring.length < 4) {
    return 0;
  }

  let total = 0;
  for (let index = 0; index < ring.length - 1; index += 1) {
    const [lon1, lat1] = ring[index];
    const [lon2, lat2] = ring[index + 1];
    total += toRadians(lon2 - lon1) * (2 + Math.sin(toRadians(lat1)) + Math.sin(toRadians(lat2)));
  }

  return Math.abs((total * EARTH_RADIUS_METERS * EARTH_RADIUS_METERS) / 2);
}

function normalizePolygonCoordinates(coordinates) {
  if (!Array.isArray(coordinates) || !Array.isArray(coordinates[0])) {
    throw new Error("Boundary must include polygon coordinates.");
  }

  return [closeRing(coordinates[0]), ...coordinates.slice(1).map(closeRing)];
}

export function normalizeBoundaryGeoJson(boundary) {
  if (!boundary || !Array.isArray(boundary.coordinates)) {
    throw new Error("Boundary must be a GeoJSON Polygon or MultiPolygon.");
  }

  if (boundary.type === "Polygon") {
    return {
      type: "Polygon",
      coordinates: normalizePolygonCoordinates(boundary.coordinates)
    };
  }

  if (boundary.type === "MultiPolygon") {
    return {
      type: "MultiPolygon",
      coordinates: boundary.coordinates.map(normalizePolygonCoordinates)
    };
  }

  throw new Error("Boundary must be a GeoJSON Polygon or MultiPolygon.");
}

export function calculateAreaAcres(boundary) {
  const normalizedBoundary = normalizeBoundaryGeoJson(boundary);
  const polygons =
    normalizedBoundary.type === "Polygon"
      ? [normalizedBoundary.coordinates]
      : normalizedBoundary.coordinates;

  const areaSquareMeters = polygons.reduce(
    (total, polygonCoordinates) => total + ringAreaSquareMeters(polygonCoordinates[0]),
    0
  );

  return Number((areaSquareMeters / SQ_METERS_PER_ACRE).toFixed(3));
}
