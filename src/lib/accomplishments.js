import { supabase } from "./supabase";
import { todayStr } from "./dateUtils";
import { getStageForLevel } from "./avatarConfig";
import { gratitudeStreak, isComplete as gratitudeComplete } from "./gratitude";
import { summarizeAllBouts } from "./workoutSession";
import { fetchHabitSettings, DEFAULT_PULLUP_TARGET } from "./habits";

const MISSING_TABLE_CODES = new Set(["42P01", "PGRST205", "PGRST202"]);

function isMissingTable(error) {
  return MISSING_TABLE_CODES.has(error?.code);
}

export const TIERS = {
  bronze: { label: "Bronze", color: "#c08457", glow: "rgba(192,132,87,0.3)" },
  silver: { label: "Silver", color: "#b9bec8", glow: "rgba(185,190,200,0.3)" },
  gold: { label: "Gold", color: "#e3bd54", glow: "rgba(227,189,84,0.32)" },
  platinum: { label: "Platinum", color: "#9fd4ff", glow: "rgba(159,212,255,0.35)" },
};

export const CATEGORIES = ["Training", "Habits", "Consistency", "Avatar", "Mind"];

// The catalog lives in code, not the database: adding an achievement is a
// deploy, never a migration. Each check() receives the stats bundle built by
// buildStats() below and must be a pure, cheap predicate.
export const ACHIEVEMENTS = [
  // ---- Training ----
  {
    id: "first_workout",
    name: "First Blood",
    description: "Log your very first set.",
    category: "Training",
    tier: "bronze",
    check: (s) => s.totalSets >= 1,
  },
  {
    id: "first_pr",
    name: "Personal Best",
    description: "Beat your own heaviest set on any lift.",
    category: "Training",
    tier: "bronze",
    check: (s) => s.prCount >= 1,
  },
  {
    id: "workout_days_10",
    name: "Regular",
    description: "Train on 10 separate days.",
    category: "Training",
    tier: "bronze",
    check: (s) => s.workoutDays >= 10,
  },
  {
    id: "workout_days_50",
    name: "Committed",
    description: "Train on 50 separate days.",
    category: "Training",
    tier: "silver",
    check: (s) => s.workoutDays >= 50,
  },
  {
    id: "workout_days_100",
    name: "Centurion",
    description: "Train on 100 separate days.",
    category: "Training",
    tier: "gold",
    check: (s) => s.workoutDays >= 100,
  },
  {
    id: "sets_100",
    name: "Century",
    description: "Log 100 sets.",
    category: "Training",
    tier: "bronze",
    check: (s) => s.totalSets >= 100,
  },
  {
    id: "sets_500",
    name: "Five Hundred",
    description: "Log 500 sets.",
    category: "Training",
    tier: "silver",
    check: (s) => s.totalSets >= 500,
  },
  {
    id: "volume_10k",
    name: "Ten Thousand Pounds",
    description: "Move 10,000 lbs in a single session.",
    category: "Training",
    tier: "silver",
    check: (s) => s.bestSessionVolume >= 10000,
  },
  {
    id: "volume_100k",
    name: "Six Figures",
    description: "Move 100,000 lbs in total.",
    category: "Training",
    tier: "gold",
    check: (s) => s.totalVolume >= 100000,
  },
  {
    id: "session_60",
    name: "The Long Haul",
    description: "Train for over an hour in one session.",
    category: "Training",
    tier: "bronze",
    check: (s) => s.longestSessionSeconds >= 3600,
  },
  {
    id: "early_bird",
    name: "Dawn Patrol",
    description: "Start a workout before 6am.",
    category: "Training",
    tier: "silver",
    check: (s) => s.earliestStartHour !== null && s.earliestStartHour < 6,
  },
  {
    id: "night_owl",
    name: "Midnight Oil",
    description: "Log a set after 10pm.",
    category: "Training",
    tier: "silver",
    check: (s) => s.latestSetHour !== null && s.latestSetHour >= 22,
  },

  // ---- Habits ----
  {
    id: "habits_full_day",
    name: "Triple Threat",
    description: "Hit all three daily habit targets in one day.",
    category: "Habits",
    tier: "bronze",
    check: (s) => s.bestDailyHabitsMet >= 3,
  },
  {
    id: "pushup_streak_7",
    name: "Push Through",
    description: "Seven days straight of pushups.",
    category: "Habits",
    tier: "silver",
    check: (s) => s.bestStreaks.pushups >= 7,
  },
  {
    id: "situp_streak_7",
    name: "Core Values",
    description: "Seven days straight of situps.",
    category: "Habits",
    tier: "silver",
    check: (s) => s.bestStreaks.situps >= 7,
  },
  {
    id: "pullup_streak_7",
    name: "Dead Hang Hero",
    description: "Seven days straight of pullups.",
    category: "Habits",
    tier: "silver",
    check: (s) => s.bestStreaks.pullups >= 7,
  },
  {
    id: "swim_streak_4",
    name: "Amphibious",
    description: "Hit the weekly swim target four weeks running.",
    category: "Habits",
    tier: "gold",
    check: (s) => s.bestStreaks.swims >= 4,
  },

  // ---- Consistency ----
  {
    id: "streak_3",
    name: "Three in a Row",
    description: "A three-day full-completion streak.",
    category: "Consistency",
    tier: "bronze",
    check: (s) => s.bestAvatarStreak >= 3,
  },
  {
    id: "streak_7",
    name: "Perfect Week",
    description: "A seven-day full-completion streak.",
    category: "Consistency",
    tier: "silver",
    check: (s) => s.bestAvatarStreak >= 7,
  },
  {
    id: "streak_30",
    name: "Unbreakable",
    description: "A thirty-day full-completion streak.",
    category: "Consistency",
    tier: "platinum",
    check: (s) => s.bestAvatarStreak >= 30,
  },
  {
    id: "prestige_1",
    name: "Prestige",
    description: "Earn your first prestige level.",
    category: "Consistency",
    tier: "silver",
    check: (s) => s.prestige >= 1,
  },
  {
    id: "prestige_5",
    name: "Veteran",
    description: "Reach prestige 5.",
    category: "Consistency",
    tier: "gold",
    check: (s) => s.prestige >= 5,
  },

  // ---- Avatar ----
  {
    id: "level_10",
    name: "Double Digits",
    description: "Reach avatar level 10.",
    category: "Avatar",
    tier: "bronze",
    check: (s) => s.level >= 10,
  },
  {
    id: "peak_form",
    name: "Peak Form",
    description: "Evolve your avatar to its final stage.",
    category: "Avatar",
    tier: "platinum",
    check: (s) => getStageForLevel(s.level) >= 6,
  },
  {
    id: "first_purchase",
    name: "Drip",
    description: "Buy your first item from the store.",
    category: "Avatar",
    tier: "bronze",
    check: (s) => s.ownedItems >= 1,
  },
  {
    id: "fully_kitted",
    name: "Fully Kitted",
    description: "Own five or more store items.",
    category: "Avatar",
    tier: "gold",
    check: (s) => s.ownedItems >= 5,
  },

  // ---- Mind ----
  {
    id: "gratitude_first",
    name: "Grateful",
    description: "Write three things you're grateful for.",
    category: "Mind",
    tier: "bronze",
    check: (s) => s.gratitudeCompleteDays >= 1,
  },
  {
    id: "gratitude_7",
    name: "Seven Days of Thanks",
    description: "A seven-day gratitude streak.",
    category: "Mind",
    tier: "silver",
    check: (s) => s.bestGratitudeStreak >= 7,
  },
  {
    id: "gratitude_30",
    name: "Thirty Days of Thanks",
    description: "A thirty-day gratitude streak.",
    category: "Mind",
    tier: "platinum",
    check: (s) => s.bestGratitudeStreak >= 30,
  },
  {
    id: "first_photo",
    name: "Say Cheese",
    description: "Take your first progress photo.",
    category: "Mind",
    tier: "bronze",
    check: (s) => s.photos >= 1,
  },
  {
    id: "photos_10",
    name: "Time Lapse",
    description: "Ten progress photos on the record.",
    category: "Mind",
    tier: "silver",
    check: (s) => s.photos >= 10,
  },
];

