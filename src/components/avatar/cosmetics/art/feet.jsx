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

// The two shoes of a pair, resolved off the leg rects. `inn` is pinned to the
// leg's own inner edge — the legs sit 3px apart at every stage, so a shoe that
// reached past it would fuse the pair into one blob — while `out` sits 2px
// proud and `dir` flips every outward offset, so each toe points away from the
// centerline and the stance reads as a stance rather than two blocks.
function shoeSides(g) {
  return [
    { dir: -1, inn: g.legLeftX + g.legWidth, out: g.legLeftX - 2 },
    { dir: 1, inn: g.legRightX, out: g.legRightX + g.legWidth + 2 },
  ];
}

// Five-pointed star, sized off r — the emblem on the gold pair.
function star(x, y, r) {
  const k = r / 5.5;
  return `M ${x} ${y - 5.5 * k} L ${x + 1.7 * k} ${y - 1.7 * k} L ${x + 5.5 * k} ${y - 1.2 * k}
          L ${x + 2.8 * k} ${y + 1.6 * k} L ${x + 3.4 * k} ${y + 5.4 * k} L ${x} ${y + 3.4 * k}
          L ${x - 3.4 * k} ${y + 5.4 * k} L ${x - 2.8 * k} ${y + 1.6 * k} L ${x - 5.5 * k} ${y - 1.2 * k}
          L ${x - 1.7 * k} ${y - 1.7 * k} Z`;
}

export function RunningShoes({ metrics, geo }) {
  const g = geoOr(geo, metrics);
  const collar = g.legBottomY - 16;
  const soleY = g.legBottomY + 1;
  const ground = g.legBottomY + 11;
  const toe = 8;
  return (
    <g>
      {shoeSides(g).map(({ dir, inn, out }) => (
        <g key={dir}>
          <path
            d={`M ${inn} ${collar + 7}
                Q ${inn} ${collar} ${inn + dir * 7} ${collar}
                L ${out - dir * 5} ${collar}
                Q ${out} ${collar + 2} ${out} ${collar + 10}
                Q ${out + dir * toe * 0.6} ${soleY - 8} ${out + dir * toe} ${soleY - 1}
                L ${inn} ${soleY}
                Z`}
            fill="#3d4a63"
            stroke="#28324a"
            strokeWidth="1.3"
          />
          {[0, 1].map((row) =>
            [0, 1, 2, 3].map((i) => (
              <circle
                key={`${row}-${i}`}
                cx={inn + dir * (5 + i * 5)}
                cy={collar + 6 + row * 5.5}
                r="1.05"
                fill="#68789c"
              />
            )),
          )}
          <line
            x1={inn + dir * 4}
            y1={collar + 2.5}
            x2={out - dir * 4}
            y2={collar + 2.5}
            stroke="#5ab4ff"
            strokeWidth="1.8"
          />
          {/* Cushioning is the whole point of this pair: the sole is 10px of
              foam, drawn over the upper's hem so the upper sinks into it. */}
          <path
            d={`M ${inn} ${soleY - 4}
                L ${out + dir * (toe - 1)} ${soleY - 4}
                Q ${out + dir * (toe + 2.5)} ${soleY} ${out + dir * (toe + 1.5)} ${ground - 4}
                Q ${out + dir * toe} ${ground} ${out + dir * (toe - 5)} ${ground}
                L ${inn + dir * 4} ${ground}
                Q ${inn} ${ground} ${inn} ${ground - 4}
                Z`}
            fill="#eef1f6"
            stroke="#c3c9d4"
            strokeWidth="1.3"
          />
          <path
            d={`M ${inn + dir * 1} ${soleY + 2.5} L ${out + dir * (toe - 1)} ${soleY + 1.5}`}
            stroke="#5ab4ff"
            strokeWidth="1.6"
            strokeOpacity="0.85"
            strokeLinecap="round"
          />
        </g>
      ))}
    </g>
  );
}

