import { getStageForLevel } from "../../lib/avatarConfig";

// Stage 1 = out of shape, stage 6 = lean/defined. Purely silhouette
// proportions here — six-pack lines, chest shading, etc. are separate
// earned-gear layers drawn on top, never baked into the base body.
const STAGE_PARAMS = [
  { shoulder: 60, waist: 70, armWidth: 18, legWidth: 23, rim: 0 },
  { shoulder: 66, waist: 62, armWidth: 19, legWidth: 23, rim: 0.1 },
  { shoulder: 72, waist: 56, armWidth: 19, legWidth: 24, rim: 0.2 },
  { shoulder: 78, waist: 51, armWidth: 20, legWidth: 24, rim: 0.35 },
  { shoulder: 84, waist: 47, armWidth: 21, legWidth: 25, rim: 0.5 },
  { shoulder: 90, waist: 44, armWidth: 22, legWidth: 26, rim: 0.7 },
];

export default function AvatarBody({ level, metrics, pulse }) {
  const stage = getStageForLevel(level);
  const p = STAGE_PARAMS[stage - 1];
  const { cx, shoulderY, waistY, hipY, legHeight, armHeight } = metrics;

  const torsoPath = `
    M ${cx - p.shoulder / 2} ${shoulderY}
    Q ${cx - p.shoulder / 2 - 6} ${(shoulderY + waistY) / 2} ${cx - p.waist / 2} ${waistY}
    L ${cx - p.waist / 2 - 3} ${hipY}
    L ${cx + p.waist / 2 + 3} ${hipY}
    L ${cx + p.waist / 2} ${waistY}
    Q ${cx + p.shoulder / 2 + 6} ${(shoulderY + waistY) / 2} ${cx + p.shoulder / 2} ${shoulderY}
    Q ${cx} ${shoulderY - 12} ${cx - p.shoulder / 2} ${shoulderY}
    Z
  `;

  return (
    <g
      className={pulse ? "avatar-pulse" : undefined}
      style={{ transformOrigin: `${cx}px ${shoulderY + 40}px` }}
    >
      {/* legs */}
      <rect
        x={cx - p.waist / 2 + 5}
        y={hipY - 2}
        width={p.legWidth}
        height={legHeight}
        rx={p.legWidth / 2.4}
        fill="#1a1a23"
        stroke="#2a2a36"
        strokeWidth="1.5"
      />
      <rect
        x={cx + p.waist / 2 - 5 - p.legWidth}
        y={hipY - 2}
        width={p.legWidth}
        height={legHeight}
        rx={p.legWidth / 2.4}
        fill="#1a1a23"
        stroke="#2a2a36"
        strokeWidth="1.5"
      />

      {/* arms — small gap from the torso so they read as distinct limbs */}
      <rect
        x={cx - p.shoulder / 2 - p.armWidth - 2}
        y={shoulderY + 8}
        width={p.armWidth}
        height={armHeight}
        rx={p.armWidth / 2}
        fill="#1a1a23"
        stroke="#2a2a36"
        strokeWidth="1.5"
      />
      <rect
        x={cx + p.shoulder / 2 + 2}
        y={shoulderY + 8}
        width={p.armWidth}
        height={armHeight}
        rx={p.armWidth / 2}
        fill="#1a1a23"
        stroke="#2a2a36"
        strokeWidth="1.5"
      />

      {/* torso */}
      <path d={torsoPath} fill="#1a1a23" stroke="#2a2a36" strokeWidth="1.5" />
      {p.rim > 0 && (
        <path d={torsoPath} fill="none" stroke="#5ab4ff" strokeOpacity={p.rim * 0.4} strokeWidth="1.5" />
      )}

      {/* head */}
      <circle cx={cx} cy={shoulderY - 24} r="19" fill="#1a1a23" stroke="#2a2a36" strokeWidth="1.5" />
    </g>
  );
}

export { STAGE_PARAMS };
