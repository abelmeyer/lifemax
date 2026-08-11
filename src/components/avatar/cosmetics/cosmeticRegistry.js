import TopCosmetic from "./TopCosmetic";
import BottomCosmetic from "./BottomCosmetic";
import FeetCosmetic from "./FeetCosmetic";
import WaistCosmetic from "./WaistCosmetic";
import WristsCosmetic from "./WristsCosmetic";
import LegsCosmetic from "./LegsCosmetic";
import AccessoryCosmetic from "./AccessoryCosmetic";
import AuraCosmetic from "./AuraCosmetic";
import DisplayCosmetic from "./DisplayCosmetic";
import HeadCosmetic from "./HeadCosmetic";

// Keyed by store_items.category (the equip slot). These are the generic
// per-slot FALLBACKS: StoreCosmeticLayer looks an item up in itemArt.jsx by
// name first and only lands here for catalog rows that don't have bespoke art
// yet, so new store items always render something recognizable.
export const COSMETIC_RENDERERS = {
  Head: HeadCosmetic,
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
