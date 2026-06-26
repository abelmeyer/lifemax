import AvatarBody from "./AvatarBody";
import PullupBar from "./gear/PullupBar";
import SitupBench from "./gear/SitupBench";
import SixPack from "./gear/SixPack";
import SwimCap from "./gear/SwimCap";
import ChestArmDefinition from "./gear/ChestArmDefinition";
import { getEquippedGearIds } from "../../lib/avatarConfig";

const METRICS = {
  cx: 110,
  shoulderY: 78,
  waistY: 150,
  hipY: 168,
  legHeight: 78,
  armHeight: 64,
};

// purchasedItems is a forward-compatible hook for the future cosmetics
// store — it stacks on top of earned gear using the exact same pattern,
// so a later sprint just needs to add more ids here, not restructure.
export default function Avatar({
  level,
  habitStreaks,
  justUnlocked = [],
  justLeveledUp = false,
  purchasedItems = [],
}) {
  const equipped = getEquippedGearIds(habitStreaks ?? {});
  const has = (id) => equipped.includes(id) || purchasedItems.includes(id);
  const isNew = (id) => justUnlocked.includes(id);

  return (
    <svg viewBox="-30 0 300 290" width="100%" height="100%" role="img" aria-label="Your Lifemaxx avatar">
      {has("pullups") && (
        <g className={isNew("pullups") ? "gear-unlock" : undefined}>
          <PullupBar metrics={METRICS} />
        </g>
      )}

      <AvatarBody level={level} metrics={METRICS} pulse={justLeveledUp} />

      {has("pushups") && (
        <g className={isNew("pushups") ? "gear-unlock" : undefined}>
          <ChestArmDefinition metrics={METRICS} />
        </g>
      )}

      {has("situps") && (
        <>
          <g className={isNew("situps") ? "gear-unlock" : undefined}>
            <SixPack metrics={METRICS} />
          </g>
          <g className={isNew("situps") ? "gear-unlock" : undefined}>
            <SitupBench metrics={METRICS} />
          </g>
        </>
      )}

      {has("swims") && (
        <g className={isNew("swims") ? "gear-unlock" : undefined}>
          <SwimCap metrics={METRICS} />
        </g>
      )}
    </svg>
  );
}
