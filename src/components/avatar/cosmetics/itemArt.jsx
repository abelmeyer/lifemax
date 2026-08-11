// Registry of real vector art for each store item, keyed by store_items.name.
// StoreCosmeticLayer looks an item up here first and only falls back to the
// generic per-slot placeholder in cosmeticRegistry.js for names without art
// yet — so new store rows added in Supabase always render something.
//
// Art lives in art/<slot>.jsx; see art/shared.js for the geometry contract
// every component must follow.
import { ClassicTankTop, ProSinglet, SignatureHoodie, CutoffTee, CompressionLongSleeve, TeamWindbreaker } from "./art/tops";
import { TrainingShorts, MeshShorts, CompressionTights, GoldTrunks } from "./art/bottoms";
import { GymSocks, RunningShoes, CrossTrainers, WeightliftingShoes, GoldSignatureSneakers } from "./art/feet";
import { LiftingBelt, ChampionshipBelt, PowerliftingBelt } from "./art/waist";
import { WristWraps, Sweatbands, LiftingStraps, FitnessWatch } from "./art/wrists";
import { KneeSleeves, CompressionSleeves, TitaniumKneeWraps } from "./art/legs";
import { SweatHeadband, KnitBeanie, SnapbackCap, BoxingHeadgear, ChampionsCrown } from "./art/head";
import { ChalkBag, GymTowel, WaterBottle, WeightedVest, ChampionshipMedal } from "./art/accessories";
import { DiamondAura, EmberAura, EmeraldAura, VoidAura } from "./art/auras";
import { TrophyCase, MedalRack, PRBoard, HallOfFamePlaque } from "./art/displays";

export const ITEM_ART = {
  "Classic Tank Top": ClassicTankTop,
  "Pro Singlet": ProSinglet,
  "Signature Hoodie": SignatureHoodie,
  "Cutoff Tee": CutoffTee,
  "Compression Long Sleeve": CompressionLongSleeve,
  "Team Windbreaker": TeamWindbreaker,
  "Training Shorts": TrainingShorts,
  "Mesh Shorts": MeshShorts,
  "Compression Tights": CompressionTights,
  "Gold Trunks": GoldTrunks,
  "Gym Socks": GymSocks,
  "Running Shoes": RunningShoes,
  "Cross-Trainers": CrossTrainers,
  "Weightlifting Shoes": WeightliftingShoes,
  "Gold Signature Sneakers": GoldSignatureSneakers,
  "Lifting Belt": LiftingBelt,
  "Golden Championship Belt": ChampionshipBelt,
  "Powerlifting Belt": PowerliftingBelt,
  "Wrist Wraps": WristWraps,
  "Sweatbands": Sweatbands,
  "Lifting Straps": LiftingStraps,
  "Fitness Watch": FitnessWatch,
  "Carbon Knee Sleeves": KneeSleeves,
  "Compression Sleeves": CompressionSleeves,
  "Titanium Knee Wraps": TitaniumKneeWraps,
  "Sweat Headband": SweatHeadband,
  "Knit Beanie": KnitBeanie,
  "Snapback Cap": SnapbackCap,
  "Boxing Headgear": BoxingHeadgear,
  "Champion's Crown": ChampionsCrown,
  "Chalk Bag": ChalkBag,
  "Gym Towel": GymTowel,
  "Water Bottle": WaterBottle,
  "Weighted Vest": WeightedVest,
  "Championship Medal": ChampionshipMedal,
  "Diamond Avatar Aura": DiamondAura,
  "Ember Aura": EmberAura,
  "Emerald Aura": EmeraldAura,
  "Void Aura": VoidAura,
  "Legacy Trophy Case": TrophyCase,
  "Medal Rack": MedalRack,
  "PR Board": PRBoard,
  "Hall of Fame Plaque": HallOfFamePlaque,
};
