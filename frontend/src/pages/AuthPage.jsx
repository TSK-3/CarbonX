import { Leaf, LogIn, ShieldCheck, Sprout, UserPlus } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";

export function AuthPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("register");
  const [values, setValues] = useState({
    name: "Ramaiah",
    phone: "9876543210",
    password: "carbonx123"
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
      <section className="relative hidden overflow-hidden bg-primary-container lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(152,181,163,0.35),transparent_28%),linear-gradient(135deg,#173124,#2d4739)]" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3 text-2xl font-black">
            <Leaf size={28} />
            CarbonX
          </div>
          <div className="max-w-xl">
            <p className="terra-kicker text-sage">Grounded Reliability</p>
            <h1 className="mt-4 text-5xl font-black leading-tight">Turn verified land data into carbon opportunity.</h1>
            <p className="mt-5 text-lg leading-8 text-sage">
              Register farm boundaries, estimate sequestration, and track credit readiness with a farmer-first workflow.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-sage">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <ShieldCheck className="mb-3" size={22} />
              Secure farm records
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <Sprout className="mb-3" size={22} />
              Carbon-ready estimates
            </div>
          </div>
        </div>
      </section>

      <section className="grid place-items-center px-5 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-field text-white">
              <Leaf size={24} />
            </span>
            <div>
              <h1 className="text-2xl font-black text-field">CarbonX</h1>
              <p className="text-sm text-outline">Farmer carbon estimate portal</p>
            </div>
          </div>

          <div className="terra-card p-6">
            <div className="mb-6">
              <p className="terra-kicker">Farmer access</p>
              <h2 className="mt-2 text-3xl font-bold text-field">
                {mode === "register" ? "Create your account" : "Welcome back"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Continue to your land registry, estimates, and verification tasks.
              </p>
            </div>

        <div className="mb-5 grid grid-cols-2 gap-2 rounded-lg bg-surface-low p-1">
          <button
            className={`rounded-md px-3 py-2 text-sm font-semibold ${mode === "register" ? "bg-white text-field shadow-sm" : "text-outline"}`}
            onClick={() => setMode("register")}
            type="button"
          >
            Register
          </button>
          <button
            className={`rounded-md px-3 py-2 text-sm font-semibold ${mode === "login" ? "bg-white text-field shadow-sm" : "text-outline"}`}
            onClick={() => setMode("login")}
            type="button"
          >
            Login
          </button>
        </div>

        <form className="space-y-4" onSubmit={submit}>
          {mode === "register" ? (
            <label className="block space-y-1">
              <span className="label">Name</span>
              <input className="input" name="name" value={values.name} onChange={updateValue} />
            </label>
          ) : null}

          <label className="block space-y-1">
            <span className="label">Phone</span>
            <input className="input" name="phone" value={values.phone} onChange={updateValue} />
          </label>

          <label className="block space-y-1">
            <span className="label">Password</span>
            <input
              className="input"
              name="password"
              type="password"
              value={values.password}
              onChange={updateValue}
            />
          </label>

          {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

          <button className="btn-primary w-full" disabled={loading} type="submit">
            {mode === "register" ? <UserPlus size={17} /> : <LogIn size={17} />}
            {loading ? "Please wait" : mode === "register" ? "Create Account" : "Log In"}
          </button>
        </form>
          </div>
        </div>
      </section>
    </main>
  );
}
