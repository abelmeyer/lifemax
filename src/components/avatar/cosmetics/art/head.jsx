import { geoOr, headCenter } from "./shared";

// Head-slot art. The skull is a circle of radius 19 and the whole face lives
// inside it — brows at hy-7, eyes at hy-1, ears at hx±18.5, mouth at hy+11 —
// so bands ride above the brow line and open-face gear frames the face rather
// than crossing it. Hair draws underneath everything here, which is why the
// hats close over the crown instead of sitting on the head like a decal.
//
// headCenter needs only cx/shoulderY, both of which the resolved geometry
// carries, so head art reads its anchor from the same `geo` object every
// other slot does instead of keeping a second source of truth.

// Half-width of the skull at a vertical offset from its center. An edge ended
// on this curve lands ON the outline; a straight vertical end floats past the
// head near the crown and bites into it near the ears.
const skullHalf = (hr, dy) => Math.sqrt(Math.max(0, hr * hr - dy * dy));

export function SweatHeadband({ metrics, geo }) {
  const g = geoOr(geo, metrics);
  const { hx, hy, hr } = headCenter(g);
  // Both ends follow the skull's arc, and the band bows up across the middle
  // so it reads as fabric wrapped round a sphere, not a bar laid over it.
  const endTop = skullHalf(hr, 9);
  const endBot = skullHalf(hr, 2);
  return (
    <g>
      <path
        d={`M ${hx - endTop} ${hy - 9}
            Q ${hx} ${hy - 18} ${hx + endTop} ${hy - 9}
            A ${hr} ${hr} 0 0 1 ${hx + endBot} ${hy - 2}
            Q ${hx} ${hy - 12} ${hx - endBot} ${hy - 2}
            A ${hr} ${hr} 0 0 1 ${hx - endTop} ${hy - 9}
            Z`}
        fill="#eceff4"
        stroke="#b9c0cb"
        strokeWidth="1.3"
      />
      {/* terry nap — a broken line reads as looped pile at thumbnail size,
          where individual stitches would just muddy into grey */}
      <path
        d={`M ${hx - endBot + 1.5} ${hy - 3.5} Q ${hx} ${hy - 13.5} ${hx + endBot - 1.5} ${hy - 3.5}`}
        fill="none"
        stroke="#c8ced8"
        strokeWidth="1.1"
        strokeDasharray="1.7 2.3"
        strokeLinecap="round"
      />
      <path
        d={`M ${hx - endTop - 0.6} ${hy - 7.5} Q ${hx} ${hy - 16.5} ${hx + endTop + 0.6} ${hy - 7.5}`}
        fill="none"
        stroke="#5ab4ff"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d={`M ${hx - endBot} ${hy - 2} Q ${hx} ${hy - 12} ${hx + endBot} ${hy - 2}`}
        fill="none"
        stroke="#a7aebb"
        strokeWidth="1"
        strokeOpacity="0.75"
      />
    </g>
  );
}

export function KnitBeanie({ metrics, geo }) {
  const g = geoOr(geo, metrics);
  const { hx, hy, hr } = headCenter(g);
  // Knit sits proud of the skull rather than shrink-wrapping it, and the
  // dome clears the crown by ~8px so the tallest hair (curls, bun) is under
  // the hat instead of poking through it.
  const half = hr + 1;
  const brimTop = hy - 11;
  const brimBot = hy - 1;
  const ribs = [-14.5, -9.5, -4.75, 0, 4.75, 9.5, 14.5];
  return (
    <g>
      <path
        d={`M ${hx - half} ${hy - 7}
            C ${hx - half - 1.5} ${hy - 34} ${hx + half + 1.5} ${hy - 34} ${hx + half} ${hy - 7}
            Z`}
        fill="#a4522f"
        stroke="#75371c"
        strokeWidth="1.4"
      />
      {ribs.map((o) => (
        <path
          key={o}
          d={`M ${hx + o} ${hy - 8} Q ${hx + o * 0.72} ${hy - 19} ${hx + o * 0.26} ${hy - 26}`}
          fill="none"
          stroke="#c06d45"
          strokeWidth="1.2"
          strokeOpacity="0.55"
          strokeLinecap="round"
        />
      ))}
      <path
        d={`M ${hx - 12} ${hy - 22.5} Q ${hx - 4} ${hy - 27.5} ${hx + 4} ${hy - 26}`}
        fill="none"
        stroke="#d08557"
        strokeWidth="1.6"
        strokeOpacity="0.5"
        strokeLinecap="round"
      />
      {/* folded brim — the double thickness is what makes it read as knitwear
          rather than a swim cap at 48px */}
      <rect
        x={hx - half - 0.5}
        y={brimTop}
        width={(half + 0.5) * 2}
        height={brimBot - brimTop}
        rx="3.5"
        fill="#b35c36"
        stroke="#75371c"
        strokeWidth="1.4"
      />
      {ribs.map((o) => (
        <line
          key={`b${o}`}
          x1={hx + o}
          y1={brimTop + 1.6}
          x2={hx + o}
          y2={brimBot - 1.6}
          stroke="#8a4526"
          strokeWidth="1.1"
          strokeOpacity="0.7"
        />
      ))}
      <line
        x1={hx - half + 1}
        y1={brimTop + 1.8}
        x2={hx + half - 1}
        y2={brimTop + 1.8}
        stroke="#d08557"
        strokeWidth="1.1"
        strokeOpacity="0.55"
      />
    </g>
  );
}

