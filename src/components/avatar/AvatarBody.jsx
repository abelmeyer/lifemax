import { getStageForLevel, resolveAppearance } from "../../lib/avatarConfig";
import { HairBack, HairFront, Face, FacialHairLayer } from "./appearance";

// Stage 1 = out of shape, stage 6 = lean/defined. Silhouette proportions plus
// an on-body definition level (def) that drives skin-shade muscle detail —
// six-pack lines, chest shading from *earned gear* are separate accent-colored
// layers drawn on top, never baked into the base body.
const STAGE_PARAMS = [
  { shoulder: 60, waist: 70, armWidth: 18, legWidth: 23, rim: 0, def: 0 },
  { shoulder: 66, waist: 62, armWidth: 19, legWidth: 23, rim: 0.1, def: 0.15 },
  { shoulder: 72, waist: 56, armWidth: 19, legWidth: 24, rim: 0.2, def: 0.3 },
  { shoulder: 78, waist: 51, armWidth: 20, legWidth: 24, rim: 0.35, def: 0.5 },
  { shoulder: 84, waist: 47, armWidth: 21, legWidth: 25, rim: 0.5, def: 0.7 },
  { shoulder: 90, waist: 44, armWidth: 22, legWidth: 26, rim: 0.7, def: 1 },
];

