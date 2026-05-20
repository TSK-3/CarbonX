import L from "leaflet";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Protocol } from "pmtiles";
import { useEffect, useRef, useState, useCallback } from "react";
import { FeatureGroup, MapContainer, TileLayer, useMap } from "react-leaflet";
import { calculateAreaAcresFromLatLngs, latLngsToPolygon, calculateAreaAcresFromGeoJson } from "../utils/geo.js";
import { useI18n } from "../i18n/I18nContext.jsx";
import { Search, LocateFixed, Layers, Plus, Minus, MousePointer2 } from "lucide-react";

const FTW_PM_TILES_URL = "https://data.source.coop/kerner-lab/fields-of-the-world/ftw-sources.pmtiles";
const FTW_SOURCE_LAYER = "ftw-sources";
const WARANGAL_CENTER = [17.9689, 79.5941];

let protocolRegistered = false;
function ensurePmtilesProtocol() {
  if (protocolRegistered) return;
  const protocol = new Protocol();
  maplibregl.addProtocol("pmtiles", protocol.tile);
  protocolRegistered = true;
}

function MapLibreOverlay({ visible }) {
  const map = useMap();
  const containerRef = useRef(null);
  const glMapRef = useRef(null);

  useEffect(() => {
    if (!visible) {
        if (glMapRef.current) {
            glMapRef.current.remove();
            glMapRef.current = null;
        }
        return;
    }

    ensurePmtilesProtocol();

    const container = L.DomUtil.create('div', 'maplibre-overlay', map.getContainer());
    container.style.position = 'absolute';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.zIndex = '400';
    container.style.pointerEvents = 'none';
    containerRef.current = container;

    const glMap = new maplibregl.Map({
      container: container,
      style: {
        version: 8,
        sources: {
          ftw: {
            type: "vector",
            url: `pmtiles://${FTW_PM_TILES_URL}`,
          }
        },
        layers: [
          {
            id: "ftw-fields-fill",
            type: "fill",
            source: "ftw",
            "source-layer": FTW_SOURCE_LAYER,
            paint: {
              "fill-color": "#2f8f5b",
              "fill-opacity": 0.3
            }
          }
        ]
      },
      center: [map.getCenter().lng, map.getCenter().lat],
      zoom: map.getZoom() - 1,
      interactive: false
    });

    glMapRef.current = glMap;

    const sync = () => {
      glMap.jumpTo({
        center: [map.getCenter().lng, map.getCenter().lat],
        zoom: map.getZoom() - 1,
        bearing: map.getBearing ? map.getBearing() : 0,
      });
    };

    map.on('move', sync);
    return () => {
      map.off('move', sync);
      glMap.remove();
      L.DomUtil.remove(container);
    };
  }, [map, visible]);

  return null;
}

function DrawControls({ onBoundaryChange }) {
  const map = useMap();
  const featureGroupRef = useRef(null);

  useEffect(() => {
    const featureGroup = featureGroupRef.current;
    if (!featureGroup) return;

    const drawControl = new L.Control.Draw({
      position: 'bottomleft',
      draw: {
        polyline: false, rectangle: false, circle: false, circlemarker: false, marker: false,
        polygon: {
          allowIntersection: false,
          showArea: true,
          shapeOptions: {
            color: "#173124",
            fillColor: "#98b5a3",
            fillOpacity: 0.4,
            weight: 3
          }
        }
      },
      edit: {
        featureGroup,
        remove: true,
        allowIntersection: false
      }
    });

    map.addControl(drawControl);

    const syncLayer = (layer) => {
      const latlngs = layer.getLatLngs()[0];
      onBoundaryChange({
        boundaryGeojson: latLngsToPolygon(latlngs),
        areaAcres: calculateAreaAcresFromLatLngs(latlngs)
      });
    };

    map.on(L.Draw.Event.CREATED, (e) => {
      featureGroup.clearLayers();
      featureGroup.addLayer(e.layer);
      syncLayer(e.layer);
    });

    map.on(L.Draw.Event.EDITED, (e) => {
      e.layers.eachLayer(syncLayer);
    });

    map.on(L.Draw.Event.DELETED, () => {
      onBoundaryChange({ boundaryGeojson: null, areaAcres: 0 });
    });

    return () => map.removeControl(drawControl);
  }, [map, onBoundaryChange]);

  return <FeatureGroup ref={featureGroupRef} />;
}

export function LandSelectionMap({ onBoundaryChange }) {
  const { t } = useI18n();
  const [showFtw, setShowFtw] = useState(false);
  const mapRef = useRef(null);

  const handleLocate = () => {
    if (mapRef.current) {
        mapRef.current.locate({ setView: true, maxZoom: 16 });
    }
  };

  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-outline-variant bg-surface-dim">
      <MapContainer
        center={WARANGAL_CENTER}
        zoom={14}
        scrollWheelZoom
        className="h-full w-full"
        ref={mapRef}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapLibreOverlay visible={showFtw} />
        <DrawControls onBoundaryChange={onBoundaryChange} />
      </MapContainer>

      {/* Map UI Overlays */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-outline-variant bg-white/90 p-2 shadow-lg backdrop-blur-md">
          <Search size={20} className="ml-2 text-outline" />
          <input
            type="text"
            placeholder={t("searchLocation")}
            aria-label={t("searchLocation")}
            className="flex-1 bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      <div className="absolute right-4 top-20 z-[1000] flex flex-col gap-3">
        <div className="flex flex-col overflow-hidden rounded-xl border border-outline-variant bg-white/90 shadow-lg backdrop-blur-md">
            <button
                onClick={handleZoomIn}
                className="p-3 hover:bg-surface-container transition-colors border-b border-outline-variant"
                title="Zoom In"
                aria-label="Zoom In"
            >
                <Plus size={20} className="text-primary" />
            </button>
            <button
                onClick={handleZoomOut}
                className="p-3 hover:bg-surface-container transition-colors"
                title="Zoom Out"
                aria-label="Zoom Out"
            >
                <Minus size={20} className="text-primary" />
            </button>
        </div>

        <button
            onClick={handleLocate}
            className="rounded-xl border border-outline-variant bg-white/90 p-3 text-primary shadow-lg backdrop-blur-md hover:bg-surface-container"
            title="Locate Me"
            aria-label={t("myLocation")}
        >
          <LocateFixed size={20} />
        </button>

        <button
            onClick={() => setShowFtw(!showFtw)}
            className={`rounded-xl border border-outline-variant p-3 shadow-lg backdrop-blur-md transition-all ${
                showFtw ? "bg-primary text-white" : "bg-white/90 text-primary hover:bg-surface-container"
            }`}
            title="Toggle Fields of the World"
            aria-label="Toggle Fields of the World"
        >
          <Layers size={20} />
        </button>
      </div>

      {/* Floating Mapping Tip */}
      <div className="absolute bottom-24 left-4 right-4 z-[1000] md:left-auto md:right-4 md:w-80">
        <div className="rounded-xl border border-secondary-container bg-secondary-container/80 p-4 shadow-xl backdrop-blur-md">
            <div className="flex items-start gap-3">
                <div className="rounded-full bg-secondary p-1 text-white">
                    <MousePointer2 size={14} />
                </div>
                <div className="space-y-1">
                    <p className="text-xs font-bold text-secondary uppercase tracking-wider">Multi-Point Mapping</p>
                    <p className="text-[11px] leading-relaxed text-on-secondary-container font-medium">
                        Click as many times as needed to outline your field accurately. There is no limit to the number of points. Double-click or click the first point to finish.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
