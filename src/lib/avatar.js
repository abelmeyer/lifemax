import { supabase } from "./supabase";
import { todayStr, addDaysStr, weekStartStr } from "./dateUtils";
import {
  fetchHabitLogsInRange,
  fetchHabitSettings,
  fetchHabitStreaks,
  upsertHabitStreak,
  habitMet,
  WEEKLY_SWIM_TARGET,
} from "./habits";
import { fetchTrainingActivity, fetchSwimDates, isActiveDay, serialized } from "./activity";
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

function sameStreak(a, b) {
  return (
    (a?.current_streak ?? 0) === (b?.current_streak ?? 0) &&
    (a?.best_streak ?? 0) === (b?.best_streak ?? 0) &&
    (a?.last_completed ?? null) === (b?.last_completed ?? null)
  );
}

/**
 * Backfills any unevaluated past days/weeks since the last visit, then
 * checks "today" / "this week" live. Safe to call on every Dashboard or
 * Habits mount — fully idempotent within the same day/week, and serialized
 * so overlapping calls can't race their writes.
 *
 * Three round trips regardless of how much there is to backfill: current
 * state, then every range it implies in one parallel batch, then only the
 * rows that actually changed.
 */
export const syncAvatarProgress = serialized(async function syncAvatarProgress(userId) {
  const today = todayStr();
  const yesterday = addDaysStr(today, -1);
  const thisWeekStart = weekStartStr(today);

  const [settings, fetchedState, fetchedStreaks] = await Promise.all([
    fetchHabitSettings(userId),
    fetchAvatarState(userId),
    fetchHabitStreaks(userId),
  ]);
  const pullupTarget = settings.pullup_target;

  let avatarState = fetchedState;
  const habitStreaks = { ...fetchedStreaks };
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
    cursor = yesterday;
  }

  // Weekly swim streak window, decided up front so its sessions load in the
  // same batch as everything else.
  const swimStreak = habitStreaks.swims;
  let swimCursor = swimStreak.last_completed ? addDaysStr(swimStreak.last_completed, 7) : thisWeekStart;
  const weekGap = swimStreak.last_completed
    ? Math.round((Date.parse(thisWeekStart) - Date.parse(swimStreak.last_completed)) / (7 * 86400000))
    : 0;
  if (weekGap > MAX_BACKFILL_WEEKS) {
    habitStreaks.swims = { ...swimStreak, current_streak: 0 };
    swimCursor = thisWeekStart;
  }

  const dayStart = cursor < today ? cursor : today;
  const swimStart = swimCursor < thisWeekStart ? swimCursor : thisWeekStart;
  const [logs, activity, swimDates] = await Promise.all([
    fetchHabitLogsInRange(userId, dayStart, today),
    fetchTrainingActivity(userId, dayStart, today),
    fetchSwimDates(userId, swimStart, addDaysStr(thisWeekStart, 6)),
  ]);
  const logsByDate = {};
  for (const log of logs) logsByDate[log.date] = log;
  const swimsByWeek = {};
  for (const d of swimDates) {
    const w = weekStartStr(d);
    swimsByWeek[w] = (swimsByWeek[w] ?? 0) + 1;
  }

  let leveledUpToday = false;

  if (cursor < today) {
    while (cursor < today) {
      const log = logsByDate[cursor] ?? null;
      // An active day (lift, cardio, or any habit at target) extends the
      // streak and levels up; anything else resets the streak and levels down.
      const success = isActiveDay(activity, cursor, log, pullupTarget);

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
    avatarState = { ...avatarState, last_evaluated_date: yesterday };
  }

  const todaysLog = logsByDate[today] ?? null;

  // Live check for "today" — only commits once per day, but is safe to
  // re-run repeatedly before that (it just won't have flipped yet).
  if (avatarState.last_evaluated_date !== today && isActiveDay(activity, today, todaysLog, pullupTarget)) {
    avatarState = {
      ...avatarState,
      level: avatarState.level + 1,
      streak: avatarState.streak + 1,
      last_evaluated_date: today,
      last_progress_date: today,
    };
    leveledUpToday = true;
  }

  // Per-habit "today" streak bump — independent of avatar-level gating,
  // and idempotent (guarded by last_completed already being today).
  for (const h of DAILY_HABITS) {
    const streak = habitStreaks[h];
    if (streak.last_completed === today) continue;
    if (habitMet(h, todaysLog, pullupTarget)) {
      habitStreaks[h] = applyStreakStep(streak, true, today, yesterday);
    }
  }

  // Weekly swim streak, evaluated the same way at week granularity.
  while (swimCursor < thisWeekStart) {
    const met = (swimsByWeek[swimCursor] ?? 0) >= WEEKLY_SWIM_TARGET;
    habitStreaks.swims = applyStreakStep(habitStreaks.swims, met, swimCursor, addDaysStr(swimCursor, -7));
    swimCursor = addDaysStr(swimCursor, 7);
  }
  if (habitStreaks.swims.last_completed !== thisWeekStart && (swimsByWeek[thisWeekStart] ?? 0) >= WEEKLY_SWIM_TARGET) {
    habitStreaks.swims = applyStreakStep(habitStreaks.swims, true, thisWeekStart, addDaysStr(thisWeekStart, -7));
  }

  // Most visits change nothing — skip the writes entirely then.
  const stateChanged =
    avatarState.level !== fetchedState.level ||
    avatarState.streak !== fetchedState.streak ||
    avatarState.last_progress_date !== fetchedState.last_progress_date ||
    avatarState.last_evaluated_date !== fetchedState.last_evaluated_date;
  const changedStreaks = Object.entries(habitStreaks).filter(([habit, s]) => !sameStreak(s, startingStreaks[habit]));

  const [savedState] = await Promise.all([
    stateChanged
      ? saveAvatarState(userId, {
          level: avatarState.level,
          streak: avatarState.streak,
          last_progress_date: avatarState.last_progress_date,
          last_evaluated_date: avatarState.last_evaluated_date,
        })
      : avatarState,
    ...changedStreaks.map(([habit, s]) =>
      upsertHabitStreak(userId, habit, {
        currentStreak: s.current_streak,
        bestStreak: s.best_streak,
        lastCompleted: s.last_completed,
      }),
    ),
  ]);

  const unlockedGear = getNewlyUnlockedGear(startingStreaks, habitStreaks);

  return { avatarState: savedState, habitStreaks, leveledUpToday, unlockedGear };
});
