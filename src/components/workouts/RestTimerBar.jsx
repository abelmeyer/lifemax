import { useRestTimer } from "../../lib/RestTimerContext";
import { formatClock } from "../../lib/rest";
import { XIcon } from "../icons";

// Floating rest countdown, docked just above the tab bar so it stays visible
// on every screen until it's dismissed.
export default function RestTimerBar() {
  const { active, label, remaining, totalSeconds, finished, isPaused, stop, addSeconds, togglePause } = useRestTimer();
  if (!active) return null;

  const progress = totalSeconds > 0 ? Math.min(1, Math.max(0, remaining / totalSeconds)) : 0;
  const accent = finished ? "#34d399" : "#5ab4ff";

  return (
    <div
      className="fade-in fixed inset-x-0 z-40 flex justify-center px-4"
      style={{ bottom: "calc(env(safe-area-inset-bottom) + 68px)" }}
    >
      <div
        className="card-shadow w-full max-w-md overflow-hidden rounded-card border bg-surface"
        style={{ borderColor: finished ? "rgba(52,211,153,0.4)" : "rgba(90,180,255,0.3)" }}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] uppercase tracking-wide text-muted">
              {finished ? "Rest complete" : isPaused ? "Rest paused" : label}
            </p>
            <p className={`font-mono text-[22px] font-semibold ${finished ? "pop-in" : ""}`} style={{ color: accent }}>
              {finished ? "Go" : formatClock(remaining)}
            </p>
          </div>

          {!finished && (
            <>
              <button
                type="button"
                onClick={() => addSeconds(30)}
                className="shrink-0 rounded-btn border border-border px-2.5 py-2 font-mono text-[12px] text-body transition-colors duration-200 hover:bg-white/[0.04] active:scale-95"
              >
                +30s
              </button>
              <button
                type="button"
                onClick={togglePause}
                className="shrink-0 rounded-btn border border-border px-3 py-2 text-[12px] font-medium text-body transition-colors duration-200 hover:bg-white/[0.04] active:scale-95"
              >
                {isPaused ? "Resume" : "Pause"}
              </button>
            </>
          )}

          <button
            type="button"
            onClick={stop}
            aria-label="Dismiss rest timer"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors duration-200 hover:bg-white/[0.06] hover:text-body active:scale-95"
          >
            <XIcon width={14} height={14} />
          </button>
        </div>

        <div className="h-1 w-full bg-white/[0.06]">
          <div
            className="h-full transition-[width] duration-200 ease-linear"
            style={{ width: `${progress * 100}%`, background: accent }}
          />
        </div>
      </div>
    </div>
  );
}
