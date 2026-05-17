import { BarChart3, CreditCard, FileCheck2, Leaf, MapPinned, Plus, TrendingUp, ChevronRight, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";
import { formatArea, formatInr, formatNumber } from "../utils/format.js";
import { useI18n } from "../i18n/I18nContext.jsx";
import { motion } from "framer-motion";

export function DashboardPage() {
  const { token, user } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .listFarms(token)
      .then((result) => setFarms(result.farms))
      .catch((caughtError) => setError(caughtError.message))
      .finally(() => setLoading(false));
  }, [token, user]);

  const totals = farms.reduce(
    (current, farm) => ({
      acres: current.acres + Number(farm.areaAcres || 0),
      tco2e: current.tco2e + Number(farm.tco2eEstimate || 0),
      earnings: current.earnings + Number(farm.earningsEstimateInr || 0)
    }),
    { acres: 0, tco2e: 0, earnings: 0 }
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (user?.role === 'buyer') {
    return (
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-7xl space-y-8 px-5 py-8"
      >
         <motion.div variants={itemVariants} className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
            <p className="terra-kicker">Industry Overview</p>
            <h1 className="mt-1 font-headline-lg text-primary">Carbon Procurement</h1>
            <p className="mt-2 font-body-md text-on-surface-variant max-w-2xl">
                Manage your carbon offset portfolio and active bids.
            </p>
            </div>
            <Link to="/marketplace" className="btn-primary h-14 px-6 rounded-xl shadow-xl">
            <ShoppingBag size={20} />
            Browse Marketplace
            </Link>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={itemVariants} className="terra-card p-6 flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <TrendingUp size={32} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-primary">Active Bids</h3>
                    <p className="text-on-surface-variant">Check your current bidding status in the marketplace.</p>
                </div>
            </motion.div>
             <motion.div variants={itemVariants} className="terra-card p-6 flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                    <Leaf size={32} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-primary">Total Offset</h3>
                    <p className="text-on-surface-variant">0 tCO2e acquired to date.</p>
                </div>
            </motion.div>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-7xl space-y-8 px-5 py-8"
    >
      <motion.div variants={itemVariants} className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="terra-kicker">{t("dashboard")}</p>
          <h1 className="mt-1 font-headline-lg text-primary">Your carbon portfolio</h1>
          <p className="mt-2 font-body-md text-on-surface-variant max-w-2xl">
            Track registered land, estimated sequestration, and verification readiness.
          </p>
        </div>
        <Link to="/farms/new" className="btn-primary h-14 px-6 rounded-xl shadow-xl">
          <Plus size={20} />
          {t("registerLand")}
        </Link>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        <motion.div variants={itemVariants} className="terra-card p-6 flex flex-col justify-between min-h-[160px]">
          <div className="flex justify-between items-start">
            <div className="rounded-xl bg-surface-container p-2.5 text-primary">
              <MapPinned size={24} />
            </div>
            <TrendingUp size={20} className="text-secondary" />
          </div>
          <div>
            <p className="terra-kicker">{t("estimatedArea")}</p>
            <p className="mt-1 text-3xl font-black text-primary">{formatArea(totals.acres)}</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="terra-card bg-primary-container p-6 text-on-primary-container flex flex-col justify-between min-h-[160px] shadow-2xl">
          <div className="flex justify-between items-start">
            <div className="rounded-xl bg-white/10 p-2.5 text-white">
              <Leaf size={24} />
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.1em] opacity-70">Carbon estimate</p>
            <p className="mt-1 text-3xl font-black text-white">{formatNumber(totals.tco2e)} tCO2e</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="terra-card p-6 flex flex-col justify-between min-h-[160px]">
          <div className="flex justify-between items-start">
            <div className="rounded-xl bg-tertiary-container/10 p-2.5 text-tertiary">
              <CreditCard size={24} />
            </div>
          </div>
          <div>
            <p className="terra-kicker">{t("earnings")}</p>
            <p className="mt-1 text-3xl font-black text-primary">{formatInr(totals.earnings)}</p>
          </div>
        </motion.div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <RotateCcw className="animate-spin text-primary" size={40} />
        </div>
      ) : null}

      {error ? <motion.p variants={itemVariants} className="rounded-xl bg-error-container p-4 text-on-error-container font-medium">{error}</motion.p> : null}

      {!loading && !farms.length ? (
        <motion.div variants={itemVariants} className="terra-card border-dashed p-12 text-center bg-surface-container-low">
          <div className="mx-auto w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mb-6">
            <Leaf className="text-outline" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-primary">No farms registered yet</h2>
          <p className="mx-auto mt-3 max-w-lg text-on-surface-variant font-body-md">
            Draw the first boundary to generate a demo-ready NDVI and carbon estimate.
          </p>
          <Link to="/farms/new" className="btn-primary mt-8 h-14 px-8 rounded-xl">
            <Plus size={20} />
            {t("registerLand")}
          </Link>
        </motion.div>
      ) : null}

      {farms.length ? (
        <div className="space-y-4">
          <motion.h2 variants={itemVariants} className="font-headline-md text-primary">Registered Lands</motion.h2>
          <div className="grid gap-4">
            {farms.map((farm) => (
              <motion.div key={farm.id} variants={itemVariants}>
                <Link
                    to={`/farms/${farm.id}`}
                    className="terra-card p-4 hover:border-primary transition-all group flex items-center justify-between"
                >
                    <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-surface-dim overflow-hidden">
                        <div className="w-full h-full bg-secondary/10 flex items-center justify-center">
                            <MapPinned size={24} className="text-secondary" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-primary group-hover:text-primary-container transition-colors">{farm.name}</h3>
                        <div className="flex items-center gap-3 mt-1 text-sm text-outline font-medium">
                        <span>{formatArea(farm.areaAcres)}</span>
                        <span>•</span>
                        <span>{formatNumber(farm.ndviScore)} NDVI</span>
                        </div>
                    </div>
                    </div>

                    <div className="flex items-center gap-8">
                    <div className="hidden md:block text-right">
                        <p className="text-xs font-bold uppercase tracking-wider text-outline">{t("earnings")}</p>
                        <p className="font-black text-primary">{formatInr(farm.earningsEstimateInr)}</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary-container/30 text-secondary text-xs font-bold uppercase tracking-widest">
                        <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                        {farm.status}
                    </div>
                    <ChevronRight size={20} className="text-outline group-hover:text-primary transition-colors" />
                    </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      ) : null}
    </motion.section>
  );
}

function RotateCcw(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </svg>
    )
  }