export const ACHIEVEMENTS_BY_ID = Object.fromEntries(ACHIEVEMENTS.map((a) => [a.id, a]));

// ---- Stats ----

// Longest run of consecutive `true` days, given a set of qualifying date
// strings. Used for streak achievements that must survive a later break:
// the live streak counters reset to 0, but "you once did 7 in a row" is a
// permanent fact, so it's recomputed from history rather than read off
// habit_streaks.current_streak.
function longestRun(dateStrings) {
  const dates = [...new Set(dateStrings)].sort();
  let best = 0;
  let run = 0;
  let prev = null;
  for (const d of dates) {
    if (prev !== null) {
      const gapDays = Math.round((Date.parse(d) - Date.parse(prev)) / 86400000);
      run = gapDays === 1 ? run + 1 : 1;
    } else {
      run = 1;
    }
    best = Math.max(best, run);
    prev = d;
  }
  return best;
}

// PostgREST caps a response at 1000 rows by default and gives no indication
// it truncated, which would silently freeze every count-based badge once the
// history got long. Page explicitly instead.
const PAGE_SIZE = 1000;
const MAX_ROWS = 50_000;

async function safeSelectAll(table, columns, userId, orderColumn = "date") {
  const rows = [];
  for (let from = 0; from < MAX_ROWS; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from(table)
      .select(columns)
      .eq("user_id", userId)
      .order(orderColumn, { ascending: true })
      .range(from, from + PAGE_SIZE - 1);
    if (error) {
      if (isMissingTable(error)) return [];
      throw error;
    }
    const page = data ?? [];
    rows.push(...page);
    if (page.length < PAGE_SIZE) break;
  }
  return rows;
}

