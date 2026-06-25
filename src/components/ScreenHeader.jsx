export default function ScreenHeader({ title, subtitle }) {
  return (
    <header className="mb-6">
      <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-body">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-1 text-[13px] text-muted leading-relaxed">{subtitle}</p>
      )}
    </header>
  );
}
