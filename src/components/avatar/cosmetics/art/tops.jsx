import { geoOr, torsoHalf } from "./shared";

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

// TODO(art): Cutoff Tee — placeholder, renders nothing until drawn.
export function CutoffTee() {
  return null;
}

// TODO(art): Compression Long Sleeve — placeholder, renders nothing until drawn.
export function CompressionLongSleeve() {
  return null;
}

// TODO(art): Team Windbreaker — placeholder, renders nothing until drawn.
export function TeamWindbreaker() {
  return null;
}
