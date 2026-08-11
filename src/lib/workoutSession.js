// Workout session timing, derived entirely from workout_sets.created_at —
// the first set logged starts the clock, the last one ends it. Nothing to
// start or stop by hand, so a session can never be left "running" overnight
// because you forgot to press a button.

// A session is considered still in progress if the most recent set landed
// within this window; past that, the workout is treated as finished and the
// duration stops growing.
export const SESSION_IDLE_TIMEOUT_MIN = 90;

export function summarizeSession(sets, nowMs = Date.now()) {
  const stamped = (sets ?? []).filter((s) => s.created_at).map((s) => new Date(s.created_at).getTime());
  if (stamped.length === 0) {
    return { hasSession: false, setCount: 0, totalVolume: 0 };
  }

  const startMs = Math.min(...stamped);
  const lastMs = Math.max(...stamped);
  const idleMs = nowMs - lastMs;
  const inProgress = idleMs < SESSION_IDLE_TIMEOUT_MIN * 60_000;

  // While training, the duration runs to "now" so the card ticks live. Once
  // the session has gone idle it freezes at the last set.
  const endMs = inProgress ? Math.max(nowMs, lastMs) : lastMs;

  const totalVolume = (sets ?? []).reduce((sum, s) => sum + (s.weight_lbs ?? 0) * (s.reps ?? 0), 0);

  return {
    hasSession: true,
    inProgress,
    startMs,
    lastSetMs: lastMs,
    endMs,
    durationSeconds: Math.max(0, (endMs - startMs) / 1000),
    setCount: (sets ?? []).length,
    totalVolume,
  };
}
