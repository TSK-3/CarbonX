export function Metric({ label, value, tone = "default" }) {
  const toneClass =
    tone === "green"
      ? "bg-green-50 text-green-900"
      : tone === "gold"
        ? "bg-amber-50 text-amber-900"
        : "bg-white text-ink";

  return (
    <div className={`rounded-md border border-stone-200 p-4 ${toneClass}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}
