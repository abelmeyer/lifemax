export default function ScreenHeader({ title, subtitle, right }) {
  return (
    <header className="mb-6 flex items-start justify-between gap-3">
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-body">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-[13px] text-muted leading-relaxed">{subtitle}</p>
        )}
      </div>
      {right && <div className="shrink-0 pt-1.5">{right}</div>}
    </header>
  );
}
