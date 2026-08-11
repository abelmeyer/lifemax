import { useId } from "react";
import { getStageGeometry } from "../../../lib/avatarConfig";

// Real vector art for each store item, keyed by store_items.name.
// StoreCosmeticLayer looks an item up here first and only falls back to the
// generic per-slot placeholder for names without art yet — so new store rows
// added in Supabase still render something before art lands here.
//
// Geometry contract: every component takes { metrics, geo }. `metrics` is the
// fixed layout (cx 110 · shoulders y78 · waist y150 · hips y168); `geo` is
// getStageGeometry(level, metrics) — the EXACT rectangles AvatarBody draws at
// the wearer's physique stage: shoulderHalf/waistHalf, armLeftX/armRightX +
// armWidth, legLeftX/legRightX + legWidth, and hipHalf (the width a Bottom
// must cover). Fixed pixel offsets are a bug here: shoulders span 60→90 and
// the waist 70→44 across the six stages, so anything hardcoded detaches from
// the body at stage 1 and stage 6. Anchor to `geo`, then add a couple of px
// of margin so the garment reads as fabric over the limb rather than paint.

// Callers outside the avatar (store thumbnails) render art without a level;
// mid-range physique matches the ghost body ItemThumb draws behind it.
const geoOr = (geo, metrics) => geo ?? getStageGeometry(4, metrics);

// Half-width of the torso silhouette at a given y — the same quadratic
// AvatarBody sweeps down each side — so a top can be cut proud of the body
// it covers at every point, not just at the shoulder and waist.
function torsoHalf(g, y) {
  const t = Math.min(1, Math.max(0, (y - g.shoulderY) / (g.waistY - g.shoulderY)));
  const ctrl = g.shoulderHalf + 6;
  return (1 - t) * (1 - t) * g.shoulderHalf + 2 * t * (1 - t) * ctrl + t * t * g.waistHalf;
}

export function ClassicTankTop({ metrics, geo }) {
  const g = geoOr(geo, metrics);
  const { cx, shoulderY, waistY } = metrics;
  const midY = (shoulderY + waistY) / 2;
  const topY = shoulderY - 4;
  const hemY = waistY - 4;
  // Sides ride the body's own curve, 2px proud of it, so no skin shows at the
  // waist (widest at stage 1) or at the shoulder (widest at stage 6).
  const shoulderOut = g.shoulderHalf + 2;
  const hemOut = torsoHalf(g, hemY) + 2;
  const sideCtrl = g.shoulderHalf + 8;
  // The neck opening stays neck-sized; broader shoulders widen the strap.
  const strapIn = Math.min(Math.max(shoulderOut - 11, 16), 26);
  const foldHalf = torsoHalf(g, waistY - 22) - 3;
  return (
    <g>
      <path
        d={`M ${cx - shoulderOut} ${topY}
            L ${cx - strapIn} ${shoulderY - 6}
            Q ${cx - strapIn + 5} ${shoulderY + 8} ${cx} ${shoulderY + 8}
            Q ${cx + strapIn - 5} ${shoulderY + 8} ${cx + strapIn} ${shoulderY - 6}
            L ${cx + shoulderOut} ${topY}
            Q ${cx + sideCtrl} ${midY} ${cx + hemOut} ${hemY}
            L ${cx - hemOut} ${hemY}
            Q ${cx - sideCtrl} ${midY} ${cx - shoulderOut} ${topY}
            Z`}
        fill="#e4e7ed"
        stroke="#c2c8d3"
        strokeWidth="1.4"
      />
      <path
        d={`M ${cx - foldHalf} ${waistY - 22} Q ${cx} ${waistY - 18} ${cx + foldHalf} ${waistY - 22}`}
        fill="none"
        stroke="#c2c8d3"
        strokeWidth="1.1"
        strokeOpacity="0.7"
      />
    </g>
  );
}

