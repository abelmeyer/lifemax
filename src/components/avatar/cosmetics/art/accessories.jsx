import { geoOr, torsoHalf } from "./shared";

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

export function GymTowel({ metrics, geo }) {
  const g = geoOr(geo, metrics);
  const { cx, shoulderY, waistY } = metrics;
  // Slung over the near shoulder, so the drape has to start where the shoulder
  // actually ends — that edge slides 30 → 45px out across the six stages.
  const capOut = cx + g.shoulderHalf + 4;
  const capIn = cx + g.shoulderHalf - 23;
  const capMid = (capIn + capOut) / 2;
  const fold = shoulderY + 5;
  // Constant-width tail hung off the outer edge rather than off cx, so a
  // narrow stage-1 shoulder gets the same towel as a wide stage-6 one.
  const tailR = cx + g.shoulderHalf;
  const tailL = tailR - 22;
  const tailMid = (tailL + tailR) / 2;
  const hemY = waistY - 2;
  const band = (y, w) => (
    <>
      <line x1={tailL + 2} y1={y} x2={tailR - 2} y2={y} stroke="#5d6b80" strokeWidth={w} />
      <line x1={tailL + 2.5} y1={y + 4.5} x2={tailR - 2.5} y2={y + 4.5} stroke="#7d8a9c" strokeWidth={w * 0.6} />
    </>
  );
  return (
    <g>
      {/* the half that fell behind the shoulder */}
      <path
        d={`M ${capOut - 9} ${fold}
            L ${capOut + 2} ${fold - 2}
            L ${capOut + 3} ${fold + 21}
            Q ${capOut - 3} ${fold + 25} ${capOut - 9} ${fold + 19}
            Z`}
        fill="#a7aeb8"
        stroke="#848c98"
        strokeWidth="1.2"
      />
      {/* front tail, widening slightly as it falls */}
      <path
        d={`M ${tailL + 1.5} ${fold}
            L ${tailR - 0.5} ${fold}
            L ${tailR} ${hemY}
            Q ${tailMid} ${hemY + 6} ${tailL} ${hemY - 3}
            Z`}
        fill="#c8cdd6"
        stroke="#9aa1ad"
        strokeWidth="1.3"
      />
      {/* woven bands at both ends — the detail that survives thumbnail scale */}
      {band(fold + 10, 3.4)}
      {band(hemY - 17, 3.4)}
      {/* terry texture — reads as cloth rather than card at thumbnail size */}
      <g stroke="#aeb6c1" strokeWidth="0.9" strokeOpacity="0.75">
        <line x1={tailL + 4} y1={hemY - 32} x2={tailMid + 1} y2={hemY - 32} />
        <line x1={tailMid - 1} y1={hemY - 27} x2={tailR - 4} y2={hemY - 27} />
        <line x1={tailL + 4} y1={hemY - 22} x2={tailMid + 2} y2={hemY - 22} />
        <line x1={tailMid - 4} y1={fold + 20} x2={tailMid - 4.5} y2={hemY - 6} strokeOpacity="0.4" />
      </g>
      {/* the fold lying across the shoulder, drawn last so it caps both tails */}
      <path
        d={`M ${capIn} ${shoulderY - 7}
            Q ${capMid} ${shoulderY - 11} ${capOut} ${shoulderY - 2}
            L ${capOut} ${fold + 8}
            Q ${capMid} ${fold + 1} ${capIn} ${fold + 4}
            Z`}
        fill="#d5dae1"
        stroke="#9aa1ad"
        strokeWidth="1.3"
      />
      <path d={`M ${capIn + 2} ${shoulderY - 2.5} Q ${capMid} ${shoulderY - 6} ${capOut - 2} ${shoulderY + 2}`} fill="none" stroke="#aeb5bf" strokeWidth="1" />
    </g>
  );
}

