export function Metric({ label, value, tone = "default" }) {
  const toneClass =
    tone === "green"
      ? "bg-secondary-container/20 text-secondary border-secondary-container/30 shadow-inner"
      : tone === "gold"
        ? "bg-tertiary-container/10 text-tertiary border-tertiary-container/20 shadow-inner"
        : "bg-white text-primary border-outline-variant shadow-md";

  return (
    <div className={`rounded-2xl border p-6 flex flex-col justify-between min-h-[140px] ${toneClass}`}>
      <p className="text-[10px] font-black uppercase tracking-[0.15em] opacity-70">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}
