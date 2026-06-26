import { supabase } from "./supabase";
import { todayStr } from "./dateUtils";

export async function fetchExercises() {
  const { data, error } = await supabase
    .from("exercises")
    .select("*")
    .order("day_slot", { ascending: true })
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchExerciseHistory(exerciseId) {
  const { data, error } = await supabase
    .from("workout_sets")
    .select("*")
    .eq("exercise_id", exerciseId)
    .order("date", { ascending: false })
    .order("set_number", { ascending: true })
    .limit(200);
  if (error) throw error;
  return data ?? [];
}

export function summarizeHistory(sets, today) {
  const todaysSets = sets
    .filter((s) => s.date === today)
    .sort((a, b) => a.set_number - b.set_number);

  const pastDates = [...new Set(sets.filter((s) => s.date !== today).map((s) => s.date))].sort(
    (a, b) => (a < b ? 1 : -1),
  );
  const lastDate = pastDates[0] ?? null;
  const lastSets = lastDate
    ? sets.filter((s) => s.date === lastDate).sort((a, b) => a.set_number - b.set_number)
    : [];

  const bestWeight = sets.reduce((max, s) => Math.max(max, s.weight_lbs ?? 0), 0);

  const lastBest = lastSets.reduce((best, s) => {
    if (!best) return s;
    if (s.weight_lbs > best.weight_lbs) return s;
    if (s.weight_lbs === best.weight_lbs && s.reps > best.reps) return s;
    return best;
  }, null);

  return { todaysSets, lastSets, lastDate, lastBest, bestWeight };
}

export async function logSet({ userId, exerciseId, setNumber, weightLbs, reps }) {
  const { data, error } = await supabase
    .from("workout_sets")
    .insert({
      user_id: userId,
      exercise_id: exerciseId,
      date: todayStr(),
      set_number: setNumber,
      weight_lbs: weightLbs,
      reps,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchCardioToday(userId) {
  const { data, error } = await supabase
    .from("cardio_sessions")
    .select("*")
    .eq("user_id", userId)
    .eq("date", todayStr());
  if (error) throw error;
  return data ?? [];
}

export async function logCardio({ userId, type, durationMin, notes }) {
  const { data, error } = await supabase
    .from("cardio_sessions")
    .insert({
      user_id: userId,
      date: todayStr(),
      type,
      duration_min: durationMin,
      notes,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}