export function WaterBottle({ metrics, geo }) {
  const g = geoOr(geo, metrics);
  const { waistY } = metrics;
  // Carried at the hand, and the hand rides the arm rect — which slides ~12px
  // outward between stage 1 and stage 6.
  const bx = g.armRightX + g.armWidth / 2 - 4;
  const capY = waistY - 2;
  const topY = capY + 9;
  const baseY = capY + 41;
  const half = 11;
  return (
    <g>
      <path
        d={`M ${bx - half} ${topY + 4}
            Q ${bx - half} ${topY - 2} ${bx - 6.5} ${topY - 3}
            L ${bx + 6.5} ${topY - 3}
            Q ${bx + half} ${topY - 2} ${bx + half} ${topY + 4}
            L ${bx + half} ${baseY - 4}
            Q ${bx + half} ${baseY} ${bx + half - 4} ${baseY}
            L ${bx - half + 4} ${baseY}
            Q ${bx - half} ${baseY} ${bx - half} ${baseY - 4}
            Z`}
        fill="#2f3947"
        stroke="#5a6675"
        strokeWidth="1.4"
      />
      <rect x={bx - 8} y={baseY - 26} width="16" height="22" rx="3" fill="#2f7fbf" fillOpacity="0.85" />
      <line x1={bx - 8} y1={baseY - 26} x2={bx + 8} y2={baseY - 26} stroke="#7fc9ff" strokeWidth="1.4" />
      <path d={`M ${bx - 6} ${topY + 5} L ${bx - 6} ${baseY - 9}`} stroke="#dfe9f5" strokeOpacity="0.16" strokeWidth="3.5" strokeLinecap="round" />
      <g stroke="#8f9dae" strokeWidth="1" strokeOpacity="0.7">
        <line x1={bx + 3} y1={baseY - 21} x2={bx + 7.5} y2={baseY - 21} />
        <line x1={bx + 5} y1={baseY - 15} x2={bx + 7.5} y2={baseY - 15} />
        <line x1={bx + 3} y1={baseY - 9} x2={bx + 7.5} y2={baseY - 9} />
      </g>
      <rect x={bx - 9} y={topY - 4} width="18" height="4" rx="1.6" fill="#3f92d6" />
      <rect x={bx - 7.5} y={capY} width="15" height="10" rx="2.5" fill="#5ab4ff" stroke="#2f78b4" strokeWidth="1.2" />
      <rect x={bx - 2.5} y={capY - 3} width="5" height="4" rx="1.2" fill="#3f92d6" />
      <line x1={bx - 5} y1={capY + 5} x2={bx + 5} y2={capY + 5} stroke="#2f78b4" strokeWidth="1" strokeOpacity="0.7" />
    </g>
  );
}

export function WeightedVest({ metrics, geo }) {
  const g = geoOr(geo, metrics);
  const { cx, shoulderY, waistY } = metrics;
  const topY = shoulderY - 4;
  const midY = (shoulderY + waistY) / 2;
  // Snug over the torso: 3px proud at the shoulder, and the sides ride the
  // body's own curve. The hem sits below waistY, where torsoHalf() no longer
  // applies — the body flares 3px from waist to hip, so track that flare.
  const shoulderOut = g.shoulderHalf + 3;
  const sideCtrl = g.shoulderHalf + 9;
  const hemY = waistY + 7;
  const hemOut = g.waistHalf + 6;
  const neckIn = Math.min(Math.max(shoulderOut - 14, 12), 21);
  // Plate grid fits the NARROWEST point it spans, or it punches through the
  // ribs at stage 6 where the waist is only 44px wide.
  const gridTop = shoulderY + 24;
  const gridBot = waistY - 5;
  const gridHalf = Math.min(torsoHalf(g, gridTop), torsoHalf(g, gridBot)) - 5;
  const cellW = gridHalf - 2;
  const cellH = (gridBot - gridTop - 6) / 3;
  const colX = (side) => (side < 0 ? cx - gridHalf : cx + 2);
  const strapY = waistY - 2;
  return (
    <g>
      <path
        d={`M ${cx - shoulderOut} ${topY}
            L ${cx - neckIn} ${shoulderY - 6}
            Q ${cx} ${shoulderY + 16} ${cx + neckIn} ${shoulderY - 6}
            L ${cx + shoulderOut} ${topY}
            Q ${cx + sideCtrl} ${midY} ${cx + hemOut} ${hemY - 5}
            Q ${cx + hemOut} ${hemY} ${cx + hemOut - 5} ${hemY}
            L ${cx - hemOut + 5} ${hemY}
            Q ${cx - hemOut} ${hemY} ${cx - hemOut} ${hemY - 5}
            Q ${cx - sideCtrl} ${midY} ${cx - shoulderOut} ${topY}
            Z`}
        fill="#2b303a"
        stroke="#4b5361"
        strokeWidth="1.5"
      />
      {/* shoulder yokes — heavy webbing, thick enough to read as load-bearing */}
      <path
        d={`M ${cx - shoulderOut} ${topY - 0.5} L ${cx - neckIn} ${shoulderY - 6.5} L ${cx - neckIn + 5} ${shoulderY + 5} L ${cx - shoulderOut + 2} ${topY + 13} Z`}
        fill="#525a6a"
        stroke="#6d7688"
        strokeWidth="1.1"
      />
      <path
        d={`M ${cx + shoulderOut} ${topY - 0.5} L ${cx + neckIn} ${shoulderY - 6.5} L ${cx + neckIn - 5} ${shoulderY + 5} L ${cx + shoulderOut - 2} ${topY + 13} Z`}
        fill="#525a6a"
        stroke="#6d7688"
        strokeWidth="1.1"
      />
      {[0, 1, 2].map((row) => {
        const y = gridTop + row * (cellH + 3);
        return (
          <g key={row}>
            {[-1, 1].map((side) => (
              <g key={side}>
                <rect x={colX(side)} y={y} width={cellW} height={cellH} rx="2.5" fill="#1b1f26" stroke="#4b5361" strokeWidth="1" />
                <rect x={colX(side) + 2.5} y={y + 2.4} width={cellW - 5} height={cellH - 4.8} rx="1.6" fill="#79828f" />
                <rect x={colX(side) + 2.5} y={y + 2.4} width={cellW - 5} height="1.8" rx="0.9" fill="#a8b0bc" />
              </g>
            ))}
          </g>
        );
      })}
      {/* cinch strap, its tails left a touch proud of the shell like real webbing */}
      <rect x={cx - hemOut - 2} y={strapY} width={(hemOut + 2) * 2} height="7" rx="2" fill="#525a6a" stroke="#6d7688" strokeWidth="1.1" />
      <rect x={cx - 6} y={strapY - 1.5} width="12" height="10" rx="2" fill="#b9bec8" stroke="#8b919c" strokeWidth="1.1" />
      <rect x={cx - 2.5} y={strapY + 1.5} width="5" height="4" rx="1" fill="#2b303a" />
      <circle cx={cx - gridHalf + 3} cy={strapY + 3.5} r="1.6" fill="#8b919c" />
      <circle cx={cx + gridHalf - 3} cy={strapY + 3.5} r="1.6" fill="#8b919c" />
    </g>
  );
}

