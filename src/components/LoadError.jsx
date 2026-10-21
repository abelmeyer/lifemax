// Shown in place of a screen's spinner when its load failed, so a dropped
// request ends in a retry button instead of a spinner that never stops.
export default function LoadError({ message = "Couldn't load this.", onRetry }) {
  return (
    <div className="card-shadow mb-3 flex flex-col items-center gap-3 rounded-card border border-border bg-surface px-6 py-8 text-center">
      <p className="text-[14px] text-body">{message}</p>
      <p className="text-[12px] text-muted">Check your connection and try again.</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-btn bg-accent px-5 py-2 text-[13px] font-medium text-[#0d0d12] transition duration-200 hover:bg-accent-hover active:scale-95"
        >
          Retry
        </button>
      )}
    </div>
  );
}
