import TopCosmetic from "./TopCosmetic";
import BottomCosmetic from "./BottomCosmetic";
import FeetCosmetic from "./FeetCosmetic";
import WaistCosmetic from "./WaistCosmetic";
import WristsCosmetic from "./WristsCosmetic";
import LegsCosmetic from "./LegsCosmetic";
import AccessoryCosmetic from "./AccessoryCosmetic";
import AuraCosmetic from "./AuraCosmetic";
import DisplayCosmetic from "./DisplayCosmetic";

// Keyed by store_items.category (the equip slot). Each renderer is a
// placeholder today — Sprint 7 swaps the body of each one for a real
// <image href={item.asset_path}> once art exists, without touching this
// lookup or anything that calls StoreCosmeticLayer.
export const COSMETIC_RENDERERS = {
  Top: TopCosmetic,
  Bottom: BottomCosmetic,
  Feet: FeetCosmetic,
  Waist: WaistCosmetic,
  Wrists: WristsCosmetic,
  Legs: LegsCosmetic,
  Accessory: AccessoryCosmetic,
  Aura: AuraCosmetic,
  Display: DisplayCosmetic,
};
