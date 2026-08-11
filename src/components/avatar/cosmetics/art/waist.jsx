import { geoOr } from "./shared";

export function LiftingBelt({ metrics, geo }) {
  const g = geoOr(geo, metrics);
  const { cx, waistY } = metrics;
  const top = waistY - 3;
  // Cinched at the waist, 3px proud on each side. The waist half-width runs
  // 35 → 22 across the stages, so a fixed 30 overhangs at stage 6 and floats
  // inside the belly at stage 1.
  const half = g.waistHalf + 3;
  const w = half * 2;
  return (
    <g>
      <rect x={cx - half} y={top} width={w} height="15" rx="4" fill="#7a4a2b" stroke="#5d3820" strokeWidth="1.4" />
      <rect x={cx - half} y={top + 2.5} width={w} height="1.6" fill="#93582f" opacity="0.8" />
      <rect x={cx - half} y={top + 11} width={w} height="1.6" fill="#5d3820" opacity="0.8" />
      <rect x={cx - 7} y={top + 1.5} width="14" height="12" rx="2" fill="#b9bec8" stroke="#8b919c" strokeWidth="1.2" />
      <rect x={cx - 3.5} y={top + 4.5} width="7" height="6" rx="1" fill="#7a4a2b" />
      <circle cx={cx + half * 0.6} cy={top + 7.5} r="1.3" fill="#5d3820" />
      <circle cx={cx + half * 0.8} cy={top + 7.5} r="1.3" fill="#5d3820" />
    </g>
  );
}


export function ChampionshipBelt({ metrics, geo }) {
  const g = geoOr(geo, metrics);
  const { cx, waistY } = metrics;
  const top = waistY - 4;
  const mid = top + 9;
  // Chunkier than the lifting belt: 4px proud of the waist on each side.
  const half = g.waistHalf + 4;
  const w = half * 2;
  return (
    <g>
      <rect x={cx - half} y={top} width={w} height="18" rx="5" fill="#c69a2e" stroke="#98741d" strokeWidth="1.4" />
      <rect x={cx - half} y={top + 2.5} width={w} height="1.8" fill="#e3bd54" opacity="0.9" />
      <ellipse cx={cx} cy={mid} rx="15" ry="12" fill="#e3bd54" stroke="#98741d" strokeWidth="1.5" />
      <ellipse cx={cx} cy={mid} rx="10.5" ry="8.2" fill="#c69a2e" stroke="#98741d" strokeWidth="1" />
      <path
        d={`M ${cx} ${mid - 5.5} L ${cx + 1.7} ${mid - 1.7} L ${cx + 5.5} ${mid - 1.2} L ${cx + 2.8} ${mid + 1.6}
            L ${cx + 3.4} ${mid + 5.4} L ${cx} ${mid + 3.4} L ${cx - 3.4} ${mid + 5.4} L ${cx - 2.8} ${mid + 1.6}
            L ${cx - 5.5} ${mid - 1.2} L ${cx - 1.7} ${mid - 1.7} Z`}
        fill="#fdf3d0"
        stroke="#98741d"
        strokeWidth="0.8"
      />
      <circle cx={cx - half * 0.75} cy={mid} r="4.5" fill="#e3bd54" stroke="#98741d" strokeWidth="1.1" />
      <circle cx={cx + half * 0.75} cy={mid} r="4.5" fill="#e3bd54" stroke="#98741d" strokeWidth="1.1" />
      <circle cx={cx - half * 0.75} cy={mid} r="1.6" fill="#fdf3d0" />
      <circle cx={cx + half * 0.75} cy={mid} r="1.6" fill="#fdf3d0" />
    </g>
  );
}

// TODO(art): Powerlifting Belt — placeholder, renders nothing until drawn.
export function PowerliftingBelt() {
  return null;
}