export function ProSinglet({ metrics, geo }) {
  const g = geoOr(geo, metrics);
  const { cx, shoulderY, waistY, hipY } = metrics;
  const midY = (shoulderY + waistY) / 2;
  const topY = shoulderY - 6;
  const shoulderOut = g.shoulderHalf + 2;
  const waistOut = g.waistHalf + 2;
  const sideCtrl = g.shoulderHalf + 8;
  const strapIn = Math.min(Math.max(shoulderOut - 8, 17), 27);
  // The leg openings flare to the hip so the shorts underneath don't spill out
  // at the sides at the wide-waisted early stages.
  const hipOut = g.hipHalf + 1;
  const chestHalf = torsoHalf(g, shoulderY + 42) * 0.58;
  return (
    <g>
      <path
        d={`M ${cx - shoulderOut} ${topY}
            L ${cx - strapIn} ${shoulderY - 7}
            Q ${cx - strapIn + 5} ${shoulderY + 10} ${cx} ${shoulderY + 10}
            Q ${cx + strapIn - 5} ${shoulderY + 10} ${cx + strapIn} ${shoulderY - 7}
            L ${cx + shoulderOut} ${topY}
            Q ${cx + sideCtrl} ${midY} ${cx + waistOut} ${waistY}
            Q ${cx + waistOut} ${waistY + 8} ${cx + hipOut} ${hipY + 2}
            L ${cx + hipOut - 2} ${hipY + 16}
            L ${cx + 6} ${hipY + 18} L ${cx + 6} ${hipY + 6} L ${cx - 6} ${hipY + 6} L ${cx - 6} ${hipY + 18}
            L ${cx - hipOut + 2} ${hipY + 16}
            L ${cx - hipOut} ${hipY + 2}
            Q ${cx - waistOut} ${waistY + 8} ${cx - waistOut} ${waistY}
            Q ${cx - sideCtrl} ${midY} ${cx - shoulderOut} ${topY}
            Z`}
        fill="#2e6cab"
        stroke="#1f4f80"
        strokeWidth="1.4"
      />
      <path
        d={`M ${cx - shoulderOut} ${topY} L ${cx - strapIn} ${shoulderY - 7} M ${cx + strapIn} ${shoulderY - 7} L ${cx + shoulderOut} ${topY}`}
        stroke="#5ab4ff"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d={`M ${cx - chestHalf} ${shoulderY + 42} Q ${cx} ${shoulderY + 50} ${cx + chestHalf} ${shoulderY + 42}`}
        fill="none"
        stroke="#5ab4ff"
        strokeWidth="1.6"
        strokeOpacity="0.85"
      />
      <circle cx={cx} cy={shoulderY + 26} r="6" fill="none" stroke="#5ab4ff" strokeWidth="1.4" strokeOpacity="0.9" />
      <path
        d={`M ${cx - 3} ${shoulderY + 26} L ${cx + 3} ${shoulderY + 26} M ${cx} ${shoulderY + 23} L ${cx} ${shoulderY + 29}`}
        stroke="#5ab4ff"
        strokeWidth="1.2"
        strokeOpacity="0.9"
      />
    </g>
  );
}

