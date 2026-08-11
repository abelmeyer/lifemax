// Shared between the avatar evaluation engine (lib/avatar.js) and the
// layered SVG renderer (components/avatar/*). Plain JS, no JSX, so either
// side can import it without a circular dependency.

// Physique stage advances every few levels. Tune freely.
export const STAGE_LEVEL_THRESHOLDS = [1, 4, 8, 14, 22, 32];

export function getStageForLevel(level) {
  let stage = 1;
  for (let i = 0; i < STAGE_LEVEL_THRESHOLDS.length; i++) {
    if (level >= STAGE_LEVEL_THRESHOLDS[i]) stage = i + 1;
  }
  return stage;
}

export const STAGE_LABELS = ["Foundation", "Building", "Progressing", "Defined", "Athletic", "Peak Form"];

export function getStageLabel(level) {
  return STAGE_LABELS[getStageForLevel(level) - 1];
}

// ---- Physique geometry, shared by the body and every layer drawn on it ----
// Stage 1 = out of shape, stage 6 = lean/defined. `def` scales the on-body
// muscle shading. These live here rather than in AvatarBody because gear and
// store cosmetics must anchor to the SAME numbers — art with hardcoded
// offsets detaches from the silhouette at the extreme stages (the shoulders
// span 60→90 and the waist 70→44 across the range).
export const STAGE_PARAMS = [
  { shoulder: 60, waist: 70, armWidth: 18, legWidth: 23, rim: 0, def: 0 },
  { shoulder: 66, waist: 62, armWidth: 19, legWidth: 23, rim: 0.1, def: 0.15 },
  { shoulder: 72, waist: 56, armWidth: 19, legWidth: 24, rim: 0.2, def: 0.3 },
  { shoulder: 78, waist: 51, armWidth: 20, legWidth: 24, rim: 0.35, def: 0.5 },
  { shoulder: 84, waist: 47, armWidth: 21, legWidth: 25, rim: 0.5, def: 0.7 },
  { shoulder: 90, waist: 44, armWidth: 22, legWidth: 26, rim: 0.7, def: 1 },
];

/**
 * Resolved pixel geometry of the body at a given level: the exact rectangles
 * AvatarBody draws, so a sleeve, cuff or belt can be positioned off the same
 * values instead of guessing.
 */
export function getStageGeometry(level, metrics) {
  const p = STAGE_PARAMS[getStageForLevel(level) - 1];
  const { cx, shoulderY, waistY, hipY, legHeight, armHeight } = metrics;

  const shoulderHalf = p.shoulder / 2;
  const waistHalf = p.waist / 2;

  return {
    ...p,
    cx,
    shoulderY,
    waistY,
    hipY,
    legHeight,
    armHeight,
    shoulderHalf,
    waistHalf,

    // arms
    armLeftX: cx - shoulderHalf - p.armWidth - 2,
    armRightX: cx + shoulderHalf + 2,
    armTopY: shoulderY + 8,
    armBottomY: shoulderY + 8 + armHeight,

    // legs (anchored to the centerline, matching AvatarBody)
    legLeftX: cx - p.legWidth - 1.5,
    legRightX: cx + 1.5,
    legTopY: hipY - 2,
    legBottomY: hipY - 2 + legHeight,

    // the default shorts' half-width, which garments must cover
    hipHalf: Math.max(waistHalf + 5, p.legWidth + 4),
  };
}

// ---- Appearance customization (chosen at account setup, editable later) ----
// Each option is { id, label, ...colors }. Ids are what's stored in the
// avatar_customization table; keep them stable once users exist.

export const SKIN_TONES = [
  { id: "porcelain", label: "Porcelain", base: "#f2ddca", shade: "#ddbfa6", line: "#c2a184" },
  { id: "fair", label: "Fair", base: "#eeceac", shade: "#d8b18b", line: "#bd9269" },
  { id: "sand", label: "Sand", base: "#e2b98d", shade: "#cb9d6f", line: "#ae7f50" },
  { id: "tan", label: "Tan", base: "#d3a06a", shade: "#b98550", line: "#9c6a38" },
  { id: "olive", label: "Olive", base: "#bb8a55", shade: "#a1713f", line: "#84582c" },
  { id: "bronze", label: "Bronze", base: "#9d6b3c", shade: "#84562d", line: "#68411f" },
  { id: "brown", label: "Brown", base: "#7d5128", shade: "#653f1d", line: "#4d2e13" },
  { id: "deep", label: "Deep", base: "#5a3a1d", shade: "#462c14", line: "#33200e" },
];

