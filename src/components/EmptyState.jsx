export default function EmptyState({ icon, title, message }) {
  return (
    <div
      className="card-shadow flex flex-col items-center gap-3 rounded-card border border-border bg-surface px-6 py-10 text-center"
    >
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-accent">
          {icon}
        </div>
      )}
      <h2 className="text-[15px] font-medium text-body">{title}</h2>
      {message && (
        <p className="max-w-[240px] text-[13px] leading-relaxed text-muted">
          {message}
        </p>
      )}
    </div>
  );
}
