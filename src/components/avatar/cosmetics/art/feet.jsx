import { geoOr } from "./shared";

export function GymSocks({ metrics, geo }) {
  const g = geoOr(geo, metrics);
  // Pulled over the actual leg rects, 1px proud each side, hanging 4px past
  // the ankle so the sock reads as covering the foot.
  const top = g.legBottomY - 20;
  const w = g.legWidth + 2;
  const h = 24;
  return (
    <g>
      {[g.legLeftX - 1, g.legRightX - 1].map((x) => (
        <g key={x}>
          <rect x={x} y={top} width={w} height={h} rx="9" fill="#eef0f4" stroke="#cdd2db" strokeWidth="1.3" />
          <line x1={x + 3} y1={top + 5} x2={x + w - 3} y2={top + 5} stroke="#5ab4ff" strokeWidth="2" />
          <line x1={x + 3} y1={top + 9.5} x2={x + w - 3} y2={top + 9.5} stroke="#5ab4ff" strokeWidth="1.3" strokeOpacity="0.6" />
        </g>
      ))}
    </g>
  );
}

// TODO(art): Running Shoes — placeholder, renders nothing until drawn.
export function RunningShoes() {
  return null;
}

// TODO(art): Cross-Trainers — placeholder, renders nothing until drawn.
export function CrossTrainers() {
  return null;
}

// TODO(art): Weightlifting Shoes — placeholder, renders nothing until drawn.
export function WeightliftingShoes() {
  return null;
}

// TODO(art): Gold Signature Sneakers — placeholder, renders nothing until drawn.
export function GoldSignatureSneakers() {
  return null;
}
