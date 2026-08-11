import { useId } from "react";
import { TIERS } from "../../lib/accomplishments";

// A tier-colored medal. The glyph is chosen per category so badges read
// apart at a glance without needing one bespoke icon per achievement.
const CATEGORY_GLYPH = {
  Training: (c) => (
    <g stroke={c} strokeWidth="2.4" strokeLinecap="round" fill="none">
      <path d="M -9 0 L 9 0" />
      <path d="M -9 -4.5 L -9 4.5 M 9 -4.5 L 9 4.5" />
      <path d="M -12.5 -2.5 L -12.5 2.5 M 12.5 -2.5 L 12.5 2.5" />
    </g>
  ),
  Habits: (c) => (
    <g stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M -8 0.5 L -2.5 6 L 8.5 -5.5" />
    </g>
  ),
  Consistency: (c) => (
    <g stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M 0 -9 A 9 9 0 1 1 -6.4 -6.4" />
      <path d="M 0 -5 L 0 0 L 3.5 2.5" />
    </g>
  ),
  Avatar: (c) => (
    <g stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <circle cx="0" cy="-4" r="4" />
      <path d="M -7.5 8 A 7.5 7.5 0 0 1 7.5 8" />
    </g>
  ),
  Mind: (c) => (
    <g stroke={c} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M 0 7.5 C -9 1 -8 -6.5 -3.4 -6.5 C -1 -6.5 0 -4.6 0 -3.4 C 0 -4.6 1 -6.5 3.4 -6.5 C 8 -6.5 9 1 0 7.5 Z" />
    </g>
  ),
};

export default function AchievementBadge({ achievement, earned = true, size = 56 }) {
  const gradientId = useId();
  const tier = TIERS[achievement.tier] ?? TIERS.bronze;
  const color = earned ? tier.color : "#3a3a46";
  const glyph = CATEGORY_GLYPH[achievement.category] ?? CATEGORY_GLYPH.Training;

  return (
    <svg
      width={size}
      height={size}
      viewBox="-32 -32 64 64"
      role="img"
      aria-label={`${achievement.name}${earned ? "" : " (locked)"}`}
    >
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor={color} stopOpacity={earned ? 0.32 : 0.1} />
          <stop offset="100%" stopColor={color} stopOpacity={earned ? 0.06 : 0.03} />
        </radialGradient>
      </defs>

      {/* faceted medal — a hexagon reads as "award" without a literal trophy */}
      <path
        d="M 0 -27 L 23.4 -13.5 L 23.4 13.5 L 0 27 L -23.4 13.5 L -23.4 -13.5 Z"
        fill={`url(#${gradientId})`}
        stroke={color}
        strokeWidth={earned ? 2 : 1.4}
        strokeOpacity={earned ? 0.9 : 0.5}
        strokeLinejoin="round"
      />
      <path
        d="M 0 -19.5 L 16.9 -9.75 L 16.9 9.75 L 0 19.5 L -16.9 9.75 L -16.9 -9.75 Z"
        fill="none"
        stroke={color}
        strokeWidth="0.9"
        strokeOpacity={earned ? 0.35 : 0.2}
        strokeLinejoin="round"
      />
      <g opacity={earned ? 1 : 0.45}>{glyph(color)}</g>
    </svg>
  );
}
