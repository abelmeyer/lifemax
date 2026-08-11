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

export function Sweatbands({ metrics, geo }) {
  const g = geoOr(geo, metrics);
  // Terry is bulky, so the band clears the arm by 3px a side; the arm rect
  // itself widens 18→22 and slides outward as the shoulders grow.
  const top = g.armBottomY - 16;
  const h = 12;
  const w = g.armWidth + 6;
  const mid = top + h / 2;
  return (
    <g>
      {[g.armLeftX - 3, g.armRightX - 3].map((x) => (
        <g key={x}>
          <rect x={x} y={top} width={w} height={h} rx={h / 2} fill="#ded8cb" stroke="#a99e8a" strokeWidth="1.2" />
          {/* Dotted round-cap strokes are the terry nap — cheaper than a
              circle per loop and it survives the 48px thumbnail. */}
          <line x1={x + 3.5} y1={top + 3} x2={x + w - 3.5} y2={top + 3} stroke="#f4f0e6" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="0.1 3.2" opacity="0.6" />
          <line x1={x + 3.5} y1={top + h - 3} x2={x + w - 3.5} y2={top + h - 3} stroke="#f4f0e6" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="0.1 3.2" opacity="0.6" />
          <rect x={x + 1.5} y={mid - 2.2} width={w - 3} height="3" fill="#2f4b7c" />
          <rect x={x + 1.5} y={mid + 1.2} width={w - 3} height="1.2" fill="#c05f3c" />
        </g>
      ))}
    </g>
  );
}

export function LiftingStraps({ metrics, geo }) {
  const g = geoOr(geo, metrics);
  const top = g.armBottomY - 17;
  const h = 14;
  const w = g.armWidth + 4;
  const bot = top + h;
  const tailW = 7;
  return (
    <g>
      {/* The tail hangs off the OUTER edge of each cuff: at stage 1 the arms
          sit right against the torso and an inner tail drapes over the hip. */}
      {[
        [g.armLeftX - 2, -1],
        [g.armRightX - 2, 1],
      ].map(([x, side]) => {
        const tx = side < 0 ? x + 1.5 : x + w - tailW - 1.5;
        const sway = side * 3;
        return (
          <g key={x}>
            <path
              d={`M ${tx} ${bot - 3}
                  C ${tx + sway} ${bot + 6} ${tx + sway * 0.4} ${bot + 11} ${tx + sway} ${bot + 19}
                  L ${tx + tailW + sway} ${bot + 19}
                  C ${tx + tailW + sway * 0.4} ${bot + 11} ${tx + tailW + sway} ${bot + 6} ${tx + tailW} ${bot - 3} Z`}
              fill="#414a5c"
              stroke="#242938"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <path
              d={`M ${tx + tailW / 2 + sway * 0.5} ${bot + 2} L ${tx + tailW / 2 + sway * 0.9} ${bot + 17}`}
              stroke="#c8d0e0"
              strokeWidth="0.9"
              strokeOpacity="0.55"
              strokeDasharray="2.4 2.2"
            />
            <rect x={x} y={top} width={w} height={h} rx="3.5" fill="#4a5266" stroke="#242938" strokeWidth="1.3" />
            <path d={`M ${x} ${top + 6.5} L ${x + w} ${top + 3} L ${x + w} ${top + 7.5} L ${x} ${top + 11} Z`} fill="#5c6780" />
            <line x1={x + 1.5} y1={top + 2.6} x2={x + w - 1.5} y2={top + 2.6} stroke="#c8d0e0" strokeWidth="0.9" strokeOpacity="0.7" strokeDasharray="2.4 2.2" />
            <line x1={x + 1.5} y1={top + h - 2.6} x2={x + w - 1.5} y2={top + h - 2.6} stroke="#c8d0e0" strokeWidth="0.9" strokeOpacity="0.7" strokeDasharray="2.4 2.2" />
            <rect x={x + w * 0.36} y={top - 0.5} width="5.5" height={h + 1} rx="1.5" fill="#2f3546" stroke="#1c202c" strokeWidth="0.9" />
          </g>
        );
      })}
    </g>
  );
}

export function FitnessWatch({ metrics, geo }) {
  const g = geoOr(geo, metrics);
  // Left wrist only — the asymmetry is the point, so this deliberately does
  // not mirror onto g.armRightX like every other Wrists item.
  const x = g.armLeftX - 1;
  const w = g.armWidth + 2;
  const cx = x + w / 2;
  const bandTop = g.armBottomY - 30;
  const bandH = 28;
  const caseW = w + 1;
  const caseH = 16;
  const caseY = bandTop + 6;
  const screenY = caseY + 3;
  const screenH = caseH - 6;
  return (
    <g>
      <rect x={x + 1} y={bandTop} width={w - 2} height={bandH} rx="3" fill="#1e212a" stroke="#0f1117" strokeWidth="1.2" />
      <line x1={x + 2.5} y1={bandTop + 3} x2={x + w - 2.5} y2={bandTop + 3} stroke="#39404f" strokeWidth="1" />
      <line x1={x + 2.5} y1={bandTop + bandH - 3} x2={x + w - 2.5} y2={bandTop + bandH - 3} stroke="#39404f" strokeWidth="1" />
      <rect x={cx - caseW / 2} y={caseY} width={caseW} height={caseH} rx="4.5" fill="#333947" stroke="#a5aec0" strokeWidth="1.4" />
      <rect x={cx - caseW / 2 - 2.2} y={caseY + caseH / 2 - 2.4} width="2.6" height="4.8" rx="1.2" fill="#a5aec0" />
      <rect x={cx - caseW / 2 + 2.5} y={screenY} width={caseW - 5} height={screenH} rx="2.5" fill="#08131f" />
      <rect x={cx - caseW / 2 + 2.5} y={screenY} width={caseW - 5} height={screenH} rx="2.5" fill="#5ab4ff" opacity="0.16" />
      <path
        d={`M ${cx - caseW / 2 + 4} ${screenY + screenH * 0.55}
            L ${cx - 2.5} ${screenY + screenH * 0.55}
            L ${cx - 0.5} ${screenY + screenH * 0.2}
            L ${cx + 1.5} ${screenY + screenH * 0.82}
            L ${cx + 3} ${screenY + screenH * 0.55}
            L ${cx + caseW / 2 - 4} ${screenY + screenH * 0.55}`}
        fill="none"
        stroke="#5ab4ff"
        strokeWidth="1.3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </g>
  );
}
