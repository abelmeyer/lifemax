import { METRICS } from "../Avatar";
import StoreCosmeticLayer from "./StoreCosmeticLayer";

// How to crop the full avatar coordinate space down to just the region a
// slot's art occupies, so store rows can show a close-up thumbnail.
const SLOT_VIEWBOX = {
  Top: "40 40 140 140",
  Bottom: "62 150 96 66",
  Feet: "70 210 80 46",
  Waist: "70 136 80 42",
  Wrists: "44 116 132 46",
  Legs: "70 188 80 48",
  Accessory: "126 144 50 46",
  Aura: "-30 0 300 290",
  Display: "144 8 60 96",
};

// Ghost silhouette behind the item so on-body pieces read in context.
function GhostBody() {
  const { cx, shoulderY, waistY, hipY, legHeight, armHeight } = METRICS;
  const shoulder = 75;
  const waist = 53;
  const fill = "rgba(255,255,255,0.05)";
  return (
    <g>
      <circle cx={cx} cy={shoulderY - 24} r="19" fill={fill} />
      <path
        d={`M ${cx - shoulder / 2} ${shoulderY}
            Q ${cx - shoulder / 2 - 6} ${(shoulderY + waistY) / 2} ${cx - waist / 2} ${waistY}
            L ${cx - waist / 2 - 3} ${hipY} L ${cx + waist / 2 + 3} ${hipY} L ${cx + waist / 2} ${waistY}
            Q ${cx + shoulder / 2 + 6} ${(shoulderY + waistY) / 2} ${cx + shoulder / 2} ${shoulderY}
            Q ${cx} ${shoulderY - 12} ${cx - shoulder / 2} ${shoulderY} Z`}
        fill={fill}
      />
      <rect x={cx - shoulder / 2 - 21} y={shoulderY + 8} width="19" height={armHeight} rx="9.5" fill={fill} />
      <rect x={cx + shoulder / 2 + 2} y={shoulderY + 8} width="19" height={armHeight} rx="9.5" fill={fill} />
      <rect x={cx - 25.5} y={hipY - 2} width="24" height={legHeight} rx="10" fill={fill} />
      <rect x={cx + 1.5} y={hipY - 2} width="24" height={legHeight} rx="10" fill={fill} />
    </g>
  );
}

export default function ItemThumb({ item }) {
  const viewBox = SLOT_VIEWBOX[item.category] ?? "-30 0 300 290";
  const [vx, vy, vw, vh] = viewBox.split(" ").map(Number);
  return (
    <svg viewBox={viewBox} width="100%" height="100%" aria-hidden="true" style={{ display: "block" }}>
      {/* Lifted backdrop so near-black garments (hoodie, shorts) still read
          against the dark card surface. */}
      <rect x={vx} y={vy} width={vw} height={vh} fill="#22222c" />
      <GhostBody />
      <StoreCosmeticLayer item={item} metrics={METRICS} />
    </svg>
  );
}