export async function buildStats(userId, { avatarState, economy, habitStreaks, pullupTarget } = {}) {
  const [sets, habitLogs, gratitude, photos, owned, settings] = await Promise.all([
    safeSelectAll("workout_sets", "exercise_id,date,weight_lbs,reps,created_at", userId),
    safeSelectAll("habit_logs", "date,pushups,situps,pullups", userId),
    safeSelectAll("gratitude_entries", "date,items", userId),
    safeSelectAll("photos", "date", userId),
    safeSelectAll("owned_items", "item_id", userId, "item_id"),
    // The caller usually has this already, but two of the three call sites
    // don't pass it. Defaulting to 10 there awarded pullup badges to anyone
    // whose real target is higher — and an accomplishments row can never be
    // revoked, so the wrong award is permanent.
    pullupTarget == null ? fetchHabitSettings(userId).catch(() => null) : null,
  ]);
  const resolvedPullupTarget = pullupTarget ?? settings?.pullup_target ?? DEFAULT_PULLUP_TARGET;

  // Per-day session shape.
  const setsByDate = new Map();
  for (const s of sets) {
    if (!setsByDate.has(s.date)) setsByDate.set(s.date, []);
    setsByDate.get(s.date).push(s);
  }

  let bestSessionVolume = 0;
  let longestSessionSeconds = 0;
  let earliestStartHour = null;
  let latestSetHour = null;

  // Per BOUT, not per calendar date: a morning session plus one forgotten
  // set in the evening is two workouts, and scoring it as one awarded the
  // "trained over an hour" badge for a gap spent not training.
  for (const daySets of setsByDate.values()) {
    for (const bout of summarizeAllBouts(daySets)) {
      bestSessionVolume = Math.max(bestSessionVolume, bout.totalVolume);
      longestSessionSeconds = Math.max(longestSessionSeconds, bout.durationSeconds);
      const startHour = new Date(bout.startMs).getHours();
      const endHour = new Date(bout.lastSetMs).getHours();
      earliestStartHour = earliestStartHour === null ? startHour : Math.min(earliestStartHour, startHour);
      latestSetHour = latestSetHour === null ? endHour : Math.max(latestSetHour, endHour);
    }
  }

  // A PR is a set that beat every earlier set on the same exercise.
  const byExercise = new Map();
  for (const s of sets) {
    if (!s.exercise_id || s.weight_lbs == null || !s.created_at) continue;
    if (!byExercise.has(s.exercise_id)) byExercise.set(s.exercise_id, []);
    byExercise.get(s.exercise_id).push(s);
  }
  let prCount = 0;
  for (const list of byExercise.values()) {
    list.sort((a, b) => Date.parse(a.created_at) - Date.parse(b.created_at));
    let best = null;
    for (const s of list) {
      if (best !== null && s.weight_lbs > best) prCount++;
      best = best === null ? s.weight_lbs : Math.max(best, s.weight_lbs);
    }
  }

  const target = resolvedPullupTarget;
  let bestDailyHabitsMet = 0;
  const fullDates = [];
  const metDates = { pushups: [], situps: [], pullups: [] };
  for (const log of habitLogs) {
    let met = 0;
    if ((log.pushups ?? 0) >= 100) {
      met++;
      metDates.pushups.push(log.date);
    }
    if ((log.situps ?? 0) >= 200) {
      met++;
      metDates.situps.push(log.date);
    }
    if ((log.pullups ?? 0) >= target) {
      met++;
      metDates.pullups.push(log.date);
    }
    bestDailyHabitsMet = Math.max(bestDailyHabitsMet, met);
    if (met >= 2 && setsByDate.has(log.date)) fullDates.push(log.date);
  }

  const gratitudeCompleteDates = gratitude.filter((g) => gratitudeComplete(g.items)).map((g) => g.date);

  // Best-ever streaks: take the larger of the live counter (which the engine
  // maintains) and what history shows, so neither source can undercount.
  const liveBest = (habit) =>
    Math.max(habitStreaks?.[habit]?.best_streak ?? 0, habitStreaks?.[habit]?.current_streak ?? 0);

  return {
    totalSets: sets.length,
    workoutDays: setsByDate.size,
    totalVolume: sets.reduce((sum, s) => sum + (s.weight_lbs ?? 0) * (s.reps ?? 0), 0),
    bestSessionVolume,
    longestSessionSeconds,
    earliestStartHour,
    latestSetHour,
    prCount,
    bestDailyHabitsMet,
    bestStreaks: {
      pushups: Math.max(liveBest("pushups"), longestRun(metDates.pushups)),
      situps: Math.max(liveBest("situps"), longestRun(metDates.situps)),
      pullups: Math.max(liveBest("pullups"), longestRun(metDates.pullups)),
      swims: liveBest("swims"),
    },
    // Recomputed from history, not read off avatarState.streak: the live
    // counter resets to 0 the first missed day, and the engine's backfill
    // walks past days silently — so a genuinely completed 7-day run could be
    // zeroed before anything ever observed it, leaving streak_7 permanently
    // unearnable. The live value still participates in case it is ahead.
    bestAvatarStreak: Math.max(avatarState?.streak ?? 0, longestRun(fullDates)),
    level: avatarState?.level ?? 1,
    prestige: economy?.prestige_level ?? 0,
    ownedItems: owned.length,
    photos: photos.length,
    gratitudeCompleteDays: gratitudeCompleteDates.length,
    bestGratitudeStreak: Math.max(
      gratitudeStreak(gratitude.map((g) => ({ date: g.date, items: g.items }))),
      longestRun(gratitudeCompleteDates),
    ),
  };
}

