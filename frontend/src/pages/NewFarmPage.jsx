import { Info, RotateCcw, Save, Undo2, Map as MapIcon, ChevronRight, ChevronDown } from "lucide-react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";
import { LandSelectionMap } from "../components/LandSelectionMap.jsx";
import { Metric } from "../components/Metric.jsx";
import { formatArea } from "../utils/format.js";
import { useI18n } from "../i18n/I18nContext.jsx";

export function NewFarmPage() {
  const { token } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [boundaryGeojson, setBoundaryGeojson] = useState(null);
  const [areaAcres, setAreaAcres] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBoundaryChange = useCallback((data) => {
    setBoundaryGeojson(data.boundaryGeojson);
    setAreaAcres(data.areaAcres);
  }, []);

  async function submit(event) {
    event.preventDefault();
    if (!boundaryGeojson) {
      setError("Please draw your farm boundary on the map first.");
      return;
    }

    setLoading(true);
    try {
      const result = await api.createFarm(token, { name: name || "My Farm", boundaryGeojson });
      navigate(`/farms/${result.farm.id}/review`);
    } catch (caughtError) {
      setError(caughtError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex min-h-[calc(100vh-64px)] flex-col bg-surface lg:flex-row">
      {/* Sidebar Controls */}
      <aside className="z-20 flex w-full flex-col border-r border-outline-variant bg-surface px-6 py-8 shadow-xl lg:w-[400px]">
        <div className="mb-8">
          <h1 className="font-headline-md text-primary">{t("registerLand")}</h1>
          <p className="mt-2 font-body-md text-on-surface-variant">
            Define your farm boundaries to start tracking carbon sequestration.
          </p>
        </div>

        <form onSubmit={submit} className="flex flex-1 flex-col gap-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-sm text-on-surface-variant px-1">{t("farmName")}</label>
              <input
                className="input"
                placeholder="e.g. Warangal Green Estate"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-sm text-on-surface-variant px-1">{t("landType")}</label>
              <div className="relative">
                <select className="input appearance-none bg-surface-container-low pr-10" defaultValue="Agroforestry">
                  <option>Agroforestry</option>
                  <option>Paddy field</option>
                  <option>Mixed crop</option>
                  <option>Orchard</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-outline">
                  <ChevronDown size={20} />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-outline-variant pt-6">
            <h2 className="font-label-sm text-primary mb-4">{t("polygonControls")}</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="btn-secondary h-12 flex-1" type="button" onClick={() => window.location.reload()}>
                <RotateCcw size={18} />
                {t("reset")}
              </button>
              <button className="btn-secondary h-12 flex-1 opacity-50" disabled type="button">
                <Undo2 size={18} />
                {t("undo")}
              </button>
            </div>
          </div>

          <div className="mt-auto space-y-4 pt-6">
            <div className="rounded-2xl bg-primary-container p-5 text-on-primary-container shadow-inner">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] opacity-70">{t("estimatedArea")}</p>
                <p className="mt-1 text-3xl font-black">{formatArea(areaAcres)}</p>
            </div>

            {error ? <p className="text-center text-sm font-semibold text-error">{error}</p> : null}

            <button
              className="btn-primary h-16 w-full rounded-2xl text-lg shadow-2xl transition-all active:scale-[0.98]"
              disabled={loading || !boundaryGeojson}
              type="submit"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <RotateCcw className="animate-spin" size={20} />
                  Calculating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {t("confirmLandArea")}
                  <ChevronRight size={20} />
                </span>
              )}
            </button>
          </div>
        </form>
      </aside>

      {/* Map Container */}
      <div className="relative flex-1 bg-surface-dim p-4 lg:p-0">
        <LandSelectionMap onBoundaryChange={handleBoundaryChange} />
      </div>
    </section>
  );
}
