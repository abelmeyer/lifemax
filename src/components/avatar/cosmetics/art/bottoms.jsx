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

// TODO(art): Mesh Shorts — placeholder, renders nothing until drawn.
export function MeshShorts() {
  return null;
}

// TODO(art): Compression Tights — placeholder, renders nothing until drawn.
export function CompressionTights() {
  return null;
}

// TODO(art): Gold Trunks — placeholder, renders nothing until drawn.
export function GoldTrunks() {
  return null;
}