export function SnapbackCap({ metrics, geo }) {
  const g = geoOr(geo, metrics);
  const { hx, hy, hr } = headCenter(g);
  // The crown closes on the skull at ear level and the brim layers over its
  // lower front. A brim floated clear of the crown reads as a flying saucer,
  // which is precisely what any gap here looks like.
  const crownHalf = skullHalf(hr, 3) + 1;
  const brimHalf = 23;
  return (
    <g>
      <path
        d={`M ${hx - crownHalf} ${hy - 3}
            C ${hx - crownHalf - 2} ${hy - 31} ${hx + crownHalf + 2} ${hy - 31} ${hx + crownHalf} ${hy - 3}
            Z`}
        fill="#26314a"
        stroke="#141c2c"
        strokeWidth="1.4"
      />
      {/* six-panel seams meeting at the button — the only thing separating a
          structured crown from a soft one at this size */}
      <path d={`M ${hx - 8} ${hy - 5} Q ${hx - 5.5} ${hy - 17} ${hx - 1.6} ${hy - 24.5}`} fill="none" stroke="#3a496a" strokeWidth="1.2" />
      <path d={`M ${hx + 8} ${hy - 5} Q ${hx + 5.5} ${hy - 17} ${hx + 1.6} ${hy - 24.5}`} fill="none" stroke="#3a496a" strokeWidth="1.2" />
      <circle cx={hx} cy={hy - 25} r="1.9" fill="#3a496a" stroke="#141c2c" strokeWidth="0.9" />
      {/* closure band: the snaps themselves fasten at the back of the head, so
          only the band and its last stud clear the brim */}
      <path
        d={`M ${hx - crownHalf + 0.6} ${hy - 6.5} L ${hx + crownHalf - 0.6} ${hy - 6.5} L ${hx + crownHalf - 0.6} ${hy - 3} L ${hx - crownHalf + 0.6} ${hy - 3} Z`}
        fill="#1a2337"
      />
      <circle cx={hx - 16.5} cy={hy - 4.7} r="1" fill="#c9d3e0" />
      <circle cx={hx + 16.5} cy={hy - 4.7} r="1" fill="#c9d3e0" />
      <path
        d={`M ${hx - brimHalf} ${hy - 10.5}
            Q ${hx} ${hy - 15} ${hx + brimHalf} ${hy - 10.5}
            Q ${hx + brimHalf + 1.5} ${hy - 7} ${hx + 15} ${hy - 5.5}
            Q ${hx} ${hy - 4} ${hx - 15} ${hy - 5.5}
            Q ${hx - brimHalf - 1.5} ${hy - 7} ${hx - brimHalf} ${hy - 10.5}
            Z`}
        fill="#2f3d59"
        stroke="#141c2c"
        strokeWidth="1.4"
      />
      <path d={`M ${hx - 15} ${hy - 5.5} Q ${hx} ${hy - 4} ${hx + 15} ${hy - 5.5}`} fill="none" stroke="#141c2c" strokeWidth="1.8" />
      <path
        d={`M ${hx - brimHalf + 3} ${hy - 10.2} Q ${hx} ${hy - 14} ${hx + brimHalf - 3} ${hy - 10.2}`}
        fill="none"
        stroke="#46587d"
        strokeWidth="1.1"
      />
      <path d={`M ${hx} ${hy - 22.5} L ${hx + 4.6} ${hy - 19} L ${hx} ${hy - 15.5} L ${hx - 4.6} ${hy - 19} Z`} fill="#5ab4ff" />
    </g>
  );
}

