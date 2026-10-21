import { supabase } from "./supabase";
import { countHabitsMet } from "./habits";

// Raw per-day training activity over a date range: which dates have at least
// one lifting set, and how many cardio sessions each date has. Shared by the
// streak/avatar engine and the economy so every rule reads the same facts.
export async function fetchTrainingActivity(userId, start, end) {
  const [{ data: sets, error: e1 }, { data: cardio, error: e2 }] = await Promise.all([
    supabase.from("workout_sets").select("date").eq("user_id", userId).gte("date", start).lte("date", end),
    supabase.from("cardio_sessions").select("date").eq("user_id", userId).gte("date", start).lte("date", end),
  ]);
  if (e1) throw e1;
  if (e2) throw e2;

  const liftDates = new Set((sets ?? []).map((r) => r.date));
  const cardioByDate = new Map();
  for (const r of cardio ?? []) cardioByDate.set(r.date, (cardioByDate.get(r.date) ?? 0) + 1);
  return { liftDates, cardioByDate };
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
