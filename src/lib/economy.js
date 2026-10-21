import { supabase } from "./supabase";
import { todayStr, addDaysStr, weekStartStr } from "./dateUtils";
import { fetchHabitLogsInRange, fetchHabitSettings, habitMet, countHabitsMet, WEEKLY_SWIM_TARGET } from "./habits";
import { fetchTrainingActivity, fetchSwimDates, workedOutOn, serialized } from "./activity";

const DAILY_HABITS = ["pushups", "situps", "pullups"];
const AURA = { workout: 50, habit: 20, swimWeekly: 40, streakDay: 10 };
const MAX_BACKFILL_DAYS = 30;
const MAX_BACKFILL_WEEKS = 8;

// Prestige: +1 for a week with 3+ lifting sessions (days with a logged set)
// and 2+ cardio sessions. Never decreases.
export const PRESTIGE_LIFTS_NEEDED = 3;
export const PRESTIGE_CARDIO_NEEDED = 2;
// The lifts + cardio rule took effect the week of 2026-10-19 (a Monday).
// A week is judged by the rule that was live while it happened: an older
// week that was never evaluated (the app wasn't opened) still gets the
// legacy 5-of-7 rule, so the cutover can neither grant nor withhold prestige
// for a week retroactively. Weeks already evaluated are never revisited.
const PRESTIGE_V2_FIRST_WEEK = "2026-10-19";
const LEGACY_PRESTIGE_DAYS_NEEDED = 5;

// Aura earned today, derived from the same per-component flags syncEconomy
// uses to pay out incrementally. Lets the Dashboard show a running "today"
// total without a separate persisted counter.
export function getTodaysAuraEarned(economy) {
  const flags = economy.today_aura_date === todayStr() ? economy.today_aura_flags ?? {} : {};
  let total = 0;
  if (flags.workout) total += AURA.workout;
  for (const h of DAILY_HABITS) if (flags[h]) total += AURA.habit;
  if (flags.streak) total += AURA.streakDay;
  return total;
}

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

// The pure rules below read from one pre-fetched activity window rather than
// querying per week, so a multi-week backfill costs no extra round trips.

// Legacy (pre-2026-10-19) prestige rule: days with a workout and 2+ habits.
function countFullDaysInWeek(activity, logsByDate, weekStart, pullupTarget, today) {
  let count = 0;
  for (let i = 0; i < 7; i++) {
    const d = addDaysStr(weekStart, i);
    if (d > today) break;
    if (workedOutOn(activity, d) && countHabitsMet(logsByDate[d] ?? null, pullupTarget) >= 2) count++;
  }
  return count;
}

// Lifting sessions (distinct days with a set) and cardio sessions (rows) in
// a Monday-start week, through today.
function countWeekTraining(activity, weekStart, today) {
  let lifts = 0;
  let cardio = 0;
  for (let i = 0; i < 7; i++) {
    const d = addDaysStr(weekStart, i);
    if (d > today) break;
    if (activity.liftDates.has(d)) lifts++;
    cardio += activity.cardioByDate.get(d) ?? 0;
  }
  return { lifts, cardio };
}

function meetsPrestigeTarget({ lifts, cardio }) {
  return lifts >= PRESTIGE_LIFTS_NEEDED && cardio >= PRESTIGE_CARDIO_NEEDED;
}

function weekEarnsPrestige(activity, logsByDate, weekStart, pullupTarget, today) {
  if (weekStart < PRESTIGE_V2_FIRST_WEEK) {
    return countFullDaysInWeek(activity, logsByDate, weekStart, pullupTarget, today) >= LEGACY_PRESTIGE_DAYS_NEEDED;
  }
  return meetsPrestigeTarget(countWeekTraining(activity, weekStart, today));
}

function minDate(...dates) {
  return dates.filter(Boolean).reduce((a, b) => (b < a ? b : a));
}

/**
 * Backfills aura/prestige for any unevaluated past days/weeks, then checks
 * "today" / "this week" live. Safe to call on every Dashboard mount, and
 * serialized so overlapping calls can't both pay out from the same balance.
 *
 * Three round trips: current state, every window it implies in one parallel
 * batch, then a single write — skipped when nothing changed.
 */
