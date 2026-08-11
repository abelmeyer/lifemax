import { useEffect } from "react";
import Avatar, { METRICS } from "../components/avatar/Avatar";
import AchievementBadge from "../components/accomplishments/AchievementBadge";
import AchievementToast from "../components/accomplishments/AchievementToast";
import WorkoutSessionCard from "../components/workouts/WorkoutSessionCard";
import RestTimerBar from "../components/workouts/RestTimerBar";
import { RestTimerProvider, useRestTimer } from "../lib/RestTimerContext";
import { ACHIEVEMENTS, CATEGORIES } from "../lib/accomplishments";
import DayDetail from "../components/calendar/DayDetail";
import Gratitude from "./Gratitude";
import Accomplishments from "./Accomplishments";
import Dashboard from "./Dashboard";
import { AccomplishmentsProvider } from "../lib/AccomplishmentsContext";
import AvatarBody from "../components/avatar/AvatarBody";
import ItemThumb from "../components/avatar/cosmetics/ItemThumb";
import StoreItemRow from "../components/store/StoreItemRow";
import AvatarSetup from "./AvatarSetup";
import Settings from "./Settings";
import { AuthContext } from "../lib/AuthContext";
import { CustomizationContext } from "../lib/CustomizationContext";
import {
  SKIN_TONES,
  HAIR_STYLES,
  FACIAL_HAIR,
  STAGE_LEVEL_THRESHOLDS,
  STAGE_LABELS,
} from "../lib/avatarConfig";

// DEV-ONLY visual harness (route only registered when import.meta.env.DEV).
// Renders the full avatar/customization/store-art matrix with zero Supabase
// so the whole surface can be eyeballed or screenshotted in one page.

const SAMPLE_ITEMS = [
  { id: "i1", name: "Classic Tank Top", category: "Top" },
  { id: "i2", name: "Pro Singlet", category: "Top" },
  { id: "i3", name: "Signature Hoodie", category: "Top" },
  { id: "i3a", name: "Cutoff Tee", category: "Top" },
  { id: "i3b", name: "Compression Long Sleeve", category: "Top" },
  { id: "i3c", name: "Team Windbreaker", category: "Top" },
  { id: "i4", name: "Training Shorts", category: "Bottom" },
  { id: "i4a", name: "Mesh Shorts", category: "Bottom" },
  { id: "i4b", name: "Compression Tights", category: "Bottom" },
  { id: "i4c", name: "Gold Trunks", category: "Bottom" },
  { id: "i5", name: "Gym Socks", category: "Feet" },
  { id: "i5a", name: "Running Shoes", category: "Feet" },
  { id: "i5b", name: "Cross-Trainers", category: "Feet" },
  { id: "i5c", name: "Weightlifting Shoes", category: "Feet" },
  { id: "i5d", name: "Gold Signature Sneakers", category: "Feet" },
  { id: "i6", name: "Lifting Belt", category: "Waist" },
  { id: "i7", name: "Golden Championship Belt", category: "Waist" },
  { id: "i7a", name: "Powerlifting Belt", category: "Waist" },
  { id: "i8", name: "Wrist Wraps", category: "Wrists" },
  { id: "i8a", name: "Sweatbands", category: "Wrists" },
  { id: "i8b", name: "Lifting Straps", category: "Wrists" },
  { id: "i8c", name: "Fitness Watch", category: "Wrists" },
  { id: "i10", name: "Carbon Knee Sleeves", category: "Legs" },
  { id: "i10a", name: "Compression Sleeves", category: "Legs" },
  { id: "i10b", name: "Titanium Knee Wraps", category: "Legs" },
  { id: "ih1", name: "Sweat Headband", category: "Head" },
  { id: "ih2", name: "Knit Beanie", category: "Head" },
  { id: "ih3", name: "Snapback Cap", category: "Head" },
  { id: "ih4", name: "Boxing Headgear", category: "Head" },
  { id: "ih5", name: "Champion's Crown", category: "Head" },
  { id: "i9", name: "Chalk Bag", category: "Accessory" },
  { id: "i9a", name: "Gym Towel", category: "Accessory" },
  { id: "i9b", name: "Water Bottle", category: "Accessory" },
  { id: "i9c", name: "Weighted Vest", category: "Accessory" },
  { id: "i9d", name: "Championship Medal", category: "Accessory" },
  { id: "i11", name: "Diamond Avatar Aura", category: "Aura" },
  { id: "i11a", name: "Ember Aura", category: "Aura" },
  { id: "i11b", name: "Emerald Aura", category: "Aura" },
  { id: "i11c", name: "Void Aura", category: "Aura" },
  { id: "i12", name: "Legacy Trophy Case", category: "Display" },
  { id: "i12a", name: "Medal Rack", category: "Display" },
  { id: "i12b", name: "PR Board", category: "Display" },
  { id: "i12c", name: "Hall of Fame Plaque", category: "Display" },
];

