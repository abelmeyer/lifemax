import { supabase } from "./supabase";
import { todayStr, dateToStr, addDaysStr } from "./dateUtils";
import { fetchHabitSettings, countHabitsMet } from "./habits";

// Builds a 7-cell (week strip) or 35/42-cell (month grid) array. Cells
// outside the requested month carry inMonth:false and a null dateStr so
// they render dimmed and non-interactive.
export function getMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const cells = [];
  for (let i = 0; i < startOffset; i++) {
    cells.push({ day: prevMonthDays - startOffset + 1 + i, inMonth: false, dateStr: null });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, inMonth: true, dateStr: dateToStr(new Date(year, month, d)) });
  }
  let nextDay = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ day: nextDay++, inMonth: false, dateStr: null });
  }
  return cells;
}

export function getLastNDays(n) {
  const today = todayStr();
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    days.push(addDaysStr(today, -i));
  }
  return days;
}

async function fetchRange(table, userId, startDate, endDate) {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("user_id", userId)
    .gte("date", startDate)
    .lte("date", endDate);
  if (error) throw error;
  return data ?? [];
}

export async function fetchRangeSummary(userId, startDate, endDate) {
  const [sets, cardio, logs, meals, settings] = await Promise.all([
    fetchRange("workout_sets", userId, startDate, endDate),
    fetchRange("cardio_sessions", userId, startDate, endDate),
    fetchRange("habit_logs", userId, startDate, endDate),
    fetchRange("meals", userId, startDate, endDate),
    fetchHabitSettings(userId),
  ]);
  return { sets, cardio, logs, meals, pullupTarget: settings.pullup_target };
}

export function classifyDay(dateStr, summary, today = todayStr()) {
  if (dateStr > today) return "future";

  const { sets, cardio, logs, pullupTarget } = summary;
  const daySets = sets.filter((s) => s.date === dateStr);
  const dayCardio = cardio.filter((c) => c.date === dateStr);
  const log = logs.find((l) => l.date === dateStr) ?? null;
  const habitsMetCount = countHabitsMet(log, pullupTarget);
  const hasSets = daySets.length > 0;
  const hasCardio = dayCardio.length > 0;

  if (hasSets && habitsMetCount >= 2) return "full";
  if (!hasSets && hasCardio && habitsMetCount < 2) return "rest";
  if (hasSets || hasCardio || habitsMetCount >= 1) return "partial";
  return "missed";
}

export const STATUS_LABELS = {
  full: "Full day — workout + habits",
  partial: "Partial — some activity logged",
  rest: "Rest day — active recovery",
  missed: "Missed — nothing logged",
  future: "Upcoming",
};

export function buildDayDetail(dateStr, summary, exercisesById) {
  const sets = summary.sets.filter((s) => s.date === dateStr);
  const cardio = summary.cardio.filter((c) => c.date === dateStr);
  const log = summary.logs.find((l) => l.date === dateStr) ?? null;
  const meals = summary.meals.filter((m) => m.date === dateStr);

  const byExercise = new Map();
  for (const s of sets) {
    const name = exercisesById[s.exercise_id]?.name ?? "Unknown exercise";
    if (!byExercise.has(s.exercise_id)) byExercise.set(s.exercise_id, { name, sets: [] });
    byExercise.get(s.exercise_id).sets.push(s);
  }
  for (const group of byExercise.values()) {
    group.sets.sort((a, b) => a.set_number - b.set_number);
  }

  return {
    date: dateStr,
    exerciseGroups: [...byExercise.values()],
    cardio,
    habitLog: log,
    pullupTarget: summary.pullupTarget,
    meals,
  };
}
