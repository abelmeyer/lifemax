import { chromium } from "playwright";

// Screenshots a dev-preview route with the Supabase REST layer mocked, so
// data-driven screens can be verified without a database.
const [, , url, out, width] = process.argv;

const today = new Date();
// Local date parts, matching the app's todayStr() — a UTC slice would be off
// by a day whenever the container's local time straddles midnight, and then
// "today's" row would silently never match.
const iso = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const daysAgo = (n) => iso(new Date(today.getTime() - n * 86400000));
const stamp = (dayOffset, hour, min) => {
  const d = new Date(today.getTime() - dayOffset * 86400000);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
};

const GRATITUDE = [
  { user_id: "u", date: iso(today), items: ["Sleep actually came easily last night.", "Squats felt light at 225.", "My brother called out of nowhere."] },
  { user_id: "u", date: daysAgo(1), items: ["Sunshine on the walk to the gym.", "Hit my protein without thinking about it.", "Finished the book I'd stalled on."] },
  { user_id: "u", date: daysAgo(2), items: ["Knees felt good on lunges.", "Made time to cook properly."] },
];

const WORKOUT_SETS = [];
for (let d = 0; d < 40; d++) {
  if (d % 7 === 6) continue;
  for (let s = 0; s < 5; s++) {
    WORKOUT_SETS.push({
      id: `s${d}-${s}`,
      exercise_id: `ex${s % 3}`,
      date: daysAgo(d),
      weight_lbs: 135 + s * 20 + (40 - d),
      reps: 10 - s,
      created_at: stamp(d, 7, 10 + s * 9),
    });
  }
}

const HABIT_LOGS = Array.from({ length: 30 }, (_, d) => ({
  date: daysAgo(d),
  pushups: 120,
  situps: 220,
  pullups: 12,
}));

const EARNED = [
  { achievement_id: "first_workout", earned_at: stamp(39, 8, 0), earned_date: daysAgo(39) },
  { achievement_id: "first_pr", earned_at: stamp(37, 8, 0), earned_date: daysAgo(37) },
  { achievement_id: "sets_100", earned_at: stamp(20, 8, 0), earned_date: daysAgo(20) },
  { achievement_id: "streak_3", earned_at: stamp(30, 8, 0), earned_date: daysAgo(30) },
  { achievement_id: "streak_7", earned_at: stamp(24, 8, 0), earned_date: daysAgo(24) },
  { achievement_id: "habits_full_day", earned_at: stamp(29, 8, 0), earned_date: daysAgo(29) },
  { achievement_id: "gratitude_first", earned_at: stamp(6, 8, 0), earned_date: daysAgo(6) },
  { achievement_id: "first_photo", earned_at: stamp(15, 8, 0), earned_date: daysAgo(15) },
  { achievement_id: "workout_days_10", earned_at: stamp(18, 8, 0), earned_date: daysAgo(18) },
  { achievement_id: "level_10", earned_at: stamp(12, 8, 0), earned_date: daysAgo(12) },
  { achievement_id: "prestige_1", earned_at: stamp(10, 8, 0), earned_date: daysAgo(10) },
  { achievement_id: "first_purchase", earned_at: stamp(9, 8, 0), earned_date: daysAgo(9) },
];

const SINGLES = {
  avatar_state: { user_id: "u", level: 14, streak: 9, last_progress_date: iso(today), last_evaluated_date: iso(today) },
  user_economy: { user_id: "u", aura_balance: 1240, prestige_level: 3, today_aura_flags: {}, today_aura_date: iso(today) },
  habit_settings: { user_id: "u", pullup_target: 10 },
};

const TABLES = {
  gratitude_entries: GRATITUDE,
  workout_sets: WORKOUT_SETS,
  habit_logs: HABIT_LOGS,
  accomplishments: EARNED,
  photos: Array.from({ length: 4 }, (_, i) => ({ date: daysAgo(i * 7), storage_path: `u/${daysAgo(i * 7)}.jpg` })),
  owned_items: [{ item_id: "i1" }, { item_id: "i2" }],
  habit_streaks: [
    { habit: "pushups", current_streak: 9, best_streak: 12, last_completed: iso(today) },
    { habit: "situps", current_streak: 9, best_streak: 12, last_completed: iso(today) },
    { habit: "pullups", current_streak: 4, best_streak: 8, last_completed: iso(today) },
    { habit: "swims", current_streak: 2, best_streak: 3, last_completed: iso(today) },
  ],
};

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: Number(width ?? 460), height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});

await page.route("**/rest/v1/**", async (route) => {
  const req = route.request();
  const u = new URL(req.url());
  const table = u.pathname.split("/rest/v1/")[1]?.split("?")[0];
  const wantsObject = (req.headers()["accept"] ?? "").includes("pgrst.object");
  const method = req.method();

  const json = (body, status = 200) =>
    route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });

  if (method === "POST" || method === "PATCH") {
    let payload = [];
    try {
      payload = JSON.parse(req.postData() ?? "[]");
    } catch {
      payload = [];
    }
    const rows = Array.isArray(payload) ? payload : [payload];
    // Upserted accomplishments with ignoreDuplicates return nothing new here,
    // which is the realistic "already earned" path.
    if (table === "accomplishments") return json([]);
    return json(wantsObject ? (rows[0] ?? {}) : rows);
  }

  if (SINGLES[table]) return json(wantsObject ? SINGLES[table] : [SINGLES[table]]);

  // Apply PostgREST filters from the query string. Without this, a
  // maybeSingle() that filters to one day gets the whole table back and
  // fails with PGRST116 — which is a bug in the mock, not the app.
  // user_id is skipped deliberately: the fixtures are single-user, so
  // filtering on it would just empty every table.
  const SKIP = new Set(["select", "order", "limit", "offset", "on_conflict", "columns", "user_id"]);
  let rows = TABLES[table] ?? [];
  for (const [column, raw] of u.searchParams.entries()) {
    if (SKIP.has(column)) continue;
    const [op, ...rest] = raw.split(".");
    const value = rest.join(".");
    rows = rows.filter((row) => {
      const actual = row[column];
      if (actual === undefined) return true; // column not modelled — don't filter it out
      switch (op) {
        case "eq":
          return String(actual) === value;
        case "gte":
          return String(actual) >= value;
        case "lte":
          return String(actual) <= value;
        case "in":
          return value.replace(/[()]/g, "").split(",").includes(String(actual));
        default:
          return true;
      }
    });
  }

  return json(wantsObject ? (rows[0] ?? {}) : rows);
});

await page.goto(url, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(Number(process.env.WAIT ?? 2500));
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log(errors.length ? "ERRORS:\n" + errors.slice(0, 12).join("\n") : "no errors");
