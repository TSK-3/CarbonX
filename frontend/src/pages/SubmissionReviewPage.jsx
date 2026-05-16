import { ArrowUpRight, ShieldCheck, Sprout } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";
import { formatArea, formatNumber } from "../utils/format.js";

export function SubmissionReviewPage() {
  const { farmId } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getFarm(token, farmId)
      .then((result) => setFarm(result.farm))
      .catch((caughtError) => setError(caughtError.message))
      .finally(() => setLoading(false));
  }, [farmId, token]);

  if (loading) {
    return <section className="mx-auto max-w-5xl px-5 py-10">Loading submission review...</section>;
  }

  if (!farm) {
    return <section className="mx-auto max-w-5xl px-5 py-10 text-red-700">{error || "Farm not found."}</section>;
  }

  return (
    <section className="mx-auto max-w-5xl px-5 py-8">
      <div className="space-y-1">
        <h1 className="text-4xl font-bold text-field">Confirm Submission</h1>
        <p className="text-stone-600">
          Review land details for {farm.name} before finalizing your carbon credit estimate.
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.7fr_0.8fr]">
        <div className="terra-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-outline-variant px-4 py-3">
            <p className="font-semibold text-field">Land Polygon Review</p>
            <Link className="text-sm font-semibold text-field" to={`/farms/${farm.id}`}>
              Adjust
            </Link>
          </div>
          <div className="h-[320px] bg-surface-dim p-3">
            <div className="h-full overflow-hidden rounded-xl">
              <img
                alt="Satellite-style land preview"
                className="h-full w-full object-cover"
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-primary-container px-6 py-10 text-center text-sage">
          <p className="text-sm uppercase tracking-[0.08em] opacity-80">Calculated area</p>
          <p className="mt-4 text-6xl font-black">{Number(farm.areaAcres).toFixed(1)}</p>
          <p className="text-lg">Acres</p>
          <div className="mx-auto mt-6 h-1 w-full rounded-full bg-sage/20">
            <div className="h-1 w-3/4 rounded-full bg-sage" />
          </div>
          <p className="mt-6 text-lg opacity-90">Topography: Slight slope</p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="terra-card p-5">
          <p className="terra-kicker">Farmer name</p>
          <p className="mt-2 text-lg font-semibold text-field">{user?.name || "Farmer"}</p>
        </div>
        <div className="terra-card p-5">
          <p className="terra-kicker">Main crop</p>
          <p className="mt-2 text-lg font-semibold text-field">Agroforestry</p>
        </div>
        <div className="terra-card p-5">
          <p className="terra-kicker">Location tag</p>
          <p className="mt-2 text-lg font-semibold text-field">Kerner FTW parcel</p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="terra-panel p-5">
          <div className="mb-4 flex items-center gap-2 text-field">
            <Sprout size={18} />
            <h2 className="text-lg font-semibold">Biological Indicators</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-700">Area</span>
              <span className="font-semibold text-field">{formatArea(farm.areaAcres)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-700">Mean NDVI</span>
              <span className="font-semibold text-field">{formatNumber(farm.ndviScore)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-700">Estimated Carbon</span>
              <span className="font-semibold text-field">{formatNumber(farm.tco2eEstimate)} tCO2e</span>
            </div>
          </div>
        </div>

        <div className="terra-card bg-surface-high p-5">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-primary-container p-3 text-white">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-field">Verified Data Protocol</h2>
              <p className="mt-2 text-sm leading-6 text-stone-700">
                Your data is processed using ISO-compliant carbon sequestration models to ensure
                institutional-grade estimates.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <button
          className="btn-primary h-16 w-full rounded-lg text-2xl font-semibold"
          onClick={() => navigate("/verification")}
          type="button"
        >
          Submit for Carbon Credit Estimate
          <ArrowUpRight size={20} />
        </button>
        <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-6 text-stone-600">
          By clicking submit, you agree to our <span className="text-field underline">Data Processing Terms</span> and verify the land boundaries are accurate.
        </p>
      </div>
    </section>
  );
}