export const syncEconomy = serialized(async function syncEconomy(userId) {
  const today = todayStr();
  const yesterday = addDaysStr(today, -1);
  const thisWeekStart = weekStartStr(today);
  const [settings, econ] = await Promise.all([fetchHabitSettings(userId), fetchEconomy(userId)]);
  const pullupTarget = settings.pullup_target;

  // ---- Work out every window first, so they can all load at once ----
  let dayCursor = econ.last_aura_evaluated_date ? addDaysStr(econ.last_aura_evaluated_date, 1) : today;
  const dayGap = econ.last_aura_evaluated_date
    ? Math.round((Date.parse(today) - Date.parse(econ.last_aura_evaluated_date)) / 86400000)
    : 0;
  if (dayGap > MAX_BACKFILL_DAYS) dayCursor = yesterday;

  let lastSwimAuraWeek = econ.last_swim_aura_week;
  let swimCursor = lastSwimAuraWeek ? addDaysStr(lastSwimAuraWeek, 7) : thisWeekStart;
  const swimWeekGap = lastSwimAuraWeek
    ? Math.round((Date.parse(thisWeekStart) - Date.parse(lastSwimAuraWeek)) / (7 * 86400000))
    : 0;
  if (swimWeekGap > MAX_BACKFILL_WEEKS) swimCursor = thisWeekStart;

  // Never evaluated before: settle every earlier week as-is and start
  // tracking from this one. Without a baseline the backfill below has
  // nothing to resume from, so a week completed on Sunday and first seen on
  // Monday would be skipped for good.
  let lastPrestigeWeek = econ.last_prestige_evaluated_week ?? addDaysStr(thisWeekStart, -7);
  let prestigeCursor = addDaysStr(lastPrestigeWeek, 7);
  const prestigeWeekGap = Math.round((Date.parse(thisWeekStart) - Date.parse(lastPrestigeWeek)) / (7 * 86400000));
  if (prestigeWeekGap > MAX_BACKFILL_WEEKS) prestigeCursor = thisWeekStart;

  const auraBackfill = dayCursor < today;
  const prestigeBackfill = prestigeCursor < thisWeekStart;
  // Habit logs only matter for aura days and legacy-rule prestige weeks.
  const legacyWeeks = prestigeBackfill && prestigeCursor < PRESTIGE_V2_FIRST_WEEK;
  const activityStart = minDate(auraBackfill && dayCursor, prestigeBackfill && prestigeCursor, thisWeekStart, today);
  const logsStart = minDate(auraBackfill && dayCursor, legacyWeeks && prestigeCursor, today);

  const [logs, activity, swimDates] = await Promise.all([
    fetchHabitLogsInRange(userId, logsStart, today),
    fetchTrainingActivity(userId, activityStart, today),
    fetchSwimDates(userId, minDate(swimCursor, thisWeekStart), addDaysStr(thisWeekStart, 6)),
  ]);
  const logsByDate = {};
  for (const l of logs) logsByDate[l.date] = l;
  const swimsByWeek = {};
  for (const d of swimDates) {
    const w = weekStartStr(d);
    swimsByWeek[w] = (swimsByWeek[w] ?? 0) + 1;
  }

  let auraGained = 0;
  let lastAuraDate = econ.last_aura_evaluated_date;

  // ---- Aura: atomic backfill for fully-elapsed past days ----
  if (auraBackfill) {
    while (dayCursor < today) {
      const log = logsByDate[dayCursor] ?? null;
      const workoutDone = workedOutOn(activity, dayCursor);
      const metHabits = DAILY_HABITS.filter((h) => habitMet(h, log, pullupTarget));
      if (workoutDone) auraGained += AURA.workout;
      auraGained += metHabits.length * AURA.habit;
      if (workoutDone && metHabits.length >= 2) auraGained += AURA.streakDay;
      dayCursor = addDaysStr(dayCursor, 1);
    }
    lastAuraDate = yesterday;
  }

  // ---- Aura: incremental flags for "today" — each component pays once ----
  const flags = econ.today_aura_date === today ? { ...econ.today_aura_flags } : {};
  const todaysLog = logsByDate[today] ?? null;
  const workoutDoneToday = workedOutOn(activity, today);
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
  while (swimCursor < thisWeekStart) {
    if ((swimsByWeek[swimCursor] ?? 0) >= WEEKLY_SWIM_TARGET) auraGained += AURA.swimWeekly;
    lastSwimAuraWeek = swimCursor;
    swimCursor = addDaysStr(swimCursor, 7);
  }
  if (lastSwimAuraWeek !== thisWeekStart && (swimsByWeek[thisWeekStart] ?? 0) >= WEEKLY_SWIM_TARGET) {
    auraGained += AURA.swimWeekly;
    lastSwimAuraWeek = thisWeekStart;
  }

  // ---- Prestige: +1/week for 3+ lifting and 2+ cardio sessions (legacy
  // 5-of-7 rule for weeks before the cutover). Never decreases — weeks that
  // miss just don't add anything. ----
  let prestigeGained = 0;
  let prestigeLevel = econ.prestige_level;
  while (prestigeCursor < thisWeekStart) {
    if (weekEarnsPrestige(activity, logsByDate, prestigeCursor, pullupTarget, today)) {
      prestigeLevel += 1;
      prestigeGained += 1;
    }
    lastPrestigeWeek = prestigeCursor;
    prestigeCursor = addDaysStr(prestigeCursor, 7);
  }

  // Always compute this week's progress live — both to decide whether to
  // award prestige now, and so the Dashboard can show an accurate
  // progress bar even after the award already landed this week.
  const week = countWeekTraining(activity, thisWeekStart, today);
  const metThisWeek = meetsPrestigeTarget(week);
  if (lastPrestigeWeek !== thisWeekStart && metThisWeek) {
    prestigeLevel += 1;
    prestigeGained += 1;
    lastPrestigeWeek = thisWeekStart;
  }

  const patch = {
    aura_balance: econ.aura_balance + auraGained,
    prestige_level: prestigeLevel,
    last_aura_evaluated_date: lastAuraDate,
    today_aura_date: today,
    today_aura_flags: flags,
    last_swim_aura_week: lastSwimAuraWeek,
    last_prestige_evaluated_week: lastPrestigeWeek,
  };
  // Most visits change nothing — skip the write entirely then.
  const unchanged =
    Object.entries(patch).every(([k, v]) => k === "today_aura_flags" || econ[k] === v) &&
    JSON.stringify(flags) === JSON.stringify(econ.today_aura_flags ?? {});
  const saved = unchanged ? econ : await saveEconomy(userId, patch);

  return {
    economy: saved,
    auraGained,
    prestigeGained,
    weekProgress: {
      lifts: Math.min(week.lifts, PRESTIGE_LIFTS_NEEDED),
      liftsNeeded: PRESTIGE_LIFTS_NEEDED,
      cardio: Math.min(week.cardio, PRESTIGE_CARDIO_NEEDED),
      cardioNeeded: PRESTIGE_CARDIO_NEEDED,
      // Awarded stays complete even if a set is later deleted — prestige
      // never comes back off.
      complete: metThisWeek || lastPrestigeWeek === thisWeekStart,
    },
  };
});

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

