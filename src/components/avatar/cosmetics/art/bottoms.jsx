import { geoOr } from "./shared";

export function TrainingShorts({ metrics, geo }) {
  const g = geoOr(geo, metrics);
  const { cx, hipY } = metrics;
  const top = hipY - 5;
  const bottom = hipY + 33;
  // A Bottom hides the default shorts, so these are the ONLY thing covering
  // the hips: never narrower than hipHalf, or bare skin shows at the hip.
  const half = g.hipHalf + 1;
  return (
    <g>
      <path
        d={`M ${cx - half} ${top + 4}
            Q ${cx - half} ${top} ${cx - half + 5} ${top}
            L ${cx + half - 5} ${top}
            Q ${cx + half} ${top} ${cx + half} ${top + 4}
            L ${cx + half - 1} ${bottom - 3}
            Q ${cx + half - 1} ${bottom} ${cx + half - 4} ${bottom}
            L ${cx + 3} ${bottom} L ${cx} ${bottom - 7} L ${cx - 3} ${bottom}
            L ${cx - half + 4} ${bottom}
            Q ${cx - half + 1} ${bottom} ${cx - half + 1} ${bottom - 3}
            Z`}
        fill="#3a3a49"
        stroke="#4a4a5c"
        strokeWidth="1.4"
      />
      <line x1={cx - half + 2} y1={top + 6} x2={cx + half - 2} y2={top + 6} stroke="#5ab4ff" strokeWidth="2" strokeOpacity="0.9" />
      <path d={`M ${cx - half + 4} ${top + 10} L ${cx - half + 7} ${bottom - 4}`} stroke="#5ab4ff" strokeWidth="1.4" strokeOpacity="0.55" />
      <path d={`M ${cx + half - 4} ${top + 10} L ${cx + half - 7} ${bottom - 4}`} stroke="#5ab4ff" strokeWidth="1.4" strokeOpacity="0.55" />
    </g>
  );
}

export function MeshShorts({ metrics, geo }) {
  const g = geoOr(geo, metrics);
  const { cx, hipY } = metrics;
  const top = hipY - 7;
  const bottom = hipY + 42;
  const bandBottom = top + 8;
  // A Bottom hides the default shorts, so this is the ONLY cover over the
  // hips: hipHalf is the floor, and the 3px on top of it is the slack a loose
  // short hangs with. The hem flares wider still.
  const half = g.hipHalf + 3;
  const hemHalf = half + 4;
  const notchTip = bottom - 15;
  const halfAt = (y) => half + ((hemHalf - half) * (y - top)) / (bottom - top);
  const notchAt = (y) => (y < notchTip ? 0 : (4 * (y - notchTip)) / (bottom - notchTip));

  // Perforations are emitted as explicit circles rather than an SVG <pattern>:
  // several of these render in one document (store list plus on-body) and
  // duplicate pattern ids resolve to whichever node the browser met first.
  const holes = [];
  const firstRow = bandBottom + 7;
  const rowCount = Math.floor((bottom - 6 - firstRow) / 6);
  for (let row = 0; row <= rowCount; row++) {
    const y = firstRow + row * 6;
    const lim = halfAt(y) - 5;
    const inner = notchAt(y) + 3;
    for (let dx = row % 2 ? -lim + 3 : -lim; dx <= lim; dx += 6) {
      if (Math.abs(dx) >= inner) holes.push({ x: cx + dx, y });
    }
  }

  return (
    <g>
      <path
        d={`M ${cx - half} ${top + 5}
            Q ${cx - half} ${top} ${cx - half + 6} ${top}
            L ${cx + half - 6} ${top}
            Q ${cx + half} ${top} ${cx + half} ${top + 5}
            L ${cx + hemHalf} ${bottom - 6}
            Q ${cx + hemHalf} ${bottom} ${cx + hemHalf - 5} ${bottom}
            L ${cx + 4} ${bottom} L ${cx} ${notchTip} L ${cx - 4} ${bottom}
            L ${cx - hemHalf + 5} ${bottom}
            Q ${cx - hemHalf} ${bottom} ${cx - hemHalf} ${bottom - 6}
            Z`}
        fill="#5a637a"
        stroke="#3b4356"
        strokeWidth="1.4"
      />
      {holes.map((h) => (
        <circle key={`${h.x}-${h.y}`} cx={h.x} cy={h.y} r="1.15" fill="#39404f" fillOpacity="0.85" />
      ))}
      <path
        d={`M ${cx - half} ${top + 5}
            Q ${cx - half} ${top} ${cx - half + 6} ${top}
            L ${cx + half - 6} ${top}
            Q ${cx + half} ${top} ${cx + half} ${top + 5}
            L ${cx + half + 1} ${bandBottom} L ${cx - half - 1} ${bandBottom} Z`}
        fill="#3b4356"
        stroke="#2c3242"
        strokeWidth="1.2"
      />
      <path
        d={`M ${cx - 7} ${bandBottom - 1} Q ${cx - 4} ${bandBottom + 6} ${cx - 1} ${bandBottom + 2}
            M ${cx + 7} ${bandBottom - 1} Q ${cx + 4} ${bandBottom + 6} ${cx + 1} ${bandBottom + 2}`}
        fill="none"
        stroke="#c9cfdb"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d={`M ${cx - half + 1} ${bandBottom + 3} L ${cx - hemHalf + 1} ${bottom - 5}`} stroke="#c9cfdb" strokeWidth="1.5" strokeOpacity="0.75" />
      <path d={`M ${cx + half - 1} ${bandBottom + 3} L ${cx + hemHalf - 1} ${bottom - 5}`} stroke="#c9cfdb" strokeWidth="1.5" strokeOpacity="0.75" />
      <path
        d={`M ${cx - hemHalf + 2} ${bottom - 3} L ${cx - 5} ${bottom - 3} M ${cx + 5} ${bottom - 3} L ${cx + hemHalf - 2} ${bottom - 3}`}
        stroke="#3b4356"
        strokeWidth="2"
      />
    </g>
  );
}