export function SignatureHoodie({ metrics, geo }) {
  const g = geoOr(geo, metrics);
  const { cx, shoulderY, waistY } = metrics;
  const headCy = shoulderY - 24;
  const midY = (shoulderY + waistY) / 2;
  // Boxy: 4px looser than the shoulder, and a hem that never tucks inside the
  // waist — at stage 1 the waist is WIDER than the shoulders, so the hem is
  // driven by whichever of the two is broader.
  const topOut = g.shoulderHalf + 4;
  const hemOut = Math.max(g.waistHalf + 3, g.shoulderHalf * 0.85);
  const sideCtrl = g.shoulderHalf + 7;
  // Sleeves wrap the actual arm rects, 1.5px proud on each side.
  const sleeveW = g.armWidth + 3;
  const sleeveY = g.armTopY - 4;
  const sleeveH = g.armHeight + 2;
  return (
    <g>
      {/* hood bunched behind the neck */}
      <path
        d={`M ${cx - 24} ${shoulderY + 2}
            Q ${cx - 26} ${headCy + 10} ${cx - 14} ${headCy + 6}
            Q ${cx} ${headCy + 16} ${cx + 14} ${headCy + 6}
            Q ${cx + 26} ${headCy + 10} ${cx + 24} ${shoulderY + 2}
            Z`}
        fill="#2c2c3a"
        stroke="#3d3d4e"
        strokeWidth="1.4"
      />
      {/* body — boxy, sits looser than the torso */}
      <path
        d={`M ${cx - topOut} ${shoulderY - 2}
            Q ${cx - 20} ${shoulderY - 10} ${cx} ${shoulderY - 9}
            Q ${cx + 20} ${shoulderY - 10} ${cx + topOut} ${shoulderY - 2}
            Q ${cx + sideCtrl} ${midY} ${cx + hemOut} ${waistY + 2}
            L ${cx - hemOut} ${waistY + 2}
            Q ${cx - sideCtrl} ${midY} ${cx - topOut} ${shoulderY - 2}
            Z`}
        fill="#262633"
        stroke="#3d3d4e"
        strokeWidth="1.4"
      />
      {/* sleeves — anchored to the arm rects, not a fixed offset */}
      <rect x={g.armLeftX - 1.5} y={sleeveY} width={sleeveW} height={sleeveH} rx="10" fill="#262633" stroke="#3d3d4e" strokeWidth="1.4" />
      <rect x={g.armRightX - 1.5} y={sleeveY} width={sleeveW} height={sleeveH} rx="10" fill="#262633" stroke="#3d3d4e" strokeWidth="1.4" />
      {/* kangaroo pocket */}
      <path
        d={`M ${cx - 16} ${waistY - 26} L ${cx + 16} ${waistY - 26} L ${cx + 12} ${waistY - 6} L ${cx - 12} ${waistY - 6} Z`}
        fill="#20202c"
        stroke="#3d3d4e"
        strokeWidth="1.2"
      />
      {/* drawstrings */}
      <path d={`M ${cx - 6} ${shoulderY - 4} Q ${cx - 7} ${shoulderY + 12} ${cx - 5} ${shoulderY + 22}`} fill="none" stroke="#5ab4ff" strokeWidth="1.4" strokeLinecap="round" />
      <path d={`M ${cx + 6} ${shoulderY - 4} Q ${cx + 7} ${shoulderY + 10} ${cx + 5} ${shoulderY + 19}`} fill="none" stroke="#5ab4ff" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx={cx - 5} cy={shoulderY + 24} r="1.4" fill="#5ab4ff" />
      <circle cx={cx + 5} cy={shoulderY + 21} r="1.4" fill="#5ab4ff" />
    </g>
  );
}

export function TrainingShorts({ metrics, geo }) {
  const g = geoOr(geo, metrics);
  const { cx, hipY } = metrics;
  const top = hipY - 5;
  const bottom = hipY + 33;
  // A Bottom hides the default shorts, so these are the ONLY thing covering
  // the hips: never narrower than hipHalf, or bare skin shows at the hip.
  const half = g.hipHalf + 1;
  return (
    <g>
      <path
        d={`M ${cx - half} ${top + 4}
            Q ${cx - half} ${top} ${cx - half + 5} ${top}
            L ${cx + half - 5} ${top}
            Q ${cx + half} ${top} ${cx + half} ${top + 4}
            L ${cx + half - 1} ${bottom - 3}
            Q ${cx + half - 1} ${bottom} ${cx + half - 4} ${bottom}
            L ${cx + 3} ${bottom} L ${cx} ${bottom - 7} L ${cx - 3} ${bottom}
            L ${cx - half + 4} ${bottom}
            Q ${cx - half + 1} ${bottom} ${cx - half + 1} ${bottom - 3}
            Z`}
        fill="#3a3a49"
        stroke="#4a4a5c"
        strokeWidth="1.4"
      />
      <line x1={cx - half + 2} y1={top + 6} x2={cx + half - 2} y2={top + 6} stroke="#5ab4ff" strokeWidth="2" strokeOpacity="0.9" />
      <path d={`M ${cx - half + 4} ${top + 10} L ${cx - half + 7} ${bottom - 4}`} stroke="#5ab4ff" strokeWidth="1.4" strokeOpacity="0.55" />
      <path d={`M ${cx + half - 4} ${top + 10} L ${cx + half - 7} ${bottom - 4}`} stroke="#5ab4ff" strokeWidth="1.4" strokeOpacity="0.55" />
    </g>
  );
}