export function BoxingHeadgear({ metrics, geo }) {
  const g = geoOr(geo, metrics);
  const { hx, hy } = headCenter(g);
  // One closed outline: down the outside of the left cheek guard, back up the
  // inside to frame the face, over the crown and down the right. Everything
  // inside x±13 and above hy+13 stays open, which is what keeps the eyes,
  // brows and mouth of an open-face guard readable.
  const shell = `M ${hx - 21.5} ${hy - 8}
      C ${hx - 21} ${hy + 4} ${hx - 20} ${hy + 11} ${hx - 14} ${hy + 16}
      L ${hx - 10} ${hy + 13}
      C ${hx - 12.5} ${hy + 6} ${hx - 13} ${hy - 2} ${hx - 13} ${hy - 7}
      C ${hx - 13} ${hy - 10} ${hx - 8} ${hy - 12} ${hx} ${hy - 12}
      C ${hx + 8} ${hy - 12} ${hx + 13} ${hy - 10} ${hx + 13} ${hy - 7}
      C ${hx + 13} ${hy - 2} ${hx + 12.5} ${hy + 6} ${hx + 10} ${hy + 13}
      L ${hx + 14} ${hy + 16}
      C ${hx + 20} ${hy + 11} ${hx + 21} ${hy + 4} ${hx + 21.5} ${hy - 8}
      C ${hx + 20} ${hy - 28} ${hx - 20} ${hy - 28} ${hx - 21.5} ${hy - 8}
      Z`;
  return (
    <g>
      {/* the strap passes under the jaw, below the mouth at hy+11 — any higher
          and it reads as a muzzle strapped across the face */}
      <path d={`M ${hx - 15} ${hy + 12} Q ${hx} ${hy + 20} ${hx + 15} ${hy + 12}`} fill="none" stroke="#4a1f1c" strokeWidth="3.6" strokeLinecap="round" />
      <rect x={hx + 4.5} y={hy + 14.2} width="3.6" height="3.4" rx="1" fill="#c9d3e0" stroke="#8b93a0" strokeWidth="0.8" />
      <path d={shell} fill="#b23a32" stroke="#7d221d" strokeWidth="1.5" />
      {/* the brow bar is the thickest pad on a real guard, so it carries the
          highlight that tells this apart from a plain hood */}
      <path
        d={`M ${hx - 13.5} ${hy - 8} C ${hx - 13.5} ${hy - 14.5} ${hx + 13.5} ${hy - 14.5} ${hx + 13.5} ${hy - 8}
            C ${hx + 13.5} ${hy - 17} ${hx - 13.5} ${hy - 17} ${hx - 13.5} ${hy - 8} Z`}
        fill="#d4574a"
        stroke="#7d221d"
        strokeWidth="1.1"
      />
      {[-1, 1].map((s) => (
        <g key={s}>
          <path
            d={`M ${hx + s * 17} ${hy - 4} Q ${hx + s * 16.5} ${hy + 4} ${hx + s * 14} ${hy + 10}`}
            fill="none"
            stroke="#7d221d"
            strokeWidth="1.2"
            strokeOpacity="0.85"
          />
          <path
            d={`M ${hx + s * 20.5} ${hy - 10} Q ${hx + s * 19} ${hy - 19} ${hx + s * 11} ${hy - 23.5}`}
            fill="none"
            stroke="#d4574a"
            strokeWidth="1.4"
            strokeOpacity="0.7"
            strokeLinecap="round"
          />
        </g>
      ))}
      <path
        d={`M ${hx - 5} ${hy - 24.5} Q ${hx} ${hy - 26.5} ${hx + 5} ${hy - 24.5}`}
        fill="none"
        stroke="#f0d9c4"
        strokeWidth="1.6"
        strokeOpacity="0.6"
        strokeLinecap="round"
      />
    </g>
  );
}

