import L from "leaflet";
import { useEffect, useRef } from "react";
import { FeatureGroup, MapContainer, Polygon, TileLayer, useMap } from "react-leaflet";
import "leaflet-draw";
import { calculateAreaAcresFromLatLngs, geometryToLatLngRings, latLngsToPolygon } from "../utils/geo.js";

const WARANGAL_CENTER = [17.9689, 79.5941];

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

function DrawControls({ onBoundaryChange }) {
  const map = useMap();
  const featureGroupRef = useRef(null);

  useEffect(() => {
    const featureGroup = featureGroupRef.current;
    if (!featureGroup) {
      return undefined;
    }

    const drawControl = new L.Control.Draw({
      draw: {
        polyline: false,
        rectangle: false,
        circle: false,
        circlemarker: false,
        marker: false,
        polygon: {
          allowIntersection: false,
          showArea: true,
          shapeOptions: {
            color: "#256f45",
            fillColor: "#8fcf9d",
            fillOpacity: 0.3
          }
        }
      },
      edit: {
        featureGroup,
        remove: true
      }
    });

    map.addControl(drawControl);

    function syncLayer(layer) {
      const latlngs = layer.getLatLngs()[0];
      onBoundaryChange({
        boundaryGeojson: latLngsToPolygon(latlngs),
        areaAcres: calculateAreaAcresFromLatLngs(latlngs)
      });
    }

    map.on(L.Draw.Event.CREATED, (event) => {
      featureGroup.clearLayers();
      featureGroup.addLayer(event.layer);
      syncLayer(event.layer);
    });

    map.on(L.Draw.Event.EDITED, (event) => {
      event.layers.eachLayer(syncLayer);
    });

    map.on(L.Draw.Event.DELETED, () => {
      onBoundaryChange({ boundaryGeojson: null, areaAcres: 0 });
    });

    return () => {
      map.removeControl(drawControl);
    };
  }, [map, onBoundaryChange]);

  return <FeatureGroup ref={featureGroupRef} />;
}

function FitPolygon({ polygon }) {
  const map = useMap();

  useEffect(() => {
    const rings = geometryToLatLngRings(polygon);
    if (!rings.length) {
      return;
    }
    map.fitBounds(rings.flat(), { padding: [28, 28] });
  }, [map, polygon]);

  return null;
}

export function FarmMap({ editable = false, boundaryGeojson, onBoundaryChange }) {
  return (
    <div className="map-shell h-full min-h-[420px] overflow-hidden rounded-md border border-stone-200 bg-white">
      <MapContainer center={WARANGAL_CENTER} zoom={14} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {editable ? <DrawControls onBoundaryChange={onBoundaryChange} /> : null}
        {boundaryGeojson ? (
          <>
            {geometryToLatLngRings(boundaryGeojson).map((positions, index) => (
              <Polygon
                key={index}
                positions={positions}
                pathOptions={{ color: "#256f45", fillColor: "#8fcf9d", fillOpacity: 0.3 }}
              />
            ))}
            <FitPolygon polygon={boundaryGeojson} />
          </>
        ) : null}
      </MapContainer>
    </div>
  );
}