export function CompressionTights({ metrics, geo }) {
  const g = geoOr(geo, metrics);
  const { cx, hipY } = metrics;
  const top = hipY - 7;
  const bandBottom = top + 6;
  const crotch = hipY + 14;
  const taperEnd = hipY + 26;
  const ankle = g.legBottomY - 6;
  // Second skin: the tubes sit 1px proud of the leg rects and the seat is
  // never narrower than hipHalf, since this replaces the default shorts
  // outright. The seat tapers into the tubes rather than stepping in, or a
  // shelf of fabric hangs off the thigh at the wide-hipped early stages.
  const half = g.hipHalf + 1;
  const tubeW = g.legWidth + 2;
  const tubes = [g.legLeftX - 1, g.legRightX - 1];
  return (
    <g>
      {tubes.map((x) => (
        <rect key={x} x={x} y={hipY + 10} width={tubeW} height={ankle - hipY - 10} rx="9" fill="#1a1a24" stroke="#2e2e3d" strokeWidth="1.3" />
      ))}
      <path
        d={`M ${cx - half} ${top + 4}
            Q ${cx - half} ${top} ${cx - half + 5} ${top}
            L ${cx + half - 5} ${top}
            Q ${cx + half} ${top} ${cx + half} ${top + 4}
            Q ${cx + half - 2} ${hipY + 12} ${g.legRightX + g.legWidth + 1} ${taperEnd}
            L ${g.legRightX - 1} ${taperEnd}
            L ${cx} ${crotch}
            L ${g.legLeftX + g.legWidth + 1} ${taperEnd}
            L ${g.legLeftX - 1} ${taperEnd}
            Q ${cx - half + 2} ${hipY + 12} ${cx - half} ${top + 4}
            Z`}
        fill="#1a1a24"
        stroke="#2e2e3d"
        strokeWidth="1.3"
      />
      <path
        d={`M ${cx - half} ${top + 4}
            Q ${cx - half} ${top} ${cx - half + 5} ${top}
            L ${cx + half - 5} ${top}
            Q ${cx + half} ${top} ${cx + half} ${top + 4}
            L ${cx + half} ${bandBottom} L ${cx - half} ${bandBottom} Z`}
        fill="#26263a"
        stroke="#2e2e3d"
        strokeWidth="1.1"
      />
      <line x1={cx - half + 2} y1={bandBottom - 1} x2={cx + half - 2} y2={bandBottom - 1} stroke="#5ab4ff" strokeWidth="1.6" strokeOpacity="0.9" />
      {tubes.map((x, i) => {
        const seam = i === 0 ? x + 3 : x + tubeW - 3;
        const knee = g.legTopY + 34;
        return (
          <g key={x}>
            <line x1={seam} y1={hipY + 22} x2={seam} y2={ankle - 5} stroke="#5ab4ff" strokeWidth="1.5" strokeOpacity="0.7" />
            <path d={`M ${x + 3} ${knee} Q ${x + tubeW / 2} ${knee + 6} ${x + tubeW - 3} ${knee}`} fill="none" stroke="#5ab4ff" strokeWidth="1.3" strokeOpacity="0.5" />
            <path d={`M ${x + 3} ${knee + 7} Q ${x + tubeW / 2} ${knee + 13} ${x + tubeW - 3} ${knee + 7}`} fill="none" stroke="#5ab4ff" strokeWidth="1.3" strokeOpacity="0.5" />
            <rect x={x + 1.5} y={ankle - 7} width={tubeW - 3} height="5.5" rx="2" fill="#26263a" />
          </g>
        );
      })}
      <path
        d={`M ${cx - half + 4} ${hipY + 2} L ${cx - 8} ${hipY + 9} M ${cx + half - 4} ${hipY + 2} L ${cx + 8} ${hipY + 9}`}
        stroke="#5ab4ff"
        strokeWidth="1.2"
        strokeOpacity="0.45"
      />
    </g>
  );
}

