// Visually binds a superset's exercises: a labelled accent rail down the
// left, the cards stacked tight inside it.
export default function SupersetGroup({ rounds, children }) {
  return (
    <section aria-label="Superset" className="mb-3 border-l-2 pl-3" style={{ borderColor: "rgba(90,180,255,0.45)" }}>
      <div className="mb-2 flex items-baseline gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-accent">Superset</span>
        <span className="font-mono text-[11px] text-muted">
          {rounds} rounds · back-to-back, rest after both
        </span>
      </div>
      <div className="[&>*:last-child]:mb-0">{children}</div>
    </section>
  );
}
