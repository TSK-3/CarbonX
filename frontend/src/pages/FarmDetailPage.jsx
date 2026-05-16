import { RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";
import { FarmMap } from "../components/FarmMap.jsx";
import { Metric } from "../components/Metric.jsx";
import { formatArea, formatInr, formatNumber } from "../utils/format.js";

export function FarmDetailPage() {
  const { farmId } = useParams();
  const { token } = useAuth();
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
    return <p className="mx-auto max-w-6xl px-5 py-8">Loading farm...</p>;
  }

  if (!farm) {
    return <p className="mx-auto max-w-6xl rounded-lg bg-red-50 p-4 text-red-700">{error || "Farm not found."}</p>;
  }

  return (
    <section className="mx-auto max-w-6xl space-y-6 px-5 py-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="terra-kicker">Farm detail</p>
          <h1 className="mt-1 text-4xl font-bold text-field">{farm.name}</h1>
        </div>
        <button className="btn-secondary" disabled={calculating} onClick={recalculate} type="button">
          <RefreshCcw size={17} />
          {calculating ? "Calculating" : "Recalculate"}
        </button>
      </div>

      {error ? <p className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p> : null}

      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Area" value={formatArea(farm.areaAcres)} />
        <Metric label="Mean NDVI" value={formatNumber(farm.ndviScore)} />
        <Metric label="Carbon estimate" value={`${formatNumber(farm.tco2eEstimate)} tCO2e`} tone="green" />
        <Metric label="Potential earnings" value={formatInr(farm.earningsEstimateInr)} tone="gold" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="overflow-hidden rounded-xl border border-outline-variant bg-white">
          <FarmMap boundaryGeojson={farm.boundaryGeojson} />
        </div>
        <aside className="terra-card p-5">
          <h2 className="text-lg font-bold text-field">Calculation</h2>
          <dl className="mt-4 space-y-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-stone-500">Status</dt>
              <dd className="font-semibold capitalize text-field">{farm.status}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-stone-500">Market rate</dt>
              <dd className="font-semibold">INR 2,000 / credit</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-stone-500">Formula</dt>
              <dd className="text-right font-semibold">hectares x NDVI x 3.67</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-stone-500">Registered</dt>
              <dd className="font-semibold">{new Date(farm.createdAt).toLocaleDateString()}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
}