// Descriptions as seeded in sprint6_migration.sql.
const STORE_DESCRIPTIONS = {
  "Gym Socks": "Comfortable crew socks.",
  "Lifting Belt": "Leather belt for heavy pulls.",
  "Golden Championship Belt": "A belt worthy of a champion.",
  "Wrist Wraps": "Support for max-effort presses.",
  "Chalk Bag": "Keep your grip locked in.",
};

const STORE_ROW_SAMPLES = ["Gym Socks", "Lifting Belt", "Golden Championship Belt", "Wrist Wraps", "Chalk Bag"]
  .map((n) => SAMPLE_ITEMS.find((i) => i.name === n));

const SAMPLE_STREAKS = {
  pushups: { current_streak: 5 },
  situps: { current_streak: 5 },
  pullups: { current_streak: 5 },
  swims: { current_streak: 3 },
};

// Renders the real AvatarSetup screen against stub contexts so its layout
// can be eyeballed without auth or a database. Reached at /preview/setup.
export function DevSetupPreview({ mode = "setup" }) {
  const auth = { user: { id: "dev-preview" }, loading: false, signOut: async () => {} };
  const custom = {
    loading: false,
    customization: null,
    needsSetup: true,
    tableMissing: false,
    loadFailed: false,
    save: async (v) => v,
    skipSetup: () => {},
  };
  return (
    <AuthContext.Provider value={auth}>
      <CustomizationContext.Provider value={custom}>
        <AvatarSetup mode={mode} />
      </CustomizationContext.Provider>
    </AuthContext.Provider>
  );
}

// Same stub-context trick for the Settings screen. Its habit-settings fetch
// hits the (stubbed) network and surfaces an error banner here — expected in
// the harness, not a defect in the screen.
export function DevSettingsPreview() {
  const auth = {
    user: { id: "dev-preview", email: "you@example.com" },
    loading: false,
    signOut: async () => {},
  };
  const custom = {
    loading: false,
    customization: { skin_tone: "bronze", hair_style: "curly", hair_color: "black", facial_hair: "beard" },
    needsSetup: false,
    tableMissing: false,
    loadFailed: false,
    skipSetup: () => {},
    save: async (v) => v,
  };
  return (
    <AuthContext.Provider value={auth}>
      <CustomizationContext.Provider value={custom}>
        <div className="mx-auto max-w-md px-4 py-8">
          <Settings />
        </div>
      </CustomizationContext.Provider>
    </AuthContext.Provider>
  );
}

// Achievement badges + the unlock toast, rendered statically so the whole
// catalog can be eyeballed at once.
export function DevBadgesPreview() {
  const sample = ACHIEVEMENTS[0];
  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="mb-6 text-[24px] font-semibold text-body">Accomplishments preview (dev only)</h1>

      <Section title="Unlock toast">
        <div className="relative" style={{ height: 110 }}>
          <AchievementToast achievement={sample} onDismiss={() => {}} />
        </div>
      </Section>

      <Section title="Every badge — earned">
        <div className="flex flex-wrap gap-2">
          {ACHIEVEMENTS.map((a) => (
            <Cell key={a.id} label={`${a.name} · ${a.tier}`} width={104}>
              <AchievementBadge achievement={a} size={54} />
            </Cell>
          ))}
        </div>
      </Section>

      <Section title="Locked state (one per category)">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const a = ACHIEVEMENTS.find((x) => x.category === c);
            return a ? (
              <Cell key={c} label={`${c} · locked`} width={104}>
                <AchievementBadge achievement={a} earned={false} size={54} />
              </Cell>
            ) : null;
          })}
        </div>
      </Section>
    </div>
  );
}

