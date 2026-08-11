import { useId } from "react";
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

export function CompressionSleeves({ metrics, geo }) {
  const g = geoOr(geo, metrics);
  // Calf, not knee: these start below the knee sleeves and run to the ankle,
  // so the two Legs items never read as the same piece on the same leg.
  const top = g.legTopY + 42;
  const h = 30;
  const w = g.legWidth + 2;
  return (
    <g>
      {[g.legLeftX - 1, g.legRightX - 1].map((x) => (
        <g key={x}>
          <rect x={x} y={top} width={w} height={h} rx="4" fill="#4e586b" stroke="#2e3542" strokeWidth="1.3" />
          <path
            d={[0.24, 0.42, 0.6, 0.78]
              .map((f) => `M ${x + w * f} ${top + 6.5} L ${x + w * f} ${top + h - 6.5}`)
              .join(" ")}
            stroke="#6d7a90"
            strokeWidth="1.1"
          />
          <rect x={x + 1.2} y={top + 1.2} width={w - 2.4} height="4.2" rx="1.8" fill="#2e3542" />
          <rect x={x + 1.2} y={top + h - 5.4} width={w - 2.4} height="4.2" rx="1.8" fill="#2e3542" />
          <line x1={x + 2.5} y1={top + 6.2} x2={x + w - 2.5} y2={top + 6.2} stroke="#3fd0a8" strokeWidth="1.3" />
          <line x1={x + 2.5} y1={top + h - 6.2} x2={x + w - 2.5} y2={top + h - 6.2} stroke="#3fd0a8" strokeWidth="1.3" strokeOpacity="0.7" />
        </g>
      ))}
    </g>
  );
}

export function TitaniumKneeWraps({ metrics, geo }) {
  const g = geoOr(geo, metrics);
  // The sheen and the spiral both need document-unique ids: this component
  // renders twice per avatar and several times per store page.
  const uid = useId();
  const top = g.legTopY + 32;
  const h = 32;
  const w = g.legWidth + 3;
  const seams = [0, 1, 2, 3, 4];
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-ti`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6c7684" />
          <stop offset="24%" stopColor="#dde4ed" />
          <stop offset="50%" stopColor="#9fa9b8" />
          <stop offset="74%" stopColor="#f1f5fa" />
          <stop offset="100%" stopColor="#737d8b" />
        </linearGradient>
      </defs>
      {[g.legLeftX - 1.5, g.legRightX - 1.5].map((x, i) => {
        const side = i === 0 ? -1 : 1;
        const clipId = `${uid}-c${i}`;
        return (
          <g key={x}>
            <defs>
              <clipPath id={clipId}>
                <rect x={x} y={top} width={w} height={h} rx="9" />
              </clipPath>
            </defs>
            <g clipPath={`url(#${clipId})`}>
              <rect x={x} y={top} width={w} height={h} fill={`url(#${uid}-ti)`} />
              {seams.map((k) => {
                const y = top + 5 + k * 6.2;
                return (
                  <g key={k}>
                    <path d={`M ${x - 3} ${y + 3.4} L ${x + w + 3} ${y - 3.4}`} stroke="#5c6472" strokeWidth="2.1" strokeOpacity="0.7" />
                    <path d={`M ${x - 3} ${y + 1.4} L ${x + w + 3} ${y - 5.4}`} stroke="#f6f9fd" strokeWidth="1" strokeOpacity="0.55" />
                  </g>
                );
              })}
            </g>
            <rect x={x} y={top} width={w} height={h} rx="9" fill="none" stroke="#78828f" strokeWidth="1.3" />
            <rect
              x={side < 0 ? x + 1.5 : x + w - 8}
              y={top + h / 2 - 5}
              width="6.5"
              height="10"
              rx="2"
              fill="#c8d2e0"
              stroke="#6d7684"
              strokeWidth="1"
            />
            <circle cx={side < 0 ? x + 4.75 : x + w - 4.75} cy={top + h / 2} r="1.5" fill="#5ab4ff" />
          </g>
        );
      })}
    </g>
  );
}
