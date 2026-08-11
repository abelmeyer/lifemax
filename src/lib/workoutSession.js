// Workout session timing, derived entirely from workout_sets.created_at —
// the first set logged starts the clock, the last one ends it. Nothing to
// start or stop by hand, so a session can never be left "running" overnight
// because you forgot to press a button.

// A gap longer than this ends a bout. Two bouts on the same calendar day are
// two workouts, not one long one: without this, logging a single forgotten
// set in the evening after a morning session would report a 13-hour workout
// (and permanently award the "trained over an hour" badge).
export const SESSION_IDLE_TIMEOUT_MIN = 90;
const IDLE_MS = SESSION_IDLE_TIMEOUT_MIN * 60_000;

// Splits a day's sets into bouts, breaking wherever the gap between
// consecutive sets exceeds the idle timeout.
export function splitIntoBouts(sets) {
  const stamped = (sets ?? [])
    .filter((s) => s.created_at)
    .map((s) => ({ ...s, ms: new Date(s.created_at).getTime() }))
    .filter((s) => Number.isFinite(s.ms))
    .sort((a, b) => a.ms - b.ms);

  const bouts = [];
  for (const s of stamped) {
    const current = bouts[bouts.length - 1];
    if (current && s.ms - current[current.length - 1].ms <= IDLE_MS) {
      current.push(s);
    } else {
      bouts.push([s]);
    }
  }
  return bouts;
}

function summarizeBout(bout) {
  const startMs = bout[0].ms;
  const lastSetMs = bout[bout.length - 1].ms;
  return {
    startMs,
    lastSetMs,
    // Elapsed time is always first-set-to-last-set. It deliberately does NOT
    // run on wall time while you're resting: doing that inflated the workout
    // by however long the app sat open, and then jumped backwards by up to 90
    // minutes the moment the idle timeout tripped.
    durationSeconds: Math.max(0, (lastSetMs - startMs) / 1000),
    setCount: bout.length,
    totalVolume: bout.reduce((sum, s) => sum + (s.weight_lbs ?? 0) * (s.reps ?? 0), 0),
  };
}

/**
 * Summarizes the most recent bout in `sets`. `nowMs` only decides whether that
 * bout is still open (i.e. whether to show it as in progress) — it never
 * affects the reported duration.
 */
export function summarizeSession(sets, nowMs = Date.now()) {
  const bouts = splitIntoBouts(sets);
  if (bouts.length === 0) {
    return { hasSession: false, inProgress: false, setCount: 0, totalVolume: 0, boutCount: 0 };
  }

  const latest = summarizeBout(bouts[bouts.length - 1]);
  return {
    hasSession: true,
    inProgress: nowMs - latest.lastSetMs < IDLE_MS,
    // Seconds since the last set — the live-ticking number, kept separate
    // from the workout's elapsed time so neither one lies.
    idleSeconds: Math.max(0, (nowMs - latest.lastSetMs) / 1000),
    boutCount: bouts.length,
    ...latest,
  };
}

/** Every bout of a day, for stats that must not merge separate workouts. */
export function summarizeAllBouts(sets) {
  return splitIntoBouts(sets).map(summarizeBout);
}
