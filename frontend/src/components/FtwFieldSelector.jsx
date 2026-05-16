import maplibregl from "maplibre-gl";
import { Protocol } from "pmtiles";
import { useEffect, useRef, useState } from "react";
import { calculateAreaAcresFromGeoJson } from "../utils/geo.js";

const FTW_PM_TILES_URL =
  "https://data.source.coop/kerner-lab/fields-of-the-world/ftw-sources.pmtiles";
const FTW_SOURCE_LAYER = "ftw-sources";
const WARANGAL_CENTER = [79.5941, 17.9689];

let protocolRegistered = false;

function ensurePmtilesProtocol() {
  if (protocolRegistered) {
    return;
  }
  const protocol = new Protocol();
  maplibregl.addProtocol("pmtiles", protocol.tile);
  protocolRegistered = true;
}

function featureToSelection(feature) {
  if (!feature?.geometry || !["Polygon", "MultiPolygon"].includes(feature.geometry.type)) {
    return null;
  }

  const areaAcres = calculateAreaAcresFromGeoJson(feature.geometry);
  if (!areaAcres) {
    return null;
  }

  return {
    boundaryGeojson: feature.geometry,
    areaAcres,
    metadata: {
      label: feature.properties?.dataset || "source field",
      time: feature.properties?.determination_datetime || "reference boundary",
      source: "Fields of The World, Kerner Lab, Source Cooperative",
      fieldId: feature.properties?.id || "",
      license: feature.properties?.license || "",
      sourceArea: feature.properties?.area ?? null,
      sourcePerimeter: feature.properties?.perimeter ?? null
    }
  };
}

export function FtwFieldSelector({ onBoundaryChange, onFallbackRequest }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [status, setStatus] = useState("Loading field boundary layer");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return undefined;
    }

    ensurePmtilesProtocol();

    const map = new maplibregl.Map({
      container: containerRef.current,
      center: WARANGAL_CENTER,
      zoom: 13.2,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "OpenStreetMap"
          },
          ftw: {
            type: "vector",
            url: `pmtiles://${FTW_PM_TILES_URL}`,
            attribution: "Fields of The World, Kerner Lab, Source Cooperative"
          },
          selectedField: {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: []
            }
          }
        },
        layers: [
          {
            id: "osm",
            type: "raster",
            source: "osm"
          },
          {
            id: "ftw-fields-fill",
            type: "fill",
            source: "ftw",
            "source-layer": FTW_SOURCE_LAYER,
            paint: {
              "fill-color": "#2f8f5b",
              "fill-opacity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                8,
                0.12,
                13,
                0.28,
                15,
                0.42
              ]
            }
          },
          {
            id: "ftw-fields-line",
            type: "line",
            source: "ftw",
            "source-layer": FTW_SOURCE_LAYER,
            paint: {
              "line-color": "#14532d",
              "line-opacity": ["interpolate", ["linear"], ["zoom"], 8, 0.2, 13, 0.65],
              "line-width": ["interpolate", ["linear"], ["zoom"], 8, 0.3, 15, 1.3]
            }
          },
          {
            id: "selected-field-fill",
            type: "fill",
            source: "selectedField",
            paint: {
              "fill-color": "#f2b84b",
              "fill-opacity": 0.48
            }
          },
          {
            id: "selected-field-line",
            type: "line",
            source: "selectedField",
            paint: {
              "line-color": "#7c3f00",
              "line-width": 3
            }
          }
        ]
      }
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    mapRef.current = map;

    map.on("load", () => {
      setStatus("Zoom in to select an FTW source field");
    });

    map.on("error", (event) => {
      setError(
        event.error?.message ||
          "FTW source boundaries unavailable. Pan to an FTW-covered country or use manual draw."
      );
    });

    map.on("mouseenter", "ftw-fields-fill", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", "ftw-fields-fill", () => {
      map.getCanvas().style.cursor = "";
    });

    map.on("click", "ftw-fields-fill", (event) => {
      const selectedFeature = event.features?.[0];
      const selection = featureToSelection(selectedFeature);

      if (!selection) {
        setStatus("No FTW field selected");
        return;
      }

      map.getSource("selectedField").setData({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: selection.boundaryGeojson,
            properties: selection.metadata
          }
        ]
      });

      setStatus("FTW field selected");
      setError("");
      onBoundaryChange(selection);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [onBoundaryChange]);

  return (
    <div className="relative min-h-[540px] overflow-hidden rounded-md border border-stone-200 bg-white">
      <div ref={containerRef} className="absolute inset-0" />
      <div className="absolute left-3 top-3 max-w-xs rounded-md border border-stone-200 bg-white/95 px-3 py-2 text-xs shadow-sm">
        <p className="font-semibold text-ink">{status}</p>
        <p className="mt-1 text-stone-600">
          Source boundaries from 24 FTW benchmark countries
        </p>
      </div>
      {error ? (
        <div className="absolute bottom-3 left-3 right-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 shadow-sm">
          {error}
        </div>
      ) : null}
      <button
        className="btn-secondary absolute bottom-3 right-3 bg-white/95"
        onClick={onFallbackRequest}
        type="button"
      >
        Use manual draw
      </button>
    </div>
  );
}
