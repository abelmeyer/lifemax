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

export function PowerliftingBelt({ metrics, geo }) {
  const g = geoOr(geo, metrics);
  const { cx, waistY } = metrics;
  const top = waistY - 4;
  const h = 22;
  const bot = top + h;
  // Beefier than the tier-3 lifting belt (15px tall) but still only 4px proud
  // of the waist, which runs 35 → 22 half-width across the stages.
  const half = g.waistHalf + 4;
  // A powerlifting belt is widest at the back: the edges wrap out of sight at
  // full height and the front face dips in a couple of px, top and bottom.
  const dip = 5.6;
  const arc = (y, dir) => `Q ${cx} ${y + dir * dip} ${cx + dir * (half - 5)} ${y}`;
  // Anything drawn on the belt face has to follow that same dip or it floats
  // off the leather at the centre.
  const band = (y, dir, inset) => `M ${cx - half + inset} ${y} Q ${cx} ${y + dir * dip} ${cx + half - inset} ${y}`;
  const suede = "#5f4335";
  const steel = "#5f6773";
  const prongY = [top + h * 0.33, top + h * 0.67];
  return (
    <g>
      <path
        d={`M ${cx - half} ${top + 5}
            Q ${cx - half} ${top} ${cx - half + 5} ${top}
            ${arc(top, 1)}
            Q ${cx + half} ${top} ${cx + half} ${top + 5}
            L ${cx + half} ${bot - 5}
            Q ${cx + half} ${bot} ${cx + half - 5} ${bot}
            ${arc(bot, -1)}
            Q ${cx - half} ${bot} ${cx - half} ${bot - 5} Z`}
        fill={suede}
        stroke="#38271f"
        strokeWidth="1.5"
      />
      {/* Suede catches light as a broad matte band, never a specular line. */}
      <path d={band(top + 4.6, 1, 4)} fill="none" stroke="#7d5b4a" strokeWidth="3.6" strokeOpacity="0.5" />
      <path d={band(top + 3.4, 1, 3.5)} fill="none" stroke="#38271f" strokeWidth="1" strokeDasharray="3 2.4" strokeOpacity="0.85" />
      <path d={band(bot - 3.4, -1, 3.5)} fill="none" stroke="#38271f" strokeWidth="1" strokeDasharray="3 2.4" strokeOpacity="0.85" />

      {/* Strap end doubled back through its keeper, both under the buckle. */}
      <rect x={cx - half * 0.74} y={top + 3} width={half * 0.74} height={h - 6} rx="3" fill="#6b4c3c" stroke="#38271f" strokeWidth="1" />
      <rect x={cx - half * 0.54} y={top + 1.5} width="6" height={h - 3} rx="1.5" fill="#4b342a" stroke="#38271f" strokeWidth="1" />

      {[0.7, 0.87].map((f) =>
        prongY.map((y) => <ellipse key={`${f}-${y}`} cx={cx + half * f} cy={y} rx="1.7" ry="1.9" fill="#33231c" />),
      )}

      {/* Double prong: two pins crossing the frame into the strap. The tier-3
          belt's single centre tongue is what this is meant to out-rank. */}
      {prongY.map((y) => (
        <ellipse key={y} cx={cx + 13.5} cy={y} rx="1.8" ry="2" fill="#33231c" />
      ))}
      <rect x={cx - 11.5} y={top + 1.2} width="23" height={h - 2.4} rx="3.5" fill="#9ba3b1" stroke={steel} strokeWidth="1.2" />
      <rect x={cx - 6} y={top + 4.8} width="12" height={h - 9.6} rx="1.5" fill={suede} stroke={steel} strokeWidth="0.9" />
      <line x1={cx - 8.5} y1={top + 3} x2={cx + 8.5} y2={top + 3} stroke="#e8ecf3" strokeWidth="1.1" strokeOpacity="0.8" />
      {prongY.map((y) => (
        <path
          key={y}
          d={`M ${cx - 6.5} ${y - 1.3} L ${cx + 12} ${y - 1.3} L ${cx + 15} ${y} L ${cx + 12} ${y + 1.3} L ${cx - 6.5} ${y + 1.3} Z`}
          fill="#e8ecf3"
          stroke={steel}
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
      ))}
    </g>
  );
}
