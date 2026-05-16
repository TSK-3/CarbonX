import { useEffect } from "react";
import { MapContainer, Polygon, TileLayer, useMap } from "react-leaflet";
import { geometryToLatLngRings } from "../utils/geo.js";

const WARANGAL_CENTER = [17.9689, 79.5941];

function FitPolygon({ polygon }) {
  const map = useMap();

  useEffect(() => {
    const rings = geometryToLatLngRings(polygon);
    if (!rings.length) return;
    map.fitBounds(rings.flat(), { padding: [40, 40] });
  }, [map, polygon]);

  return null;
}

export function FarmMap({ boundaryGeojson }) {
  return (
    <div className="h-full w-full bg-surface-dim">
      <MapContainer center={WARANGAL_CENTER} zoom={14} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {boundaryGeojson ? (
          <>
            {geometryToLatLngRings(boundaryGeojson).map((positions, index) => (
              <Polygon
                key={index}
                positions={positions}
                pathOptions={{ color: "#173124", fillColor: "#98b5a3", fillOpacity: 0.4, weight: 3 }}
              />
            ))}
            <FitPolygon polygon={boundaryGeojson} />
          </>
        ) : null}
      </MapContainer>
    </div>
  );
}