export function GymSocks({ metrics, geo }) {
  const g = geoOr(geo, metrics);
  // Pulled over the actual leg rects, 1px proud each side, hanging 4px past
  // the ankle so the sock reads as covering the foot.
  const top = g.legBottomY - 20;
  const w = g.legWidth + 2;
  const h = 24;
  return (
    <g>
      {[g.legLeftX - 1, g.legRightX - 1].map((x) => (
        <g key={x}>
          <rect x={x} y={top} width={w} height={h} rx="9" fill="#eef0f4" stroke="#cdd2db" strokeWidth="1.3" />
          <line x1={x + 3} y1={top + 5} x2={x + w - 3} y2={top + 5} stroke="#5ab4ff" strokeWidth="2" />
          <line x1={x + 3} y1={top + 9.5} x2={x + w - 3} y2={top + 9.5} stroke="#5ab4ff" strokeWidth="1.3" strokeOpacity="0.6" />
        </g>
      ))}
    </g>
  );
}

export function LiftingBelt({ metrics, geo }) {
  const g = geoOr(geo, metrics);
  const { cx, waistY } = metrics;
  const top = waistY - 3;
  // Cinched at the waist, 3px proud on each side. The waist half-width runs
  // 35 → 22 across the stages, so a fixed 30 overhangs at stage 6 and floats
  // inside the belly at stage 1.
  const half = g.waistHalf + 3;
  const w = half * 2;
  return (
    <g>
      <rect x={cx - half} y={top} width={w} height="15" rx="4" fill="#7a4a2b" stroke="#5d3820" strokeWidth="1.4" />
      <rect x={cx - half} y={top + 2.5} width={w} height="1.6" fill="#93582f" opacity="0.8" />
      <rect x={cx - half} y={top + 11} width={w} height="1.6" fill="#5d3820" opacity="0.8" />
      <rect x={cx - 7} y={top + 1.5} width="14" height="12" rx="2" fill="#b9bec8" stroke="#8b919c" strokeWidth="1.2" />
      <rect x={cx - 3.5} y={top + 4.5} width="7" height="6" rx="1" fill="#7a4a2b" />
      <circle cx={cx + half * 0.6} cy={top + 7.5} r="1.3" fill="#5d3820" />
      <circle cx={cx + half * 0.8} cy={top + 7.5} r="1.3" fill="#5d3820" />
    </g>
  );
}

export function ChampionshipBelt({ metrics, geo }) {
  const g = geoOr(geo, metrics);
  const { cx, waistY } = metrics;
  const top = waistY - 4;
  const mid = top + 9;
  // Chunkier than the lifting belt: 4px proud of the waist on each side.
  const half = g.waistHalf + 4;
  const w = half * 2;
  return (
    <g>
      <rect x={cx - half} y={top} width={w} height="18" rx="5" fill="#c69a2e" stroke="#98741d" strokeWidth="1.4" />
      <rect x={cx - half} y={top + 2.5} width={w} height="1.8" fill="#e3bd54" opacity="0.9" />
      <ellipse cx={cx} cy={mid} rx="15" ry="12" fill="#e3bd54" stroke="#98741d" strokeWidth="1.5" />
      <ellipse cx={cx} cy={mid} rx="10.5" ry="8.2" fill="#c69a2e" stroke="#98741d" strokeWidth="1" />
      <path
        d={`M ${cx} ${mid - 5.5} L ${cx + 1.7} ${mid - 1.7} L ${cx + 5.5} ${mid - 1.2} L ${cx + 2.8} ${mid + 1.6}
            L ${cx + 3.4} ${mid + 5.4} L ${cx} ${mid + 3.4} L ${cx - 3.4} ${mid + 5.4} L ${cx - 2.8} ${mid + 1.6}
            L ${cx - 5.5} ${mid - 1.2} L ${cx - 1.7} ${mid - 1.7} Z`}
        fill="#fdf3d0"
        stroke="#98741d"
        strokeWidth="0.8"
      />
      <circle cx={cx - half * 0.75} cy={mid} r="4.5" fill="#e3bd54" stroke="#98741d" strokeWidth="1.1" />
      <circle cx={cx + half * 0.75} cy={mid} r="4.5" fill="#e3bd54" stroke="#98741d" strokeWidth="1.1" />
      <circle cx={cx - half * 0.75} cy={mid} r="1.6" fill="#fdf3d0" />
      <circle cx={cx + half * 0.75} cy={mid} r="1.6" fill="#fdf3d0" />
    </g>
  );
}

