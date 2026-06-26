export default function MacroBar({ label, value, unit = "g", target }) {
  const met = value >= target.min;
  const pct = Math.min(100, Math.round((value / target.min) * 100));

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-[12px] text-muted">{label}</span>
        <span className="font-mono text-[13px] text-body">
          {value}
          {unit} <span className="text-muted">/ {target.label ?? `${target.min}${unit}`}</span>
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${pct}%`, background: met ? "#34d399" : "#5ab4ff" }}
        />
      </div>
    </div>
  );
}
