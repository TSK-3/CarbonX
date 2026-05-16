import { ArrowUpRight, ShieldCheck, Sprout, ChevronRight, MapPinned } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";
import { formatArea, formatNumber } from "../utils/format.js";
import { useI18n } from "../i18n/I18nContext.jsx";

export function SubmissionReviewPage() {
  const { farmId } = useParams();
  const { token, user } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getFarm(token, farmId)
      .then((result) => setFarm(result.farm))
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [farmId, token, navigate]);

  if (loading) return <div className="p-10 text-center animate-pulse uppercase tracking-widest text-outline">Loading review...</div>;
  if (!farm) return null;

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 space-y-10">
      <div className="max-w-3xl">
        <p className="terra-kicker">Final Review</p>
        <h1 className="mt-1 font-headline-lg text-primary">Verify Land Details</h1>
        <p className="mt-2 font-body-md text-on-surface-variant">
          Review land details for {farm.name} before finalizing your carbon credit estimate.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.7fr_1fr]">
        <div className="terra-card overflow-hidden shadow-xl">
          <div className="flex items-center justify-between border-b border-outline-variant px-6 py-4 bg-surface-container-low">
            <p className="font-bold text-primary flex items-center gap-2">
                <MapPinned size={18} />
                Land Polygon Review
            </p>
            <Link className="text-sm font-bold text-primary hover:underline" to={`/farms/${farm.id}`}>
              Adjust Boundary
            </Link>
          </div>
          <div className="h-[400px] bg-surface-dim relative">
            <img
              alt="Satellite-style land preview"
              className="h-full w-full object-cover grayscale-[20%]"
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
            />
            <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
          </div>
        </div>

        <div className="rounded-3xl bg-primary text-on-primary p-10 flex flex-col justify-center items-center text-center shadow-2xl">
          <p className="text-xs uppercase tracking-[0.2em] font-black opacity-70 mb-6">{t("estimatedArea")}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-7xl font-black">{Number(farm.areaAcres).toFixed(1)}</span>
            <span className="text-2xl font-bold opacity-80">Acres</span>
          </div>
          <div className="w-full mt-10 space-y-4">
            <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-3/4 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
            </div>
            <p className="text-sm font-bold tracking-wide opacity-90">Confidence Score: High</p>
          </div>
          <p className="mt-10 text-lg font-medium opacity-80 italic">Topography: Slight southern slope, optimal for agroforestry</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <ReviewItem label="Farmer Name" value={user?.name || "Farmer"} />
        <ReviewItem label="Main Crop Type" value="Agroforestry" />
        <ReviewItem label="Source Dataset" value="Fields of The World" />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="terra-panel p-8 space-y-6 shadow-inner">
          <div className="flex items-center gap-3 text-primary">
            <Sprout size={24} />
            <h2 className="font-headline-md">Biological Indicators</h2>
          </div>
          <div className="space-y-4 font-medium">
            <div className="flex justify-between items-center py-2 border-b border-outline-variant/30">
              <span className="text-on-surface-variant">Total Area</span>
              <span className="font-black text-primary text-lg">{formatArea(farm.areaAcres)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-outline-variant/30">
              <span className="text-on-surface-variant">Mean NDVI Score</span>
              <span className="font-black text-primary text-lg">{formatNumber(farm.ndviScore)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-on-surface-variant">Est. Carbon (tCO2e)</span>
              <span className="font-black text-secondary text-2xl">{formatNumber(farm.tco2eEstimate)}</span>
            </div>
          </div>
        </div>

        <div className="terra-card bg-surface-container-high p-8 flex items-start gap-6 border-2 border-primary/5">
          <div className="rounded-2xl bg-primary p-4 text-white shadow-lg">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h2 className="font-headline-md text-primary">Verified Data Protocol</h2>
            <p className="mt-3 font-body-md text-on-surface-variant leading-relaxed">
              Your land data is being processed using ISO-compliant carbon sequestration models. We ensure
              institutional-grade estimates for maximum buyer trust.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-10 border-t border-outline-variant flex flex-col items-center gap-6">
        <button
          className="btn-primary h-20 w-full max-w-2xl rounded-2xl text-2xl font-black shadow-2xl transition-all active:scale-[0.98] group"
          onClick={() => navigate("/verification")}
          type="button"
        >
          Submit for Carbon Payout
          <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
        </button>
        <p className="max-w-xl text-center text-xs font-medium leading-relaxed text-outline">
          By clicking submit, you confirm the land boundaries are accurate and agree to our
          <span className="text-primary font-bold cursor-pointer hover:underline mx-1">Data Processing Terms</span>.
        </p>
      </div>
    </section>
  );
}

function ReviewItem({ label, value }) {
    return (
        <div className="terra-card p-6 border-2 border-primary/5">
          <p className="terra-kicker text-outline">{label}</p>
          <p className="mt-2 text-xl font-black text-primary">{value}</p>
        </div>
    )
}