export function ChampionshipMedal({ metrics }) {
  const { cx, shoulderY } = metrics;
  // Hangs off the neck, and neck width and head radius are fixed across the
  // stages — this one rides the centerline, not the torso edges.
  const neckY = shoulderY - 2;
  const ringY = shoulderY + 21;
  const my = ringY + 9;
  const star = (r) =>
    `M ${cx} ${my - r} L ${cx + r * 0.31} ${my - r * 0.31} L ${cx + r} ${my - r * 0.22}
     L ${cx + r * 0.5} ${my + r * 0.29} L ${cx + r * 0.62} ${my + r * 0.98}
     L ${cx} ${my + r * 0.62} L ${cx - r * 0.62} ${my + r * 0.98} L ${cx - r * 0.5} ${my + r * 0.29}
     L ${cx - r} ${my - r * 0.22} L ${cx - r * 0.31} ${my - r * 0.31} Z`;
  return (
    <g>
      <path
        d={`M ${cx - 13} ${neckY - 1} L ${cx - 6} ${neckY + 1} L ${cx - 1.5} ${ringY - 1} L ${cx - 6.5} ${ringY - 1} Z`}
        fill="#a92b3f"
        stroke="#75182a"
        strokeWidth="1.1"
      />
      <path
        d={`M ${cx + 13} ${neckY - 1} L ${cx + 6} ${neckY + 1} L ${cx + 1.5} ${ringY - 1} L ${cx + 6.5} ${ringY - 1} Z`}
        fill="#c33449"
        stroke="#75182a"
        strokeWidth="1.1"
      />
      <path d={`M ${cx - 9.5} ${neckY + 2} L ${cx - 4} ${ringY - 2}`} stroke="#e3bd54" strokeWidth="0.9" strokeOpacity="0.8" />
      <path d={`M ${cx + 9.5} ${neckY + 2} L ${cx + 4} ${ringY - 2}`} stroke="#e3bd54" strokeWidth="0.9" strokeOpacity="0.8" />
      <circle cx={cx} cy={ringY + 1} r="2.9" fill="none" stroke="#e3bd54" strokeWidth="1.6" />
      <circle cx={cx} cy={my} r="9.5" fill="#c69a2e" stroke="#8f6c1c" strokeWidth="1.3" />
      <circle cx={cx} cy={my} r="7.2" fill="#e3bd54" stroke="#c69a2e" strokeWidth="0.9" />
      <path d={star(4.7)} fill="#fdf3d0" stroke="#c69a2e" strokeWidth="0.6" />
      <path d={`M ${cx - 7.4} ${my - 3.4} A 8.3 8.3 0 0 1 ${cx - 1.7} ${my - 9}`} fill="none" stroke="#fff3c9" strokeOpacity="0.55" strokeWidth="1.6" strokeLinecap="round" />
    </g>
  );
}