// Equips an item, unequipping any other owned item that shares its slot
// (store_items.category) — only one item per slot can be equipped at once.
// allItems is the full store catalog, used to resolve which other item ids
// share this item's slot without a join.
export async function equipItem(userId, item, allItems) {
  const sameSlotIds = allItems.filter((i) => i.category === item.category && i.id !== item.id).map((i) => i.id);

  if (sameSlotIds.length > 0) {
    const { error: unequipErr } = await supabase
      .from("owned_items")
      .update({ equipped: false })
      .eq("user_id", userId)
      .in("item_id", sameSlotIds);
    if (unequipErr) throw unequipErr;
  }

  const { data, error } = await supabase
    .from("owned_items")
    .update({ equipped: true })
    .eq("user_id", userId)
    .eq("item_id", item.id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function unequipItem(userId, item) {
  const { data, error } = await supabase
    .from("owned_items")
    .update({ equipped: false })
    .eq("user_id", userId)
    .eq("item_id", item.id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Full store_items rows for whatever this user currently has equipped —
// what the avatar renders as cosmetic layers.
// One round trip: the owned_items -> store_items foreign key lets PostgREST
// embed the item rows directly.
export async function fetchEquippedItems(userId) {
  const { data, error } = await supabase
    .from("owned_items")
    .select("store_items(*)")
    .eq("user_id", userId)
    .eq("equipped", true);
  if (error) throw error;
  return (data ?? []).map((r) => r.store_items).filter(Boolean);
}
