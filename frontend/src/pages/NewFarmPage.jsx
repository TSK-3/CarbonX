import { Info, RotateCcw, Save, Undo2 } from "lucide-react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";
import { FarmMap } from "../components/FarmMap.jsx";
import { FtwFieldSelector } from "../components/FtwFieldSelector.jsx";
import { Metric } from "../components/Metric.jsx";
import { formatArea } from "../utils/format.js";

export function NewFarmPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("Warangal Green Estate");
  const [boundaryGeojson, setBoundaryGeojson] = useState(null);
  const [areaAcres, setAreaAcres] = useState(0);
  const [fieldMetadata, setFieldMetadata] = useState(null);
  const [selectionMode, setSelectionMode] = useState("ftw");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const clearBoundary = useCallback(() => {
    setBoundaryGeojson(null);
    setAreaAcres(0);
    setFieldMetadata(null);
  }, []);

  const handleBoundaryChange = useCallback((nextBoundary) => {
    setBoundaryGeojson(nextBoundary.boundaryGeojson);
    setAreaAcres(nextBoundary.areaAcres);
    setFieldMetadata(nextBoundary.metadata || null);
  }, []);

  async function submit(event) {
    event.preventDefault();
    setError("");

    if (!boundaryGeojson) {
      setError("Select a Fields of The World boundary or draw a farm boundary before submitting.");
      return;
    }

    setLoading(true);
    try {
      const result = await api.createFarm(token, { name, boundaryGeojson });
      navigate(`/farms/${result.farm.id}/review`);
    } catch (caughtError) {
      setError(caughtError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="grid min-h-[calc(100vh-64px)] bg-surface lg:grid-cols-[384px_1fr]">
      <form className="flex min-h-full flex-col border-r border-outline-variant bg-surface px-6 py-6" onSubmit={submit}>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-field">Register Land</h1>
          <p className="text-sm leading-6 text-stone-700">
            Define your farm boundaries to start tracking carbon sequestration.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <label className="block space-y-1">
            <span className="label">Farm name</span>
            <input className="input" value={name} onChange={(event) => setName(event.target.value)} />
          </label>

          <label className="block space-y-1">
            <span className="label">Land Type</span>
            <select className="input" defaultValue="Agroforestry">
              <option>Agroforestry</option>
              <option>Paddy field</option>
              <option>Mixed crop</option>
              <option>Orchard</option>
            </select>
          </label>

          <div className="border-t border-outline-variant pt-4">
            <p className="label mb-3 px-0">Polygon Controls</p>
            <button
              className="btn-primary h-14 w-full rounded-xl"
              onClick={() => {
                setSelectionMode("manual");
                clearBoundary();
              }}
              type="button"
            >
              <Save size={18} />
              Draw Boundary
            </button>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <button className="btn-secondary h-12 rounded-xl" onClick={clearBoundary} type="button">
                <RotateCcw size={16} />
                Reset
              </button>
              <button className="btn-secondary h-12 rounded-xl border-outline text-outline" disabled type="button">
                <Undo2 size={16} />
                Undo
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-sage-soft bg-sage-soft/30 p-4 text-sm">
            <div className="flex gap-3">
              <Info className="mt-0.5 shrink-0 text-secondary" size={18} />
              <div>
                <p className="font-semibold text-ink">
                  {selectionMode === "ftw" ? "Fields of The World selection" : "Manual drawing fallback"}
                </p>
                <p className="mt-1 text-stone-600">
                  {fieldMetadata
                    ? `${fieldMetadata.source} | ${fieldMetadata.label} | ${fieldMetadata.time}${fieldMetadata.license ? ` | ${fieldMetadata.license}` : ""}`
                    : selectionMode === "ftw"
                      ? "Zoom in and click a Fields of The World source boundary."
                      : "Use the polygon tool on the map to draw a boundary."}
                </p>
                {fieldMetadata?.fieldId ? (
                  <p className="mt-2 text-xs text-stone-500">FTW field id: {fieldMetadata.fieldId}</p>
                ) : null}
              </div>
            </div>
          </div>

          <Metric label="Calculated area" value={formatArea(areaAcres)} />
        </div>

        {error ? <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

        <div className="mt-auto border-t border-outline-variant bg-white py-6">
          <button className="btn-primary h-14 w-full rounded-xl" disabled={loading || !boundaryGeojson} type="submit">
            <Save size={17} />
            {loading ? "Calculating NDVI" : "Confirm Land Area"}
          </button>
        </div>
      </form>

      <div className="relative min-h-[620px] bg-surface-dim">
        {selectionMode === "ftw" ? (
          <FtwFieldSelector
            onBoundaryChange={handleBoundaryChange}
            onFallbackRequest={() => {
              setSelectionMode("manual");
              clearBoundary();
            }}
          />
        ) : (
          <div className="h-full p-4">
            <button
              className="btn-secondary absolute left-4 top-4 z-20 bg-white"
              onClick={() => {
                setSelectionMode("ftw");
                clearBoundary();
              }}
              type="button"
            >
              Back to FTW selection
            </button>
            <FarmMap editable onBoundaryChange={handleBoundaryChange} />
          </div>
        )}

        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-6 rounded-2xl bg-primary-container px-6 py-4 text-sage shadow-2xl">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] opacity-70">Estimated area</p>
            <p className="text-lg font-black">{formatArea(areaAcres)}</p>
          </div>
          <div className="h-8 w-px bg-sage/20" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] opacity-70">Dataset</p>
            <p className="text-lg font-semibold">{fieldMetadata?.label || "FTW source"}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
