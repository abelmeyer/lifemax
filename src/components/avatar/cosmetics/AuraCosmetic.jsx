import { useId } from "react";

export default function AuraCosmetic({ metrics }) {
  const { cx, shoulderY } = metrics;
  const cy = shoulderY + 60;
  const gradientId = useId();

  return (
    <g className="cosmetic-aura-pulse">
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5ab4ff" stopOpacity="0.35" />
          <stop offset="70%" stopColor="#5ab4ff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#5ab4ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r="120" fill={`url(#${gradientId})`} />
    </g>
  );
}
