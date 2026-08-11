import { useEffect, useState } from "react";
import { summarizeSession } from "../../lib/workoutSession";
import { formatDuration, formatTimeOfDay } from "../../lib/rest";

// Live session clock. Nothing to start or stop — the first set logged today
// begins the workout and the last one ends it.
export default function WorkoutSessionCard({ sets }) {
  const [now, setNow] = useState(() => Date.now());
  const session = summarizeSession(sets, now);

  useEffect(() => {
    if (!session.hasSession || !session.inProgress) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [session.hasSession, session.inProgress]);

  if (!session.hasSession) return null;

  const accent = session.inProgress ? "#5ab4ff" : "#6e7a8a";

  return (
    <div
      className="card-shadow mb-3 rounded-card border bg-surface px-5 py-4"
      style={{ borderColor: session.inProgress ? "rgba(90,180,255,0.28)" : "rgba(255,255,255,0.07)" }}
    >
      <div className="mb-3 flex items-baseline justify-between">
        <div className="flex items-center gap-2">
          {session.inProgress && (
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ background: accent }} />
              <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: accent }} />
            </span>
          )}
          <h3 className="text-[15px] font-medium text-body">
            {session.inProgress ? "Workout in progress" : "Today's workout"}
          </h3>
        </div>
        <span className="font-mono text-[20px] font-semibold" style={{ color: accent }}>
          {formatDuration(session.durationSeconds)}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border pt-3 text-[12px]">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-wide text-muted">Started</span>
          <span className="font-mono text-body">{formatTimeOfDay(session.startMs)}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-wide text-muted">
            {session.inProgress ? "Last set" : "Finished"}
          </span>
          <span className="font-mono text-body">{formatTimeOfDay(session.lastSetMs)}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-wide text-muted">Sets</span>
          <span className="font-mono text-body">{session.setCount}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-wide text-muted">Volume</span>
          <span className="font-mono text-body">{Math.round(session.totalVolume).toLocaleString()} lbs</span>
        </div>
      </div>
    </div>
  );
}
