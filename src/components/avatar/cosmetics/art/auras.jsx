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

export function EmberAura({ metrics }) {
  const { cx, shoulderY, hipY, legHeight } = metrics;
  // Heat pools at the floor and the embers climb out of it, so the glow sits
  // lower than the diamond aura's body-centered field.
  const cy = shoulderY + 72;
  const gradientId = useId();

  // Teardrop, point upward — a rising ember rather than a floating gem.
  const ember = (x, y, s) =>
    `M ${x} ${y - s * 1.7} Q ${x + s} ${y - s * 0.1} ${x} ${y + s} Q ${x - s} ${y - s * 0.1} ${x} ${y - s * 1.7} Z`;
  const embers = [
    [cx - 82, cy - 34, 6, 0.92, "#ffb35c"],
    [cx + 84, cy - 12, 5, 0.8, "#ff8a3a"],
    [cx - 70, cy + 44, 4.5, 0.72, "#ff7a34"],
    [cx + 72, cy + 52, 6.5, 0.88, "#ffb35c"],
    [cx - 20, cy - 116, 5, 0.85, "#ffc978"],
    [cx + 30, cy - 104, 3.6, 0.62, "#ff9a45"],
    [cx - 96, cy + 12, 3.4, 0.6, "#ff8a3a"],
  ];

  return (
    <g className="cosmetic-aura-pulse">
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffcf8a" stopOpacity="0.42" />
          <stop offset="50%" stopColor="#ff7a34" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#e0341a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r="120" fill={`url(#${gradientId})`} />
      <ellipse cx={cx} cy={hipY + legHeight + 4} rx="86" ry="26" fill={`url(#${gradientId})`} />
      {embers.map(([x, y, s, o, color], i) => (
        <path key={i} d={ember(x, y, s)} fill={color} fillOpacity={o * 0.6} stroke={color} strokeOpacity={o} strokeWidth="1.1" />
      ))}
      <g fill="#ffe0a3">
        <circle cx={cx - 52} cy={cy - 76} r="1.6" opacity="0.85" />
        <circle cx={cx + 58} cy={cy - 60} r="1.2" opacity="0.7" />
        <circle cx={cx + 12} cy={cy - 134} r="1.4" opacity="0.6" />
        <circle cx={cx - 92} cy={cy + 62} r="1.3" opacity="0.65" />
      </g>
      <g stroke="#ffc978" strokeWidth="1.2" strokeLinecap="round" fill="none">
        <path d={`M ${cx - 64} ${cy + 84} q 4 -9 -1 -16`} strokeOpacity="0.55" />
        <path d={`M ${cx + 50} ${cy + 88} q -4 -8 1 -14`} strokeOpacity="0.5" />
      </g>
    </g>
  );
}

