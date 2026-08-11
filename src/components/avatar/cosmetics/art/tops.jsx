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

export function CutoffTee({ metrics, geo }) {
  const g = geoOr(geo, metrics);
  const { cx, shoulderY, waistY, hipY } = metrics;
  const midY = (shoulderY + waistY) / 2;
  const topY = shoulderY - 3;
  // Untucked, so the hem falls onto the shorts: hemmed at the waist it leaves
  // a bare midriff at every stage, since the shorts don't start until hipY-4.
  const hemY = hipY - 2;
  const shoulderOut = g.shoulderHalf + 3;
  const hemOut = g.waistHalf + 5.5;
  const sideCtrl = g.shoulderHalf + 9;
  const neckHalf = 10;
  // The cut runs across the arm itself, so the caps are measured off the arm
  // rects and run far enough inboard to finish underneath the body panel —
  // drawn over it they'd read as two pauldrons stuck to the shoulders.
  const capTop = g.armTopY - 5;
  const capBot = g.armTopY + 12;
  const caps = [
    { x0: g.armLeftX - 2, x1: g.armLeftX + g.armWidth + 9 },
    { x0: g.armRightX - 9, x1: g.armRightX + g.armWidth + 2 },
  ];
  return (
    <g>
      {caps.map(({ x0, x1 }) => (
        <path
          key={x0}
          d={`M ${x0} ${capBot}
              L ${x0} ${capTop + 6}
              Q ${x0} ${capTop} ${x0 + 7} ${capTop}
              L ${x1} ${capTop}
              L ${x1} ${capBot}
              L ${x0 + (x1 - x0) * 0.76} ${capBot - 1.8}
              L ${x0 + (x1 - x0) * 0.55} ${capBot + 1.1}
              L ${x0 + (x1 - x0) * 0.34} ${capBot - 1.6}
              L ${x0 + (x1 - x0) * 0.15} ${capBot + 0.9}
              Z`}
          fill="#9aa2ae"
          stroke="#6f7784"
          strokeWidth="1.4"
        />
      ))}
      <path
        d={`M ${cx - shoulderOut} ${topY}
            Q ${cx - shoulderOut * 0.6} ${shoulderY - 9} ${cx - neckHalf} ${shoulderY - 7}
            Q ${cx} ${shoulderY + 6} ${cx + neckHalf} ${shoulderY - 7}
            Q ${cx + shoulderOut * 0.6} ${shoulderY - 9} ${cx + shoulderOut} ${topY}
            Q ${cx + sideCtrl} ${midY} ${cx + hemOut} ${hemY}
            L ${cx - hemOut} ${hemY}
            Q ${cx - sideCtrl} ${midY} ${cx - shoulderOut} ${topY}
            Z`}
        fill="#9aa2ae"
        stroke="#6f7784"
        strokeWidth="1.4"
      />
      {/* raw armhole: the seam was cut straight through, so the join is a bare
          scissor line with a loose thread, not a finished hem */}
      {[-1, 1].map((s) => (
        <g key={s}>
          <path
            d={`M ${cx + s * (shoulderOut - 1)} ${topY + 3} Q ${cx + s * (shoulderOut + 1)} ${shoulderY + 10} ${cx + s * (shoulderOut - 3)} ${shoulderY + 20}`}
            fill="none"
            stroke="#7f8794"
            strokeWidth="1.2"
            strokeDasharray="2.4 2.2"
          />
          <path
            d={`M ${cx + s * (shoulderOut - 2.5)} ${shoulderY + 21} l ${s * 2} 3`}
            stroke="#b4bcc7"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </g>
      ))}
      <path
        d={`M ${cx - neckHalf - 1.5} ${shoulderY - 7.5} Q ${cx} ${shoulderY + 7.5} ${cx + neckHalf + 1.5} ${shoulderY - 7.5}`}
        fill="none"
        stroke="#b4bcc7"
        strokeWidth="2.4"
      />
      <path
        d={`M ${cx - torsoHalf(g, shoulderY + 34) * 0.5} ${shoulderY + 34} Q ${cx} ${shoulderY + 40} ${cx + torsoHalf(g, shoulderY + 34) * 0.5} ${shoulderY + 34}`}
        fill="none"
        stroke="#8b93a0"
        strokeWidth="1.2"
        strokeOpacity="0.8"
      />
      <path
        d={`M ${cx - hemOut + 2} ${hemY - 3.5} L ${cx + hemOut - 2} ${hemY - 3.5}`}
        stroke="#8b93a0"
        strokeWidth="1.1"
        strokeOpacity="0.7"
      />
    </g>
  );
}


