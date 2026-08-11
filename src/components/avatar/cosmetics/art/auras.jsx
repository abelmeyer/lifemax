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
  // Heat pools at the floor and the embers climb out of it, so the field sits
  // lower than the diamond aura's body-centered glow.
  const cy = shoulderY + 72;
  const groundY = hipY + legHeight + 2;
  const gradientId = useId();

  // Teardrop, point upward — a rising ember rather than a floating gem.
  const ember = (x, y, s) =>
    `M ${x} ${y - s * 1.7} Q ${x + s} ${y - s * 0.1} ${x} ${y + s} Q ${x - s} ${y - s * 0.1} ${x} ${y - s * 1.7} Z`;
  // Two loose columns rather than an even ring: embers rise off the fire.
  const embers = [
    [cx - 84, cy - 30, 4.6, 0.95, "#ffcf82"],
    [cx - 70, cy + 40, 3.8, 0.85, "#ff9640"],
    [cx - 92, cy + 14, 2.8, 0.7, "#ff8236"],
    [cx - 58, cy - 84, 3.2, 0.78, "#ffdca0"],
    [cx + 86, cy - 8, 4.2, 0.9, "#ffbe66"],
    [cx + 72, cy + 50, 5, 0.95, "#ff9640"],
    [cx + 62, cy - 70, 2.9, 0.75, "#ffdca0"],
    [cx - 22, cy - 118, 3.8, 0.88, "#ffcf82"],
    [cx + 32, cy - 106, 2.8, 0.68, "#ffa54e"],
  ];
  // Tongues sit outboard of the legs; anything behind them is never seen.
  const flames = [
    [cx - 50, groundY - 8, 8, "#ff8a3a"],
    [cx - 68, groundY - 4, 5.5, "#ff6a26"],
    [cx + 52, groundY - 9, 7, "#ffb35c"],
    [cx + 70, groundY - 3, 5, "#ff6a26"],
  ];

  return (
    <g className="cosmetic-aura-pulse">
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd79a" stopOpacity="0.56" />
          <stop offset="34%" stopColor="#ffa552" stopOpacity="0.34" />
          <stop offset="70%" stopColor="#ff6a26" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#e0341a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r="122" fill={`url(#${gradientId})`} />
      <ellipse cx={cx} cy={groundY} rx="88" ry="26" fill={`url(#${gradientId})`} />
      {flames.map(([x, y, s, color], i) => (
        <path key={`f${i}`} d={ember(x, y, s)} fill={color} fillOpacity="0.55" stroke={color} strokeOpacity="0.9" strokeWidth="1.1" />
      ))}
      {embers.map(([x, y, s, o, color], i) => (
        <g key={i}>
          <path d={ember(x, y, s)} fill={color} fillOpacity={o} />
          <circle cx={x} cy={y - s * 0.15} r={s * 0.38} fill="#fff1d2" opacity={o * 0.9} />
        </g>
      ))}
      <g fill="#ffe0a3">
        <circle cx={cx - 52} cy={cy - 76} r="1.6" opacity="0.85" />
        <circle cx={cx + 58} cy={cy - 60} r="1.2" opacity="0.7" />
        <circle cx={cx + 12} cy={cy - 136} r="1.4" opacity="0.6" />
        <circle cx={cx - 96} cy={cy + 60} r="1.3" opacity="0.65" />
        <circle cx={cx + 100} cy={cy + 24} r="1.1" opacity="0.6" />
      </g>
    </g>
  );
}