export function ChampionsCrown({ metrics, geo }) {
  const g = geoOr(geo, metrics);
  const { hx, hy, hr } = headCenter(g);
  // The band is a ring seen head-on: both edges dip at the centre because the
  // front of the ring is nearest the viewer, and the ends land on the skull's
  // arc so it grips the head instead of hovering above it.
  const botEnd = skullHalf(hr, 9);
  const topEnd = skullHalf(hr, 14);
  const gems = [
    { x: -8.5, fill: "#4fa3e8", edge: "#2c6ea6" },
    { x: 0, fill: "#e4444f", edge: "#a12730" },
    { x: 8.5, fill: "#46c98a", edge: "#238457" },
  ];
  return (
    <g>
      <path
        d={`M ${hx - 13.5} ${hy - 14}
            L ${hx - 15} ${hy - 19} L ${hx - 11} ${hy - 15.5}
            L ${hx - 7.5} ${hy - 22.5} L ${hx - 4} ${hy - 14.5}
            L ${hx} ${hy - 26} L ${hx + 4} ${hy - 14.5}
            L ${hx + 7.5} ${hy - 22.5} L ${hx + 11} ${hy - 15.5}
            L ${hx + 15} ${hy - 19} L ${hx + 13.5} ${hy - 14}
            Q ${hx} ${hy - 11.5} ${hx - 13.5} ${hy - 14} Z`}
        fill="#e3bd54"
        stroke="#98741d"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d={`M ${hx - botEnd} ${hy - 9}
            Q ${hx} ${hy - 3} ${hx + botEnd} ${hy - 9}
            A ${hr} ${hr} 0 0 0 ${hx + topEnd} ${hy - 14}
            Q ${hx} ${hy - 9.5} ${hx - topEnd} ${hy - 14}
            A ${hr} ${hr} 0 0 0 ${hx - botEnd} ${hy - 9}
            Z`}
        fill="#c69a2e"
        stroke="#98741d"
        strokeWidth="1.4"
      />
      <path
        d={`M ${hx - botEnd + 1.5} ${hy - 10.5} Q ${hx} ${hy - 5.2} ${hx + botEnd - 1.5} ${hy - 10.5}`}
        fill="none"
        stroke="#f2d987"
        strokeWidth="1.2"
        strokeOpacity="0.85"
      />
      {gems.map((gem) => (
        <g key={gem.x}>
          <circle cx={hx + gem.x} cy={hy - 7 + Math.abs(gem.x) * 0.14} r={gem.x === 0 ? 2.6 : 2} fill={gem.fill} stroke={gem.edge} strokeWidth="0.9" />
          <circle cx={hx + gem.x - 0.6} cy={hy - 7.8 + Math.abs(gem.x) * 0.14} r={gem.x === 0 ? 0.8 : 0.6} fill="#ffffff" fillOpacity="0.75" />
        </g>
      ))}
      <circle cx={hx} cy={hy - 27.2} r="2" fill="#fdf3d0" stroke="#98741d" strokeWidth="0.9" />
      <circle cx={hx - 7.5} cy={hy - 23.6} r="1.7" fill="#fdf3d0" stroke="#98741d" strokeWidth="0.8" />
      <circle cx={hx + 7.5} cy={hy - 23.6} r="1.7" fill="#fdf3d0" stroke="#98741d" strokeWidth="0.8" />
      <circle cx={hx - 15.4} cy={hy - 20.2} r="1.4" fill="#fdf3d0" stroke="#98741d" strokeWidth="0.8" />
      <circle cx={hx + 15.4} cy={hy - 20.2} r="1.4" fill="#fdf3d0" stroke="#98741d" strokeWidth="0.8" />
      {/* glints, not a glow: a filter would blur away at thumbnail scale */}
      {[
        { x: -21, y: -14, r: 2.6 },
        { x: 20, y: -20, r: 2.2 },
        { x: 12, y: -8, r: 1.8 },
      ].map((s) => (
        <path
          key={`${s.x}${s.y}`}
          d={`M ${hx + s.x} ${hy + s.y - s.r} Q ${hx + s.x} ${hy + s.y} ${hx + s.x + s.r} ${hy + s.y}
              Q ${hx + s.x} ${hy + s.y} ${hx + s.x} ${hy + s.y + s.r}
              Q ${hx + s.x} ${hy + s.y} ${hx + s.x - s.r} ${hy + s.y}
              Q ${hx + s.x} ${hy + s.y} ${hx + s.x} ${hy + s.y - s.r} Z`}
          fill="#fdf3d0"
          fillOpacity="0.85"
        />
      ))}
    </g>
  );
}
