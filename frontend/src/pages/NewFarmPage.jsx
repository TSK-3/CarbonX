import { Info, RotateCcw, Save, Undo2, Map as MapIcon, ChevronRight, X, AlertCircle, ChevronDown } from "lucide-react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
              <label htmlFor="farmName" className="font-label-sm text-on-surface-variant px-1">{t("farmName")}</label>
              <div className="relative">
                <input
                  id="farmName"
                  className="input pr-10"
                  placeholder="e.g. Warangal Green Estate"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {name && (
                  <button
                    type="button"
                    onClick={() => setName("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                    aria-label="Clear farm name"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="landType" className="font-label-sm text-on-surface-variant px-1">{t("landType")}</label>
              <div className="relative">
                <select id="landType" className="input appearance-none bg-surface-container-low pr-10" defaultValue="Agroforestry">
                  <option>Agroforestry</option>
                  <option>Paddy field</option>
                  <option>Mixed crop</option>
                  <option>Orchard</option>
                </select>
                <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none" aria-hidden="true" />
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
                <motion.p
                  animate={{ scale: [0.98, 1], opacity: [0.9, 1] }}
                  transition={{ duration: 0.2 }}
                  className="mt-1 text-3xl font-black"
                >
                  {formatArea(areaAcres)}
                </motion.p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 rounded-xl bg-error-container px-3 py-2 text-sm font-semibold text-on-error-container"
                >
                  <AlertCircle size={16} className="shrink-0" />
                  <p>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

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