export function CompressionLongSleeve({ metrics, geo }) {
  const g = geoOr(geo, metrics);
  const { cx, shoulderY, waistY, hipY } = metrics;
  const midY = (shoulderY + waistY) / 2;
  const topY = shoulderY - 2;
  const hemY = hipY - 2;
  // Second skin: the smallest margin that still hides the body's own outline
  // stroke. Any looser and it stops reading as compression wear.
  const shoulderOut = g.shoulderHalf + 1.5;
  const hemOut = g.waistHalf + 4;
  const sideCtrl = g.shoulderHalf + 8;
  const neckHalf = 9;
  const sleeveW = g.armWidth + 2;
  const sleeveTop = g.armTopY - 4;
  // Runs 1px past the arm so no skin shows at the wrist; a Wrists cosmetic
  // draws over the top of it, which is the correct stacking order anyway.
  const sleeveH = g.armHeight + 5;
  return (
    <g>
      {[g.armLeftX - 1, g.armRightX - 1].map((x) => (
        <g key={x}>
          <rect
            x={x}
            y={sleeveTop}
            width={sleeveW}
            height={sleeveH}
            rx={g.armWidth / 2 + 1}
            fill="#1e1e2a"
            stroke="#4a4a64"
            strokeWidth="1.4"
          />
          <line
            x1={x + sleeveW / 2}
            y1={sleeveTop + 6}
            x2={x + sleeveW / 2}
            y2={sleeveTop + sleeveH - 12}
            stroke="#5ab4ff"
            strokeWidth="1.2"
            strokeOpacity="0.55"
          />
          <rect
            x={x + 0.6}
            y={sleeveTop + sleeveH - 11}
            width={sleeveW - 1.2}
            height="7"
            rx="3"
            fill="#2a2a3a"
            stroke="#5ab4ff"
            strokeWidth="1.2"
            strokeOpacity="0.8"
          />
        </g>
      ))}
      <path
        d={`M ${cx - shoulderOut} ${topY}
            Q ${cx - shoulderOut * 0.55} ${shoulderY - 8} ${cx - neckHalf} ${shoulderY - 6}
            Q ${cx} ${shoulderY + 3} ${cx + neckHalf} ${shoulderY - 6}
            Q ${cx + shoulderOut * 0.55} ${shoulderY - 8} ${cx + shoulderOut} ${topY}
            Q ${cx + sideCtrl} ${midY} ${cx + hemOut} ${hemY}
            L ${cx - hemOut} ${hemY}
            Q ${cx - sideCtrl} ${midY} ${cx - shoulderOut} ${topY}
            Z`}
        fill="#1e1e2a"
        stroke="#4a4a64"
        strokeWidth="1.4"
      />
      {/* raglan seams and panel lines are the whole read on a black garment —
          without them the torso is a silhouette-shaped hole */}
      {[-1, 1].map((s) => (
        <path
          key={s}
          d={`M ${cx + s * (neckHalf + 1)} ${shoulderY - 5} Q ${cx + s * (shoulderOut * 0.7)} ${shoulderY + 4} ${cx + s * (shoulderOut - 1)} ${shoulderY + 16}`}
          fill="none"
          stroke="#5ab4ff"
          strokeWidth="1.4"
          strokeOpacity="0.7"
        />
      ))}
      <path
        d={`M ${cx - torsoHalf(g, shoulderY + 30) * 0.62} ${shoulderY + 24} L ${cx} ${shoulderY + 32} L ${cx + torsoHalf(g, shoulderY + 30) * 0.62} ${shoulderY + 24}`}
        fill="none"
        stroke="#5ab4ff"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <line x1={cx} y1={shoulderY + 34} x2={cx} y2={hemY - 5} stroke="#5ab4ff" strokeWidth="1.1" strokeOpacity="0.45" />
      {[-1, 1].map((s) => (
        <path
          key={`side${s}`}
          d={`M ${cx + s * (shoulderOut - 2)} ${shoulderY + 20} Q ${cx + s * (sideCtrl - 3)} ${midY} ${cx + s * (hemOut - 2)} ${hemY - 4}`}
          fill="none"
          stroke="#5ab4ff"
          strokeWidth="1.1"
          strokeOpacity="0.4"
        />
      ))}
      <path
        d={`M ${cx - neckHalf - 1} ${shoulderY - 6.5} Q ${cx} ${shoulderY + 4} ${cx + neckHalf + 1} ${shoulderY - 6.5}`}
        fill="none"
        stroke="#5ab4ff"
        strokeWidth="1.8"
        strokeOpacity="0.85"
      />
      <rect x={cx - hemOut + 1} y={hemY - 5} width={(hemOut - 1) * 2} height="4.5" fill="#5ab4ff" fillOpacity="0.16" />
    </g>
  );
}


