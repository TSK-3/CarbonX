import { CreditCard, TrendingUp, Wallet, ArrowUpRight, History } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";
import { formatInr, formatNumber } from "../utils/format.js";
import { useI18n } from "../i18n/I18nContext.jsx";

export function EarningsPage() {
  const { token } = useAuth();
  const { t } = useI18n();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listFarms(token)
        .then((result) => setFarms(result.farms))
        .catch(() => setFarms([]))
        .finally(() => setLoading(false));
  }, [token]);

  const totals = farms.reduce(
    (current, farm) => ({
      carbon: current.carbon + Number(farm.tco2eEstimate || 0),
      earnings: current.earnings + Number(farm.earningsEstimateInr || 0)
    }),
    { carbon: 0, earnings: 0 }
  );

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="terra-kicker">{t("earnings")}</p>
          <h1 className="mt-1 font-headline-lg text-primary">Financial Overview</h1>
          <p className="mt-2 font-body-md text-on-surface-variant max-w-2xl">
            Monitor estimated carbon revenue and tracking each parcel through the payout pipeline.
          </p>
        </div>
        <button className="btn-primary h-14 px-8 rounded-xl shadow-xl">
            <ArrowUpRight size={20} />
            Withdraw Funds
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="terra-card p-8 flex flex-col justify-between min-h-[180px] shadow-lg border-2 border-primary/5">
          <div className="flex justify-between items-start">
            <div className="rounded-2xl bg-surface-container p-3 text-primary">
              <Wallet size={28} />
            </div>
            <span className="text-xs font-bold text-secondary bg-secondary-container/20 px-2 py-1 rounded-full uppercase tracking-widest">Active</span>
          </div>
          <div>
            <p className="terra-kicker mt-4">{t("earnings")}</p>
            <p className="mt-1 text-4xl font-black text-primary">{formatInr(totals.earnings)}</p>
          </div>
        </div>

        <div className="terra-card bg-primary text-on-primary p-8 flex flex-col justify-between min-h-[180px] shadow-2xl">
          <div className="flex justify-between items-start">
            <div className="rounded-2xl bg-white/10 p-3 text-white">
              <TrendingUp size={28} />
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.1em] opacity-70">Total Carbon Offset</p>
            <p className="mt-1 text-4xl font-black">{formatNumber(totals.carbon)} tCO2e</p>
          </div>
        </div>

        <div className="terra-card p-8 flex flex-col justify-between min-h-[180px] shadow-lg border-2 border-primary/5">
          <div className="flex justify-between items-start">
            <div className="rounded-2xl bg-tertiary-container/10 p-3 text-tertiary">
              <CreditCard size={28} />
            </div>
          </div>
          <div>
            <p className="terra-kicker mt-4">Next Payout Window</p>
            <p className="mt-1 text-4xl font-black text-primary">Nov 15</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-surface-container text-primary">
                <History size={20} />
            </div>
            <h2 className="font-headline-md text-primary">Payout Readiness by Farm</h2>
        </div>

        <div className="overflow-hidden rounded-2xl border border-outline-variant bg-white shadow-xl">
            <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 border-b border-outline-variant bg-surface-container-low px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-outline">
                <span>Farm Name</span>
                <span>Estimate</span>
                <span>Potential Payout</span>
                <span>Verification Status</span>
            </div>
            <div className="divide-y divide-outline-variant/30">
                {farms.map((farm) => (
                    <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 px-6 py-6 items-center hover:bg-surface-container-lowest transition-colors" key={farm.id}>
                        <span className="font-bold text-primary">{farm.name}</span>
                        <span className="font-medium text-on-surface-variant">{formatNumber(farm.tco2eEstimate)} tCO2e</span>
                        <span className="font-black text-primary">{formatInr(farm.earningsEstimateInr)}</span>
                        <div>
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary-container/30 text-secondary text-[10px] font-bold uppercase tracking-widest border border-secondary-container/50">
                                <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                                Reviewing
                            </span>
                        </div>
                    </div>
                ))}
                {!farms.length && !loading ? (
                    <div className="px-6 py-16 text-center">
                        <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-4">
                            <Wallet size={32} className="text-outline" />
                        </div>
                        <p className="text-on-surface-variant font-medium">No registered farms to show earnings for.</p>
                    </div>
                ) : null}
                {loading && (
                    <div className="px-6 py-10 text-center animate-pulse">
                        <p className="text-outline font-medium tracking-widest uppercase text-xs">Loading earnings data...</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </section>
  );
}