export function CrossTrainers({ metrics, geo }) {
  const g = geoOr(geo, metrics);
  const collar = g.legBottomY - 14;
  const soleY = g.legBottomY + 3;
  const ground = g.legBottomY + 9;
  const toe = 6;
  return (
    <g>
      {shoeSides(g).map(({ dir, inn, out }) => (
        <g key={dir}>
          <path
            d={`M ${inn} ${collar + 6}
                Q ${inn} ${collar} ${inn + dir * 6} ${collar}
                L ${out - dir * 5} ${collar}
                Q ${out} ${collar + 2} ${out} ${collar + 8}
                Q ${out + dir * toe * 0.7} ${soleY - 7} ${out + dir * toe} ${soleY - 1}
                L ${inn} ${soleY}
                Z`}
            fill="#d2d6df"
            stroke="#9aa1af"
            strokeWidth="1.3"
          />
          <path
            d={`M ${out - dir * 1} ${soleY - 9}
                Q ${out + dir * toe * 0.7} ${soleY - 7} ${out + dir * toe} ${soleY - 1}
                L ${out + dir * 1} ${soleY} Z`}
            fill="#8b93a3"
          />
          <path
            d={`M ${inn} ${collar + 6} Q ${inn} ${collar} ${inn + dir * 6} ${collar} L ${inn + dir * 7} ${soleY} L ${inn} ${soleY} Z`}
            fill="#8b93a3"
          />
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M ${inn + dir * (8 + i * 4.5)} ${collar + 3.5} L ${inn + dir * (12 + i * 4.5)} ${collar + 9.5}
                  M ${inn + dir * (12 + i * 4.5)} ${collar + 3.5} L ${inn + dir * (8 + i * 4.5)} ${collar + 9.5}`}
              stroke="#3b4250"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          ))}
          {/* Flat and wide: the sole is only 6px thick but flares 2px past the
              upper on both sides, which is the whole silhouette cue here. */}
          <path
            d={`M ${inn - dir * 1} ${soleY - 2}
                L ${out + dir * (toe + 1)} ${soleY - 2}
                Q ${out + dir * (toe + 3)} ${soleY} ${out + dir * (toe + 2)} ${ground - 2}
                Q ${out + dir * (toe + 1)} ${ground} ${out + dir * (toe - 3)} ${ground}
                L ${inn + dir * 2} ${ground}
                Q ${inn - dir * 1} ${ground} ${inn - dir * 1} ${ground - 2}
                Z`}
            fill="#1e1e28"
            stroke="#0f0f16"
            strokeWidth="1.2"
          />
          <path
            d={`M ${inn - dir * 0.5} ${soleY + 0.5} L ${out + dir * (toe + 1)} ${soleY + 0.5}`}
            stroke="#5ab4ff"
            strokeWidth="1.4"
            strokeOpacity="0.8"
          />
        </g>
      ))}
    </g>
  );
}

export function WeightliftingShoes({ metrics, geo }) {
  const g = geoOr(geo, metrics);
  const collar = g.legBottomY - 19;
  const heelTop = g.legBottomY - 2;
  const ground = g.legBottomY + 12;
  const toe = 7;
  const strapY = g.legBottomY - 10;
  return (
    <g>
      {shoeSides(g).map(({ dir, inn, out }) => (
        <g key={dir}>
          {/* Stiff and square — barely any curve on the upper, unlike the
              running pair, so the two never get confused at thumbnail size. */}
          <path
            d={`M ${inn} ${collar + 4}
                Q ${inn} ${collar} ${inn + dir * 5} ${collar}
                L ${out - dir * 4} ${collar}
                Q ${out} ${collar + 1} ${out} ${collar + 7}
                L ${out + dir * (toe - 2)} ${heelTop + 2}
                L ${inn} ${heelTop + 2}
                Z`}
            fill="#8e2f3a"
            stroke="#5f1d26"
            strokeWidth="1.3"
          />
          <path
            d={`M ${inn} ${collar + 4} Q ${inn} ${collar} ${inn + dir * 5} ${collar} L ${inn + dir * 6} ${heelTop + 2} L ${inn} ${heelTop + 2} Z`}
            fill="#6d222c"
          />
          {/* The raised wedge: 14px of stack under the heel tapering to 8 at
              the toe. This is the item's one unmistakable read. */}
          <path
            d={`M ${inn} ${heelTop - 2}
                L ${out + dir * (toe - 1)} ${heelTop + 5}
                Q ${out + dir * (toe + 2)} ${ground - 1} ${out + dir * (toe - 4)} ${ground}
                L ${inn + dir * 4} ${ground}
                Q ${inn} ${ground} ${inn} ${ground - 4}
                Z`}
            fill="#e8e4da"
            stroke="#a9a396"
            strokeWidth="1.3"
          />
          <path
            d={`M ${inn + dir * 9} ${heelTop + 0.5} L ${inn + dir * 10} ${ground - 0.5}`}
            stroke="#a9a396"
            strokeWidth="1.2"
          />
          <path
            d={`M ${inn + dir * 1} ${ground - 5} L ${inn + dir * 9} ${ground - 5}`}
            stroke="#a9a396"
            strokeWidth="1.1"
            strokeOpacity="0.8"
          />
          <rect
            x={Math.min(inn, out) - 1}
            y={strapY}
            width={Math.abs(out - inn) + 2 + toe * 0.4}
            height="6.5"
            rx="2"
            fill="#22222c"
            stroke="#3a3a48"
            strokeWidth="1.1"
          />
          <rect x={inn + dir * 9 - 3} y={strapY + 0.75} width="6" height="5" rx="1.2" fill="#b9bec8" />
        </g>
      ))}
    </g>
  );
}

export function GoldSignatureSneakers({ metrics, geo }) {
  const g = geoOr(geo, metrics);
  const collar = g.legBottomY - 29;
  const soleY = g.legBottomY + 1;
  const ground = g.legBottomY + 12;
  const toe = 9;
  return (
    <g>
      {shoeSides(g).map(({ dir, inn, out }) => (
        <g key={dir}>
          {/* High-top: the shaft climbs 29px up the shin, which is what marks
              this pair as top tier before the gold even registers. */}
          <path
            d={`M ${inn} ${collar + 6}
                Q ${inn} ${collar} ${inn + dir * 6} ${collar}
                L ${out - dir * 5} ${collar}
                Q ${out} ${collar + 1} ${out} ${collar + 8}
                L ${out} ${soleY - 12}
                Q ${out + dir * toe * 0.6} ${soleY - 8} ${out + dir * toe} ${soleY - 1}
                L ${inn} ${soleY}
                Z`}
            fill="#c69a2e"
            stroke="#8a6716"
            strokeWidth="1.3"
          />
          <path
            d={`M ${inn} ${collar + 6} Q ${inn} ${collar} ${inn + dir * 6} ${collar} L ${out - dir * 5} ${collar}
                Q ${out} ${collar + 1} ${out} ${collar + 8} L ${out - dir * 2} ${collar + 9}
                L ${inn} ${collar + 9} Z`}
            fill="#e3bd54"
            stroke="#8a6716"
            strokeWidth="1.1"
          />
          {[0, 1, 2].map((i) => (
            <line
              key={i}
              x1={inn + dir * 6}
              y1={collar + 13 + i * 5}
              x2={out - dir * 3}
              y2={collar + 13 + i * 5}
              stroke="#fdf3d0"
              strokeWidth="1.3"
              strokeOpacity="0.85"
            />
          ))}
          <path d={star(inn + dir * (g.legWidth * 0.55), soleY - 8, 5)} fill="#fdf3d0" stroke="#8a6716" strokeWidth="0.7" />
          <path
            d={`M ${inn} ${soleY - 4}
                L ${out + dir * (toe - 1)} ${soleY - 4}
                Q ${out + dir * (toe + 2.5)} ${soleY} ${out + dir * (toe + 1.5)} ${ground - 4}
                Q ${out + dir * toe} ${ground} ${out + dir * (toe - 5)} ${ground}
                L ${inn + dir * 4} ${ground}
                Q ${inn} ${ground} ${inn} ${ground - 4}
                Z`}
            fill="#fdf3d0"
            stroke="#c69a2e"
            strokeWidth="1.4"
          />
          <path
            d={`M ${inn + dir * 1} ${soleY + 3} L ${out + dir * (toe - 1)} ${soleY + 2}`}
            stroke="#c69a2e"
            strokeWidth="1.6"
          />
        </g>
      ))}
    </g>
  );
}
