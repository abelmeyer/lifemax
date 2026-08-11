import { headCenter } from "./art/shared";

// Generic fallback for the Head slot — a simple band across the brow, enough
// to read as headwear for a catalog row whose bespoke art hasn't landed yet.
export default function HeadCosmetic({ metrics }) {
  const { hx, hy, hr } = headCenter(metrics);
  return (
    <path
      d={`M ${hx - hr + 1} ${hy - 4} Q ${hx} ${hy - 12} ${hx + hr - 1} ${hy - 4}
          L ${hx + hr - 1} ${hy + 1} Q ${hx} ${hy - 7} ${hx - hr + 1} ${hy + 1} Z`}
      fill="#5ab4ff"
      fillOpacity="0.5"
      stroke="#5ab4ff"
      strokeOpacity="0.7"
      strokeWidth="1.2"
    />
  );
}
