import { BarChart3, CreditCard, FileCheck2, Leaf, MapPinned, Plus, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";
import { Metric } from "../components/Metric.jsx";
import { formatArea, formatInr, formatNumber } from "../utils/format.js";

export function DashboardPage() {
  const { token } = useAuth();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .listFarms(token)
      .then((result) => setFarms(result.farms))
      .catch((caughtError) => setError(caughtError.message))
      .finally(() => setLoading(false));
  }, [token]);

  const totals = farms.reduce(
    (current, farm) => ({
      acres: current.acres + Number(farm.areaAcres || 0),
      tco2e: current.tco2e + Number(farm.tco2eEstimate || 0),
      earnings: current.earnings + Number(farm.earningsEstimateInr || 0)
    }),
    { acres: 0, tco2e: 0, earnings: 0 }
  );

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-5 py-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="terra-kicker">Farmer dashboard</p>
          <h1 className="mt-1 text-4xl font-black text-field">Your carbon portfolio</h1>
          <p className="mt-2 text-stone-600">Track registered land, estimated sequestration, and verification readiness.</p>
        </div>
        <Link to="/farms/new" className="btn-primary">
          <Plus size={18} />
          Register Farm
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="terra-card p-5">
          <MapPinned className="text-field" size={22} />
          <p className="terra-kicker mt-4">Total land</p>
          <p className="mt-2 text-3xl font-black text-field">{formatArea(totals.acres)}</p>
        </div>
        <div className="terra-card bg-primary-container p-5 text-sage">
          <TrendingUp size={22} />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.08em]">Carbon estimate</p>
          <p className="mt-2 text-3xl font-black">{formatNumber(totals.tco2e)} tCO2e</p>
        </div>
        <div className="terra-card p-5">
          <CreditCard className="text-field" size={22} />
          <p className="terra-kicker mt-4">Potential earnings</p>
          <p className="mt-2 text-3xl font-black text-field">{formatInr(totals.earnings)}</p>
        </div>
      </div>

      {loading ? <p className="terra-card p-6">Loading farms...</p> : null}
      {error ? <p className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p> : null}

      {!loading && !farms.length ? (
        <div className="terra-card border-dashed p-10 text-center">
          <Leaf className="mx-auto text-field" size={36} />
          <h2 className="mt-3 text-xl font-bold text-ink">No farms registered yet</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-stone-600">
            Draw the first boundary to generate a demo-ready NDVI and carbon estimate.
          </p>
          <Link to="/farms/new" className="btn-primary mt-5">
            <Plus size={17} />
            Register Farm
          </Link>
        </div>
      ) : null}

      {farms.length ? (
        <div className="overflow-hidden rounded-xl border border-outline-variant bg-white">
          <div className="grid grid-cols-[1.2fr_0.8fr_0.7fr_0.8fr_0.9fr_0.7fr_0.7fr] gap-3 border-b border-outline-variant bg-surface-low px-4 py-3 text-xs font-bold uppercase tracking-wide text-outline">
            <span>Farm</span>
            <span>Area</span>
            <span>NDVI</span>
            <span>Carbon</span>
            <span>Earnings</span>
            <span>Status</span>
            <span>Review</span>
          </div>
          {farms.map((farm) => (
            <Link
              className="grid grid-cols-[1.2fr_0.8fr_0.7fr_0.8fr_0.9fr_0.7fr_0.7fr] gap-3 border-b border-stone-100 px-4 py-4 text-sm transition last:border-b-0 hover:bg-sage-soft/25"
              key={farm.id}
              to={`/farms/${farm.id}`}
            >
              <span className="font-semibold text-ink">{farm.name}</span>
              <span>{formatArea(farm.areaAcres)}</span>
              <span>{formatNumber(farm.ndviScore)}</span>
              <span>{formatNumber(farm.tco2eEstimate)} tCO2e</span>
              <span>{formatInr(farm.earningsEstimateInr)}</span>
              <span className="inline-flex items-center gap-1 font-semibold capitalize text-field">
                <BarChart3 size={15} />
                {farm.status}
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-field">
                <FileCheck2 size={15} />
                Open
              </span>
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
}
