// Training cycles the Workouts tab can switch between. The catalog lives in
// code (like PPL_DAYS and the badge catalog) — the database only stores which
// cycle a user has active, and which program day each set was logged under.

export const CYCLES = [
  { id: "ppl", label: "PPL (6-day)", short: "PPL" },
  { id: "full_body", label: "Full Body (A/B/C)", short: "Full Body" },
];

export const DEFAULT_CYCLE = "ppl";

export function isCycleId(id) {
  return CYCLES.some((c) => c.id === id);
}

// Full Body prescriptions reference the shared exercise library by exact
// name, so a set logged here lands on the same exercise row as PPL and the
// history/PR lookups (which key on exercise_id) carry over in both
// directions. Only sets and reps are overridden — cues come from the row.
//
// Entries sharing a `superset` id are performed back-to-back and render as
// one group.
export const FULL_BODY_DAYS = [
  {
    key: "A",
    label: "Strength",
    short: "Strength",
    exercises: [
      { name: "Barbell Squat", sets: 3, reps: "6-8" },
      { name: "Barbell Bench Press", sets: 3, reps: "6-10" },
      { name: "Pull-Ups / Lat Pulldown", sets: 3, reps: "6-10" },
      { name: "Lateral Raises", sets: 3, reps: "12-15" },
      { name: "Hanging Leg Raises", sets: 3, reps: "10-15" },
    ],
  },
  {
    key: "B",
    label: "Posterior + shoulders",
    short: "Posterior",
    exercises: [
      { name: "Romanian Deadlift", sets: 3, reps: "8-10" },
      { name: "Overhead Press", sets: 3, reps: "8-10" },
      { name: "Single-Arm Dumbbell Row", sets: 3, reps: "8-10 each side" },
      { name: "Face Pulls", sets: 3, reps: "15-20" },
      { name: "Barbell/Dumbbell Curl", sets: 3, reps: "10-12", superset: "arms" },
      { name: "Tricep Cable Pushdowns", sets: 3, reps: "10-12", superset: "arms" },
    ],
  },
  {
    key: "C",
    label: "Volume + V-taper",
    short: "V-taper",
    exercises: [
      { name: "Reverse Lunges", sets: 3, reps: "10 each leg" },
      { name: "Incline Dumbbell Press", sets: 3, reps: "8-12" },
      { name: "Seated Cable Row", sets: 3, reps: "10-12" },
      { name: "Lateral Raises", sets: 3, reps: "12-15" },
      { name: "Barbell/Dumbbell Curl", sets: 2, reps: "10-12", superset: "arms" },
      { name: "Tricep Cable Pushdowns", sets: 2, reps: "10-12", superset: "arms" },
      { name: "Plank + Side Plank", sets: 3, reps: "45-60s" },
    ],
  },
];

export const FULL_BODY_KEYS = FULL_BODY_DAYS.map((d) => d.key);

export function fullBodyDay(key) {
  return FULL_BODY_DAYS.find((d) => d.key === key) ?? FULL_BODY_DAYS[0];
}

// A → B → C → A. No history starts at A.
export function nextFullBodyKey(lastKey) {
  const i = FULL_BODY_KEYS.indexOf(lastKey);
  return i === -1 ? FULL_BODY_KEYS[0] : FULL_BODY_KEYS[(i + 1) % FULL_BODY_KEYS.length];
}

// workout_sets.program_day values.
export function pplProgramDay(day) {
  return `ppl-${day}`;
}

export function fullBodyProgramDay(key) {
  return `fb-${key}`;
}

export function fullBodyKeyFromProgramDay(programDay) {
  const m = /^fb-([A-Z])$/.exec(programDay ?? "");
  return m && FULL_BODY_KEYS.includes(m[1]) ? m[1] : null;
}

// Turns a day's prescription into renderable blocks against the loaded
// exercise library: { kind: "single", exercise } or { kind: "superset",
// exercises: [...] }. Each exercise is the library row with this day's
// sets/reps swapped in. Names with no matching row are returned in
// `missing` rather than silently dropped.
export function resolveFullBodyDay(key, library) {
  const byName = new Map(library.map((e) => [e.name, e]));
  const blocks = [];
  const missing = [];

  for (const item of fullBodyDay(key).exercises) {
    const row = byName.get(item.name);
    if (!row) {
      missing.push(item.name);
      continue;
    }
    const exercise = { ...row, default_sets: item.sets, rep_scheme: item.reps };
    const prev = blocks[blocks.length - 1];
    if (item.superset && prev?.kind === "superset" && prev.id === item.superset) {
      prev.exercises.push(exercise);
    } else if (item.superset) {
      blocks.push({ kind: "superset", id: item.superset, exercises: [exercise] });
    } else {
      blocks.push({ kind: "single", exercise });
    }
  }

  // A superset whose partner is missing is just a single exercise.
  return {
    blocks: blocks.map((b) => (b.kind === "superset" && b.exercises.length === 1 ? { kind: "single", exercise: b.exercises[0] } : b)),
    missing,
  };
}
