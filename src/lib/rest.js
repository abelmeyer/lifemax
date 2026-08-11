// Optimal rest between sets, inferred from the exercise's own prescription.
// The evidence-backed shape of it: the heavier and lower-rep the set, the
// longer the rest, because the limiting factor is phosphocreatine and CNS
// recovery rather than local muscular fatigue.
//
//   strength (≤8 reps, big compounds)   → 3 min
//   hypertrophy (9–14 reps)             → 90 s
//   endurance / isolation (15+ reps)    → 60 s
//   timed holds (planks)                → 60 s
//
// rep_scheme strings in the seeded library look like "8-12", "6-8", "10 each",
// "15-20", "45-60s".

export const REST_STRENGTH = 180;
export const REST_HYPERTROPHY = 90;
export const REST_ENDURANCE = 60;

// Compounds earn the full strength rest even at moderate reps — a set of 10
// squats taxes you far more than a set of 10 curls.
const HEAVY_COMPOUNDS = [
  "Barbell Squat",
  "Barbell Bench Press",
  "Romanian Deadlift",
  "Overhead Press",
  "Pull-Ups / Lat Pulldown",
];

// A timed hold looks like a duration all the way through ("45-60s", "30 sec"),
// not merely a string that happens to end in "s" — "10 each side" is a rep
// scheme, and treating it as a hold would prescribe the wrong rest.
const TIMED_HOLD = /^\s*\d+\s*(?:-\s*\d+\s*)?(?:s|sec|secs|seconds)\s*$/i;

// Top of the rep range, or null when it's a timed hold. The top rather than
// the bottom: a set of "8-12" is a hypertrophy set you take to 12, and using
// the bottom would classify it as a 3-minute strength rest, contradicting the
// tiers above.
export function parseTopReps(repScheme) {
  if (!repScheme) return null;
  if (TIMED_HOLD.test(repScheme)) return null;
  const nums = repScheme.match(/\d+/g);
  if (!nums || nums.length === 0) return null;
  return Math.max(...nums.map(Number));
}

export function restSecondsFor(exercise) {
  if (!exercise) return REST_HYPERTROPHY;
  if (HEAVY_COMPOUNDS.includes(exercise.name)) return REST_STRENGTH;

  const reps = parseTopReps(exercise.rep_scheme);
  if (reps === null) return REST_ENDURANCE;
  if (reps <= 8) return REST_STRENGTH;
  if (reps <= 14) return REST_HYPERTROPHY;
  return REST_ENDURANCE;
}

export function restLabelFor(exercise) {
  const s = restSecondsFor(exercise);
  if (s >= REST_STRENGTH) return "strength";
  if (s >= REST_HYPERTROPHY) return "hypertrophy";
  return "endurance";
}

export function formatClock(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds));
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}

// "1h 12m" / "48m" / "6m" / "40s" — for workout duration, where seconds are
// noise above a minute but "0m" for a real (if short) workout is not.
export function formatDuration(totalSeconds) {
  const secs = Math.max(0, Math.round(totalSeconds));
  if (secs < 60) return `${secs}s`;
  const mins = Math.round(secs / 60);
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function formatTimeOfDay(isoOrDate) {
  const d = isoOrDate instanceof Date ? isoOrDate : new Date(isoOrDate);
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}