export async function fetchEarned(userId) {
  const { data, error } = await supabase
    .from("accomplishments")
    .select("achievement_id,earned_at,earned_date")
    .eq("user_id", userId);
  if (error) {
    if (isMissingTable(error)) return { earned: [], tableMissing: true };
    throw error;
  }
  return { earned: data ?? [], tableMissing: false };
}

/**
 * Evaluates the whole catalog and records anything newly satisfied. Returns
 * the achievements earned *on this call* so the caller can celebrate them —
 * the unique key on (user_id, achievement_id) is what guarantees a badge
 * animates exactly once, even if two screens sync concurrently.
 */
export async function syncAccomplishments(userId, context = {}) {
  const { earned, tableMissing } = await fetchEarned(userId);
  if (tableMissing) {
    return { newlyEarned: [], earnedIds: new Set(), tableMissing: true, stats: null };
  }

  const earnedIds = new Set(earned.map((e) => e.achievement_id));
  const stats = await buildStats(userId, context);

  const nowEarned = ACHIEVEMENTS.filter((a) => !earnedIds.has(a.id) && a.check(stats));
  if (nowEarned.length === 0) {
    return { newlyEarned: [], earnedIds, tableMissing: false, stats };
  }

  const today = todayStr();
  const { data, error } = await supabase
    .from("accomplishments")
    .upsert(
      nowEarned.map((a) => ({ user_id: userId, achievement_id: a.id, earned_date: today })),
      { onConflict: "user_id,achievement_id", ignoreDuplicates: true },
    )
    .select("achievement_id");
  if (error) throw error;

  // With ignoreDuplicates, only genuinely new rows come back — so a race with
  // another tab celebrates in exactly one of them.
  const insertedIds = new Set((data ?? []).map((r) => r.achievement_id));
  for (const a of nowEarned) earnedIds.add(a.id);

  return {
    newlyEarned: nowEarned.filter((a) => insertedIds.has(a.id)),
    earnedIds,
    tableMissing: false,
    stats,
  };
}
