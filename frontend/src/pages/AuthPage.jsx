import { AlertCircle, Leaf, Loader2, LogIn, ShieldCheck, Sprout, UserPlus, Briefcase, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import { useI18n } from "../i18n/I18nContext.jsx";

export function AuthPage() {
  const { login, register } = useAuth();
  const { t } = useI18n();
  const [mode, setMode] = useState("register");
  const [values, setValues] = useState({
    name: "Ramaiah",
    phone: "9876543210",
    password: "carbonx123",
    role: "farmer"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateValue(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        await register(values);
      } else {
        await login({ phone: values.phone, password: values.password });
      }
    } catch (caughtError) {
      setError(caughtError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-surface lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden bg-primary lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(152,181,163,0.35),transparent_28%),linear-gradient(135deg,#173124,#2d4739)]" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3 text-2xl font-black">
            <Leaf size={28} />
            CarbonX
          </div>
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-on-primary-container">Grounded Reliability</p>
            <h1 className="mt-4 text-5xl font-black leading-tight">Turn verified land data into carbon opportunity.</h1>
            <p className="mt-5 text-lg leading-8 text-on-primary-container">
              Register farm boundaries, estimate sequestration, and track credit readiness with a farmer-first workflow.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-on-primary-container font-medium">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <ShieldCheck className="mb-3 text-white" size={22} />
              Secure farm records
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <Sprout className="mb-3 text-white" size={22} />
              Carbon-ready estimates
            </div>
          </div>
        </div>
      </section>

      <section className="grid place-items-center px-5 py-10">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center gap-4 lg:hidden">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-white shadow-xl">
              <Leaf size={28} />
            </span>
            <div>
              <h1 className="text-2xl font-black text-primary">CarbonX</h1>
              <p className="text-sm font-medium text-outline">Farmer carbon estimate portal</p>
            </div>
          </div>

          <div className="terra-card p-8 shadow-2xl">
            <div className="mb-8">
              <p className="terra-kicker">Secure Access</p>
              <h2 className="mt-2 text-3xl font-bold text-primary">
                {mode === "register" ? "Create your account" : "Welcome back"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-on-surface-variant font-medium">
                {mode === "register" ? "Join our ecosystem for carbon credit generation and trading." : "Continue to your dashboard and tasks."}
              </p>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-surface-container p-1.5">
              <button
                className={`rounded-lg px-3 py-2.5 text-sm font-bold transition-all ${mode === "register" ? "bg-white text-primary shadow-sm" : "text-outline hover:text-primary"}`}
                onClick={() => setMode("register")}
                type="button"
              >
                Register
              </button>
              <button
                className={`rounded-lg px-3 py-2.5 text-sm font-bold transition-all ${mode === "login" ? "bg-white text-primary shadow-sm" : "text-outline hover:text-primary"}`}
                onClick={() => setMode("login")}
                type="button"
              >
                Login
              </button>
            </div>

            <form className="space-y-5" onSubmit={submit}>
              {mode === "register" && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <button
                    type="button"
                    onClick={() => setValues(v => ({...v, role: 'farmer'}))}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${values.role === 'farmer' ? 'border-primary bg-primary/5 text-primary' : 'border-surface-container-highest text-outline'}`}
                  >
                    <User size={24} />
                    <span className="text-xs font-bold uppercase">Farmer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setValues(v => ({...v, role: 'buyer'}))}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${values.role === 'buyer' ? 'border-primary bg-primary/5 text-primary' : 'border-surface-container-highest text-outline'}`}
                  >
                    <Briefcase size={24} />
                    <span className="text-xs font-bold uppercase">Buyer</span>
                  </button>
                </div>
              )}

              {mode === "register" ? (
                <div className="space-y-1.5">
                  <label className="label" htmlFor="name">{values.role === 'farmer' ? t("farmerName") : "Business Name"}</label>
                  <input id="name" className="input" name="name" value={values.name} onChange={updateValue} placeholder="Enter full name or business" />
                </div>
              ) : null}

              <div className="space-y-1.5">
                <label className="label" htmlFor="phone">Phone</label>
                <input id="phone" className="input" name="phone" value={values.phone} onChange={updateValue} placeholder="Phone number" />
              </div>

              <div className="space-y-1.5">
                <label className="label" htmlFor="password">Password</label>
                <input
                  id="password"
                  className="input"
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={updateValue}
                  placeholder="••••••••"
                />
              </div>

              {error ? (
                <p className="flex items-center gap-2 rounded-xl bg-error-container px-3 py-2 text-sm font-semibold text-on-error-container">
                  <AlertCircle size={16} />
                  {error}
                </p>
              ) : null}

              <button className="btn-primary h-14 w-full rounded-xl text-lg shadow-xl mt-4" disabled={loading} type="submit">
                {loading ? <Loader2 className="animate-spin" size={20} /> : mode === "register" ? <UserPlus size={20} /> : <LogIn size={20} />}
                {loading ? "Please wait" : mode === "register" ? "Create Account" : "Log In"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