export function EmeraldAura({ metrics }) {
  const { cx, shoulderY } = metrics;
  const cy = shoulderY + 60;
  const gradientId = useId();

  // Six-sided shards laid out in mirrored pairs — the arrangement is what
  // makes this field read as steady next to the ember aura's scatter.
  const shard = (x, y, s) =>
    `M ${x} ${y - s} L ${x + s * 0.52} ${y - s * 0.36} L ${x + s * 0.46} ${y + s * 0.5}
     L ${x} ${y + s} L ${x - s * 0.46} ${y + s * 0.5} L ${x - s * 0.52} ${y - s * 0.36} Z`;
  const shards = [
    [cx - 88, cy - 20, 8, 0.9],
    [cx + 88, cy - 20, 8, 0.9],
    [cx - 72, cy + 56, 6, 0.75],
    [cx + 72, cy + 56, 6, 0.75],
    [cx - 34, cy - 104, 5.5, 0.8],
    [cx + 34, cy - 104, 5.5, 0.8],
  ];

  return (
    <g className="cosmetic-aura-pulse">
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#b6ffd7" stopOpacity="0.34" />
          <stop offset="52%" stopColor="#2fd08a" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#0f9f5f" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r="122" fill={`url(#${gradientId})`} />
      <circle cx={cx} cy={cy} r="96" fill="none" stroke="#5fe3a6" strokeOpacity="0.16" strokeWidth="1.2" />
      <circle cx={cx} cy={cy} r="112" fill="none" stroke="#5fe3a6" strokeOpacity="0.1" strokeWidth="1" />
      {shards.map(([x, y, s, o], i) => (
        <g key={i}>
          <path d={shard(x, y, s)} fill="#7ff0b4" fillOpacity={o * 0.34} stroke="#4fdc9b" strokeOpacity={o} strokeWidth="1.1" />
          <path d={`M ${x} ${y - s} L ${x} ${y + s} M ${x - s * 0.52} ${y - s * 0.36} L ${x + s * 0.52} ${y - s * 0.36}`} stroke="#c7ffe4" strokeOpacity={o * 0.55} strokeWidth="0.8" />
        </g>
      ))}
      <g fill="#c7ffe4">
        <circle cx={cx - 108} cy={cy + 22} r="1.6" opacity="0.7" />
        <circle cx={cx + 108} cy={cy + 22} r="1.6" opacity="0.7" />
        <circle cx={cx - 14} cy={cy - 128} r="1.3" opacity="0.6" />
        <circle cx={cx + 46} cy={cy + 96} r="1.4" opacity="0.6" />
        <circle cx={cx - 46} cy={cy + 96} r="1.4" opacity="0.6" />
      </g>
    </g>
  );
}

export function VoidAura({ metrics }) {
  const { cx, shoulderY } = metrics;
  // The bright rim has to clear the whole silhouette or it cuts across the
  // head and feet: this center/radius pair keeps every limb inside the core.
  const cy = shoulderY + 62;
  const r = 134;
  const gradientId = useId();

  const arc = (rr, a0, a1) => {
    const p = (a) => `${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)}`;
    return `M ${p(a0)} A ${rr} ${rr} 0 0 1 ${p(a1)}`;
  };

  return (
    <g className="cosmetic-aura-pulse">
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#150726" stopOpacity="0.92" />
          <stop offset="48%" stopColor="#22103a" stopOpacity="0.82" />
          <stop offset="72%" stopColor="#4c1d95" stopOpacity="0.5" />
          <stop offset="85%" stopColor="#a855f7" stopOpacity="0.55" />
          <stop offset="91%" stopColor="#ecd9ff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={`url(#${gradientId})`} />
      <circle cx={cx} cy={cy} r="120" fill="none" stroke="#e9d5ff" strokeOpacity="0.5" strokeWidth="1.4" />
      <circle cx={cx} cy={cy} r="127" fill="none" stroke="#a855f7" strokeOpacity="0.25" strokeWidth="1" />
      <circle cx={cx} cy={cy} r="88" fill="none" stroke="#5b21b6" strokeOpacity="0.45" strokeWidth="1.1" />
      {/* starlight smeared around the core — the tell that light is bending */}
      <g fill="none" stroke="#f3e8ff" strokeLinecap="round">
        <path d={arc(124, -2.5, -1.95)} strokeOpacity="0.75" strokeWidth="1.8" />
        <path d={arc(131, -0.95, -0.55)} strokeOpacity="0.45" strokeWidth="1.2" />
        <path d={arc(116, 0.55, 1.15)} strokeOpacity="0.6" strokeWidth="1.5" />
        <path d={arc(129, 2.1, 2.45)} strokeOpacity="0.4" strokeWidth="1.1" />
      </g>
      <g fill="#e9d5ff">
        <circle cx={cx - 96} cy={cy - 92} r="1.5" opacity="0.8" />
        <circle cx={cx + 104} cy={cy + 70} r="1.3" opacity="0.65" />
        <circle cx={cx + 62} cy={cy - 122} r="1.2" opacity="0.6" />
        <circle cx={cx - 118} cy={cy + 44} r="1.1" opacity="0.55" />
      </g>
    </g>
  );
}
