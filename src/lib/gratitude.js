import { supabase } from "./supabase";
import { todayStr, addDaysStr } from "./dateUtils";

export const GRATITUDE_SLOTS = 3;

// Same graceful-degradation contract as avatar customization: until the
// operator runs sprint11_migration.sql the screen explains itself instead of
// throwing.
const MISSING_TABLE_CODES = new Set(["42P01", "PGRST205", "PGRST202"]);

function isMissingTable(error) {
  return MISSING_TABLE_CODES.has(error?.code);
}

export function normalizeItems(items) {
  const list = Array.isArray(items) ? items : [];
  return Array.from({ length: GRATITUDE_SLOTS }, (_, i) => (typeof list[i] === "string" ? list[i] : ""));
}

export function countFilled(items) {
  return normalizeItems(items).filter((t) => t.trim().length > 0).length;
}

export function isComplete(items) {
  return countFilled(items) >= GRATITUDE_SLOTS;
}

export async function fetchGratitude(userId, date) {
  const { data, error } = await supabase
    .from("gratitude_entries")
    .select("*")
    .eq("user_id", userId)
    .eq("date", date)
    .maybeSingle();
  if (error) {
    if (isMissingTable(error)) return { entry: null, tableMissing: true };
    throw error;
  }
  return { entry: data, tableMissing: false };
}

export async function fetchGratitudeRange(userId, startDate, endDate) {
  const { data, error } = await supabase
    .from("gratitude_entries")
    .select("*")
    .eq("user_id", userId)
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: false });
  if (error) {
    if (isMissingTable(error)) return { entries: [], tableMissing: true };
    throw error;
  }
  return { entries: data ?? [], tableMissing: false };
}

export async function saveGratitude(userId, date, items) {
  const cleaned = normalizeItems(items).map((t) => t.trim());
  const { data, error } = await supabase
    .from("gratitude_entries")
    .upsert(
      { user_id: userId, date, items: cleaned, updated_at: new Date().toISOString() },
      { onConflict: "user_id,date" },
    )
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Consecutive days ending today (or yesterday, if today isn't written yet)
// on which all three slots were filled. Counting from yesterday keeps the
// streak from reading as "broken" all morning before you've journaled.
export function gratitudeStreak(entries, today = todayStr()) {
  const complete = new Set(entries.filter((e) => isComplete(e.items)).map((e) => e.date));
  if (complete.size === 0) return 0;

  let cursor = complete.has(today) ? today : addDaysStr(today, -1);
  let streak = 0;
  while (complete.has(cursor)) {
    streak++;
    cursor = addDaysStr(cursor, -1);
  }
  return streak;
}