export function EmeraldAura({ metrics }) {
  const { cx, shoulderY } = metrics;
  const cy = shoulderY + 60;
  const gradientId = useId();

  // Six-sided shards in mirrored pairs, inside a hex lattice — the regular
  // arrangement is what makes this field read steady next to ember's scatter.
  const shard = (x, y, s) =>
    `M ${x} ${y - s} L ${x + s * 0.52} ${y - s * 0.36} L ${x + s * 0.46} ${y + s * 0.5}
     L ${x} ${y + s} L ${x - s * 0.46} ${y + s * 0.5} L ${x - s * 0.52} ${y - s * 0.36} Z`;
  const hex = (r) =>
    [0, 1, 2, 3, 4, 5]
      .map((i) => {
        const a = (Math.PI / 3) * i - Math.PI / 2;
        return `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
      })
      .join(" L ");
  const shards = [
    [cx - 88, cy - 20, 8, 0.9],
    [cx + 88, cy - 20, 8, 0.9],
    [cx - 74, cy + 58, 6, 0.78],
    [cx + 74, cy + 58, 6, 0.78],
    [cx - 34, cy - 104, 5.5, 0.82],
    [cx + 34, cy - 104, 5.5, 0.82],
  ];

  return (
    <g className="cosmetic-aura-pulse">
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c2ffdf" stopOpacity="0.46" />
          <stop offset="38%" stopColor="#3ee89a" stopOpacity="0.27" />
          <stop offset="74%" stopColor="#12b877" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#0f9f5f" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r="122" fill={`url(#${gradientId})`} />
      <path d={`M ${hex(112)} Z`} fill="none" stroke="#5fe3a6" strokeOpacity="0.22" strokeWidth="1.2" />
      <path d={`M ${hex(92)} Z`} fill="none" stroke="#5fe3a6" strokeOpacity="0.12" strokeWidth="1" />
      {shards.map(([x, y, s, o], i) => (
        <g key={i}>
          <path d={shard(x, y, s)} fill="#7ff0b4" fillOpacity={o * 0.38} stroke="#4fdc9b" strokeOpacity={o} strokeWidth="1.1" />
          <path d={`M ${x} ${y - s} L ${x} ${y + s} M ${x - s * 0.52} ${y - s * 0.36} L ${x + s * 0.52} ${y - s * 0.36}`} stroke="#c7ffe4" strokeOpacity={o * 0.55} strokeWidth="0.8" />
        </g>
      ))}
      <g fill="#c7ffe4">
        <circle cx={cx - 108} cy={cy + 24} r="1.6" opacity="0.75" />
        <circle cx={cx + 108} cy={cy + 24} r="1.6" opacity="0.75" />
        <circle cx={cx - 16} cy={cy - 128} r="1.3" opacity="0.6" />
        <circle cx={cx + 48} cy={cy + 98} r="1.4" opacity="0.6" />
        <circle cx={cx - 48} cy={cy + 98} r="1.4" opacity="0.6" />
      </g>
    </g>
  );
}

export function VoidAura({ metrics }) {
  const { cx, shoulderY } = metrics;
  // The lit rim has to clear the whole silhouette or it cuts across the head
  // and the feet: this center/radius pair keeps every limb inside the core.
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
        {/* The core stays near-black: all of the light lives in the 84–94%
            band, which is what sells a rim bending around a dark mass. */}
        <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#080310" stopOpacity="0.88" />
          <stop offset="52%" stopColor="#100722" stopOpacity="0.8" />
          <stop offset="76%" stopColor="#231043" stopOpacity="0.6" />
          <stop offset="86%" stopColor="#6d28d9" stopOpacity="0.34" />
          <stop offset="92%" stopColor="#dcbcff" stopOpacity="0.42" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={`url(#${gradientId})`} />
      <circle cx={cx} cy={cy} r="123" fill="none" stroke="#e9d5ff" strokeOpacity="0.34" strokeWidth="1.1" />
      <circle cx={cx} cy={cy} r="129" fill="none" stroke="#a855f7" strokeOpacity="0.16" strokeWidth="0.9" />
      <circle cx={cx} cy={cy} r="86" fill="none" stroke="#6d28d9" strokeOpacity="0.3" strokeWidth="1" />
      {/* starlight smeared along the rim — the tell that light is bending */}
      <g fill="none" stroke="#f3e8ff" strokeLinecap="round">
        <path d={arc(126, -2.5, -1.95)} strokeOpacity="0.7" strokeWidth="1.6" />
        <path d={arc(133, -0.95, -0.55)} strokeOpacity="0.4" strokeWidth="1.1" />
        <path d={arc(118, 0.55, 1.15)} strokeOpacity="0.5" strokeWidth="1.3" />
        <path d={arc(131, 2.1, 2.45)} strokeOpacity="0.35" strokeWidth="1" />
      </g>
      <g fill="#e9d5ff">
        <circle cx={cx - 96} cy={cy - 92} r="1.5" opacity="0.75" />
        <circle cx={cx + 104} cy={cy + 70} r="1.3" opacity="0.6" />
        <circle cx={cx + 62} cy={cy - 122} r="1.2" opacity="0.55" />
        <circle cx={cx - 118} cy={cy + 44} r="1.1" opacity="0.5" />
      </g>
    </g>
  );
}