export function WristWraps({ metrics, geo }) {
  const g = geoOr(geo, metrics);
  // Wrapped round the bottom of the actual arm rects — the arms swing from
  // cx±32 at stage 1 out to cx±69 at stage 6, so a fixed x lands on air.
  const top = g.armBottomY - 18;
  const w = g.armWidth + 3;
  return (
    <g>
      {[g.armLeftX - 1.5, g.armRightX - 1.5].map((x) => (
        <g key={x}>
          <rect x={x} y={top} width={w} height="14" rx="5" fill="#e8e9ef" stroke="#c6c9d4" strokeWidth="1.2" />
          <path d={`M ${x + 2} ${top + 9} L ${x + w - 2} ${top + 4}`} stroke="#c6c9d4" strokeWidth="1.1" />
          <path d={`M ${x + 2} ${top + 12} L ${x + w - 2} ${top + 7}`} stroke="#c6c9d4" strokeWidth="1.1" />
          <rect x={x + w / 2 - 2} y={top - 2.5} width="4" height="3.5" rx="1" fill="#5ab4ff" />
        </g>
      ))}
    </g>
  );
}

export function ChalkBag({ metrics }) {
  const { cx, hipY } = metrics;
  const bx = cx + 38;
  const by = hipY - 6;
  return (
    <g>
      <path d={`M ${bx - 6} ${by - 4} Q ${cx + 26} ${by - 10} ${cx + 20} ${by - 12}`} fill="none" stroke="#6e5a3f" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d={`M ${bx - 8} ${by}
            Q ${bx - 9} ${by - 5} ${bx - 5} ${by - 5}
            L ${bx + 5} ${by - 5}
            Q ${bx + 9} ${by - 5} ${bx + 8} ${by}
            Q ${bx + 10} ${by + 16} ${bx} ${by + 17}
            Q ${bx - 10} ${by + 16} ${bx - 8} ${by}
            Z`}
        fill="#d8d1c2"
        stroke="#b3a98f"
        strokeWidth="1.3"
      />
      <path d={`M ${bx - 7} ${by - 1} Q ${bx} ${by + 2} ${bx + 7} ${by - 1}`} fill="none" stroke="#b3a98f" strokeWidth="1.2" />
      <circle cx={bx - 3} cy={by - 8} r="1.6" fill="#eef0f4" opacity="0.8" />
      <circle cx={bx + 4} cy={by - 11} r="1.1" fill="#eef0f4" opacity="0.6" />
      <circle cx={bx + 1} cy={by - 14} r="0.8" fill="#eef0f4" opacity="0.45" />
    </g>
  );
}

export function KneeSleeves({ metrics, geo }) {
  const g = geoOr(geo, metrics);
  // Sleeved over the actual leg rects at knee height, 1px proud each side.
  const top = g.legTopY + 32;
  const w = g.legWidth + 2;
  const h = 22;
  return (
    <g>
      {[g.legLeftX - 1, g.legRightX - 1].map((x) => (
        <g key={x}>
          <rect x={x} y={top} width={w} height={h} rx="8" fill="#2b2b36" stroke="#41414f" strokeWidth="1.3" />
          <path d={`M ${x + 3} ${top + 6} L ${x + w - 3} ${top + 3.5} M ${x + 3} ${top + 11} L ${x + w - 3} ${top + 8.5} M ${x + 3} ${top + 16} L ${x + w - 3} ${top + 13.5}`} stroke="#41414f" strokeWidth="1" />
          <line x1={x + 2.5} y1={top + 2} x2={x + w - 2.5} y2={top + 2} stroke="#5ab4ff" strokeWidth="1.4" strokeOpacity="0.8" />
          <line x1={x + 2.5} y1={top + h - 2} x2={x + w - 2.5} y2={top + h - 2} stroke="#5ab4ff" strokeWidth="1.4" strokeOpacity="0.8" />
        </g>
      ))}
    </g>
  );
}

