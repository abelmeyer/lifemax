import { WEEKLY_SWIM_TARGET } from "../../lib/habits";

export default function SwimCard({ count, streak }) {
  return (
    <div
      className="mb-3 rounded-card border border-border bg-surface p-5"
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[15px] font-medium text-body">Swims this week</h3>
        <div className="flex items-center gap-3 font-mono text-[12px] text-muted">
          <span style={{ color: streak?.current_streak > 0 ? "#34d399" : undefined }}>
            {streak?.current_streak ?? 0}wk streak
          </span>
          <span>best {streak?.best_streak ?? 0}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {Array.from({ length: WEEKLY_SWIM_TARGET }).map((_, i) => (
          <div
            key={i}
            className="h-2.5 flex-1 rounded-full"
            style={{ background: i < count ? "#34d399" : "rgba(255,255,255,0.06)" }}
          />
        ))}
        <span className="ml-1 font-mono text-[13px] text-muted">
          {count}/{WEEKLY_SWIM_TARGET}
        </span>
      </div>

      <p className="mt-3 text-[12px] leading-relaxed text-muted">
        Log swims from the Cardio card on the Workouts tab.
      </p>
    </div>
  );
}
