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
  // Best before today, kept separately so editing or deleting one of today's
  // sets can recompute bestWeight downward — a mistyped PR must be
  // correctable, which a running max() alone can never do.
  const pastBestWeight = sets.reduce(
    (max, s) => (s.date === today ? max : Math.max(max, s.weight_lbs ?? 0)),
    0,
  );

  const lastBest = lastSets.reduce((best, s) => {
    if (!best) return s;
    if (s.weight_lbs > best.weight_lbs) return s;
    if (s.weight_lbs === best.weight_lbs && s.reps > best.reps) return s;
    return best;
  }, null);

  return { todaysSets, lastSets, lastDate, lastBest, bestWeight, pastBestWeight };
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

export async function updateSet(setId, { weightLbs, reps }) {
  const { data, error } = await supabase
    .from("workout_sets")
    .update({ weight_lbs: weightLbs, reps })
    .eq("id", setId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteSet(setId) {
  const { error } = await supabase.from("workout_sets").delete().eq("id", setId);
  if (error) throw error;
}

// Every set logged on a date, across all exercises — the raw material for the
// session timing card (created_at bounds the workout).
export async function fetchSetsForDate(userId, date) {
  const { data, error } = await supabase
    .from("workout_sets")
    .select("*")
    .eq("user_id", userId)
    .eq("date", date)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

// Max weight logged per day, for each named exercise — feeds the Workouts
// progress chart. Exercise names are matched exactly against the seeded
// exercise library (e.g. "Barbell Bench Press", "Barbell Squat").
export async function fetchLiftProgress(userId, exerciseNames) {
  const { data: exs, error: exErr } = await supabase.from("exercises").select("id,name").in("name", exerciseNames);
  if (exErr) throw exErr;
  if (!exs || exs.length === 0) return [];

  const ids = exs.map((e) => e.id);
  const { data: sets, error } = await supabase
    .from("workout_sets")
    .select("exercise_id,date,weight_lbs")
    .eq("user_id", userId)
    .in("exercise_id", ids)
    .order("date", { ascending: true });
  if (error) throw error;

  return exs.map((ex) => {
    const byDate = {};
    for (const s of sets ?? []) {
      if (s.exercise_id !== ex.id) continue;
      const prev = byDate[s.date];
      if (!prev || s.weight_lbs > prev) byDate[s.date] = s.weight_lbs;
    }
    const points = Object.entries(byDate)
      .map(([date, weight]) => ({ date, weight }))
      .sort((a, b) => (a.date < b.date ? -1 : 1));
    return { name: ex.name, points };
  });
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