// The rest timer bar in its three states, and the workout session card.
export function DevWorkoutPreview() {
  const now = Date.now();
  const sessionSets = [
    { id: 1, created_at: new Date(now - 42 * 60000).toISOString(), weight_lbs: 135, reps: 10 },
    { id: 2, created_at: new Date(now - 34 * 60000).toISOString(), weight_lbs: 155, reps: 8 },
    { id: 3, created_at: new Date(now - 21 * 60000).toISOString(), weight_lbs: 175, reps: 6 },
    { id: 4, created_at: new Date(now - 3 * 60000).toISOString(), weight_lbs: 185, reps: 5 },
  ];
  const finishedSets = sessionSets.map((s, i) => ({
    ...s,
    created_at: new Date(now - (300 - i * 15) * 60000).toISOString(),
  }));

  return (
    <div className="mx-auto max-w-md px-6 py-8">
      <h1 className="mb-6 text-[24px] font-semibold text-body">Workout session preview (dev only)</h1>

      <Section title="Session in progress">
        <WorkoutSessionCard sets={sessionSets} />
      </Section>

      <Section title="Session finished (idle)">
        <WorkoutSessionCard sets={finishedSets} />
      </Section>

      <Section title="Rest timer — running">
        <RestTimerProvider>
          <RestTimerHarness seconds={95} />
        </RestTimerProvider>
      </Section>

      <Section title="Rest timer — finished">
        <RestTimerProvider>
          <RestTimerHarness seconds={0} />
        </RestTimerProvider>
      </Section>
    </div>
  );
}

// Starts a timer on mount so RestTimerBar has something to render. The bar is
// fixed-position in the real app; a transformed wrapper becomes the
// containing block for fixed descendants, which pins it inline here so both
// states can be seen at once instead of stacking on top of each other.
function RestTimerHarness({ seconds }) {
  const { start } = useRestTimer();
  useEffect(() => {
    start(seconds, "Rest · Barbell Squat");
  }, [start, seconds]);
  return (
    <div style={{ transform: "translateZ(0)", position: "relative", height: 96 }}>
      <RestTimerBar />
    </div>
  );
}

// DayDetail is pure props, so it can be exercised with a fabricated day —
// the richest one the calendar can produce.
export function DevDayDetailPreview() {
  const base = Date.parse("2026-08-09T07:12:00");
  const detail = {
    date: "2026-08-09",
    status: "full",
    exerciseGroups: [
      {
        name: "Barbell Bench Press",
        sets: [
          { id: "a", weight_lbs: 135, reps: 12 },
          { id: "b", weight_lbs: 155, reps: 10 },
          { id: "c", weight_lbs: 175, reps: 8 },
        ],
      },
      {
        name: "Incline Dumbbell Press",
        sets: [
          { id: "d", weight_lbs: 55, reps: 12 },
          { id: "e", weight_lbs: 60, reps: 10 },
        ],
      },
    ],
    session: {
      hasSession: true,
      startMs: base,
      lastSetMs: base + 52 * 60000,
      durationSeconds: 52 * 60,
      setCount: 5,
      totalVolume: 6420,
    },
    cardio: [{ id: "c1", type: "Swim", duration_min: 30 }],
    habitLog: { pushups: 140, situps: 210, pullups: 12 },
    pullupTarget: 10,
    meals: [
      { id: "m1", protein_g: 62, carbs_g: 70, fat_g: 18, calories: 690 },
      { id: "m2", protein_g: 55, carbs_g: 85, fat_g: 22, calories: 760 },
    ],
    gratitude: {
      items: [
        "Training partner spotted me on the last set.",
        "Shoulder held up through all three pressing movements.",
        "Coffee with my sister ran two hours long.",
      ],
    },
    badges: [{ achievement_id: "first_pr" }, { achievement_id: "volume_10k" }],
  };

  return (
    <div className="mx-auto max-w-md px-6 py-8">
      <h1 className="mb-6 text-[24px] font-semibold text-body">Day detail preview (dev only)</h1>
      <DayDetail detail={detail} />
    </div>
  );
}

// Gratitude and Accomplishments against stub auth. Their Supabase reads fail
// in the harness (stub URL), which is exactly the empty/error path — enough
// to verify layout without a database.
export function DevJournalPreview() {
  const auth = { user: { id: "dev-preview", email: "you@example.com" }, loading: false, signOut: async () => {} };
  return (
    <AuthContext.Provider value={auth}>
      <AccomplishmentsProvider>
        <div className="mx-auto max-w-md px-6 py-8">
          <Gratitude />
          <div className="my-10 border-t border-border" />
          <Accomplishments />
        </div>
      </AccomplishmentsProvider>
    </AuthContext.Provider>
  );
}

