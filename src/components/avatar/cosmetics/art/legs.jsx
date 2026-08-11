import { geoOr } from "./shared";

export function KneeSleeves({ metrics, geo }) {
  const g = geoOr(geo, metrics);
  // Sleeved over the actual leg rects at knee height, 1px proud each side.
  const top = g.legTopY + 32;
  const w = g.legWidth + 2;
  const h = 22;
  return (
    <g>
      {[g.legLeftX - 1, g.legRightX - 1].map((x) => (
        <g key={x}>
          <rect x={x} y={top} width={w} height={h} rx="8" fill="#2b2b36" stroke="#41414f" strokeWidth="1.3" />
          <path d={`M ${x + 3} ${top + 6} L ${x + w - 3} ${top + 3.5} M ${x + 3} ${top + 11} L ${x + w - 3} ${top + 8.5} M ${x + 3} ${top + 16} L ${x + w - 3} ${top + 13.5}`} stroke="#41414f" strokeWidth="1" />
          <line x1={x + 2.5} y1={top + 2} x2={x + w - 2.5} y2={top + 2} stroke="#5ab4ff" strokeWidth="1.4" strokeOpacity="0.8" />
          <line x1={x + 2.5} y1={top + h - 2} x2={x + w - 2.5} y2={top + h - 2} stroke="#5ab4ff" strokeWidth="1.4" strokeOpacity="0.8" />
        </g>
      ))}
    </g>
  );
}

// TODO(art): Compression Sleeves — placeholder, renders nothing until drawn.
export function CompressionSleeves() {
  return null;
}

// TODO(art): Titanium Knee Wraps — placeholder, renders nothing until drawn.
export function TitaniumKneeWraps() {
  return null;
}
