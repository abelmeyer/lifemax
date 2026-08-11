import { useId } from "react";

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

// TODO(art): Ember Aura — placeholder, renders nothing until drawn.
export function EmberAura() {
  return null;
}

// TODO(art): Emerald Aura — placeholder, renders nothing until drawn.
export function EmeraldAura() {
  return null;
}

// TODO(art): Void Aura — placeholder, renders nothing until drawn.
export function VoidAura() {
  return null;
}
