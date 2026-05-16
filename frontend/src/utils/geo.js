const EARTH_RADIUS_METERS = 6371008.8;
const SQ_METERS_PER_ACRE = 4046.8564224;

function toRadians(value) {
  return (value * Math.PI) / 180;
}

export function calculateAreaAcresFromLatLngs(latlngs) {
  if (!Array.isArray(latlngs) || latlngs.length < 3) {
    return 0;
  }

  const points = [...latlngs, latlngs[0]];
  let total = 0;

  for (let index = 0; index < points.length - 1; index += 1) {
    const first = points[index];
    const second = points[index + 1];
    total +=
      toRadians(second.lng - first.lng) *
      (2 + Math.sin(toRadians(first.lat)) + Math.sin(toRadians(second.lat)));
  }

  return Math.abs((total * EARTH_RADIUS_METERS * EARTH_RADIUS_METERS) / 2) / SQ_METERS_PER_ACRE;
}

function ringAreaAcres(ring) {
  if (!Array.isArray(ring) || ring.length < 4) {
    return 0;
  }

  return calculateAreaAcresFromLatLngs(ring.map(([lng, lat]) => ({ lng, lat })));
}

export function calculateAreaAcresFromGeoJson(geometry) {
  if (!geometry) {
    return 0;
  }

  if (geometry.type === "Polygon") {
    return ringAreaAcres(geometry.coordinates[0]);
  }

  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates.reduce((total, polygon) => total + ringAreaAcres(polygon[0]), 0);
  }

  return 0;
}

export function latLngsToPolygon(latlngs) {
  const coordinates = latlngs.map((point) => [point.lng, point.lat]);
  coordinates.push(coordinates[0]);
  return {
    type: "Polygon",
    coordinates: [coordinates]
  };
}

export function geometryToLatLngRings(geometry) {
  if (!geometry) {
    return [];
  }

  if (geometry.type === "Polygon") {
    return [geometry.coordinates[0].map(([lng, lat]) => [lat, lng])];
  }

  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates.map((polygon) => polygon[0].map(([lng, lat]) => [lat, lng]));
  }

  return [];
}
