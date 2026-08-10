import Avatar, { METRICS } from "../components/avatar/Avatar";
import AvatarBody from "../components/avatar/AvatarBody";
import ItemThumb from "../components/avatar/cosmetics/ItemThumb";
import AvatarSetup from "./AvatarSetup";
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
  { id: "i4", name: "Training Shorts", category: "Bottom" },
  { id: "i5", name: "Gym Socks", category: "Feet" },
  { id: "i6", name: "Lifting Belt", category: "Waist" },
  { id: "i7", name: "Golden Championship Belt", category: "Waist" },
  { id: "i8", name: "Wrist Wraps", category: "Wrists" },
  { id: "i9", name: "Chalk Bag", category: "Accessory" },
  { id: "i10", name: "Carbon Knee Sleeves", category: "Legs" },
  { id: "i11", name: "Diamond Avatar Aura", category: "Aura" },
  { id: "i12", name: "Legacy Trophy Case", category: "Display" },
];

const SAMPLE_STREAKS = {
  pushups: { current_streak: 5 },
  situps: { current_streak: 5 },
  pullups: { current_streak: 5 },
  swims: { current_streak: 3 },
};

// Renders the real AvatarSetup screen against stub contexts so its layout
// can be eyeballed without auth or a database. Reached at /preview/setup.
export function DevSetupPreview({ mode = "setup" }) {
  const auth = { user: { id: "dev-preview" }, loading: false };
  const custom = {
    loading: false,
    customization: null,
    needsSetup: true,
    save: async (v) => v,
  };
  return (
    <AuthContext.Provider value={auth}>
      <CustomizationContext.Provider value={custom}>
        <AvatarSetup mode={mode} />
      </CustomizationContext.Provider>
    </AuthContext.Provider>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-8">
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
