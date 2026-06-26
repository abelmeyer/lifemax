import { supabase } from "./supabase";
import { todayStr, weekStartStr, addDaysStr } from "./dateUtils";

export const HABIT_TARGETS = {
  pushups: { min: 100, max: 200, label: "100-200" },
  situps: { min: 200, max: 300, label: "200-300" },
};

export const DEFAULT_PULLUP_TARGET = 10;
export const WEEKLY_SWIM_TARGET = 3;

export async function fetchHabitLog(userId, date) {
  const { data, error } = await supabase
    .from("habit_logs")
    .select("*")
    .eq("user_id", userId)
    .eq("date", date)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchHabitLogsInRange(userId, startDate, endDate) {
  const { data, error } = await supabase
    .from("habit_logs")
    .select("*")
    .eq("user_id", userId)
    .gte("date", startDate)
    .lte("date", endDate);
  if (error) throw error;
  return data ?? [];
}

export async function upsertHabitLog({ userId, date, pushups, situps, pullups }) {
  const { data, error } = await supabase
    .from("habit_logs")
    .upsert(
      { user_id: userId, date, pushups, situps, pullups },
      { onConflict: "user_id,date" },
    )
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchHabitSettings(userId) {
  const { data, error } = await supabase
    .from("habit_settings")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data ?? { user_id: userId, pullup_target: DEFAULT_PULLUP_TARGET };
}

export async function upsertPullupTarget(userId, pullupTarget) {
  const { data, error } = await supabase
    .from("habit_settings")
    .upsert({ user_id: userId, pullup_target: pullupTarget }, { onConflict: "user_id" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchHabitStreaks(userId) {
  const { data, error } = await supabase.from("habit_streaks").select("*").eq("user_id", userId);
  if (error) throw error;
  const map = {};
  for (const row of data ?? []) map[row.habit] = row;
  return map;
}

export async function upsertHabitStreak(userId, habit, { currentStreak, bestStreak, lastCompleted }) {
  const { data, error } = await supabase
    .from("habit_streaks")
    .upsert(
      {
        user_id: userId,
        habit,
        current_streak: currentStreak,
        best_streak: bestStreak,
        last_completed: lastCompleted,
      },
      { onConflict: "user_id,habit" },
    )
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchSwimCountForWeek(userId, weekStart) {
  const weekEnd = addDaysStr(weekStart, 6);
  const { data, error } = await supabase
    .from("cardio_sessions")
    .select("id")
    .eq("user_id", userId)
    .eq("type", "Swim")
    .gte("date", weekStart)
    .lte("date", weekEnd);
  if (error) throw error;
  return (data ?? []).length;
}

export function habitMet(habit, log, pullupTarget) {
  if (!log) return false;
  if (habit === "pushups") return (log.pushups ?? 0) >= HABIT_TARGETS.pushups.min;
  if (habit === "situps") return (log.situps ?? 0) >= HABIT_TARGETS.situps.min;
  if (habit === "pullups") return (log.pullups ?? 0) >= pullupTarget;
  return false;
}

export function countHabitsMet(log, pullupTarget) {
  return ["pushups", "situps", "pullups"].filter((h) => habitMet(h, log, pullupTarget)).length;
}

export function currentWeekStart() {
  return weekStartStr(todayStr());
}
