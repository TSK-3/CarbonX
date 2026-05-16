import { CreditCard, TrendingUp, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";
import { formatInr, formatNumber } from "../utils/format.js";

export function EarningsPage() {
  const { token } = useAuth();
  const [farms, setFarms] = useState([]);

  useEffect(() => {
    api.listFarms(token).then((result) => setFarms(result.farms)).catch(() => setFarms([]));
  }, [token]);

  const totals = farms.reduce(
    (current, farm) => ({
      carbon: current.carbon + Number(farm.tco2eEstimate || 0),
      earnings: current.earnings + Number(farm.earningsEstimateInr || 0)
    }),
    { carbon: 0, earnings: 0 }
  );

  return (
    <section className="mx-auto max-w-7xl px-5 py-8">
      <div className="mb-6">
        <p className="terra-kicker">Earnings and payments</p>
        <h1 className="mt-1 text-4xl font-bold text-field">Projected payout readiness</h1>
        <p className="mt-2 text-stone-600">
          Monitor estimated carbon revenue and where each parcel sits in the payout pipeline.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="terra-card p-5">
          <Wallet className="text-field" size={22} />
          <p className="terra-kicker mt-4">Projected earnings</p>
          <p className="mt-2 text-3xl font-black text-field">{formatInr(totals.earnings)}</p>
        </div>
        <div className="terra-card bg-primary-container p-5 text-sage">
          <TrendingUp size={22} />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.08em]">Carbon estimate</p>
          <p className="mt-2 text-3xl font-black">{formatNumber(totals.carbon)} tCO2e</p>
        </div>
        <div className="terra-card p-5">
          <CreditCard className="text-field" size={22} />
          <p className="terra-kicker mt-4">Next payout</p>
          <p className="mt-2 text-3xl font-black text-field">Nov 15</p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-outline-variant bg-white">
        <div className="grid grid-cols-[1.3fr_0.8fr_0.8fr_0.9fr] gap-3 border-b border-outline-variant bg-surface-low px-4 py-3 text-xs font-bold uppercase tracking-wide text-outline">
          <span>Farm</span>
          <span>Estimate</span>
          <span>Earnings</span>
          <span>Status</span>
        </div>
        {farms.map((farm) => (
          <div className="grid grid-cols-[1.3fr_0.8fr_0.8fr_0.9fr] gap-3 border-b border-stone-100 px-4 py-4 text-sm last:border-b-0" key={farm.id}>
            <span className="font-semibold text-field">{farm.name}</span>
            <span>{formatNumber(farm.tco2eEstimate)} tCO2e</span>
            <span>{formatInr(farm.earningsEstimateInr)}</span>
            <span className="font-semibold text-secondary">Awaiting verification</span>
          </div>
        ))}
        {!farms.length ? <div className="px-4 py-10 text-center text-stone-600">No farms registered yet.</div> : null}
      </div>
    </section>
  );
}