export const HAIR_COLORS = [
  { id: "black", label: "Black", base: "#26221f", shine: "#403a35" },
  { id: "dark_brown", label: "Dark Brown", base: "#3e2b1c", shine: "#5a4029" },
  { id: "brown", label: "Brown", base: "#5c4126", shine: "#7b5936" },
  { id: "light_brown", label: "Light Brown", base: "#7d5c38", shine: "#9c774c" },
  { id: "blonde", label: "Blonde", base: "#c49f5d", shine: "#dcbc7f" },
  { id: "red", label: "Red", base: "#8c3d22", shine: "#ab5433" },
  { id: "gray", label: "Gray", base: "#8f959e", shine: "#adb3bc" },
  { id: "platinum", label: "Platinum", base: "#d5d0c5", shine: "#e9e5dc" },
];

export const HAIR_STYLES = [
  { id: "bald", label: "Bald" },
  { id: "buzz", label: "Buzz" },
  { id: "short", label: "Short" },
  { id: "curly", label: "Curly" },
  { id: "long", label: "Long" },
  { id: "bun", label: "Bun" },
];

export const FACIAL_HAIR = [
  { id: "none", label: "Clean" },
  { id: "stubble", label: "Stubble" },
  { id: "mustache", label: "Mustache" },
  { id: "beard", label: "Beard" },
];

export const DEFAULT_CUSTOMIZATION = {
  skin_tone: "tan",
  hair_style: "short",
  hair_color: "brown",
  facial_hair: "none",
};

const byId = (list) => Object.fromEntries(list.map((o) => [o.id, o]));
const SKIN_BY_ID = byId(SKIN_TONES);
const HAIR_COLOR_BY_ID = byId(HAIR_COLORS);

// Resolve a stored customization row (or null/partial) into concrete color
// objects the renderer can use. Unknown ids fall back to defaults so an old
// client never crashes on a row written by a newer one.
export function resolveAppearance(customization) {
  const c = { ...DEFAULT_CUSTOMIZATION, ...(customization ?? {}) };
  return {
    skin: SKIN_BY_ID[c.skin_tone] ?? SKIN_BY_ID[DEFAULT_CUSTOMIZATION.skin_tone],
    hairColor: HAIR_COLOR_BY_ID[c.hair_color] ?? HAIR_COLOR_BY_ID[DEFAULT_CUSTOMIZATION.hair_color],
    hairStyle: HAIR_STYLES.some((s) => s.id === c.hair_style) ? c.hair_style : DEFAULT_CUSTOMIZATION.hair_style,
    facialHair: FACIAL_HAIR.some((f) => f.id === c.facial_hair) ? c.facial_hair : DEFAULT_CUSTOMIZATION.facial_hair,
  };
}

// Day-streak (or week-streak, for swims) needed to earn each gear piece.
export const GEAR_THRESHOLDS = {
  situps: 3,
  pullups: 3,
  pushups: 3,
  swims: 2,
};

export function isGearEarned(habit, habitStreaks) {
  const streak = habitStreaks?.[habit]?.current_streak ?? 0;
  return streak >= GEAR_THRESHOLDS[habit];
}

export function getEquippedGearIds(habitStreaks) {
  return Object.keys(GEAR_THRESHOLDS).filter((habit) => isGearEarned(habit, habitStreaks));
}

export function getNewlyUnlockedGear(oldStreaks, newStreaks) {
  return Object.keys(GEAR_THRESHOLDS).filter(
    (habit) => !isGearEarned(habit, oldStreaks) && isGearEarned(habit, newStreaks),
  );
}
