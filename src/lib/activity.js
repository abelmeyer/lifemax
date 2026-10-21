import { supabase } from "./supabase";
import { countHabitsMet } from "./habits";

// PostgREST silently caps a response at 1000 rows. A few weeks of sets can
// pass that (a session is ~15 rows), so date-only reads page explicitly —
// a truncated read would quietly turn a training day into a missed one.
const PAGE_SIZE = 1000;
const MAX_PAGES = 20;

async function selectDates(table, userId, start, end, extra) {
  const rows = [];
  for (let page = 0; page < MAX_PAGES; page++) {
    let q = supabase.from(table).select("date").eq("user_id", userId).gte("date", start).lte("date", end);
    if (extra) q = extra(q);
    const { data, error } = await q.order("date", { ascending: true }).range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
    if (error) throw error;
    rows.push(...(data ?? []));
    if ((data ?? []).length < PAGE_SIZE) break;
  }
  return rows;
}

// Raw per-day training activity over a date range: which dates have at least
// one lifting set, and how many cardio sessions each date has. Shared by the
// streak/avatar engine and the economy so every rule reads the same facts.
export async function fetchTrainingActivity(userId, start, end) {
  const [sets, cardio] = await Promise.all([
    selectDates("workout_sets", userId, start, end),
    selectDates("cardio_sessions", userId, start, end),
  ]);

  const liftDates = new Set(sets.map((r) => r.date));
  const cardioByDate = new Map();
  for (const r of cardio) cardioByDate.set(r.date, (cardioByDate.get(r.date) ?? 0) + 1);
  return { liftDates, cardioByDate };
}

// Swim sessions per Monday-start week across a range, in one query.
export async function fetchSwimDates(userId, start, end) {
  const rows = await selectDates("cardio_sessions", userId, start, end, (q) => q.eq("type", "Swim"));
  return rows.map((r) => r.date);
}

export function liftedOn(activity, date) {
  return activity.liftDates.has(date);
}

export function cardioOn(activity, date) {
  return (activity.cardioByDate.get(date) ?? 0) > 0;
}

// Lifting or cardio — the "workout" in the aura rules.
export function workedOutOn(activity, date) {
  return liftedOn(activity, date) || cardioOn(activity, date);
}

// The one definition of an "active day", used by the day streak and the
// avatar's daily level up/down in every cycle: at least one lifting set, a
// cardio session, or at least one daily habit at its target. Cycle-agnostic
// on purpose — a rotation has no scheduled rest days to excuse.
export function isActiveDay(activity, date, habitLog, pullupTarget) {
  return workedOutOn(activity, date) || countHabitsMet(habitLog, pullupTarget) >= 1;
}

// Serializes calls to an async sync engine. Two overlapping runs (Dashboard
// mounting while Habits saves, a double tap) would each read the same
// starting state and race their writes; queued, each run sees the previous
// one's result.
export function serialized(fn) {
  let tail = Promise.resolve();
  return (...args) => {
    const run = tail.then(() => fn(...args));
    tail = run.catch(() => {});
    return run;
  };
}