// The Dashboard with every provider stubbed. Pair with scripts/preview-shot.mjs
// (which mocks the Supabase REST layer) to see it with realistic data.
export function DevDashboardPreview() {
  const auth = { user: { id: "dev-preview", email: "you@example.com" }, loading: false, signOut: async () => {} };
  const custom = {
    loading: false,
    customization: { skin_tone: "bronze", hair_style: "short", hair_color: "black", facial_hair: "stubble" },
    needsSetup: false,
    tableMissing: false,
    loadFailed: false,
    skipSetup: () => {},
    save: async (v) => v,
  };
  return (
    <AuthContext.Provider value={auth}>
      <CustomizationContext.Provider value={custom}>
        <AccomplishmentsProvider>
          <div className="mx-auto max-w-md px-4 py-8">
            <Dashboard />
          </div>
        </AccomplishmentsProvider>
      </CustomizationContext.Provider>
    </AuthContext.Provider>
  );
}

// The id makes each section addressable from a screenshot script, so a
// capture can hide the ones it doesn't want with CSS. (Removing nodes from
// the DOM instead does not survive a React re-render.)
function Section({ title, children }) {
  const id = "sec-" + title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return (
    <div className="mb-8" id={id} data-section={title}>
      <h2 className="mb-3 text-[15px] font-medium text-body">{title}</h2>
      {children}
    </div>
  );
}

function Cell({ label, children, width = 130 }) {
  return (
    <div className="card-shadow flex flex-col items-center rounded-card border border-border bg-surface p-2" style={{ width }}>
      {children}
      <span className="mt-1 text-center text-[10px] leading-tight text-muted">{label}</span>
    </div>
  );
}

