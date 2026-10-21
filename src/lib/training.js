import { supabase } from "./supabase";
import { DEFAULT_CYCLE, isCycleId, fullBodyKeyFromProgramDay } from "./cycles";

// Sprint 13 objects (training_settings, workout_sets.program_day) must not
// break the Workouts tab for someone who hasn't run the migration yet. Until
// then the active cycle and last full-body day live in this browser instead.
const MISSING_TABLE_CODES = new Set(["42P01", "PGRST205", "PGRST202"]);
export const MISSING_COLUMN_CODES = new Set(["42703", "PGRST204"]);

const CYCLE_KEY = "lifemaxx_active_cycle";
const LAST_FB_KEY = "lifemaxx_last_fb_day";

function readLocal(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeLocal(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Private mode / blocked storage — the database is the real store anyway.
  }
}

// Last cycle chosen in this browser — the fallback when the database can't
// answer (unrun migration, or offline).
export function localActiveCycle() {
  const local = readLocal(CYCLE_KEY);
  return isCycleId(local) ? local : DEFAULT_CYCLE;
}

export async function fetchActiveCycle(userId) {
  const fallback = localActiveCycle();

  const { data, error } = await supabase
    .from("training_settings")
    .select("active_cycle")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    if (MISSING_TABLE_CODES.has(error.code)) return fallback;
    throw error;
  }
  return isCycleId(data?.active_cycle) ? data.active_cycle : fallback;
}

export async function saveActiveCycle(userId, cycle) {
  if (!isCycleId(cycle)) throw new Error(`Unknown cycle: ${cycle}`);
  writeLocal(CYCLE_KEY, cycle);

  const { error } = await supabase
    .from("training_settings")
    .upsert({ user_id: userId, active_cycle: cycle, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
  if (error && !MISSING_TABLE_CODES.has(error.code)) throw error;
}

// Remembered locally on every full-body log, so the rotation still advances
// before the program_day column exists.
export function rememberFullBodyDay(key, date) {
  writeLocal(LAST_FB_KEY, JSON.stringify({ key, date }));
}

function localLastFullBodyDay() {
  try {
    const parsed = JSON.parse(readLocal(LAST_FB_KEY) ?? "null");
    return parsed?.key ? { key: parsed.key, date: parsed.date ?? null } : null;
  } catch {
    return null;
  }
}

// The most recent full-body day with at least one logged set: { key, date }
// or null. Sets logged under PPL never count, even for shared exercises.
export async function fetchLastFullBodyDay(userId) {
  const { data, error } = await supabase
    .from("workout_sets")
    .select("program_day,date")
    .eq("user_id", userId)
    .like("program_day", "fb-%")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1);
  if (error) {
    if (MISSING_COLUMN_CODES.has(error.code)) return localLastFullBodyDay();
    throw error;
  }
  const row = data?.[0];
  const key = fullBodyKeyFromProgramDay(row?.program_day);
  return key ? { key, date: row.date } : null;
}