export default function AvatarBody({ level, metrics, pulse, customization }) {
  const stage = getStageForLevel(level);
  const p = STAGE_PARAMS[stage - 1];
  const { cx, shoulderY, waistY, hipY, legHeight, armHeight } = metrics;
  const appearance = resolveAppearance(customization);
  const { skin } = appearance;

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

  // Legs anchor to the body's centerline (not the waist edges) so they never
  // overlap each other at high stages where the waist is narrower than two
  // leg-widths; the default shorts cover the hip junction at every stage.
  const leftLegX = cx - p.legWidth - 1.5;
  const rightLegX = cx + 1.5;
  const shortsTop = hipY - 4;
  const shortsBottom = hipY + 30;
  const shortsHalf = Math.max(p.waist / 2 + 5, p.legWidth + 4);

  return (
    <g
      className={pulse ? "avatar-pulse" : undefined}
      style={{ transformOrigin: `${cx}px ${shoulderY + 40}px` }}
    >
      <HairBack metrics={metrics} appearance={appearance} />

      {/* legs */}
      <rect
        x={leftLegX}
        y={hipY - 2}
        width={p.legWidth}
        height={legHeight}
        rx={p.legWidth / 2.4}
        fill={skin.base}
        stroke={skin.line}
        strokeWidth="1.5"
      />
      <rect
        x={rightLegX}
        y={hipY - 2}
        width={p.legWidth}
        height={legHeight}
        rx={p.legWidth / 2.4}
        fill={skin.base}
        stroke={skin.line}
        strokeWidth="1.5"
      />
      {p.def >= 0.5 && (
        <>
          <path
            d={`M ${leftLegX + p.legWidth * 0.35} ${hipY + 40} Q ${leftLegX + p.legWidth * 0.5} ${hipY + 52} ${leftLegX + p.legWidth * 0.4} ${hipY + 62}`}
            fill="none"
            stroke={skin.shade}
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeOpacity={p.def * 0.6}
          />
          <path
            d={`M ${rightLegX + p.legWidth * 0.65} ${hipY + 40} Q ${rightLegX + p.legWidth * 0.5} ${hipY + 52} ${rightLegX + p.legWidth * 0.6} ${hipY + 62}`}
            fill="none"
            stroke={skin.shade}
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeOpacity={p.def * 0.6}
          />
        </>
      )}

      {/* arms — small gap from the torso so they read as distinct limbs */}
      <rect
        x={cx - p.shoulder / 2 - p.armWidth - 2}
        y={shoulderY + 8}
        width={p.armWidth}
        height={armHeight}
        rx={p.armWidth / 2}
        fill={skin.base}
        stroke={skin.line}
        strokeWidth="1.5"
      />
      <rect
        x={cx + p.shoulder / 2 + 2}
        y={shoulderY + 8}
        width={p.armWidth}
        height={armHeight}
        rx={p.armWidth / 2}
        fill={skin.base}
        stroke={skin.line}
        strokeWidth="1.5"
      />
      {p.def >= 0.3 && (
        <>
          <path
            d={`M ${cx - p.shoulder / 2 - p.armWidth + 2} ${shoulderY + 26} Q ${cx - p.shoulder / 2 - p.armWidth / 2 - 2} ${shoulderY + 31} ${cx - p.shoulder / 2 - 4} ${shoulderY + 27}`}
            fill="none"
            stroke={skin.shade}
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeOpacity={p.def * 0.7}
          />
          <path
            d={`M ${cx + p.shoulder / 2 + 4} ${shoulderY + 27} Q ${cx + p.shoulder / 2 + p.armWidth / 2 + 2} ${shoulderY + 31} ${cx + p.shoulder / 2 + p.armWidth - 2} ${shoulderY + 26}`}
            fill="none"
            stroke={skin.shade}
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeOpacity={p.def * 0.7}
          />
        </>
      )}

      {/* neck */}
      <rect x={cx - 6.5} y={shoulderY - 14} width="13" height="16" fill={skin.base} stroke={skin.line} strokeWidth="1.5" rx="4" />

      {/* torso */}
      <path d={torsoPath} fill={skin.base} stroke={skin.line} strokeWidth="1.5" />

      {/* on-body definition, scaled by stage */}
      {p.def >= 0.15 && (
        <path
          d={`M ${cx - p.shoulder / 4 - 4} ${shoulderY + 26} Q ${cx} ${shoulderY + 33} ${cx + p.shoulder / 4 + 4} ${shoulderY + 26}`}
          fill="none"
          stroke={skin.shade}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeOpacity={0.35 + p.def * 0.45}
        />
      )}
      {p.def >= 0.3 && (
        <>
          <path
            d={`M ${cx - p.shoulder / 2 + 6} ${shoulderY + 6} L ${cx - 8} ${shoulderY + 9}`}
            fill="none"
            stroke={skin.shade}
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeOpacity={p.def * 0.55}
          />
          <path
            d={`M ${cx + p.shoulder / 2 - 6} ${shoulderY + 6} L ${cx + 8} ${shoulderY + 9}`}
            fill="none"
            stroke={skin.shade}
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeOpacity={p.def * 0.55}
          />
        </>
      )}
      {p.def >= 0.5 && (
        <>
          <line
            x1={cx}
            y1={shoulderY + 36}
            x2={cx}
            y2={waistY - 8}
            stroke={skin.shade}
            strokeWidth="1.3"
            strokeOpacity={p.def * 0.5}
          />
          <path
            d={`M ${cx - p.waist / 2 + 3} ${waistY - 14} Q ${cx - p.waist / 4} ${waistY - 10} ${cx - 4} ${waistY - 12}`}
            fill="none"
            stroke={skin.shade}
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeOpacity={p.def * 0.45}
          />
          <path
            d={`M ${cx + p.waist / 2 - 3} ${waistY - 14} Q ${cx + p.waist / 4} ${waistY - 10} ${cx + 4} ${waistY - 12}`}
            fill="none"
            stroke={skin.shade}
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeOpacity={p.def * 0.45}
          />
        </>
      )}
      {p.rim > 0 && (
        <path d={torsoPath} fill="none" stroke="#5ab4ff" strokeOpacity={p.rim * 0.4} strokeWidth="1.5" />
      )}

      {/* default training shorts — cosmetic Bottom items draw over these */}
      <path
        d={`M ${cx - shortsHalf} ${shortsTop + 4}
            Q ${cx - shortsHalf} ${shortsTop} ${cx - shortsHalf + 5} ${shortsTop}
            L ${cx + shortsHalf - 5} ${shortsTop}
            Q ${cx + shortsHalf} ${shortsTop} ${cx + shortsHalf} ${shortsTop + 4}
            L ${cx + shortsHalf - 1} ${shortsBottom - 3}
            Q ${cx + shortsHalf - 1} ${shortsBottom} ${cx + shortsHalf - 4} ${shortsBottom}
            L ${cx + 2.5} ${shortsBottom}
            L ${cx} ${shortsBottom - 6}
            L ${cx - 2.5} ${shortsBottom}
            L ${cx - shortsHalf + 4} ${shortsBottom}
            Q ${cx - shortsHalf + 1} ${shortsBottom} ${cx - shortsHalf + 1} ${shortsBottom - 3}
            Z`}
        fill="#1e1e28"
        stroke="#2c2c38"
        strokeWidth="1.5"
      />
      <line
        x1={cx - shortsHalf + 3}
        y1={shortsTop + 5}
        x2={cx + shortsHalf - 3}
        y2={shortsTop + 5}
        stroke="#383846"
        strokeWidth="1.3"
      />

      {/* head */}
      <circle cx={cx} cy={shoulderY - 24} r="19" fill={skin.base} stroke={skin.line} strokeWidth="1.5" />
      <Face metrics={metrics} appearance={appearance} />
      <FacialHairLayer metrics={metrics} appearance={appearance} />
      <HairFront metrics={metrics} appearance={appearance} />
    </g>
  );
}

export { STAGE_PARAMS };
