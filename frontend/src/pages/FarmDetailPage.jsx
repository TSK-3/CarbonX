import { RefreshCcw, MapPinned, Info, CreditCard, Leaf } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";
import { FarmMap } from "../components/FarmMap.jsx";
import { formatArea, formatInr, formatNumber } from "../utils/format.js";
import { useI18n } from "../i18n/I18nContext.jsx";

export function FarmDetailPage() {
  const { farmId } = useParams();
  const { token } = useAuth();
  const { t } = useI18n();
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getFarm(token, farmId)
      .then((result) => setFarm(result.farm))
      .catch((caughtError) => setError(caughtError.message))
      .finally(() => setLoading(false));
  }, [farmId, token]);

  async function recalculate() {
    setCalculating(true);
    setError("");
    try {
      const result = await api.calculateFarm(token, farmId);
      setFarm(result.farm);
    } catch (caughtError) {
      setError(caughtError.message);
    } finally {
      setCalculating(false);
    }
  }

  if (loading) {
    return (
        <div className="flex h-[calc(100vh-64px)] items-center justify-center">
            <RefreshCcw className="animate-spin text-primary" size={40} />
        </div>
    );
  }

  if (!farm) {
    return (
        <div className="mx-auto max-w-4xl p-10">
            <div className="rounded-xl bg-error-container p-6 text-on-error-container">
                <p className="font-bold">{error || "Farm not found."}</p>
            </div>
        </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-5 py-8">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-surface-container p-3 text-primary">
                <MapPinned size={32} />
            </div>
            <div>
                <p className="terra-kicker">Farm details</p>
                <h1 className="mt-1 font-headline-lg text-primary">{farm.name}</h1>
            </div>
        </div>
        <button
            className="btn-secondary h-12 rounded-xl shadow-sm bg-white"
            disabled={calculating}
            onClick={recalculate}
            type="button"
        >
          <RefreshCcw size={18} className={calculating ? "animate-spin" : ""} />
          {calculating ? "Recalculating..." : "Refresh Estimates"}
        </button>
      </div>

      {error ? <p className="rounded-xl bg-error-container p-4 text-on-error-container font-medium">{error}</p> : null}

      <div className="grid gap-6 md:grid-cols-4">
        <MetricCard label={t("estimatedArea")} value={formatArea(farm.areaAcres)} icon={<MapPinned size={20} />} />
        <MetricCard label="Mean NDVI" value={formatNumber(farm.ndviScore)} icon={<Info size={20} />} />
        <MetricCard label="Carbon Estimate" value={`${formatNumber(farm.tco2eEstimate)} tCO2e`} icon={<Leaf size={20} />} highlight />
        <MetricCard label="Potential Earnings" value={formatInr(farm.earningsEstimateInr)} icon={<CreditCard size={20} />} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="overflow-hidden rounded-2xl border border-outline-variant bg-white shadow-xl min-h-[500px]">
          <FarmMap boundaryGeojson={farm.boundaryGeojson} />
        </div>

        <div className="space-y-6">
            <aside className="terra-card p-6 shadow-lg">
                <h2 className="font-headline-md text-primary mb-6">Verification Status</h2>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary-container/30 text-secondary border border-secondary-container mb-6">
                    <div className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
                    <span className="font-bold uppercase tracking-widest text-xs">{farm.status}</span>
                </div>

                <dl className="space-y-4 text-sm font-medium">
                    <div className="flex justify-between items-center py-3 border-b border-outline-variant">
                        <dt className="text-on-surface-variant">Market Rate</dt>
                        <dd className="font-bold text-primary">₹ 2,000 / credit</dd>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-outline-variant">
                        <dt className="text-on-surface-variant">Methodology</dt>
                        <dd className="font-bold text-primary text-right">NDVI-based Sequestration</dd>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-outline-variant">
                        <dt className="text-on-surface-variant">Registration Date</dt>
                        <dd className="font-bold text-primary">{new Date(farm.createdAt).toLocaleDateString()}</dd>
                    </div>
                    <div className="flex justify-between items-center py-3">
                        <dt className="text-on-surface-variant">Estimated Credits</dt>
                        <dd className="font-black text-secondary text-lg">{formatNumber(farm.tco2eEstimate)}</dd>
                    </div>
                </dl>
            </aside>

            <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-6">
                <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary p-2 text-white shadow-lg">
                        <Info size={18} />
                    </div>
                    <div>
                        <p className="font-bold text-primary mb-1">What's next?</p>
                        <p className="text-sm text-on-surface-variant leading-relaxed font-medium">
                            Our team will review your land boundary. Once verified, you'll be eligible to receive carbon credit payments directly to your wallet.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}

function MetricCard({ label, value, icon, highlight = false }) {
    return (
        <div className={`terra-card p-6 flex flex-col justify-between shadow-md ${highlight ? 'bg-primary text-on-primary' : 'bg-white text-primary'}`}>
            <div className="flex justify-between items-start">
                <div className={`rounded-xl p-2.5 ${highlight ? 'bg-white/10' : 'bg-surface-container'}`}>
                    {icon}
                </div>
            </div>
            <div className="mt-4">
                <p className={`text-[10px] font-bold uppercase tracking-[0.15em] ${highlight ? 'text-on-primary/70' : 'text-outline'}`}>{label}</p>
                <p className={`mt-1 text-2xl font-black ${highlight ? 'text-white' : ''}`}>{value}</p>
            </div>
        </div>
    )
}