export function TeamWindbreaker({ metrics, geo }) {
  const g = geoOr(geo, metrics);
  const { cx, shoulderY, waistY, hipY } = metrics;
  const midY = (shoulderY + waistY) / 2;
  const topY = shoulderY - 4;
  const hemY = hipY - 2;
  const topOut = g.shoulderHalf + 5;
  // A shell blouses out instead of tapering, so the hem is driven by the
  // shoulder at the lean stages and by the waist at the wide ones.
  const hemOut = Math.max(g.waistHalf + 6, g.shoulderHalf * 0.88);
  const sideCtrl = g.shoulderHalf + 9;
  const neckHalf = 13;
  const sleeveW = g.armWidth + 6;
  const sleeveTop = g.armTopY - 6;
  const sleeveBot = g.armBottomY - 1;
  const stripeY = shoulderY + 26;
  return (
    <g>
      {[g.armLeftX - 3, g.armRightX - 3].map((x) => (
        <g key={x}>
          <rect
            x={x}
            y={sleeveTop}
            width={sleeveW}
            height={sleeveBot - sleeveTop}
            rx={g.armWidth / 2 + 2}
            fill="#2a4661"
            stroke="#16283a"
            strokeWidth="1.4"
          />
          <rect x={x + 1.5} y={stripeY - 3} width={sleeveW - 3} height="5" fill="#5ab4ff" />
          <rect
            x={x + 0.8}
            y={sleeveBot - 8}
            width={sleeveW - 1.6}
            height="7"
            rx="3"
            fill="#1c3145"
            stroke="#16283a"
            strokeWidth="1.2"
          />
        </g>
      ))}
      <path
        d={`M ${cx - topOut} ${topY}
            Q ${cx - topOut * 0.55} ${shoulderY - 12} ${cx - neckHalf} ${shoulderY - 3}
            Q ${cx} ${shoulderY + 5} ${cx + neckHalf} ${shoulderY - 3}
            Q ${cx + topOut * 0.55} ${shoulderY - 12} ${cx + topOut} ${topY}
            Q ${cx + sideCtrl} ${midY} ${cx + hemOut} ${hemY}
            L ${cx - hemOut} ${hemY}
            Q ${cx - sideCtrl} ${midY} ${cx - topOut} ${topY}
            Z`}
        fill="#2a4661"
        stroke="#16283a"
        strokeWidth="1.5"
      />
      <path
        d={`M ${cx - torsoHalf(g, stripeY) - 6} ${stripeY - 3} L ${cx + torsoHalf(g, stripeY) + 6} ${stripeY - 3}
            L ${cx + torsoHalf(g, stripeY) + 6} ${stripeY + 2} L ${cx - torsoHalf(g, stripeY) - 6} ${stripeY + 2} Z`}
        fill="#5ab4ff"
      />
      <rect x={cx - hemOut} y={hemY - 7} width={hemOut * 2} height="7" fill="#1c3145" stroke="#16283a" strokeWidth="1.2" />
      {/* zip placket: the teeth line has to sit on top of the chest stripe,
          otherwise the jacket reads as a pullover */}
      <rect x={cx - 3} y={shoulderY - 2} width="6" height={hemY - shoulderY} fill="#1c3145" />
      <line x1={cx} y1={shoulderY - 2} x2={cx} y2={hemY - 1} stroke="#8f9db0" strokeWidth="1.2" strokeDasharray="1.6 1.6" />
      <rect x={cx - 2.2} y={shoulderY + 12} width="4.4" height="6" rx="1.4" fill="#c9d3e0" stroke="#7d8899" strokeWidth="0.9" />
      <path
        d={`M ${cx - 15} ${shoulderY + 3}
            L ${cx - 13} ${shoulderY - 13}
            Q ${cx} ${shoulderY - 5} ${cx + 13} ${shoulderY - 13}
            L ${cx + 15} ${shoulderY + 3}
            Z`}
        fill="#1c3145"
        stroke="#16283a"
        strokeWidth="1.4"
      />
      <path
        d={`M ${cx - 12} ${shoulderY - 10.5} Q ${cx} ${shoulderY - 3} ${cx + 12} ${shoulderY - 10.5}`}
        fill="none"
        stroke="#5ab4ff"
        strokeWidth="1.4"
        strokeOpacity="0.85"
      />
    </g>
  );
}