export function GoldTrunks({ metrics, geo }) {
  const g = geoOr(geo, metrics);
  const { cx, waistY, hipY } = metrics;
  const bandTop = waistY + 1;
  const bandBottom = bandTop + 13;
  const bottom = hipY + 36;
  const notchTip = bottom - 14;
  // Boxing cut: cinched on the waist, then flared over the hip. The flare is
  // a quadratic that reaches full width within a few px of the band, because
  // at the leanest stage the legs are WIDER than the waist and a slow taper
  // leaves the tops of the thighs bare at the sides.
  const bandHalf = Math.max(g.waistHalf + 3, g.hipHalf - 3);
  const hemHalf = g.hipHalf + 4;
  const body = `M ${cx - bandHalf} ${bandBottom - 3}
      Q ${cx - hemHalf} ${bandBottom + 6} ${cx - hemHalf} ${bottom - 6}
      Q ${cx - hemHalf} ${bottom} ${cx - hemHalf + 5} ${bottom}
      L ${cx - 5} ${bottom} L ${cx} ${notchTip} L ${cx + 5} ${bottom}
      L ${cx + hemHalf - 5} ${bottom}
      Q ${cx + hemHalf} ${bottom} ${cx + hemHalf} ${bottom - 6}
      Q ${cx + hemHalf} ${bandBottom + 6} ${cx + bandHalf} ${bandBottom - 3}
      Z`;
  return (
    <g>
      <path d={body} fill="#2a1e33" stroke="#1b1322" strokeWidth="1.4" />
      {/* The side slits are drawn as folds, not cut out of the silhouette —
          a real notch here would open bare skin over the thigh at stage 6. */}
      <path
        d={`M ${cx - hemHalf + 3} ${bottom - 2} L ${cx - hemHalf + 5} ${bandBottom + 12}
            M ${cx + hemHalf - 3} ${bottom - 2} L ${cx + hemHalf - 5} ${bandBottom + 12}`}
        stroke="#c69a2e"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d={`M ${cx - hemHalf + 5} ${bottom} L ${cx - 5} ${bottom} L ${cx} ${notchTip} L ${cx + 5} ${bottom} L ${cx + hemHalf - 5} ${bottom}`}
        fill="none"
        stroke="#e3bd54"
        strokeWidth="3.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <rect x={cx - bandHalf} y={bandTop} width={bandHalf * 2} height="13" rx="4" fill="#e3bd54" stroke="#98741d" strokeWidth="1.4" />
      <line x1={cx - bandHalf + 2} y1={bandTop + 3} x2={cx + bandHalf - 2} y2={bandTop + 3} stroke="#fdf3d0" strokeWidth="1.6" strokeOpacity="0.9" />
      <line x1={cx - bandHalf + 2} y1={bandTop + 10} x2={cx + bandHalf - 2} y2={bandTop + 10} stroke="#98741d" strokeWidth="1.4" strokeOpacity="0.9" />
      <path
        d={`M ${cx} ${hipY + 8} L ${cx + 1.9} ${hipY + 12.2} L ${cx + 6.1} ${hipY + 12.8} L ${cx + 3.1} ${hipY + 16}
            L ${cx + 3.8} ${hipY + 20.2} L ${cx} ${hipY + 18} L ${cx - 3.8} ${hipY + 20.2} L ${cx - 3.1} ${hipY + 16}
            L ${cx - 6.1} ${hipY + 12.8} L ${cx - 1.9} ${hipY + 12.2} Z`}
        fill="#e3bd54"
        stroke="#98741d"
        strokeWidth="0.8"
      />
    </g>
  );
}