export function DiamondAura({ metrics }) {
  const { cx, shoulderY } = metrics;
  const cy = shoulderY + 60;
  const gradientId = useId();

  const diamond = (x, y, s, o) =>
    `M ${x} ${y - s} L ${x + s * 0.7} ${y} L ${x} ${y + s} L ${x - s * 0.7} ${y} Z|${o}`;
  const diamonds = [
    diamond(cx - 78, cy - 46, 7, 0.9),
    diamond(cx + 80, cy - 22, 5.5, 0.75),
    diamond(cx - 66, cy + 52, 5, 0.7),
    diamond(cx + 68, cy + 58, 6.5, 0.85),
    diamond(cx + 2, cy - 112, 5.5, 0.8),
  ];

  return (
    <g className="cosmetic-aura-pulse">
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#9fd4ff" stopOpacity="0.4" />
          <stop offset="55%" stopColor="#5ab4ff" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#5ab4ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r="122" fill={`url(#${gradientId})`} />
      {diamonds.map((d, i) => {
        const [path, opacity] = d.split("|");
        return (
          <path key={i} d={path} fill="#bfe2ff" fillOpacity={Number(opacity) * 0.55} stroke="#9fd4ff" strokeOpacity={opacity} strokeWidth="1.1" />
        );
      })}
      <g stroke="#d8eeff" strokeWidth="1.1" strokeLinecap="round">
        <path d={`M ${cx - 88} ${cy + 8} l 0 7 M ${cx - 91.5} ${cy + 11.5} l 7 0`} opacity="0.8" />
        <path d={`M ${cx + 90} ${cy - 64} l 0 6 M ${cx + 87} ${cy - 61} l 6 0`} opacity="0.7" />
        <path d={`M ${cx + 14} ${cy - 128} l 0 5 M ${cx + 11.5} ${cy - 125.5} l 5 0`} opacity="0.6" />
      </g>
    </g>
  );
}

export function TrophyCase({ metrics }) {
  const { cx } = metrics;
  const x = cx + 62;

  const trophy = (tx, ty, color) => (
    <g transform={`translate(${tx}, ${ty})`}>
      <path d="M -4 0 L 4 0 L 3 6 Q 0 8.5 -3 6 Z" fill={color} />
      <path d="M -4 1 Q -7 2 -5 5 M 4 1 Q 7 2 5 5" stroke={color} strokeWidth="1.1" fill="none" />
      <rect x="-1.2" y="8" width="2.4" height="2.5" fill={color} />
      <rect x="-3.5" y="10.5" width="7" height="2" rx="0.6" fill={color} />
    </g>
  );

  return (
    <g>
      <rect x={x - 20} y="18" width="40" height="76" rx="6" fill="#14141c" stroke="#3d3d4e" strokeWidth="1.4" />
      <rect x={x - 20} y="18" width="40" height="76" rx="6" fill="none" stroke="#5ab4ff" strokeOpacity="0.25" strokeWidth="1.4" />
      <line x1={x - 16} y1="44" x2={x + 16} y2="44" stroke="#3d3d4e" strokeWidth="1.3" />
      <line x1={x - 16} y1="69" x2={x + 16} y2="69" stroke="#3d3d4e" strokeWidth="1.3" />
      {trophy(x - 8, 30, "#e3bd54")}
      {trophy(x + 8, 30, "#b9bec8")}
      {trophy(x, 55, "#c69a2e")}
      <ellipse cx={x} cy="86" rx="10" ry="2.5" fill="#5ab4ff" opacity="0.12" />
      <path d={`M ${x - 5} 80 L ${x + 5} 80 L ${x + 4} 84 L ${x - 4} 84 Z`} fill="#e3bd54" opacity="0.9" />
    </g>
  );
}

export const ITEM_ART = {
  "Classic Tank Top": ClassicTankTop,
  "Pro Singlet": ProSinglet,
  "Signature Hoodie": SignatureHoodie,
  "Training Shorts": TrainingShorts,
  "Gym Socks": GymSocks,
  "Lifting Belt": LiftingBelt,
  "Golden Championship Belt": ChampionshipBelt,
  "Wrist Wraps": WristWraps,
  "Chalk Bag": ChalkBag,
  "Carbon Knee Sleeves": KneeSleeves,
  "Diamond Avatar Aura": DiamondAura,
  "Legacy Trophy Case": TrophyCase,
};
