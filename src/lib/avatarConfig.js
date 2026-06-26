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
