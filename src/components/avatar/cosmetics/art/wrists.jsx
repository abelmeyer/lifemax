import { geoOr } from "./shared";

export function WristWraps({ metrics, geo }) {
  const g = geoOr(geo, metrics);
  // Wrapped round the bottom of the actual arm rects — the arms swing from
  // cx±32 at stage 1 out to cx±69 at stage 6, so a fixed x lands on air.
  const top = g.armBottomY - 18;
  const w = g.armWidth + 3;
  return (
    <g>
      {[g.armLeftX - 1.5, g.armRightX - 1.5].map((x) => (
        <g key={x}>
          <rect x={x} y={top} width={w} height="14" rx="5" fill="#e8e9ef" stroke="#c6c9d4" strokeWidth="1.2" />
          <path d={`M ${x + 2} ${top + 9} L ${x + w - 2} ${top + 4}`} stroke="#c6c9d4" strokeWidth="1.1" />
          <path d={`M ${x + 2} ${top + 12} L ${x + w - 2} ${top + 7}`} stroke="#c6c9d4" strokeWidth="1.1" />
          <rect x={x + w / 2 - 2} y={top - 2.5} width="4" height="3.5" rx="1" fill="#5ab4ff" />
        </g>
      ))}
    </g>
  );
}

// TODO(art): Sweatbands — placeholder, renders nothing until drawn.
export function Sweatbands() {
  return null;
}

// TODO(art): Lifting Straps — placeholder, renders nothing until drawn.
export function LiftingStraps() {
  return null;
}

// TODO(art): Fitness Watch — placeholder, renders nothing until drawn.
export function FitnessWatch() {
  return null;
}
