import { FULL_BODY_DAYS, fullBodyDay } from "../../lib/cycles";

// "Next up" for the A → B → C rotation, plus manual override chips.
// suggestedKey is what the rotation says to train; inProgress means that day
// already has sets today (so it's "Today", not "Next up").
export default function FullBodyDayPicker({ suggestedKey, inProgress, selectedKey, onChange }) {
  const suggested = fullBodyDay(suggestedKey);
  const overridden = selectedKey !== suggestedKey;

  return (
    <div className="card-shadow mb-3 rounded-card border border-border bg-surface px-5 py-4">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
            {inProgress ? "Today" : "Next up"}
          </p>
          <p className="mt-0.5 truncate text-[15px] font-medium text-body">
            Day {suggested.key} · {suggested.label}
          </p>
        </div>
        {overridden && (
          <button
            type="button"
            onClick={() => onChange(suggestedKey)}
            className="shrink-0 text-[12px] font-medium text-accent transition-colors duration-200 hover:text-accent-hover"
          >
            Back to Day {suggestedKey}
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {FULL_BODY_DAYS.map((d) => {
          const active = d.key === selectedKey;
          const isSuggested = d.key === suggestedKey;
          return (
            <button
              key={d.key}
              type="button"
              onClick={() => onChange(d.key)}
              aria-pressed={active}
              className="relative flex flex-col items-center gap-0.5 rounded-btn px-2 py-2 transition-colors duration-200"
              style={{
                background: active ? "#5AB4FF" : "#0d0d12",
                border: active ? "1px solid #5AB4FF" : "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <span
                className="font-mono text-[10px] uppercase tracking-wide"
                style={{ color: active ? "#0d0d12" : "#6e7a8a" }}
              >
                Day {d.key}
              </span>
              <span
                className="w-full truncate text-center text-[12px] font-medium"
                style={{ color: active ? "#0d0d12" : "#e8eaf0" }}
              >
                {d.short}
              </span>
              {isSuggested && !active && (
                <span
                  aria-label="Suggested"
                  className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full"
                  style={{ background: "#5AB4FF" }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
