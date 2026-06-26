import { supabase } from "./supabase";
import { todayStr, addDaysStr, weekStartStr } from "./dateUtils";
import { fetchHabitLogsInRange, fetchHabitSettings, fetchSwimCountForWeek, habitMet, countHabitsMet, WEEKLY_SWIM_TARGET } from "./habits";

const DAILY_HABITS = ["pushups", "situps", "pullups"];
const AURA = { workout: 50, habit: 20, swimWeekly: 40, streakDay: 10 };
const MAX_BACKFILL_DAYS = 30;
const MAX_BACKFILL_WEEKS = 8;

export async function fetchEconomy(userId) {
  const { data, error } = await supabase.from("user_economy").select("*").eq("user_id", userId).maybeSingle();
  if (error) throw error;
  return (
    data ?? {
      user_id: userId,
      aura_balance: 0,
      prestige_level: 0,
      last_aura_evaluated_date: null,
      today_aura_date: null,
      today_aura_flags: {},
      last_swim_aura_week: null,
      last_prestige_evaluated_week: null,
    }
  );
}

async function saveEconomy(userId, patch) {
  const { data, error } = await supabase
    .from("user_economy")
    .upsert({ user_id: userId, ...patch }, { onConflict: "user_id" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function fetchActivityDates(userId, start, end) {
  const [{ data: sets, error: e1 }, { data: cardio, error: e2 }] = await Promise.all([
    supabase.from("workout_sets").select("date").eq("user_id", userId).gte("date", start).lte("date", end),
    supabase.from("cardio_sessions").select("date").eq("user_id", userId).gte("date", start).lte("date", end),
  ]);
  if (e1) throw e1;
  if (e2) throw e2;
  return new Set([...(sets ?? []).map((r) => r.date), ...(cardio ?? []).map((r) => r.date)]);
}

async function countFullDaysInWeek(userId, weekStart, pullupTarget, today) {
  const weekEnd = addDaysStr(weekStart, 6);
  const [logs, activityDates] = await Promise.all([
    fetchHabitLogsInRange(userId, weekStart, weekEnd),
    fetchActivityDates(userId, weekStart, weekEnd),
  ]);
  const logsByDate = {};
  for (const l of logs) logsByDate[l.date] = l;

  let count = 0;
  for (let i = 0; i < 7; i++) {
    const d = addDaysStr(weekStart, i);
    if (d > today) break;
    const workoutDone = activityDates.has(d);
    const met = countHabitsMet(logsByDate[d] ?? null, pullupTarget);
    if (workoutDone && met >= 2) count++;
  }
  return count;
}

/**
 * Backfills aura/prestige for any unevaluated past days/weeks, then checks
 * "today" / "this week" live. Safe to call on every Dashboard mount.
 */
export async function syncEconomy(userId) {
  const today = todayStr();
  const settings = await fetchHabitSettings(userId);
  const pullupTarget = settings.pullup_target;
  const econ = await fetchEconomy(userId);

  let auraGained = 0;
  let lastAuraDate = econ.last_aura_evaluated_date;

  // ---- Aura: atomic backfill for fully-elapsed past days ----
  let dayCursor = econ.last_aura_evaluated_date ? addDaysStr(econ.last_aura_evaluated_date, 1) : today;
  const dayGap = econ.last_aura_evaluated_date
    ? Math.round((Date.parse(today) - Date.parse(econ.last_aura_evaluated_date)) / 86400000)
    : 0;
  if (dayGap > MAX_BACKFILL_DAYS) dayCursor = addDaysStr(today, -1);

  if (dayCursor < today) {
    const logs = await fetchHabitLogsInRange(userId, dayCursor, addDaysStr(today, -1));
    const logsByDate = {};
    for (const l of logs) logsByDate[l.date] = l;
    const activityDates = await fetchActivityDates(userId, dayCursor, addDaysStr(today, -1));

    while (dayCursor < today) {
      const log = logsByDate[dayCursor] ?? null;
      const workoutDone = activityDates.has(dayCursor);
      const metHabits = DAILY_HABITS.filter((h) => habitMet(h, log, pullupTarget));
      if (workoutDone) auraGained += AURA.workout;
      auraGained += metHabits.length * AURA.habit;
      if (workoutDone && metHabits.length >= 2) auraGained += AURA.streakDay;
      dayCursor = addDaysStr(dayCursor, 1);
    }
    lastAuraDate = addDaysStr(today, -1);
  }

  // ---- Aura: incremental flags for "today" — each component pays once ----
  let flags = econ.today_aura_date === today ? { ...econ.today_aura_flags } : {};
  const todaysLog = (await fetchHabitLogsInRange(userId, today, today))[0] ?? null;
  const todaysActivity = await fetchActivityDates(userId, today, today);
  const workoutDoneToday = todaysActivity.has(today);
  const metToday = DAILY_HABITS.filter((h) => habitMet(h, todaysLog, pullupTarget));

  if (workoutDoneToday && !flags.workout) {
    auraGained += AURA.workout;
    flags.workout = true;
  }
  for (const h of metToday) {
    if (!flags[h]) {
      auraGained += AURA.habit;
      flags[h] = true;
    }
  }
  if (workoutDoneToday && metToday.length >= 2 && !flags.streak) {
    auraGained += AURA.streakDay;
    flags.streak = true;
  }

  // ---- Aura: weekly swim bonus, paid once per week the target is hit ----
  const thisWeekStart = weekStartStr(today);
  let lastSwimAuraWeek = econ.last_swim_aura_week;
  let swimCursor = lastSwimAuraWeek ? addDaysStr(lastSwimAuraWeek, 7) : thisWeekStart;
  const swimWeekGap = lastSwimAuraWeek
    ? Math.round((Date.parse(thisWeekStart) - Date.parse(lastSwimAuraWeek)) / (7 * 86400000))
    : 0;
  if (swimWeekGap > MAX_BACKFILL_WEEKS) swimCursor = thisWeekStart;

  while (swimCursor < thisWeekStart) {
    const count = await fetchSwimCountForWeek(userId, swimCursor);
    if (count >= WEEKLY_SWIM_TARGET) auraGained += AURA.swimWeekly;
    lastSwimAuraWeek = swimCursor;
    swimCursor = addDaysStr(swimCursor, 7);
  }
  if (lastSwimAuraWeek !== thisWeekStart) {
    const count = await fetchSwimCountForWeek(userId, thisWeekStart);
    if (count >= WEEKLY_SWIM_TARGET) {
      auraGained += AURA.swimWeekly;
      lastSwimAuraWeek = thisWeekStart;
    }
  }

  // ---- Prestige: +1/week when a workout + majority-habits day lands on
  // 5+ of that week's 7 days. Never decreases — weeks that miss just don't
  // add anything. ----
  let prestigeGained = 0;
  let prestigeLevel = econ.prestige_level;
  let lastPrestigeWeek = econ.last_prestige_evaluated_week;
  let prestigeCursor = lastPrestigeWeek ? addDaysStr(lastPrestigeWeek, 7) : thisWeekStart;
  const prestigeWeekGap = lastPrestigeWeek
    ? Math.round((Date.parse(thisWeekStart) - Date.parse(lastPrestigeWeek)) / (7 * 86400000))
    : 0;
  if (prestigeWeekGap > MAX_BACKFILL_WEEKS) prestigeCursor = thisWeekStart;

  while (prestigeCursor < thisWeekStart) {
    const fullDays = await countFullDaysInWeek(userId, prestigeCursor, pullupTarget, today);
    if (fullDays >= 5) {
      prestigeLevel += 1;
      prestigeGained += 1;
    }
    lastPrestigeWeek = prestigeCursor;
    prestigeCursor = addDaysStr(prestigeCursor, 7);
  }
  if (lastPrestigeWeek !== thisWeekStart) {
    const fullDays = await countFullDaysInWeek(userId, thisWeekStart, pullupTarget, today);
    if (fullDays >= 5) {
      prestigeLevel += 1;
      prestigeGained += 1;
      lastPrestigeWeek = thisWeekStart;
    }
  }

  const saved = await saveEconomy(userId, {
    aura_balance: econ.aura_balance + auraGained,
    prestige_level: prestigeLevel,
    last_aura_evaluated_date: lastAuraDate,
    today_aura_date: today,
    today_aura_flags: flags,
    last_swim_aura_week: lastSwimAuraWeek,
    last_prestige_evaluated_week: lastPrestigeWeek,
  });

  return { economy: saved, auraGained, prestigeGained };
}

export async function fetchStoreItems() {
  const { data, error } = await supabase
    .from("store_items")
    .select("*")
    .order("required_prestige")
    .order("cost_aura");
  if (error) throw error;
  return data ?? [];
}

export async function fetchOwnedItems(userId) {
  const { data, error } = await supabase.from("owned_items").select("*").eq("user_id", userId);
  if (error) throw error;
  return data ?? [];
}

export async function purchaseItem(userId, item, economy) {
  if (economy.prestige_level < item.required_prestige) {
    throw new Error("Prestige level too low for this item.");
  }
  if (economy.aura_balance < item.cost_aura) {
    throw new Error("Not enough aura.");
  }

  const { error: ownErr } = await supabase.from("owned_items").insert({ user_id: userId, item_id: item.id });
  if (ownErr) {
    if (ownErr.code === "23505") throw new Error("You already own this item.");
    throw ownErr;
  }

  const { data, error } = await supabase
    .from("user_economy")
    .update({ aura_balance: economy.aura_balance - item.cost_aura })
    .eq("user_id", userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