export default function DevPreview() {
  const combos = [
    { skin_tone: "porcelain", hair_style: "long", hair_color: "blonde", facial_hair: "none" },
    { skin_tone: "fair", hair_style: "curly", hair_color: "red", facial_hair: "stubble" },
    { skin_tone: "tan", hair_style: "short", hair_color: "brown", facial_hair: "none" },
    { skin_tone: "olive", hair_style: "bun", hair_color: "black", facial_hair: "beard" },
    { skin_tone: "brown", hair_style: "buzz", hair_color: "black", facial_hair: "mustache" },
    { skin_tone: "deep", hair_style: "bald", hair_color: "black", facial_hair: "beard" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="mb-6 text-[24px] font-semibold text-body">Avatar system preview (dev only)</h1>

      <Section title="Evolution stages (default customization)">
        <div className="flex flex-wrap gap-2">
          {STAGE_LEVEL_THRESHOLDS.map((lvl, i) => (
            <Cell key={lvl} label={`${STAGE_LABELS[i]} · L${lvl}`}>
              <svg viewBox="10 6 200 260" width="110" height="146">
                <AvatarBody level={lvl} metrics={METRICS} customization={null} />
              </svg>
            </Cell>
          ))}
        </div>
      </Section>

      <Section title="Customization combos (stage 4)">
        <div className="flex flex-wrap gap-2">
          {combos.map((c, i) => (
            <Cell key={i} label={`${c.skin_tone} · ${c.hair_style} · ${c.hair_color} · ${c.facial_hair}`}>
              <svg viewBox="10 6 200 260" width="110" height="146">
                <AvatarBody level={14} metrics={METRICS} customization={c} />
              </svg>
            </Cell>
          ))}
        </div>
      </Section>

      <Section title="All hair styles × 4 colors (heads)">
        <div className="flex flex-wrap gap-2">
          {HAIR_STYLES.map((s) =>
            ["black", "blonde", "red", "gray"].map((hc) => (
              <Cell key={`${s.id}-${hc}`} label={`${s.label} · ${hc}`} width={82}>
                <svg viewBox="82 16 56 64" width="56" height="64">
                  <AvatarBody
                    level={1}
                    metrics={METRICS}
                    customization={{ skin_tone: "tan", hair_style: s.id, hair_color: hc, facial_hair: "none" }}
                  />
                </svg>
              </Cell>
            )),
          )}
        </div>
      </Section>

      <Section title="Facial hair (heads)">
        <div className="flex flex-wrap gap-2">
          {FACIAL_HAIR.map((f) => (
            <Cell key={f.id} label={f.label} width={82}>
              <svg viewBox="82 16 56 64" width="56" height="64">
                <AvatarBody
                  level={1}
                  metrics={METRICS}
                  customization={{ skin_tone: "sand", hair_style: "short", hair_color: "dark_brown", facial_hair: f.id }}
                />
              </svg>
            </Cell>
          ))}
        </div>
      </Section>

      <Section title="All skin tones (stage 3)">
        <div className="flex flex-wrap gap-2">
          {SKIN_TONES.map((t) => (
            <Cell key={t.id} label={t.label} width={100}>
              <svg viewBox="10 6 200 260" width="86" height="118">
                <AvatarBody
                  level={8}
                  metrics={METRICS}
                  customization={{ skin_tone: t.id, hair_style: "short", hair_color: "black", facial_hair: "none" }}
                />
              </svg>
            </Cell>
          ))}
        </div>
      </Section>

      <Section title="Store items equipped (one at a time, stage 4 + all earned gear)">
        <div className="flex flex-wrap gap-2">
          {SAMPLE_ITEMS.map((item) => (
            <Cell key={item.id} label={item.name} width={150}>
              <div style={{ width: 138, aspectRatio: "300 / 290" }}>
                <Avatar
                  level={14}
                  habitStreaks={SAMPLE_STREAKS}
                  customization={{ skin_tone: "tan", hair_style: "short", hair_color: "brown", facial_hair: "stubble" }}
                  equippedCosmetics={[item]}
                />
              </div>
            </Cell>
          ))}
        </div>
      </Section>

      <Section title="Store items at the physique extremes (stage 1 vs stage 6)">
        <p className="mb-2 text-[12px] leading-relaxed text-muted">
          The shoulders span 60→90 and the waist 70→44 across the six stages, so any cosmetic drawn at fixed pixel
          offsets detaches from the body here. Every garment must still sit on the limb it covers in BOTH columns.
        </p>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_ITEMS.filter((i) => !["Aura", "Display", "Accessory"].includes(i.category)).flatMap((item) =>
            [1, 32].map((lvl) => (
              <Cell key={`${item.id}-${lvl}`} label={`${item.name} · L${lvl}`} width={124}>
                <div style={{ width: 112, aspectRatio: "300 / 290" }}>
                  <Avatar
                    level={lvl}
                    habitStreaks={{}}
                    customization={{ skin_tone: "tan", hair_style: "short", hair_color: "brown", facial_hair: "none" }}
                    equippedCosmetics={[item]}
                  />
                </div>
              </Cell>
            )),
          )}
        </div>
      </Section>

      <Section title="A full outfit (tank + shorts + socks + belt + wraps + aura)">
        <div className="card-shadow inline-block rounded-card border border-border bg-surface p-3" style={{ width: 260 }}>
          <Avatar
            level={32}
            habitStreaks={SAMPLE_STREAKS}
            customization={{ skin_tone: "bronze", hair_style: "curly", hair_color: "black", facial_hair: "beard" }}
            equippedCosmetics={[
              SAMPLE_ITEMS[0],
              SAMPLE_ITEMS[3],
              SAMPLE_ITEMS[4],
              SAMPLE_ITEMS[5],
              SAMPLE_ITEMS[7],
              SAMPLE_ITEMS[10],
            ]}
          />
        </div>
      </Section>

      <Section title="Store rows (real StoreItemRow, all button states)">
        <div className="flex max-w-md flex-col gap-2.5">
          {[
            { state: "buy, affordable", props: { canAfford: true } },
            { state: "buy, too expensive", props: { canAfford: false } },
            { state: "owned, not equipped", props: { owned: true, canAfford: true } },
            { state: "owned, equipped", props: { owned: true, equipped: true, canAfford: true } },
            { state: "locked by prestige", props: { locked: true, canAfford: true } },
          ].map(({ state, props }, i) => (
            <StoreItemRow
              key={state}
              item={{
                ...STORE_ROW_SAMPLES[i],
                description: STORE_DESCRIPTIONS[STORE_ROW_SAMPLES[i].name],
                cost_aura: 250,
              }}
              {...props}
            />
          ))}
        </div>
      </Section>

      <Section title="Store thumbnails">
        <div className="flex flex-wrap gap-2">
          {SAMPLE_ITEMS.map((item) => (
            <Cell key={item.id} label={item.name} width={90}>
              <div className="h-14 w-14 overflow-hidden rounded-[10px] border border-border bg-bg/60">
                <ItemThumb item={item} />
              </div>
            </Cell>
          ))}
        </div>
      </Section>
    </div>
  );
}
