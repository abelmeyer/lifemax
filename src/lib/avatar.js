import { supabase } from "./supabase";
import { todayStr, addDaysStr, weekStartStr } from "./dateUtils";
import {
  fetchHabitLogsInRange,
  fetchHabitSettings,
  fetchHabitStreaks,
  upsertHabitStreak,
  fetchSwimCountForWeek,
  habitMet,
  countHabitsMet,
  WEEKLY_SWIM_TARGET,
} from "./habits";
import { getNewlyUnlockedGear } from "./avatarConfig";

const DAILY_HABITS = ["pushups", "situps", "pullups"];
const MAX_BACKFILL_DAYS = 30;
const MAX_BACKFILL_WEEKS = 8;

export async function fetchAvatarState(userId) {
  const { data, error } = await supabase
    .from("avatar_state")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return (
    data ?? {
      user_id: userId,
      level: 1,
      streak: 0,
      last_progress_date: null,
      last_evaluated_date: null,
    }
  );
}

async function saveAvatarState(userId, patch) {
  const { data, error } = await supabase
    .from("avatar_state")
    .upsert({ user_id: userId, ...patch }, { onConflict: "user_id" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function fetchActivityDates(userId, start, end) {
  const [{ data: setsData, error: e1 }, { data: cardioData, error: e2 }] = await Promise.all([
    supabase.from("workout_sets").select("date").eq("user_id", userId).gte("date", start).lte("date", end),
    supabase.from("cardio_sessions").select("date").eq("user_id", userId).gte("date", start).lte("date", end),
  ]);
  if (e1) throw e1;
  if (e2) throw e2;
  return new Set([...(setsData ?? []).map((r) => r.date), ...(cardioData ?? []).map((r) => r.date)]);
}

function applyStreakStep(streak, met, dateLabel, prevDateLabel) {
  if (!met) {
    return { current_streak: 0, best_streak: streak.best_streak ?? 0, last_completed: streak.last_completed };
  }
  const continued = streak.last_completed === prevDateLabel;
  const current = continued ? (streak.current_streak ?? 0) + 1 : 1;
  return {
    current_streak: current,
    best_streak: Math.max(streak.best_streak ?? 0, current),
    last_completed: dateLabel,
  };
}

/**
 * Backfills any unevaluated past days/weeks since the last visit, then
 * checks "today" / "this week" live. Safe to call on every Dashboard or
 * Habits mount — fully idempotent within the same day/week.
 */
export async function syncAvatarProgress(userId) {
  const today = todayStr();
  const settings = await fetchHabitSettings(userId);
  const pullupTarget = settings.pullup_target;

  let avatarState = await fetchAvatarState(userId);
  let habitStreaks = await fetchHabitStreaks(userId);
  for (const h of [...DAILY_HABITS, "swims"]) {
    if (!habitStreaks[h]) {
      habitStreaks[h] = { habit: h, current_streak: 0, best_streak: 0, last_completed: null };
    }
  }
  const startingStreaks = JSON.parse(JSON.stringify(habitStreaks));

  let cursor = avatarState.last_evaluated_date ? addDaysStr(avatarState.last_evaluated_date, 1) : today;
  const gapDays = avatarState.last_evaluated_date
    ? Math.round((Date.parse(today) - Date.parse(avatarState.last_evaluated_date)) / 86400000)
    : 0;

  if (gapDays > MAX_BACKFILL_DAYS) {
    // Too long a gap to walk day-by-day — apply a single reset instead.
    avatarState = { ...avatarState, streak: 0, level: Math.max(1, avatarState.level - 1) };
    for (const h of DAILY_HABITS) {
      habitStreaks[h] = { ...habitStreaks[h], current_streak: 0 };
    }
    cursor = addDaysStr(today, -1);
  }

  let leveledUpToday = false;

  if (cursor < today) {
    const logs = await fetchHabitLogsInRange(userId, cursor, addDaysStr(today, -1));
    const logsByDate = {};
    for (const log of logs) logsByDate[log.date] = log;
    const activityDates = await fetchActivityDates(userId, cursor, addDaysStr(today, -1));

    while (cursor < today) {
      const log = logsByDate[cursor] ?? null;
      const workoutDone = activityDates.has(cursor);
      const habitsMetCount = countHabitsMet(log, pullupTarget);
      const success = workoutDone && habitsMetCount >= 2;

      if (success) {
        avatarState = { ...avatarState, level: avatarState.level + 1, streak: avatarState.streak + 1 };
      } else {
        avatarState = { ...avatarState, level: Math.max(1, avatarState.level - 1), streak: 0 };
      }

      const prevDay = addDaysStr(cursor, -1);
      for (const h of DAILY_HABITS) {
        habitStreaks[h] = { ...habitStreaks[h], ...applyStreakStep(habitStreaks[h], habitMet(h, log, pullupTarget), cursor, prevDay) };
      }

      cursor = addDaysStr(cursor, 1);
    }

    // Mark everything through yesterday as settled. Without this, calling
    // syncAvatarProgress again before today's criteria is met (e.g.
    // visiting Habits, then Dashboard, then Workouts in the same day) would
    // re-walk this same backfill range and re-apply its level/streak
    // change on every call.
    avatarState = { ...avatarState, last_evaluated_date: addDaysStr(today, -1) };
  }

  const todaysLog = (await fetchHabitLogsInRange(userId, today, today))[0] ?? null;

  // Live check for "today" — only commits once per day, but is safe to
  // re-run repeatedly before that (it just won't have flipped yet).
  if (avatarState.last_evaluated_date !== today) {
    const activityDates = await fetchActivityDates(userId, today, today);
    const workoutDone = activityDates.has(today);
    const habitsMetCount = countHabitsMet(todaysLog, pullupTarget);
    const success = workoutDone && habitsMetCount >= 2;

    if (success) {
      avatarState = {
        ...avatarState,
        level: avatarState.level + 1,
        streak: avatarState.streak + 1,
        last_evaluated_date: today,
        last_progress_date: today,
      };
      leveledUpToday = true;
    }
  }

  // Per-habit "today" streak bump — independent of avatar-level gating,
  // and idempotent (guarded by last_completed already being today).
  const yesterday = addDaysStr(today, -1);
  for (const h of DAILY_HABITS) {
    const streak = habitStreaks[h];
    if (streak.last_completed === today) continue;
    if (habitMet(h, todaysLog, pullupTarget)) {
      habitStreaks[h] = applyStreakStep(streak, true, today, yesterday);
    }
  }

  // Weekly swim streak, evaluated the same way at week granularity.
  const swimStreak = habitStreaks.swims;
  const thisWeekStart = weekStartStr(today);
  let swimCursor = swimStreak.last_completed ? addDaysStr(swimStreak.last_completed, 7) : thisWeekStart;
  const weekGap = swimStreak.last_completed
    ? Math.round((Date.parse(thisWeekStart) - Date.parse(swimStreak.last_completed)) / (7 * 86400000))
    : 0;
  if (weekGap > MAX_BACKFILL_WEEKS) {
    habitStreaks.swims = { ...swimStreak, current_streak: 0 };
    swimCursor = thisWeekStart;
  }
  while (swimCursor < thisWeekStart) {
    const count = await fetchSwimCountForWeek(userId, swimCursor);
    const met = count >= WEEKLY_SWIM_TARGET;
    const prevWeek = addDaysStr(swimCursor, -7);
    habitStreaks.swims = applyStreakStep(habitStreaks.swims, met, swimCursor, prevWeek);
    swimCursor = addDaysStr(swimCursor, 7);
  }
  if (habitStreaks.swims.last_completed !== thisWeekStart) {
    const count = await fetchSwimCountForWeek(userId, thisWeekStart);
    if (count >= WEEKLY_SWIM_TARGET) {
      const prevWeek = addDaysStr(thisWeekStart, -7);
      habitStreaks.swims = applyStreakStep(habitStreaks.swims, true, thisWeekStart, prevWeek);
    }
  }

  const savedState = await saveAvatarState(userId, {
    level: avatarState.level,
    streak: avatarState.streak,
    last_progress_date: avatarState.last_progress_date,
    last_evaluated_date: avatarState.last_evaluated_date,
  });

  await Promise.all(
    Object.entries(habitStreaks).map(([habit, s]) =>
      upsertHabitStreak(userId, habit, {
        currentStreak: s.current_streak,
        bestStreak: s.best_streak,
        lastCompleted: s.last_completed,
      }),
    ),
  );

  const unlockedGear = getNewlyUnlockedGear(startingStreaks, habitStreaks);

  return { avatarState: savedState, habitStreaks, leveledUpToday, unlockedGear };
}
